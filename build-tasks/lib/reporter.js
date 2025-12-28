/**
 * @file build-tasks/lib/reporter.js
 * @description
 * 负责收集和展示验证修复任务的执行报告。
 * 它会在内存中记录所有的修复操作，并在任务结束时生成一份美观、详细的汇总报告。
 */

import { color } from './colors.js';
import { t } from './terminal-i18n.js';
import path from 'path';

export class ValidationReporter {
    constructor() {
        // 存储修复记录，结构为:
        // {
        //   "full/path/to/file.js": [
        //     { type: 'auto/manual', action: 'added/modified/removed/emptied', line: 123, details: '...' }
        //   ]
        // }
        this.fixes = new Map();
        this.skippedCount = 0;
    }

    /**
     * 记录一次修复操作
     * @param {string} file - 文件路径
     * @param {string} type - 修复类型 ('auto-fix' | 'manual-fix')
     * @param {string} action - 动作类型 ('added' | 'modified' | 'removed' | 'emptied')
     * @param {number} line - 行号
     * @param {string} [details] - 详细信息（例如 "old -> new"）
     */
    recordFix(file, type, action, line, details = '') {
        if (!this.fixes.has(file)) {
            this.fixes.set(file, []);
        }
        this.fixes.get(file).push({
            type,
            action,
            line,
            details
        });
    }

    /**
     * 记录跳过的问题数量
     * @param {number} count 
     */
    addSkipped(count) {
        this.skippedCount += count;
    }

    /**
     * 打印最终报告
     */
    printSummary() {
        console.log('\n' + color.bold(color.green(t('reports.separator'))));
        console.log('           ' + color.bold(color.cyan(t('reports.title'))));
        console.log(color.bold(color.green(t('reports.separator'))) + '\n');

        let totalFiles = 0;
        let totalIssues = 0;

        // 按文件分组打印
        for (const [file, fixes] of this.fixes.entries()) {
            totalFiles++;
            const fileName = path.basename(file);
            // 从路径中猜测语言代码 (例如 .../zh-cn/...)
            const langMatch = file.match(/translations[\\/]([^\\/]+)[\\/]/);
            const language = langMatch ? langMatch[1] : 'unknown';

            console.log(color.bold(t('reports.fileHeader', fileName, language)));

            // 对修复记录按行号排序
            fixes.sort((a, b) => a.line - b.line);

            for (const fix of fixes) {
                totalIssues++;
                const fixTypeLabel = fix.type === 'auto-fix' ? t('reports.fixTypeAuto') : t('reports.fixTypeManual');
                const actionLabel = t(`reports.action${fix.action.charAt(0).toUpperCase() + fix.action.slice(1)}`);

                let message = t('reports.linePrefix', fix.line, `${fixTypeLabel} [${actionLabel}]`, fix.details);

                // 根据不同类型添加颜色
                if (fix.type === 'auto-fix') {
                    console.log(color.dim(message));
                } else {
                    console.log(color.cyan(message));
                }
            }
            console.log(''); // 空行分隔
        }

        // 打印统计信息
        console.log(color.dim(t('reports.separator')));
        console.log(color.bold(t('reports.summaryTitle')));
        console.log(t('reports.totalFiles', color.yellow(totalFiles)));
        console.log(t('reports.totalIssues', color.green(totalIssues)));
        if (this.skippedCount > 0) {
            console.log(t('reports.totalSkipped', color.red(this.skippedCount)));
        }
        console.log(color.dim(t('reports.separator')) + '\n');
    }
}
