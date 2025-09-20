/**
 * @file manager-ui/backend/routes/operations.js
 * @description 项目操作API路由
 */

import express from 'express';
import { buildProject, sortTranslations } from '../core/build-core.js';

const router = express.Router();

/**
 * POST /api/operations/build
 * 执行完整项目构建
 * Body: { preserveFormatting?: boolean }
 */
router.post('/build', async (req, res) => {
  try {
    const { preserveFormatting = false } = req.body;
    
    const result = await buildProject({ preserveFormatting });
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          outputPath: result.outputPath,
          preserveFormatting: result.preserveFormatting
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
        errors: result.errors
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '构建项目时发生错误',
      error: error.message
    });
  }
});

/**
 * POST /api/operations/sort
 * 对翻译文件进行排序
 */
router.post('/sort', async (req, res) => {
  try {
    const result = await sortTranslations();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          totalFiles: result.totalFiles,
          sortedFiles: result.sortedFiles,
          results: result.results
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '排序翻译文件时发生错误',
      error: error.message
    });
  }
});

/**
 * GET /api/operations/types
 * 获取所有支持的操作类型
 */
router.get('/types', (req, res) => {
  const operationTypes = [
    {
      id: 'build',
      name: '构建项目',
      description: '将所有翻译文件打包生成最终的用户脚本',
      endpoint: 'POST /api/operations/build',
      parameters: {
        preserveFormatting: {
          type: 'boolean',
          description: '是否保留代码格式和注释',
          default: false
        }
      }
    },
    {
      id: 'sort',
      name: '排序翻译',
      description: '对翻译文件中的规则进行字母顺序排序',
      endpoint: 'POST /api/operations/sort',
      parameters: {}
    }
  ];

  res.json({
    success: true,
    data: operationTypes
  });
});

/**
 * POST /api/operations/batch
 * 批量执行多个操作
 * Body: { operations: Array<{type: string, options?: object}> }
 */
router.post('/batch', async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!Array.isArray(operations) || operations.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的操作数组'
      });
    }

    const validOperationTypes = ['build', 'sort'];
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // 串行执行操作以避免文件系统冲突
    for (const operation of operations) {
      const { type, options = {} } = operation;
      
      if (!validOperationTypes.includes(type)) {
        results.push({
          type,
          success: false,
          message: `无效的操作类型: ${type}`,
          validTypes: validOperationTypes
        });
        failureCount++;
        continue;
      }

      try {
        let result;
        switch (type) {
          case 'build':
            result = await buildProject(options);
            break;
          case 'sort':
            result = await sortTranslations();
            break;
        }

        if (result.success) {
          results.push({
            type,
            success: true,
            message: result.message,
            data: result
          });
          successCount++;
        } else {
          results.push({
            type,
            success: false,
            message: result.message,
            error: result.error
          });
          failureCount++;
        }
      } catch (error) {
        results.push({
          type,
          success: false,
          message: `执行 ${type} 操作时发生错误`,
          error: error.message
        });
        failureCount++;
      }
    }

    res.json({
      success: failureCount === 0,
      message: `批量操作完成，${successCount} 个成功，${failureCount} 个失败`,
      data: {
        results,
        summary: {
          total: operations.length,
          success: successCount,
          failure: failureCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '执行批量操作时发生错误',
      error: error.message
    });
  }
});

export default router;