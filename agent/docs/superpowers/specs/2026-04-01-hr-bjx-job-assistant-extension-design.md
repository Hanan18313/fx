# 北极星人才网求职助手浏览器扩展 — 设计文档

**日期：** 2026-04-01  
**项目路径：** `d:/hwl_workspace/application/agent`  
**目标网站：** https://hr.bjx.com.cn

---

## 1. 产品概述

一款 Chrome/Edge 浏览器扩展，在用户浏览 hr.bjx.com.cn 时提供 AI 驱动的求职助手。用户通过自然语言描述求职需求（职位名称、薪资期望、地区），助手自动搜索网站职位并返回推荐列表；用户点击职位后，助手进一步分析薪资合理性、公司背景和简历匹配度。

**目标用户：** 在北极星人才网找工作的求职者  
**AI 后端：** DeepSeek API（国内模型，中文能力强，成本低）  
**架构模式：** 纯前端扩展，无需服务器，数据不经过第三方

---

## 2. 核心功能

### 2.1 职位推荐（主流程）
1. 用户点击页面右下角悬浮助手按钮，弹出对话框
2. 用户输入需求，例如："帮我找光伏工程师，15k 以上，北京"
3. DeepSeek 从自然语言中提取结构化参数：`{ position, salaryMin, salaryMax, city }`
4. Content Script 以提取的参数调用 hr.bjx.com.cn 搜索接口（优先）或抓取搜索结果页（降级）
5. 职位列表以卡片形式展示在对话框中（职位名、薪资、公司名、城市）

### 2.2 职位详情分析（次流程）
用户点击任意职位卡片，弹窗切换到分析视图，展示三块内容（由 DeepSeek 一次调用流式返回）：

| 分析块 | 内容 |
|--------|------|
| 💰 薪资分析 | 该岗位薪资与市场行情对比，判断是否合理 |
| 🏢 公司背景 | 公司性质（央企/民企）、规模、行业地位、稳定性评价 |
| 📋 简历匹配 | 与用户简历对比，给出匹配度百分比及具体优劣势说明 |

分析视图底部提供"继续对话"（返回聊天追问）和"投递简历"（跳转网站原始投递页）两个操作。

### 2.3 简历管理
- 用户在扩展设置页（Options Page）粘贴简历文本，一次配置，永久生效
- 简历存储于 `chrome.storage.local`，不上传任何服务器

---

## 3. 架构设计

### 3.1 扩展模块

```
agent/
└── extension/
    ├── manifest.json          # Manifest V3，仅注入 hr.bjx.com.cn
    ├── background/
    │   └── service-worker.ts  # DeepSeek API 调用、消息路由
    ├── content/
    │   └── content-script.ts  # 注入悬浮按钮、搜索接口调用/页面抓取
    ├── sidepanel/
    │   ├── index.html         # 弹窗 UI 入口
    │   ├── App.tsx            # React 根组件
    │   ├── views/
    │   │   ├── ChatView.tsx   # 对话 + 职位列表视图
    │   │   └── DetailView.tsx # 职位详情分析视图
    │   └── components/
    │       ├── JobCard.tsx
    │       ├── AnalysisBlock.tsx
    │       └── ChatInput.tsx
    ├── options/
    │   ├── index.html
    │   └── Options.tsx        # 简历粘贴 + API Key 设置
    └── types/
        ├── job.ts
        ├── analysis.ts
        └── message.ts
```

### 3.2 数据流

```
用户输入自然语言
    ↓
sidepanel → background: { type: 'SEARCH', query }
    ↓
background: DeepSeek 提取 { position, salaryMin, salaryMax, city }
    ↓
background → content: { type: 'FETCH_JOBS', params }
    ↓
content: 调用 hr.bjx.com.cn 接口（或抓取页面）
    ↓
content → background → sidepanel: JobList[]
    ↓
用户点击职位卡片
    ↓
sidepanel → background: { type: 'ANALYZE', job, resume }
    ↓
background: DeepSeek 流式分析（薪资 + 公司 + 简历匹配）
    ↓
background → sidepanel: 流式 token，逐块渲染
```

### 3.3 消息类型

| 消息类型 | 发送方 | 接收方 | 说明 |
|----------|--------|--------|------|
| `SEARCH` | sidepanel | background | 用户发起职位搜索 |
| `FETCH_JOBS` | background | content | 触发接口调用/页面抓取 |
| `JOBS_RESULT` | content | background | 返回职位列表 |
| `ANALYZE` | sidepanel | background | 请求职位详情分析 |
| `ANALYSIS_CHUNK` | background | sidepanel | 流式分析片段 |

### 3.4 存储结构（chrome.storage.local）

```ts
{
  resume: string,       // 用户简历文本
  apiKey: string,       // DeepSeek API Key
  searchHistory: Array<{ query: string, timestamp: number }>  // 可选
}
```

---

## 4. UI 设计

**触发方式：** 右下角固定悬浮按钮（🤖），仅在 hr.bjx.com.cn 域名下显示  
**弹窗尺寸：** 宽 300px，高自适应（最大 520px），可拖拽  
**视图切换：** 弹窗内部在"聊天/列表视图"和"详情分析视图"之间切换，无页面跳转

### 聊天/列表视图
- 顶部：标题栏（助手名称 + 关闭按钮）
- 中部：对话消息流（用户消息靠右气泡，助手消息靠左）
- 职位列表以卡片内嵌在对话流中展示
- 底部：输入框 + 发送按钮

### 详情分析视图
- 顶部：返回按钮 + "职位分析"标题 + 关闭按钮
- 职位基本信息摘要（名称、薪资、公司、城市、原始链接）
- 三块分析内容（流式逐块显示）
- 底部：继续对话 + 投递简历按钮

---

## 5. 技术选型

| 项目 | 选型 | 理由 |
|------|------|------|
| 扩展规范 | Manifest V3 | 现代标准，Chrome/Edge 均支持 |
| UI 框架 | React + TypeScript | 项目统一技术栈 |
| 打包工具 | Vite + CRXJS | 专为 MV3 扩展优化，支持 HMR |
| AI 模型 | DeepSeek Chat API | 中文理解强，成本低，国内访问稳定 |
| 样式 | CSS Modules | 避免与目标网站样式冲突 |

---

## 6. 关键约束与风险

| 风险 | 应对 |
|------|------|
| hr.bjx.com.cn 接口变动 | Content Script 同时实现接口调用和 DOM 抓取两套逻辑，互为降级 |
| DeepSeek API 响应慢 | 使用流式输出，边生成边展示，避免用户等待白屏 |
| 网站 CSP 限制 | 所有外部请求（DeepSeek API）从 background Service Worker 发出，不受页面 CSP 影响 |
| 简历信息安全 | 简历仅存本地 `chrome.storage.local`，随 prompt 发送给 DeepSeek 时用户已知晓 |

---

## 7. 超出当前范围（不做）

- 自动投递简历功能
- 多标签页职位对比
- 收藏/历史记录同步到云端
- 支持其他招聘网站
