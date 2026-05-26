# DeepSeek API 缓存 & 余额监控面板

![GitHub](https://img.shields.io/badge/DeepSeek-API_Monitor-4facfe?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-12.x+-2ed573?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-ffa502?style=flat-square)

一个轻量级的 DeepSeek API 实时监控桌面工具，带有浮窗式可视化面板。支持缓存命中率、余额查询、Token 用量等指标的自动刷新监控。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 💰 **余额监控** | 实时查询 DeepSeek 账户余额 |
| 🎯 **缓存命中率** | 监控 API 缓存命中 vs 未命中比例 |
| 📝 **Token 用量** | 查看最近请求的输入/输出 Token |
| 📈 **缓存历史走势** | Sparkline 迷你折线图，显示最近 10 次缓存率变化 |
| 🔄 **自动刷新** | 每 30 秒自动刷新所有数据 |
| 📋 **调试日志** | 记录每次 API 调用详情，支持复制 |
| 🪟 **浮窗设计** | 可拖拽、最小化，固定在桌面角落 |
| 🔑 **API Key 管理** | 本地保存，支持切换密钥 |

## 📦 文件结构

```
deepseek-api-monitor/
├── deepseek-monitor.html       # 监控面板前端（浮窗式 UI）
├── deepseek-monitor-server.js  # 本地代理服务器（端口 38899）
├── launcher.js                 # Node.js 启动脚本
├── launcher.vbs                # VBS 启动器（Edge 应用窗口模式）
├── .gitignore
└── README.md
```

## 🚀 快速开始

### 前置条件

- Node.js 12+（如果使用 Hermes 环境，路径为 `C:\Users\15798\AppData\Local\hermes\node\node.exe`）
- 有效 DeepSeek API Key（以 `sk-` 开头）

### 启动方式

#### 方式一：直接打开 HTML（推荐调试）

```bash
# 1. 启动本地代理服务器
node deepseek-monitor-server.js

# 2. 浏览器访问
# 打开 http://127.0.0.1:38899
```

#### 方式二：一键启动

双击 `launcher.vbs` 即可：
1. 自动启动代理服务器
2. 以 Edge 应用窗口模式打开监控面板
3. 点击弹窗确认后自动关闭

#### 方式三：Hermes 集成启动

```bash
node launcher.js
```

### 配置

1. 打开监控面板后，输入你的 DeepSeek API Key（`sk-...`）
2. 点击 **保存** 开始监控
3. API Key 会保存在浏览器 `localStorage` 中，下次自动加载

## 🖥️ 界面说明

```
┌─ DeepSeek Monitor ──────── [―] [✕] ─┐
│                                      │
│  🔑 [sk-xxx...xxxxxxxx] [保存]       │
│                                      │
│  🟢 正常运行        更新: 14:32:15   │
│                                      │
│  ┌──────────┐  ┌──────────────┐      │
│  │ 💰 余额  │  │ 🎯 缓存命中率│      │
│  │ $10.52   │  │   85.3%     │      │
│  └──────────┘  └──────────────┘      │
│                                      │
│  📊 缓存命中 vs 未命中               │
│  ████████████░░░░░                    │
│  🟢 命中 1024  🔴 未命中 176        │
│                                      │
│  📝 最近 Token 用量                  │
│  输入 (Prompt):      256 tokens      │
│  输出 (Completion):   64 tokens      │
│  总计:               320 tokens      │
│  缓存命中:             84 tokens     │
│                                      │
│  📈 缓存率历史 (最近10次)            │
│  ▓▓▓▓▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│  旧                            新    │
│                                      │
│  下次刷新: 23s        [⟳ 立即刷新]  │
└──────────────────────────────────────┘
```

## 🔧 API 端点

服务器运行在 `http://127.0.0.1:38899`

| 端点 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 返回监控面板 HTML |
| `/api/balance` | POST | 查询 DeepSeek 账户余额（Body: `{"apiKey":"sk-..."}`） |
| `/api/test` | POST | 测试 API 调用并获取缓存统计（Body: `{"apiKey":"sk-..."}`） |

## 📝 注意事项

- 监控面板需要在本地服务器环境下运行（`file://` 协议会有 CORS 限制）
- API Key 仅存储在浏览器本地，不会上传到任何服务器
- 服务器默认监听 `127.0.0.1:38899`，仅本地可访问
- 关闭监控窗口后，API 调用自动停止

## 🛠️ 技术栈

- **前端**: 原生 HTML + CSS + JavaScript（无任何外部依赖）
- **后端**: Node.js HTTP 服务器（`http` / `https` 原生模块）
- **启动器**: VBScript + Node.js
- **API**: DeepSeek API (`/user/balance`, `/chat/completions`)

---

> 💡 提示：如需修改刷新间隔，在 HTML 中搜索 `REFRESH_INTERVAL = 30000`（单位毫秒）
