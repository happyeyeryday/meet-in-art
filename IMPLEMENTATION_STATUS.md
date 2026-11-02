# 最终实施与验收状态

2026-11-02。成员：朱昭荣、宋琪语。中文离线 MVP、课程材料与真实录屏已完成。原始三个选题文件保持不变。

## GitHub 版本：与画相逢

仓库：https://github.com/happyeyeryday/meet-in-art 。网页、启动提示、README 和新导出图片使用“与画相逢”；课程报告、PPT、视频保留原题名“把自己放进画里／入画”。

发布前回归再次通过 22 项单元测试、类型检查、资源 SHA-256 校验及 36 项浏览器验收。另验证了四种启动场景，以及新名称、旧记录恢复、导出兼容和 390px 布局，详见 `evidence/startup-checks.json` 与 `evidence/github-release-checks.json`。

源码首次启动可自动构建，无需 npm 安装；离线包使用预构建网页。GitHub Actions 在 Linux 和 Windows 上运行启动、单元、类型及资源检查，版本标签触发两个 ZIP 和校验值的发布；实际运行结果以仓库 Actions 页面为准。

以下课程验收描述保留原研究边界，功能检查不等于真人试用或学习效果验证。

## 已交付

- 三幅画的观察卡、上传照片、真实姿态/构图/色板分析、最多三条建议、两次共同关节比较、创作说明、本机保存恢复删除、PNG/JSON 导出。
- 固定 MediaPipe 1.2.0 运行时、官方模型、三幅原画、六张标注的 AI 合成示例、本地字体及许可。
- 无需安装 npm 的预构建离线包，以及源码、依赖锁文件、资源 SHA-256、Windows/WSL 启动脚本。
- 报告正文 2694 个汉字（含非汉字共 3285 字符），4 页 PDF、可编辑 HTML/JSON；12 页可编辑 PPTX 和 PDF。
- 约 5 分钟讲稿；2 分 37.92 秒、1440×900 的连续真实浏览器录屏；后续真人试用记录表。

## 验收依据

| 范围 | 实际结果 | 证据 |
| --- | --- | --- |
| 数学、色板与资源清单 | 22 项单元测试通过 | `evidence/unit-tests.txt` |
| 类型与构建 | TypeScript 检查通过；内置转换器可构建 | `evidence/typecheck.json` |
| 真实模型 | 三幅画、六张示例均返回可用关键点 | `evidence/browser/acceptance.json` 与三组 JSON |
| 浏览器闭环与异常 | 36 项检查通过 | `evidence/browser/acceptance.json` |
| 空缓存阻断外网 | 全新 Chrome 配置，只放行本机服务；0 外部域名请求、0 照片上传请求 | 同上，含请求日志与隔离方法 |
| 解压独立运行 | 从无 node_modules 的新目录启动，再次通过全部 36 项浏览器检查 | `evidence/unpacked-browser/acceptance.json` |
| 图片导出 | 三组 PNG 及 200 字说明导出完成，目视检查无文本裁切 | `evidence/browser/*-comparison.png`、`reflection-200-characters.png` |
| 文档 | PDF 渲染；PPTX 独立解析、XML/关系检查通过，含 152 个文字节点 | `evidence/document-checks.json`、`pptx-parser-check.json` |
| 视频 | Chrome 解码通过，时长 157.92 秒；关键帧目视检查 | `evidence/video/verification.json` |

模型在本次六图测试中的 detect 调用约 40—259 ms，不含初始化、图片解码及导出。设备和软件信息在 `evidence/environment.json`。

前期限制网络和浏览器的执行环境已通过获准命令解决，原错误日志留在 `evidence/history`。历史阶段材料位于 `archive`，不代表当前交付状态。

## 项目复评分

按此前约定的量表自评：**88 / 100**。这不是教师正式成绩。

| 维度 | 得分 | 依据与余地 |
| --- | ---: | --- |
| 艺术问题与内容 / 20 | 18 | 三幅作品观察任务明确；还可深化艺术史背景与参考点研究 |
| 产品闭环 / 30 | 28 | 三画真实推理、记录、导出与离线解压复测通过；仍是照片上传型 MVP |
| AI 可靠性 / 20 | 17 | 有置信度、共同关节和失败处理；二维透视、遮挡及人工标注仍有限制 |
| 界面体验 / 10 | 8 | 中文响应式界面和关键点开关；手机仅模拟视口验证 |
| 验证与证据 / 10 | 8 | 单元、类型、浏览器、断网、解压复测有证据；不是大规模泛化评测 |
| 结课材料 / 10 | 9 | 报告、PPT、讲稿、来源、视频齐全；PPTX 未在 Microsoft PowerPoint 原生渲染验收 |

## 结论边界

六张演示照片均为 AI 合成，不是真人参与者。没有开展真人试用，也不声称验证了学习效果。后续试用属于研究扩展，不计作当前已完成的实验。

Windows 与 Linux 的启动脚本、构建、单元、类型和资源检查已通过 GitHub Actions。真实模型的浏览器验收平台为 WSL + Chrome 146。真人手机、其他浏览器和原生 PowerPoint 的差异应在展示设备上提前确认。
