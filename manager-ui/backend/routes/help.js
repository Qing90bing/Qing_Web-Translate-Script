/**
 * @file manager-ui/backend/routes/help.js
 * @description 帮助内容管理API路由
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

const router = express.Router();

// 配置 multer 用于图片上传
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const helpImagesDir = path.join(process.cwd(), '..', 'public', 'help-images');
    try {
      await fs.mkdir(helpImagesDir, { recursive: true });
      cb(null, helpImagesDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `help-${timestamp}${extension}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 帮助内容存储文件路径
const helpDataPath = path.join(process.cwd(), '..', 'public', 'help-data.json');

/**
 * 获取默认帮助内容
 */
function getDefaultHelpContent() {
  return {
    overview: {
      title: '翻译管理器概览',
      content: '这是一个用于管理网页翻译脚本的可视化工具。',
      images: []
    },
    fileManagement: {
      title: '文件管理',
      content: '在这里您可以创建、编辑和删除翻译文件。',
      images: []
    },
    ruleEditing: {
      title: '规则编辑',
      content: '使用表格界面轻松编辑翻译规则。',
      images: []
    },
    checking: {
      title: '检查与修复',
      content: '运行各种检查来发现和修复翻译文件中的问题。',
      images: []
    },
    building: {
      title: '项目构建',
      content: '将翻译文件打包生成最终的用户脚本。',
      images: []
    }
  };
}

/**
 * 读取帮助内容
 */
async function readHelpContent() {
  try {
    const content = await fs.readFile(helpDataPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // 如果文件不存在，返回默认内容
    if (error.code === 'ENOENT') {
      return getDefaultHelpContent();
    }
    throw error;
  }
}

/**
 * 保存帮助内容
 */
async function saveHelpContent(content) {
  await fs.writeFile(helpDataPath, JSON.stringify(content, null, 2));
}

/**
 * GET /api/help
 * 获取所有帮助内容
 */
router.get('/', async (req, res) => {
  try {
    const helpContent = await readHelpContent();
    res.json({
      success: true,
      data: helpContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取帮助内容失败',
      error: error.message
    });
  }
});

/**
 * GET /api/help/:section
 * 获取特定部分的帮助内容
 */
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const helpContent = await readHelpContent();
    
    if (!helpContent[section]) {
      return res.status(404).json({
        success: false,
        message: `帮助部分 "${section}" 不存在`
      });
    }

    res.json({
      success: true,
      data: helpContent[section]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取帮助内容失败',
      error: error.message
    });
  }
});

/**
 * PUT /api/help
 * 更新所有帮助内容
 * Body: { [section]: { title: string, content: string, images: string[] } }
 */
router.put('/', async (req, res) => {
  try {
    const newContent = req.body;
    
    // 验证内容格式
    for (const section in newContent) {
      const sectionData = newContent[section];
      if (!sectionData.title || !sectionData.content) {
        return res.status(400).json({
          success: false,
          message: `部分 "${section}" 缺少必要的 title 或 content 字段`
        });
      }
    }

    await saveHelpContent(newContent);
    
    res.json({
      success: true,
      message: '帮助内容更新成功',
      data: newContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新帮助内容失败',
      error: error.message
    });
  }
});

/**
 * PUT /api/help/:section
 * 更新特定部分的帮助内容
 * Body: { title: string, content: string, images?: string[] }
 */
router.put('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const { title, content, images = [] } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的 title 或 content 字段'
      });
    }

    const helpContent = await readHelpContent();
    helpContent[section] = { title, content, images };
    
    await saveHelpContent(helpContent);
    
    res.json({
      success: true,
      message: `帮助部分 "${section}" 更新成功`,
      data: helpContent[section]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新帮助内容失败',
      error: error.message
    });
  }
});

/**
 * POST /api/help/upload
 * 上传帮助图片
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const imageUrl = `/help-images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: '图片上传成功',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '上传图片失败',
      error: error.message
    });
  }
});

/**
 * DELETE /api/help/images/:filename
 * 删除帮助图片
 */
router.delete('/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(process.cwd(), '..', 'public', 'help-images', filename);
    
    try {
      await fs.unlink(imagePath);
      res.json({
        success: true,
        message: '图片删除成功'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({
          success: false,
          message: '图片文件不存在'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除图片失败',
      error: error.message
    });
  }
});

/**
 * GET /api/help/images
 * 获取所有帮助图片列表
 */
router.get('/images', async (req, res) => {
  try {
    const helpImagesDir = path.join(process.cwd(), '..', 'public', 'help-images');
    
    try {
      const files = await fs.readdir(helpImagesDir);
      const images = files
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .map(file => ({
          filename: file,
          url: `/help-images/${file}`
        }));
      
      res.json({
        success: true,
        data: images
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.json({
          success: true,
          data: []
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取图片列表失败',
      error: error.message
    });
  }
});

export default router;