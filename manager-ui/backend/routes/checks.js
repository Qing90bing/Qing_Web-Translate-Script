/**
 * @file manager-ui/backend/routes/checks.js
 * @description 检查与修复API路由
 */

import express from 'express';
import { runCheck } from '../core/validation-core.js';

const router = express.Router();

/**
 * POST /api/checks/:checkType
 * 运行指定类型的检查
 * 支持的检查类型: comma, empty, duplicates, identical, source-duplicates
 */
router.post('/:checkType', async (req, res) => {
  try {
    const { checkType } = req.params;
    
    // 验证检查类型
    const validCheckTypes = ['comma', 'empty', 'duplicates', 'identical', 'source-duplicates'];
    if (!validCheckTypes.includes(checkType)) {
      return res.status(400).json({
        success: false,
        message: `无效的检查类型: ${checkType}`,
        validTypes: validCheckTypes
      });
    }

    const result = await runCheck(checkType);
    
    res.json({
      success: true,
      message: `${getCheckDisplayName(checkType)}检查完成`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '执行检查时发生错误',
      error: error.message
    });
  }
});

/**
 * GET /api/checks/types
 * 获取所有支持的检查类型
 */
router.get('/types', (req, res) => {
  const checkTypes = [
    {
      id: 'comma',
      name: '遗漏逗号检查',
      description: '检查翻译规则之间是否遗漏逗号'
    },
    {
      id: 'empty',
      name: '空翻译检查',
      description: '检查是否存在空的翻译内容'
    },
    {
      id: 'duplicates',
      name: '重复翻译检查',
      description: '检查是否存在完全相同的翻译规则'
    },
    {
      id: 'identical',
      name: '原文译文相同检查',
      description: '检查原文和译文是否完全相同'
    },
    {
      id: 'source-duplicates',
      name: '原文重复检查',
      description: '检查是否存在相同的原文对应不同的译文'
    }
  ];

  res.json({
    success: true,
    data: checkTypes
  });
});

/**
 * POST /api/checks/batch
 * 批量执行多个检查
 * Body: { checkTypes: string[] }
 */
router.post('/batch', async (req, res) => {
  try {
    const { checkTypes } = req.body;
    
    if (!Array.isArray(checkTypes) || checkTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的检查类型数组'
      });
    }

    const validCheckTypes = ['comma', 'empty', 'duplicates', 'identical', 'source-duplicates'];
    const invalidTypes = checkTypes.filter(type => !validCheckTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `无效的检查类型: ${invalidTypes.join(', ')}`,
        validTypes: validCheckTypes
      });
    }

    const results = {};
    let totalErrors = 0;

    // 并行执行所有检查
    const checkPromises = checkTypes.map(async (checkType) => {
      try {
        const result = await runCheck(checkType);
        results[checkType] = result;
        totalErrors += result.errorCount;
        return { checkType, success: true };
      } catch (error) {
        results[checkType] = {
          success: false,
          errorCount: 0,
          errors: [],
          error: error.message
        };
        return { checkType, success: false, error: error.message };
      }
    });

    const checkResults = await Promise.all(checkPromises);
    
    res.json({
      success: true,
      message: `批量检查完成，共发现 ${totalErrors} 个问题`,
      data: {
        results,
        summary: {
          totalChecks: checkTypes.length,
          totalErrors,
          checkResults
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '执行批量检查时发生错误',
      error: error.message
    });
  }
});

/**
 * 获取检查类型的显示名称
 */
function getCheckDisplayName(checkType) {
  const displayNames = {
    'comma': '遗漏逗号',
    'empty': '空翻译',
    'duplicates': '重复翻译',
    'identical': '原文译文相同',
    'source-duplicates': '原文重复'
  };
  return displayNames[checkType] || checkType;
}

export default router;