const esbuild = require('esbuild');
const fs = require('fs/promises');
const path = require('path');

async function build() {
  try {
    console.log('开始构建...');
    const result = await esbuild.build({
      entryPoints: [path.join(__dirname, 'src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
    });
    const header = await fs.readFile(path.join(__dirname, 'src/header.txt'), 'utf-8');
    const bundledCode = result.outputFiles[0].text;
    const finalScript = `${header}\n\n${bundledCode}`;
    await fs.mkdir(path.join(__dirname, 'dist'), { recursive: true });
    await fs.writeFile(path.join(__dirname, 'dist/Web-Translate-Script.user.js'), finalScript);
    console.log('✅ 构建成功！最终脚本位于 dist/Web-Translate-Script.user.js');
  } catch (error) {
    console.error('构建失败:', error);
    process.exit(1);
  }
}

build();