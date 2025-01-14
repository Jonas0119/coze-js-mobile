# Coze Realtime Console

一个基于 React 的实时通讯控制台应用,用于与 Coze 机器人进行实时语音/视频交互。

## 项目简介

这是一个用于演示和测试 Coze Realtime API 功能的 Web 控制台。它允许用户连接到 Coze 机器人,进行实时语音对话、视频通话,并提供丰富的调试工具和监控功能。

## 主要功能

### 基础功能
- 用户认证与工作区管理
- 机器人连接与会话控制
- 实时语音对话
- 视频通话支持
- 消息发送与接收

### 音频/视频控制
- 麦克风开关控制
- 音频设备选择(输入/输出)
- 视频开关控制
- 音频设备测试工具

### 调试与监控
- 实时事件日志
- 用户/助手消息记录
- 音频属性报告
- 设备状态监控
- 连接状态管理

### 设置管理
- Access Token 配置
- Bot ID 设置
- Voice ID 设置
- API Base URL 配置
- 噪声抑制设置

## 技术栈

### 前端框架
- React 18
- TypeScript
- React Router v6
- Ant Design v5

### 核心依赖
- @coze/api - Coze API SDK
- @coze/realtime-api - Coze 实时通讯 SDK

### 开发工具
- Create React App
- Webpack 5
- ESLint
- TypeScript
- Jest

## 项目结构

src/
├── pages/ # 页面组件
│ ├── main/ # 主控制台页面
│ │ ├── header.tsx # 头部控制栏
│ │ ├── player.tsx # 视频播放器
│ │ ├── settings.tsx # 设置面板
│ │ └── index.tsx # 主页面
│ └── login/ # 登录页面
├── hooks/ # 自定义 Hooks
├── utils/ # 工具函数
├── App.tsx # 应用入口
└── index.tsx # 渲染入口
public/ # 静态资源
config/ # 项目配置
scripts/ # 构建脚本


## 开发指南

### 环境要求
- Node.js v18+
- npm 或 yarn

### 安装依赖
bash
rush update
rush build

### 启动开发服务器
bash
npm run start

### 构建生产版本
bash
npm run build

## 使用说明

1. 配置开发环境
2. 安装依赖并构建项目
3. 启动开发服务器
4. 访问 http://localhost:3000
5. 在设置面板中配置:
   - Access Token
   - Bot ID  
   - Voice ID
   - API Base URL
6. 点击"Connect"按钮开始连接
7. 允许麦克风权限即可开始对话

## 许可证
