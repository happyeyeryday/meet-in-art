与画相逢 / MEET IN ART
朱昭荣、宋琪语 · 艺术与 AI 课程项目
2026-11-23：新版源码使用说明

完整图文说明请打开 README.md；交作业前请阅读“提交前检查.md”。

最新作业材料
deliverables/与画相逢-作业介绍.pptx：17 页，可编辑。
deliverables/与画相逢-作业介绍.pdf：同一份 PPT 导出的 17 页 PDF。
旧版 PPT、PDF、讲稿及源文件位于 deliverables/archive/2026-11-02。

启动
需要 Node.js 22.19 或更高版本，以及 Chrome / Edge。
如果之前已经运行过旧版，拉取后先在项目根目录执行：
  node app/scripts/build.mjs
Windows：双击 app/start-demo.bat。
WSL / Linux / macOS：bash app/start-demo.sh。
浏览器访问 http://127.0.0.1:4173，保持启动窗口打开；Ctrl+C 停止。

新版体验
跳过开场 → 探索世界 → 页面下方“内置示例” → 绝望的人 → 载入完整示例。
观察两次反馈，保存到本机，再进入“我的护照”查看作品、印章和可拖拽排版的内页。
40 件探索作品分属 6 个时期、24 个地点时期节点，另有 2 件独立演示作品。
完整演示有三幅画、六张 AI 合成照片；不是真人试用。

在线点评是可选功能
默认姿态、配色和记录均在本地运行，无需令牌。
如将 app/.env.example 复制为 app/.env 并填入有效令牌，页面会自动将原画和仿拍发给配置的外部模型。
AI_MOCK=1 仅返回模拟点评。修改配置后重启服务。
不要分享 .env；Git 和打包脚本排除它。

交付状态
当前 PPT/PDF 已覆盖地图与护照。老师无需 API、无需自备照片，也无需 npm 安装。
GitHub 仓库不是在线试玩网站：请下载当前源码，按上面的步骤启动。
v1.0.3 Release、已有两个 ZIP、原报告和原视频仍为三画旧版；体验新版不要下载旧 Release。
README.md 与“提交前检查.md”记录当前功能和检查范围。
