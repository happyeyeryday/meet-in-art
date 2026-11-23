# 当前作业材料

更新时间：2026-11-23。

| 材料 | 用途 |
| --- | --- |
| **[与画相逢-作业介绍.pptx](与画相逢-作业介绍.pptx)** | 最新 17 页演示，可用 PowerPoint / WPS 编辑与放映 |
| **[与画相逢-作业介绍.pdf](与画相逢-作业介绍.pdf)** | 同一份 PPT 的 PDF，方便在线预览和提交 |
| [仓库启动与使用说明](../README.md) | 老师下载源码后本地体验，无需 API 或 npm 安装 |

新版覆盖选题来源、六时期与 40 件探索作品、探索地图、创作室、艺术护照、项目价值与不足。PPT 保持用户提供的原文件内容；PDF 使用 Microsoft PowerPoint 原生导出，均为 17 页。

## 旧版归档

[archive/2026-11-02](archive/2026-11-02/) 保存旧的 12 页 PPT、对应 PDF、约 5 分钟讲稿和版式源文件。它们描述最初的三画仿拍版本，不是当前答辩入口。

本目录中的原报告、原录屏和 v1.0.3 发布包同样对应旧版，保留作历史记录；如只提交 PPT 与链接，使用上表的当前材料即可。

## 再次导出 PDF

在安装了 Microsoft PowerPoint 的 Windows 上，从仓库根目录运行：

```powershell
powershell -NoProfile -File tools/export_presentation.ps1 -InputPptx "deliverables/与画相逢-作业介绍.pptx" -OutputPdf "deliverables/与画相逢-作业介绍.pdf"
```

也可以在 PowerPoint / WPS 中打开新版 PPT，选择“导出 → PDF”。旧工具 `tools/build_documents.py` 只生成旧版演示到归档目录，不会覆盖当前演示。
