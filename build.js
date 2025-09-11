/**
 * @file build.js
 * @description
 * 这是一个用于构建“油猴脚本”（UserScript）的 Node.js 脚本。
 *
 * 它做的事情很简单：
 * 1. 读取 `src/main.js` 文件作为入口，并使用 esbuild 将其所有相关的代码打包成一个单独的JS文件。
 * 2. 读取 `src/header.txt` 文件，这是油猴脚本的头部信息，用于让 Tampermonkey/Greasemonkey 等插件识别脚本。
 * 3. 将头部信息和打包后的JS代码合并成一个最终的脚本文件。
 * 4. 将这个最终文件输出到 `dist` 文件夹中。
 *
 * ---
 * 如何使用:
 * 1. 确保你已经安装了 Node.js 和 npm。
 * 2. 在终端里进入这个项目所在的文件夹。
 * 3. 运行 `npm install esbuild` 来安装依赖。
 * 4. 运行 `node build.js` 来执行此脚本。
 * ---
 */

// 引入 esbuild，这是一个非常快的 JavaScript 打包和压缩工具。
const esbuild = require('esbuild');
// 引入 Node.js 内置的“文件系统”模块（的 Promise版本），用于读取和写入文件。
const fs = require('fs/promises');
// 引入 Node.js 内置的“路径”处理模块，用于处理跨平台的文件路径问题。
const path = require('path');

/**
 * 主构建函数，包含了所有的构建逻辑。
 * 使用 async/await 来处理异步的文件操作。
 */
async function build() {
  try {
    // 在终端打印一条消息，告诉用户构建已经开始。
    console.log('🚀 开始构建...');

    // --- 第一步：使用 esbuild 在内存中打包代码 ---
    const result = await esbuild.build({
      // entryPoints: 指定打包的入口文件。我们的所有代码都从这里开始。
      entryPoints: [path.join(__dirname, 'src/main.js')],
      // bundle: true, 开启打包模式。esbuild会分析依赖，并把所有需要的文件合并成一个。
      bundle: true,
      // 【重要】write: false, 设置为 false，esbuild 不会把结果写入硬盘文件，
      // 而是会把打包后的代码放在内存中（result变量里），方便我们后续添加头部信息。
      write: false,
      // charset: 'utf8', 确保输出的文件编码是 UTF-8，防止中文乱码。
      charset: 'utf8',
    });

    // --- 第二步：读取油猴脚本的头部信息 ---
    // 从 src/header.txt 文件中读取内容。这些信息是油猴脚本运行所必需的。
    const header = await fs.readFile(path.join(__dirname, 'src/header.txt'), 'utf-8');

    // --- 第三步：将头部信息和打包后的代码拼接成最终脚本 ---
    // 从 esbuild 的内存结果中获取打包好的 JavaScript 代码。
    const bundledCode = result.outputFiles[0].text;
    // 使用模板字符串将 header 和 bundledCode 组合起来。中间加两个换行符以保持格式清晰。
    const finalScript = `${header}\n\n${bundledCode}`;

    // --- 第四步：创建输出目录 ---
    // 确保 ./dist 文件夹存在，如果不存在就创建它。
    // recursive: true 可以防止在文件夹已存在时报错。
    await fs.mkdir(path.join(__dirname, 'dist'), { recursive: true });

    // --- 第五步：将最终的脚本内容写入到文件 ---
    // 将拼接好的最终脚本内容写入到 dist/Web-Translate-Script.user.js 文件中。
    await fs.writeFile(path.join(__dirname, 'dist/Web-Translate-Script.user.js'), finalScript);

    // 在终端打印成功消息，并告诉用户产物在哪里。
    console.log('✅ 构建成功！最终脚本位于 dist/Web-Translate-Script.user.js');

  } catch (error) {
    // 如果上面的任何一步出错了（比如文件找不到、代码有语法错误等），就会在这里捕获到错误。
    console.error('❌ 构建失败:', error);
    // 退出程序，并返回一个错误码（1），表示构建过程异常中断。
    process.exit(1);
  }
}

// 调用并执行上面的 build 函数，开始整个构建过程。
build();