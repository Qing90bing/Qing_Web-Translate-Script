/**
 * @file build-tasks/tasks/check-identical.js
 * @description
 * 此任务负责检查并修复翻译文件中"原文与译文相同"的问题。
 * 这种情况通常意味着翻译尚未完成，或者是一个占位符。
 *
 * **核心工作流程**:
 * 1. **检查问题**: 调用 `validateTranslationFiles` 并开启 `checkIdentical` 选项，找出所有错误。
 *    （注意：与其他检查不同，此任务将语法检查的逻辑委托给了 `validateTranslationFiles` 内部处理）。
 * 2. 如果没有发现问题，则退出。
 * 3. **顶层决策**: 调用 `promptUserAboutIdenticalTranslations` 让用户首先做出一个高层次的决策：
 *    是希望"自动修复"、"手动修复"还是"忽略"所有问题。
 * 4. **执行分支**:
 *    - **自动修复**: 如果用户选择自动，`promptUserAboutIdenticalTranslations` 会继续询问具体的自动修复策略
 *      （全部移除 vs 全部置空），然后此任务调用 `fixIdenticalAutomatically` 执行批量操作。
 *    - **手动修复**: 如果用户选择手动，任务会进入一个循环，逐个调用 `promptForSingleIdenticalFix` 和
 *      `applySingleIdenticalFix` 来处理每个问题。
 *    - **忽略/取消**: 打印信息并退出。
 */

// 导入核心库
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptUserAboutIdenticalTranslations, promptForSingleIdenticalFix } from '../../lib/prompting.js';
import { fixIdenticalAutomatically, applySingleIdenticalFix } from '../../lib/fixing.js';
// 从终端国际化模块导入翻译函数
import { t } from '../../lib/terminal-i18n.js';

/**
 * @function handleIdenticalCheck
 * @description "检查原文与译文相同"任务的主处理函数。
 * @returns {Promise<void>}
 */
import { ProgressBar } from '../../lib/progress.js';
import { printValidationResults } from '../../lib/validation.js';

/**
 * @function handleIdenticalCheck
 * @description "检查原文与译文相同"任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleIdenticalCheck() {
    console.log(color.cyan(t('checkTasks.checkingIdentical')));

    const progressBar = new ProgressBar({
        format: `${color.cyan('{bar}')} {percentage}% | {value}/{total} | {text}`
    });

    // 1. 查找所有原文和译文相同的错误。
    const options = {
        checkIdentical: true,
        silent: true,
        onProgress: (current, total, file) => {
            progressBar.total = total;
            progressBar.update(current, `${t('checkTasks.scanning')} ${file}`);
        }
    };

    progressBar.start(0, t('checkTasks.scanning'));
    let identicalErrors = await validateTranslationFiles(options);
    progressBar.stop(true);

    // 如果有错误，需要手动打印
    if (identicalErrors.length > 0) {
        const errorsByFile = {};
        for (const error of identicalErrors) {
            if (!errorsByFile[error.file]) errorsByFile[error.file] = [];
            errorsByFile[error.file].push(error);
        }
        for (const [file, errors] of Object.entries(errorsByFile)) {
            printValidationResults(errors, file, options);
        }
    }
    if (identicalErrors.length === 0) {
        console.log(color.green(t('checkTasks.noIdenticalFound')));
        return;
    }

    // 2. 询问用户希望采取哪种顶层操作。
    // `result` 对象会包含用户的顶层决策，例如 { action: 'auto-fix', decisions: { type: 'remove', errors: [...] } }
    const result = await promptUserAboutIdenticalTranslations(identicalErrors);
    if (!result || result.action === 'cancel') {
        console.clear();
        console.log(color.dim(t('checkTasks.operationCancelled')));
        return;
    }

    console.clear();

    // 3. 根据用户的顶层选择，执行相应流程。
    if (result.action === 'auto-fix') {
        // 自动修复流程
        await fixIdenticalAutomatically(result.decisions);
        // `fixIdenticalAutomatically` 内部会打印自己的日志，这里不再重复
    } else if (result.action === 'ignore') {
        // 忽略流程
        console.clear();
        console.log(color.yellow(t('checkTasks.emptyIssuesIgnored')));
    } else if (result.action === 'manual-fix') {
        // 手动修复流程
        console.log(color.cyan(t('checkTasks.enteringManualModeIdentical')));
        const ignoredPositions = new Set(); // 存储用户选择跳过的问题的起始位置
        let quit = false;
        let totalFixed = 0;
        let totalSkipped = 0;

        while (!quit) {
            console.clear();
            // 每次循环都重新扫描，以获取最新的错误列表（并排除已忽略的）
            let currentErrors = await validateTranslationFiles({ checkIdentical: true, ignoredPositions, silent: true });
            if (currentErrors.length === 0) {
                console.log(totalFixed > 0 ? color.green(t('checkTasks.allIdenticalFixed')) : color.yellow(t('checkTasks.noIdenticalToProcess')));
                break;
            }

            const errorToFix = currentErrors[0]; // 一次处理一个
            // 提示用户对当前错误做出决策
            const decision = await promptForSingleIdenticalFix(errorToFix, currentErrors.length);

            // 根据用户的决策执行操作
            if (decision.action === 'retry') {
                // 如果用户在二次确认时取消了"中止"，则重新尝试当前问题
                continue;
            }
            if (decision.action === 'abort') {
                quit = true;
                continue;
            }
            if (decision.action === 'skip-all') {
                totalSkipped += currentErrors.length;
                quit = true;
                continue;
            }

            if (decision.action === 'skip') {
                // 将问题加入忽略列表
                ignoredPositions.add(errorToFix.node.range[0]);
                totalSkipped++;
                console.log(color.yellow(t('checkTasks.identicalSkipped')));
            } else {
                // 应用修复（修改或移除）
                await applySingleIdenticalFix(decision);
                totalFixed++;
                console.log(color.green(t('checkTasks.identicalFixed')));
            }
        }

        // 打印手动修复的总结
        const separator = color.dim(t('validation.separator').replace(/-/g, ''));
        console.log(`\n${separator}`);
        console.log(color.bold(t('checkTasks.manualFixSummaryTitle')));
        console.log(t('checkTasks.identicalTotalProcessed', '  - ' + color.green(``), totalFixed));
        if (totalSkipped > 0) {
            console.log(t('checkTasks.identicalTotalSkipped', '  - ' + color.yellow(``), totalSkipped));
        }
        console.log(separator);
    }
}