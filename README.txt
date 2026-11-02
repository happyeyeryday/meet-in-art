与画相逢 / MEET IN ART
朱昭荣 · 宋琪语 | 艺术与 AI 课程项目 | 离线 MVP

GitHub：https://github.com/happyeyeryday/meet-in-art
下载包：https://github.com/happyeyeryday/meet-in-art/releases/latest
详细图文说明见 README.md。
原题名“把自己放进画里”和旧网页名“入画”指同一项目；课程报告、PPT、视频保留原题名。

打开演示
需要 Node.js 22.19 或更高版本，以及桌面 Chrome / Edge。
Windows：解压离线演示包，进入 app，双击 start-demo.bat。
WSL / macOS / Linux：在解压目录执行 bash app/start-demo.sh。
也可执行 node app/scripts/start-demo.mjs，然后打开 http://127.0.0.1:4173。
模型、WASM、原画、示例与字体已随包提供；运行预构建版本无需 npm install 或外网。
从 GitHub 下载的源码首次启动时会自动生成 dist；修改源码后仍需重新运行构建命令。
请通过本地服务打开，不要双击 dist/index.html。终端按 Ctrl+C 停止服务。
如果 4173 被占用，WSL 可用 PORT=4174 node app/scripts/start-demo.mjs；Windows CMD 先执行 set PORT=4174，再启动服务。

一分钟体验
1. 选择三幅画中的任意一幅，阅读观察卡。
2. 点击“用示例试试”或上传 JPG / PNG / WebP。
3. 查看实际识别的肩、肘、腕标记、姿态/构图建议和主要颜色。
4. 再上传第二张，查看两次共同可见关节的变化，写下一句拍摄想法。
5. 保存到本机、刷新恢复，或导出 PNG 与 JSON。
六张内置照片均为 AI 合成，页面、导出图和 JSON 都保留这一标识。

交付文件（两个 ZIP 分别提供，解压目录不再嵌套 ZIP）
- deliverables/入画_离线演示包.zip：最小运行包，模型与素材齐全。
- deliverables/名画仿拍_完整结课包.zip：源码、离线资源、材料、测试证据与原选题文件。
- deliverables/项目报告_最终版.pdf：约 2700 汉字正文，4 页。
- deliverables/项目报告_可编辑源稿.html、report-source.json：报告源稿。
- deliverables/答辩演示_最终版.pptx / .pdf：12 页，PPTX 文字可编辑。
- deliverables/答辩讲稿_约5分钟.txt：对应最终 PPT。
- deliverables/名画仿拍_真实演示.webm：2 分 37.92 秒，1440×900，真实浏览器操作与字幕，无配音。
- deliverables/后续真人试用记录表.pdf / .txt：未填写真人数据的试用表。
- deliverables/assets-sources.json、image-prompts.json、开源调研.txt：来源、许可、生成提示词与复用决策。
- evidence/browser：36 项真实浏览器检查、网络请求、截图与真实导出文件。
- evidence/unit-tests.txt：22 项通过的单元测试。
- evidence/video：交付视频解码检查和关键帧。

已验证的范围
三幅画、六张示例均完成真实 MediaPipe 推理；没有预填照片关键点。
22 项单元测试、TypeScript 类型检查、36 项浏览器检查通过。
浏览器验收使用 Chrome 146、全新上下文和空缓存，外部请求由拦截规则与不可用代理阻断，仅放行本机回环服务。观察到 0 个外部域名请求、0 个照片上传请求。
检查包括镜像重算、记录刷新恢复与删除、PNG/JSON 导出、390px 手机布局、空白图、多人图、腿部裁切、损坏文件、过大/过小图片、格式不支持与缺少模型。
PNG 已检查三图、中文、AI 标签和 200 字说明；视频已解码核对时长/尺寸并目视检查关键帧。
PPTX 经独立解析器读取、XML/内部关系检查；PDF 已渲染检查。未在 Microsoft PowerPoint 或真实手机硬件上验收，排版和性能可能随软件/设备不同。
没有开展真人试用，不宣称教学效果。约 40—259 ms 是此次六图 detect 调用耗时，不含模型加载、解码和导出，不是通用性能保证。

技术与本地数据
AI：@mediapipe/tasks-vision 1.2.0，pose_landmarker_full/float16/1，CPU / 模块 Worker。
配色：Color Thief 同步源码随包提供（MIT）；九个文件与上游 Git blob SHA 一致。
原画：肩、肘、腕由人工近似标注，不是解剖学真值。
姿态：保留宽高比，以肩部中心对齐、肩宽归一化；保留身体倾斜。
构图：比较肩部中心在画幅中的位置及肩宽占画幅比例，不代表全身面积。
两次变化：只用双方共同可靠的肘腕，防止遮挡造成虚假改善。
保存：仅点击“保存到本机”后写入当前浏览器 IndexedDB；清理站点数据会删除记录，请及时导出。
网络：无照片上传接口；本地服务只接受 GET/HEAD，同源连接策略阻止页面及 Worker 访问外部地址。
不同端口/浏览器视为不同本地存储，不会共享保存记录。

修改与复现（完整结课包）
无需安装 npm 的构建与单元测试：
  node app/scripts/build.mjs
  node --experimental-strip-types app/scripts/test.mjs
  node app/scripts/check-assets.mjs --dist
开发工具安装（仅开发和浏览器自动化需要联网）：
  cd app
  npm ci --ignore-scripts
  npm run typecheck
  npm test
  npm run test:browser
test:browser 需要本地服务已启动。默认使用 /usr/bin/google-chrome；其他位置设置 CHROME_PATH。没有系统 Chrome 时，可安装 Playwright Chromium。
浏览器测试脚本创建独立临时配置，不读取日常浏览器账号数据。
只有需要重建运行资源时，才执行 npm run prepare:assets；该步骤从固定官方 npm 包复制 WASM，并从 Google 地址下载模型，随后记录 SHA-256。
当前包已经包含全部运行资源。

录屏复现
在 app 目录运行 npx playwright install ffmpeg，然后 node scripts/record-demo.mjs。
录屏需要浏览器运行权限和本地服务；脚本按真实时间执行操作，不替换模型输出。
本次编码器安装在临时目录，因此使用了 PLAYWRIGHT_BROWSERS_PATH=/tmp/ai-art-playwright；你可使用 Playwright 默认路径。

源码入口
app/src/main.ts：界面、上传、记录与交互。
app/src/analysis.ts：比较、置信度和共同关节算法。
app/src/artworks.ts：作品说明、来源与人工参考点。
app/src/pose.worker.ts：真实模型加载与推理。
app/src/export.ts：PNG/JSON 导出。
app/src/style.css：响应式样式。
tools/build_documents.py：从报告 JSON、素材和版面定义重建 PDF/PPTX；Python 标准库即可运行。
tools/package_release.py：生成离线演示包和完整结课包。
app/public/runtime-manifest.json：模型和运行时的文件长度、来源与 SHA-256。

原始三个选题文件保持不变。历史阶段材料与环境拒绝日志已归档，不作为最终验收结论。
课程自评 88/100，详细依据见 IMPLEMENTATION_STATUS.md；这不是教师正式评分。
