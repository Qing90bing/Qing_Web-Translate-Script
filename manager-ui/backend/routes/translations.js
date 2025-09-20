/**
 * @file manager-ui/backend/routes/translations.js
 * @description 翻译文件管理API路由
 */

import express from 'express';
import {
  getTranslationFiles,
  getTranslationFile,
  createTranslationFile,
  updateTranslationFile,
  deleteTranslationFile
} from '../core/translation-core.js';

const router = express.Router();

/**
 * GET /api/translations
 * 获取所有翻译文件列表
 */
router.get('/', async (req, res) => {
  try {
    const files = await getTranslationFiles();
    res.json({
      success: true,
      data: files,
      count: files.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取翻译文件列表失败',
      error: error.message
    });
  }
});

/**
 * GET /api/translations/:filename
 * 获取单个翻译文件详细内容
 */
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const fileData = await getTranslationFile(filename);
    res.json({
      success: true,
      data: fileData
    });
  } catch (error) {
    if (error.message.includes('不存在')) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取翻译文件失败',
        error: error.message
      });
    }
  }
});

/**
 * POST /api/translations
 * 创建新的翻译文件
 * Body: { domain: string }
 */
router.post('/', async (req, res) => {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({
        success: false,
        message: '域名参数是必需的'
      });
    }

    const result = await createTranslationFile(domain);
    res.status(201).json({
      success: true,
      message: '翻译文件创建成功',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * PUT /api/translations/:filename
 * 更新翻译文件内容
 * Body: { textRules?: Array, regexRules?: Array, styles?: Array, jsRules?: Array }
 */
router.put('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const updateData = req.body;

    const result = await updateTranslationFile(filename, updateData);
    res.json({
      success: true,
      message: '翻译文件更新成功',
      data: result
    });
  } catch (error) {
    if (error.message.includes('不存在')) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '更新翻译文件失败',
        error: error.message
      });
    }
  }
});

/**
 * DELETE /api/translations/:filename
 * 删除翻译文件
 */
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    const result = await deleteTranslationFile(filename);
    res.json({
      success: true,
      message: '翻译文件删除成功',
      data: result
    });
  } catch (error) {
    if (error.message.includes('不存在')) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除翻译文件失败',
        error: error.message
      });
    }
  }
});

export default router;