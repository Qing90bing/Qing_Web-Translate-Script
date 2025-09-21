/**
 * @file build-tasks/tasks/build-project.js
 * @description
 * 此任务负责执行完整的项目构建流程，生成最终可用的油猴脚本。
 *
 * 工作流程：
 * 1. 调用 `promptToPreserveFormatting` 询问用户是否希望在最终脚本中保留注释和格式。
 * 2. 使用 `esbuild` 将 `src/main.js` 作为入口点，打包所有相关的 JavaScript 模块。
 *    - `bundle: true` 会将所有依赖项合并到一个文件中。
 *    - `write: false` 使得 `esbuild` 将结果返回到内存中，而不是直接写入文件，以便我们进行后续处理。
 * 3. 读取 `src/header.txt` 的内容，这是油猴脚本的元数据头部。
 * 4. 根据用户在步骤1中的选择，对打包后的代码进行处理：
 *    - **保留格式**: 直接使用 `prettier` 对代码进行格式化。
 *    - **不保留格式**: 先用正则表达式移除所有注释，然后用 `prettier` 格式化，再移除多余的空行。
 * 5. 将处理后的代码与头部内容拼接成最终的脚本字符串。
 * 6. 创建 `dist` 目录（如果尚不存在）。
 * 7. 将最终的脚本字符串写入到 `dist/Web-Translate-Script.user.js` 文件中。
 * 8. 处理可能发生的 `esbuild` 构建错误或其它异常。
 */

// 导入所需模块
import esbuild from 'esbuild'; // 高性能的 JavaScript 打包和压缩工具
import fs from 'fs/promises'; // Node.js 文件系统模块的 Promise 版本
import path from 'path'; // Node.js 路径处理模块
import prettier from 'prettier'; // 流行的代码格式化工具
import { color } from '../lib/colors.js'; // 导入颜色工具
import { promptToPreserveFormatting } from '../lib/prompting.js'; // 从 prompting 库导入交互函数

/**
 * @function handleFullBuild
 * @description “完整构建项目”任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleFullBuild() {
  try {
    console.log(color.cyan('🚀 开始执行完整构建流程...'));

    // --- 步骤 1: 询问用户是否希望保留格式 ---
    const preserveFormatting = await promptToPreserveFormatting();

    // --- 步骤 2: 使用 esbuild 执行打包 ---
    console.log(color.bold('\n--- (阶段 1/2) 正在打包脚本... ---'));
    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main.js')], // 指定打包的入口文件
      bundle: true,      // 开启打包模式，将所有依赖打包进一个文件
      write: false,      // 不将结果写入文件系统，而是返回到内存中
      charset: 'utf8',   // 设置输出文件的字符集
      minify: false,     // 不进行代码压缩，因为后续会用 Prettier 格式化
    });

    // --- 步骤 3: 后处理代码并组合成最终脚本 ---
    console.log(color.bold('\n--- (阶段 2/2) 正在生成最终文件... ---'));
    // 读取油猴脚本的头部信息
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');

    // 从 esbuild 的打包结果中获取代码文本
    let bundledCode = result.outputFiles[0].text;
    let finalScript;

    if (preserveFormatting) {
        // 如果用户选择保留格式，直接使用 Prettier 格式化代码
        const formattedCode = await prettier.format(bundledCode, {
            parser: 'babel', // 使用 babel 解析器
            semi: true, // 在语句末尾添加分号
            singleQuote: true, // 使用单引号
            printWidth: 9999, // 设置一个极大的打印宽度，以防止 Prettier 自动换行
        });
        // 将头部和格式化后的代码拼接起来
        finalScript = `${header}\n\n${formattedCode}`;
        console.log(color.green('  -> 💅 已保留注释和空白行。'));
    } else {
        // 如果用户选择不保留格式
        // 1. 使用正则表达式移除所有 JS 注释 (包括 `/**/` 和 `//`)
        bundledCode = bundledCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        // 2. 移除描述性属性 (更安全的处理方式，避免破坏对象结构)
        // 使用简单的正则表达式来移除特定的属性行
        bundledCode = bundledCode.replace(/^\s*description:\s*["'][\s\S]*?["'],?\s*$/gm, '');
        bundledCode = bundledCode.replace(/^\s*testUrl:\s*["'][\s\S]*?["'],?\s*$/gm, '');
        bundledCode = bundledCode.replace(/^\s*createdAt:\s*["'][\s\S]*?["'],?\s*$/gm, '');
        // 3. 使用 Prettier 格式化代码
        let formattedCode = await prettier.format(bundledCode, {
            parser: 'babel', semi: true, singleQuote: true, printWidth: 9999,
        });
        // 4. 移除格式化后可能产生的多余空行
        formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');
        // 5. 将头部和处理后的代码拼接起来
        finalScript = `${header}\n\n${formattedCode}`;
        console.log(color.green('  -> 🧹 已移除注释和多余空白行。'));
    }

    // --- 步骤 4: 将最终脚本写入文件 ---
    const distDir = path.resolve('dist');
    // 确保 `dist` 目录存在，如果不存在则创建它
    await fs.mkdir(distDir, { recursive: true });
    const outputPath = path.join(distDir, 'Web-Translate-Script.user.js');
    // 将最终脚本内容写入文件
    await fs.writeFile(outputPath, finalScript);

    console.log(color.bold(color.lightGreen(`\n🎉 构建成功！最终脚本位于: ${color.underline(outputPath)}`)));

  } catch (error) {
    // --- 异常处理 ---
    // esbuild 在构建失败时，会返回一个包含 `errors` 数组的特定错误对象。
    // 我们需要优先处理这种结构化错误，因为它能提供更详细、更精确的错误信息（如具体文件和行号）。
    if (error.errors && error.errors.length > 0) {
      console.error(color.lightRed('❌ esbuild 构建失败:'));
      error.errors.forEach(e => console.error(color.red(`  - 错误: ${e.text} [位置: ${e.location.file}:${e.location.line}]`)));
    } else {
      // 处理其他未知错误
      console.error(color.lightRed('❌ 构建过程中发生未知错误:'), error);
    }
  }
}
