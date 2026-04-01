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
| 📋 简历匹配 | 与用户简历对比，给出匹配度百分比及具体优劣势说明。**若用户未配置简历，跳过此块并在分析视图顶部显示提示条："请先在设置页粘贴你的简历以启用匹配功能"** |

分析视图底部提供"继续对话"（返回聊天追问）和"投递简历"（跳转网站原始投递页）两个操作。

### 2.3 简历管理
- 用户在扩展设置页（Options Page）粘贴简历文本，一次配置，永久生效
- 简历存储于 `chrome.storage.local`，不上传任何服务器

### 2.4 错误状态 UI 行为

| 场景 | 弹窗展示 |
|------|----------|
| API Key 未配置，用户发送消息 | 助手消息："你还没有配置 DeepSeek API Key，[点击前往设置 →]" |
| 搜索接口返回空列表 | 助手消息："没有找到符合条件的职位，你可以尝试放宽薪资范围或更换城市" |
| 网络请求超时（>15s） | 助手消息："请求超时，请检查网络后重试" + 重试按钮 |
| DeepSeek API 返回错误 | 助手消息："AI 分析暂时不可用，错误：{errorCode}，请稍后重试" |
| DOM 抓取失败（页面结构变化） | 降级提示："当前页面结构已变化，无法自动抓取，请 [手动打开搜索页]" |

---

## 3. 架构设计

### 3.1 UI 宿主说明

弹窗 UI 由 Content Script 注入页面，挂载在 **Shadow DOM** 中（`element.attachShadow({ mode: 'closed' })`），React 应用渲染到 Shadow Root。

> **为什么不用 Chrome Side Panel API？** Side Panel 是独立标签页级别的侧边栏，生命周期与页面绑定，但本项目的 UI 是用户主动唤起的浮动对话框，使用 Shadow DOM 注入方式更符合"悬浮气泡"的交互模式，也无需注册额外的 `side_panel` manifest 权限。

样式通过 **CSS Modules + 构建时内联到 Shadow DOM** 方式隔离，避免与目标网站样式冲突。

### 3.2 扩展模块

```
agent/
└── extension/
    ├── manifest.json          # Manifest V3，仅注入 hr.bjx.com.cn
    ├── background/
    │   └── service-worker.ts  # DeepSeek API 调用、消息路由、tabId 管理
    ├── content/
    │   └── content-script.ts  # 注入 Shadow DOM、搜索接口调用/页面抓取
    ├── popup/                 # Shadow DOM 内渲染的 React 应用
    │   ├── index.tsx          # React 挂载入口（挂载到 Shadow Root）
    │   ├── App.tsx            # 根组件，管理 ChatView ↔ DetailView 切换
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
        ├── job.ts             # 对应 hr.bjx.com.cn 实际响应结构（见 3.5 节）
        ├── analysis.ts
        └── message.ts
```

### 3.3 数据流

```
[popup] 用户输入自然语言
    ↓  chrome.runtime.sendMessage({ type: 'SEARCH', query, tabId })
[background] DeepSeek 提取 { position, salaryMin, salaryMax, city }
    ↓  chrome.tabs.sendMessage(tabId, { type: 'FETCH_JOBS', params })
[content] 调用 hr.bjx.com.cn 接口（或抓取页面）
    ↓  chrome.runtime.sendMessage({ type: 'JOBS_RESULT', jobs })
[background] → chrome.tabs.sendMessage(tabId, { type: 'JOBS_RESULT', jobs })
    ↓  content 将消息转发到 Shadow DOM 内的 popup（通过 window.postMessage）
[popup] 渲染职位卡片列表
    ↓
用户点击职位卡片
    ↓  chrome.runtime.sendMessage({ type: 'ANALYZE', job, resume, tabId })
[background] 建立 long-lived port（chrome.runtime.connect）
    ↓  DeepSeek 流式 SSE 调用，逐 token port.postMessage({ type: 'CHUNK', delta })
[popup] 流式渲染分析内容
```

**tabId 获取方式：** Content Script 在初始化时通过 `chrome.runtime.sendMessage({ type: 'REGISTER_TAB' })` 将自身 tabId 注册到 background；background 维护一个 `activeTabs: Map<tabId, boolean>`，每次收到 popup 消息时使用随消息携带的 tabId 定向转发。

**流式传输机制：** 使用 `chrome.runtime.connect()` 建立 long-lived port，避免 `sendMessage` 的单次响应限制。DeepSeek SSE 流的每个 delta 通过 `port.postMessage` 逐块推送到 popup，popup 监听 `port.onMessage` 追加渲染。

### 3.4 消息类型

| 消息类型 | 发送方 | 接收方 | 说明 |
|----------|--------|--------|------|
| `REGISTER_TAB` | content | background | content script 初始化时注册当前 tabId |
| `SEARCH` | popup | background | 用户发起职位搜索，携带 tabId |
| `FETCH_JOBS` | background | content | 触发接口调用/页面抓取 |
| `JOBS_RESULT` | content → background → content → popup | 链式转发 | 返回职位列表 |
| `ANALYZE` | popup | background | 请求职位详情分析，建立 port 连接 |
| `CHUNK` | background | popup（via port） | 流式分析 token 片段 |
| `ANALYZE_DONE` | background | popup（via port） | 分析完成信号 |
| `ERROR` | background | popup | 错误信息，携带 errorCode 和 message |

### 3.5 hr.bjx.com.cn 搜索接口

> **⚠️ 实现前必须验证**：以下接口信息需在实现阶段通过 DevTools Network 面板抓包确认，若接口不可用则降级到 DOM 抓取方案。

**预计接口（待验证）：**
```
GET https://hr.bjx.com.cn/jobs/search
Query: keyword={position}&city={city}&salaryMin={salaryMin}&salaryMax={salaryMax}&page=1
```

**预期响应结构（待验证，对应 job.ts 类型）：**
```ts
interface JobSearchResponse {
  total: number
  list: JobItem[]
}

interface JobItem {
  id: string
  title: string
  company: string
  salary: string        // 原始字符串，如 "15-20K"
  city: string
  experience: string    // 如 "3-5年"
  education: string     // 如 "本科"
  url: string           // 职位详情页 URL
  publishedAt: string
}
```

**DOM 抓取降级方案（当接口不可用时）：** content script 导航到搜索结果页，通过 CSS 选择器提取职位卡片信息。降级判断条件：接口请求返回非 200 状态码，或返回数据缺少 `list` 字段。

### 3.6 存储结构（chrome.storage.local）

```ts
{
  resume: string,   // 用户简历文本，空字符串表示未配置
  apiKey: string,   // DeepSeek API Key，空字符串表示未配置
}
```

> searchHistory 不在当前范围内，已移除。

---

## 4. UI 设计

**触发方式：** 右下角固定悬浮按钮（🤖），仅在 hr.bjx.com.cn 域名下显示，注入到 Shadow DOM  
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
- 三块分析内容（流式逐块显示）；若简历未配置，顶部显示提示条
- 底部：继续对话 + 投递简历按钮

---

## 5. 技术选型

| 项目 | 选型 | 理由 |
|------|------|------|
| 扩展规范 | Manifest V3 | 现代标准，Chrome/Edge 均支持 |
| UI 框架 | React + TypeScript | 项目统一技术栈 |
| UI 宿主 | Shadow DOM（content script 注入） | 样式隔离，无需额外 manifest 权限 |
| 打包工具 | Vite + CRXJS | 专为 MV3 扩展优化，支持 HMR |
| AI 模型 | DeepSeek Chat API | 中文理解强，成本低，国内访问稳定 |
| 样式 | CSS Modules（构建时内联） | 防止与目标网站样式冲突 |
| 流式通信 | chrome.runtime.connect() long-lived port | MV3 原生流式消息机制 |

---

## 6. 关键约束与风险

| 风险 | 应对 |
|------|------|
| hr.bjx.com.cn 接口变动 | Content Script 同时实现接口调用和 DOM 抓取两套逻辑，互为降级 |
| DeepSeek API 响应慢 | 使用流式输出，边生成边展示，避免用户等待白屏 |
| 网站 CSP 限制 | 所有外部请求（DeepSeek API）从 background Service Worker 发出，不受页面 CSP 影响 |
| 简历信息安全 | 简历仅存本地 `chrome.storage.local`，随 prompt 发送给 DeepSeek 时用户已知晓 |
| 多标签页消息路由 | content script 初始化时注册 tabId，popup 发消息携带 tabId，background 定向转发 |

---

## 7. 超出当前范围（不做）

- 自动投递简历功能
- 多标签页职位对比
- 收藏/历史记录（本地或云端）
- 支持其他招聘网站
- 搜索历史记录展示
