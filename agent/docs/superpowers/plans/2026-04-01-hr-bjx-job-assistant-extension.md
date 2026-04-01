# 北极星人才网求职助手浏览器扩展 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 Chrome/Edge 浏览器扩展，在 hr.bjx.com.cn 上为求职者提供 AI 驱动的职位推荐与分析助手。

**Architecture:** 纯 Manifest V3 扩展，Content Script 注入 Shadow DOM 悬浮弹窗（React），Background Service Worker 处理 DeepSeek API 调用和消息路由，Options Page 管理简历和 API Key。无后端服务器。

**Tech Stack:** React 18 + TypeScript, Vite + CRXJS, DeepSeek Chat API（SSE 流式）, chrome.runtime.connect() long-lived port, CSS Modules（内联到 Shadow DOM）, Vitest + @testing-library/react

---

## 文件结构

```
agent/extension/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── manifest.json
├── background/
│   └── service-worker.ts       # 消息路由、tabId 管理、DeepSeek 调用
├── content/
│   └── content-script.ts       # Shadow DOM 注入、hr.bjx.com.cn 搜索
├── popup/
│   ├── index.tsx               # React 挂载入口（由 content script 调用）
│   ├── App.tsx                 # 根组件，ChatView ↔ DetailView 切换
│   ├── App.module.css
│   ├── views/
│   │   ├── ChatView.tsx        # 对话 + 职位卡片列表
│   │   ├── ChatView.module.css
│   │   ├── DetailView.tsx      # 职位详情分析（流式渲染）
│   │   └── DetailView.module.css
│   └── components/
│       ├── JobCard.tsx
│       ├── JobCard.module.css
│       ├── AnalysisBlock.tsx   # 单块分析（薪资/公司/简历）
│       ├── AnalysisBlock.module.css
│       ├── ChatInput.tsx
│       └── ChatInput.module.css
├── options/
│   ├── index.html
│   ├── Options.tsx
│   └── Options.module.css
├── types/
│   ├── job.ts
│   ├── analysis.ts
│   └── message.ts
└── tests/
    ├── setup.ts
    ├── background/
    │   ├── deepseek-extract.test.ts
    │   └── message-router.test.ts
    ├── content/
    │   └── job-search.test.ts
    └── components/
        ├── JobCard.test.tsx
        └── AnalysisBlock.test.tsx
```

---

## Task 1: 项目脚手架

**Files:**
- Create: `extension/package.json`
- Create: `extension/vite.config.ts`
- Create: `extension/tsconfig.json`
- Create: `extension/manifest.json`
- Create: `extension/tests/setup.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "bjx-job-assistant",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.0.0-beta.33",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/chrome": "^0.0.268",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "jsdom": "^24.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 2: 创建 manifest.json**

```json
{
  "manifest_version": 3,
  "name": "北极星求职助手",
  "version": "0.1.0",
  "description": "在 hr.bjx.com.cn 上智能推荐职位并分析岗位详情",
  "permissions": [
    "storage",
    "tabs",
    "activeTab"
  ],
  "host_permissions": [
    "https://hr.bjx.com.cn/*"
  ],
  "background": {
    "service_worker": "background/service-worker.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://hr.bjx.com.cn/*"],
      "js": ["content/content-script.ts"],
      "run_at": "document_idle"
    }
  ],
  "options_ui": {
    "page": "options/index.html",
    "open_in_tab": true
  },
  "action": {
    "default_title": "北极星求职助手"
  }
}
```

- [ ] **Step 3: 创建 vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

- [ ] **Step 4: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5: 创建 tests/setup.ts**

```ts
import '@testing-library/jest-dom'

// Mock chrome APIs
globalThis.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  runtime: {
    sendMessage: vi.fn(),
    onMessage: { addListener: vi.fn() },
    connect: vi.fn(),
  },
  tabs: {
    sendMessage: vi.fn(),
    query: vi.fn(),
  },
} as unknown as typeof chrome
```

- [ ] **Step 6: 安装依赖**

```bash
cd extension
npm install
```

Expected: node_modules 创建，无报错

- [ ] **Step 7: 验证构建**

创建 `extension/content/content-script.ts`（空文件占位）：
```ts
export {}
```

创建 `extension/background/service-worker.ts`（空文件占位）：
```ts
export {}
```

创建 `extension/options/index.html`：
```html
<!DOCTYPE html>
<html lang="zh">
<head><meta charset="UTF-8"><title>设置</title></head>
<body><div id="root"></div><script type="module" src="./Options.tsx"></script></body>
</html>
```

创建 `extension/options/Options.tsx`（空占位）：
```tsx
export default function Options() { return <div>设置页</div> }
```

```bash
npm run build
```

Expected: `dist/` 目录生成，包含 `manifest.json`，无 TypeScript 错误

- [ ] **Step 8: 配置 vitest**

在 `vite.config.ts` 中添加 test 配置：

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['node_modules', 'dist'],
  },
})
```

- [ ] **Step 9: Commit**

```bash
git add extension/
git commit -m "feat: scaffold chrome extension project with vite+crxjs"
```

---

## Task 2: TypeScript 类型定义

**Files:**
- Create: `extension/types/job.ts`
- Create: `extension/types/analysis.ts`
- Create: `extension/types/message.ts`

- [ ] **Step 1: 创建 types/job.ts**

```ts
export interface JobItem {
  id: string
  title: string
  company: string
  salary: string       // 原始字符串，如 "15-20K·月"
  city: string
  experience: string   // 如 "3-5年"
  education: string    // 如 "本科"
  url: string          // 职位详情页完整 URL
  publishedAt: string
}

export interface JobSearchParams {
  position: string
  salaryMin?: number   // 单位：K
  salaryMax?: number
  city?: string
}
```

- [ ] **Step 2: 创建 types/analysis.ts**

```ts
export type AnalysisBlockType = 'salary' | 'company' | 'resume'

export interface AnalysisBlock {
  type: AnalysisBlockType
  label: string
  badge?: string       // 如 "合理"、"央企"、"匹配度 78%"
  badgeColor?: 'green' | 'blue' | 'orange' | 'red'
  content: string      // 分析文本（流式追加）
  done: boolean
}

export interface AnalysisResult {
  salary: AnalysisBlock
  company: AnalysisBlock
  resume: AnalysisBlock | null   // null 表示简历未配置
}
```

- [ ] **Step 3: 创建 types/message.ts**

```ts
import type { JobItem, JobSearchParams } from './job'

// content → background
export interface RegisterTabMessage {
  type: 'REGISTER_TAB'
}

// popup → background（用于获取当前 tabId，比 content script 内 chrome.tabs.query 更可靠）
export interface GetTabIdMessage {
  type: 'GET_TAB_ID'
}

// popup → background
export interface SearchMessage {
  type: 'SEARCH'
  query: string
  tabId: number
}

// background → content
export interface FetchJobsMessage {
  type: 'FETCH_JOBS'
  params: JobSearchParams
}

// content → background
export interface JobsResultMessage {
  type: 'JOBS_RESULT'
  jobs: JobItem[]
}

// background → popup (via content relay)
export interface JobsReadyMessage {
  type: 'JOBS_READY'
  jobs: JobItem[]
}

// popup → background (opens long-lived port)
export interface AnalyzeMessage {
  type: 'ANALYZE'
  job: JobItem
  resume: string
  tabId: number
}

// background → popup via port
export interface ChunkMessage {
  type: 'CHUNK'
  block: 'salary' | 'company' | 'resume'
  delta: string
}

export interface AnalyzeDoneMessage {
  type: 'ANALYZE_DONE'
}

export interface ErrorMessage {
  type: 'ERROR'
  code: 'NO_API_KEY' | 'SEARCH_EMPTY' | 'TIMEOUT' | 'API_ERROR' | 'SCRAPE_FAILED'
  message: string
}

export type BackgroundMessage =
  | RegisterTabMessage
  | GetTabIdMessage
  | SearchMessage
  | JobsResultMessage
  | AnalyzeMessage

export type ContentMessage =
  | FetchJobsMessage
  | JobsReadyMessage
  | ErrorMessage

export type PortMessage =
  | ChunkMessage
  | AnalyzeDoneMessage
  | ErrorMessage
```

- [ ] **Step 4: 验证类型无编译错误**

```bash
npx tsc --noEmit
```

Expected: 无错误输出

- [ ] **Step 5: Commit**

```bash
git add extension/types/
git commit -m "feat: add TypeScript type definitions for jobs, analysis, messages"
```

---

## Task 3: Options 设置页

**Files:**
- Modify: `extension/options/Options.tsx`
- Create: `extension/options/Options.module.css`
- Create: `extension/tests/components/Options.test.tsx`

- [ ] **Step 1: 写失败测试**

创建 `extension/tests/components/Options.test.tsx`：

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Options from '../../options/Options'

describe('Options', () => {
  beforeEach(() => {
    vi.mocked(chrome.storage.local.get).mockImplementation((_keys, callback) => {
      callback?.({ apiKey: '', resume: '' })
    })
    vi.mocked(chrome.storage.local.set).mockImplementation((_data, callback) => {
      callback?.()
    })
  })

  it('loads saved values from storage on mount', async () => {
    vi.mocked(chrome.storage.local.get).mockImplementation((_keys, callback) => {
      callback?.({ apiKey: 'sk-test-key', resume: '我是一名工程师' })
    })
    render(<Options />)
    await waitFor(() => {
      expect(screen.getByDisplayValue('sk-test-key')).toBeInTheDocument()
      expect(screen.getByDisplayValue('我是一名工程师')).toBeInTheDocument()
    })
  })

  it('saves apiKey and resume to storage on submit', async () => {
    render(<Options />)
    await waitFor(() => screen.getByPlaceholderText(/API Key/))

    fireEvent.change(screen.getByPlaceholderText(/API Key/), {
      target: { value: 'sk-new-key' },
    })
    fireEvent.change(screen.getByPlaceholderText(/简历/), {
      target: { value: '工作经历：...' },
    })
    fireEvent.click(screen.getByText('保存'))

    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { apiKey: 'sk-new-key', resume: '工作经历：...' },
      expect.any(Function)
    )
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npm test tests/components/Options.test.tsx
```

Expected: FAIL — Options component not implemented

- [ ] **Step 3: 实现 Options.tsx**

```tsx
import { useEffect, useState } from 'react'
import styles from './Options.module.css'

export default function Options() {
  const [apiKey, setApiKey] = useState('')
  const [resume, setResume] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'resume'], (result) => {
      setApiKey(result.apiKey ?? '')
      setResume(result.resume ?? '')
    })
  }, [])

  const handleSave = () => {
    chrome.storage.local.set({ apiKey, resume }, () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>北极星求职助手 — 设置</h1>

      <section className={styles.section}>
        <label className={styles.label}>DeepSeek API Key</label>
        <input
          type="password"
          className={styles.input}
          placeholder="API Key（sk-...）"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className={styles.hint}>
          前往 <a href="https://platform.deepseek.com" target="_blank" rel="noreferrer">platform.deepseek.com</a> 获取
        </p>
      </section>

      <section className={styles.section}>
        <label className={styles.label}>我的简历</label>
        <textarea
          className={styles.textarea}
          placeholder="粘贴你的简历文本（用于匹配分析）"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={12}
        />
      </section>

      <button className={styles.saveBtn} onClick={handleSave}>
        {saved ? '✓ 已保存' : '保存'}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: 创建 Options.module.css**

```css
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.title { font-size: 20px; font-weight: 700; margin-bottom: 32px; color: #1a1a1a; }

.section { margin-bottom: 24px; }

.label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.input, .textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}

.input:focus, .textarea:focus { border-color: #6200ea; }

.hint { font-size: 12px; color: #888; margin-top: 4px; }

.saveBtn {
  background: #6200ea;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.saveBtn:hover { background: #4a00b0; }
```

- [ ] **Step 5: 运行测试，确认通过**

```bash
npm test tests/components/Options.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add extension/options/ extension/tests/components/Options.test.tsx
git commit -m "feat: add options page for API key and resume configuration"
```

---

## Task 4: Content Script — Shadow DOM 注入 + 悬浮按钮

**Files:**
- Modify: `extension/content/content-script.ts`
- Create: `extension/popup/index.tsx`
- Create: `extension/popup/App.tsx`
- Create: `extension/popup/App.module.css`
- Create: `extension/popup/styles.css`  （全局样式，内联到 Shadow DOM）

- [ ] **Step 1: 创建 popup/styles.css**（Shadow DOM 内的全局重置）

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif; }
```

- [ ] **Step 2: 创建 popup/App.tsx 占位**

```tsx
export default function App() {
  return (
    <div style={{ padding: 12, color: '#333', fontSize: 13 }}>
      北极星求职助手 — 占位
    </div>
  )
}
```

- [ ] **Step 3: 创建 popup/index.tsx**（供 content script 调用）

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// 接收 HTMLElement（弹窗容器），不是 ShadowRoot
export function mountApp(container: HTMLElement) {
  createRoot(container).render(<App />)
}
```

- [ ] **Step 4: 实现 content-script.ts**

```ts
import { mountApp } from '../popup/index'
import popupStyles from '../popup/styles.css?inline'

// 防止重复注入
if (!document.getElementById('bjx-assistant-host')) {
  injectAssistant()
}

function injectAssistant() {
  // 创建宿主元素
  const host = document.createElement('div')
  host.id = 'bjx-assistant-host'
  host.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:2147483647;'
  document.body.appendChild(host)

  // 创建 Shadow DOM（样式隔离）
  const shadow = host.attachShadow({ mode: 'closed' })

  // 注入样式到 Shadow DOM
  const style = document.createElement('style')
  style.textContent = popupStyles
  shadow.appendChild(style)

  // 创建悬浮按钮
  const fab = document.createElement('button')
  fab.id = 'bjx-fab'
  fab.textContent = '🤖'
  fab.style.cssText = `
    width: 48px; height: 48px; border-radius: 50%; border: none;
    background: #6200ea; color: #fff; font-size: 22px;
    cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center;
  `
  shadow.appendChild(fab)

  // 弹窗容器（初始隐藏）——React 挂载到此 HTMLElement
  const popupContainer = document.createElement('div')
  popupContainer.id = 'bjx-popup-container'
  popupContainer.style.cssText = `
    position: absolute; bottom: 60px; right: 0;
    width: 300px; display: none;
  `
  shadow.appendChild(popupContainer)

  // 挂载 React 应用到弹窗容器
  mountApp(popupContainer)

  // 点击悬浮按钮切换显示
  let isOpen = false
  fab.addEventListener('click', () => {
    isOpen = !isOpen
    popupContainer.style.display = isOpen ? 'block' : 'none'
  })

  // 注册 tabId 到 background
  chrome.runtime.sendMessage({ type: 'REGISTER_TAB' })
}

- [ ] **Step 5: 构建验证（无 TypeScript 错误）**

```bash
npm run build
```

Expected: 构建成功，`dist/` 中包含 content script bundle

- [ ] **Step 6: 手动测试**

1. 打开 Chrome → 扩展管理页 → 开发者模式 → 加载已解压的扩展 → 选择 `dist/`
2. 访问 https://hr.bjx.com.cn
3. 确认右下角出现 🤖 悬浮按钮
4. 点击按钮，确认弹窗出现/消失

- [ ] **Step 7: Commit**

```bash
git add extension/content/ extension/popup/
git commit -m "feat: inject shadow DOM floating button on hr.bjx.com.cn"
```

---

## Task 5: Background Service Worker — 消息路由 + TabId 管理

**Files:**
- Modify: `extension/background/service-worker.ts`
- Create: `extension/tests/background/message-router.test.ts`

- [ ] **Step 1: 写失败测试**

```ts
// tests/background/message-router.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// 提取纯函数供测试，service-worker 的副作用（addListener）在模块加载时执行
// 所以我们测试消息处理逻辑的核心函数

describe('handleRegisterTab', () => {
  it('stores tabId when REGISTER_TAB received', () => {
    const activeTabs = new Map<number, boolean>()
    function handleRegisterTab(tabId: number) {
      activeTabs.set(tabId, true)
    }

    handleRegisterTab(42)
    expect(activeTabs.has(42)).toBe(true)
  })
})

describe('handleJobsResult', () => {
  it('forwards JOBS_READY to popup via content script relay', () => {
    const sendMessage = vi.fn()
    function handleJobsResult(
      jobs: unknown[],
      tabId: number,
      sendMsg: typeof sendMessage
    ) {
      sendMsg(tabId, { type: 'JOBS_READY', jobs })
    }

    handleJobsResult([{ id: '1', title: '工程师' }], 42, sendMessage)
    expect(sendMessage).toHaveBeenCalledWith(42, {
      type: 'JOBS_READY',
      jobs: [{ id: '1', title: '工程师' }],
    })
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npm test tests/background/message-router.test.ts
```

Expected: FAIL — functions not defined

- [ ] **Step 3: 实现 service-worker.ts**

```ts
import type { BackgroundMessage } from '../types/message'

// tabId 注册表：content script 初始化时注册
const activeTabs = new Map<number, boolean>()

chrome.runtime.onMessage.addListener(
  (message: BackgroundMessage, sender, sendResponse) => {
    switch (message.type) {
      case 'REGISTER_TAB':
        if (sender.tab?.id) {
          activeTabs.set(sender.tab.id, true)
          // 标签关闭时清理
          chrome.tabs.onRemoved.addListener((tabId) => {
            activeTabs.delete(tabId)
          })
        }
        break

      case 'GET_TAB_ID':
        // popup 在 content script 上下文中无法可靠获取 tabId，由 background 返回
        sendResponse({ tabId: sender.tab?.id ?? null })
        break

      case 'SEARCH':
        handleSearch(message.query, message.tabId, sendResponse)
        return true // 保持 sendResponse 通道开放（异步）

      case 'JOBS_RESULT':
        if (sender.tab?.id) {
          // content 拿到搜索结果后，转发给 popup（通过 content 中转）
          chrome.tabs.sendMessage(sender.tab.id, {
            type: 'JOBS_READY',
            jobs: message.jobs,
          })
        }
        break
    }
  }
)

async function handleSearch(
  query: string,
  tabId: number,
  sendResponse: (response?: unknown) => void
) {
  const storage = await chrome.storage.local.get(['apiKey'])
  if (!storage.apiKey) {
    chrome.tabs.sendMessage(tabId, {
      type: 'ERROR',
      code: 'NO_API_KEY',
      message: '你还没有配置 DeepSeek API Key，请前往扩展设置页配置',
    })
    sendResponse()
    return
  }

  // Step 6 中实现 extractSearchParams
  // Step 7 中触发 content script 搜索
  sendResponse()
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
npm test tests/background/message-router.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add extension/background/ extension/tests/background/message-router.test.ts
git commit -m "feat: add background service worker with tabId registration and message routing"
```

---

## Task 6: Background — DeepSeek 意图提取

**Files:**
- Create: `extension/background/deepseek.ts`（DeepSeek 工具函数）
- Create: `extension/tests/background/deepseek-extract.test.ts`

- [ ] **Step 1: 写失败测试**

```ts
// tests/background/deepseek-extract.test.ts
import { describe, it, expect, vi } from 'vitest'
import { parseSearchParams } from '../../background/deepseek'

// Mock global fetch
globalThis.fetch = vi.fn()

describe('parseSearchParams', () => {
  it('extracts position, salary, city from natural language', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              position: '光伏工程师',
              salaryMin: 15,
              salaryMax: null,
              city: '北京',
            }),
          },
        }],
      }),
    } as Response)

    const result = await parseSearchParams('帮我找光伏工程师，15k以上，北京', 'sk-test')
    expect(result.position).toBe('光伏工程师')
    expect(result.salaryMin).toBe(15)
    expect(result.city).toBe('北京')
  })

  it('returns position only when no salary/city specified', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({ position: '电气工程师', salaryMin: null, salaryMax: null, city: null }),
          },
        }],
      }),
    } as Response)

    const result = await parseSearchParams('找电气工程师', 'sk-test')
    expect(result.position).toBe('电气工程师')
    expect(result.salaryMin).toBeNull()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npm test tests/background/deepseek-extract.test.ts
```

Expected: FAIL — parseSearchParams not defined

- [ ] **Step 3: 实现 background/deepseek.ts**

```ts
import type { JobSearchParams } from '../types/job'
import type { JobItem } from '../types/job'

const DEEPSEEK_API = 'https://api.deepseek.com/chat/completions'

/** 从自然语言中提取结构化搜索参数 */
export async function parseSearchParams(
  query: string,
  apiKey: string
): Promise<JobSearchParams> {
  const response = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是求职助手，从用户输入中提取搜索参数，返回 JSON，字段：
{ "position": string, "salaryMin": number|null, "salaryMax": number|null, "city": string|null }
薪资单位为 K（千元），只返回 JSON，不要其他文字。`,
        },
        { role: 'user', content: query },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`)
  }

  const data = await response.json()
  const parsed = JSON.parse(data.choices[0].message.content)
  return {
    position: parsed.position ?? query,
    salaryMin: parsed.salaryMin ?? undefined,
    salaryMax: parsed.salaryMax ?? undefined,
    city: parsed.city ?? undefined,
  }
}

/** 流式调用 DeepSeek 进行职位分析（使用 SSE） */
export async function streamJobAnalysis(
  job: JobItem,
  resume: string,
  apiKey: string,
  onChunk: (block: 'salary' | 'company' | 'resume', delta: string) => void,
  onDone: () => void,
  onError: (msg: string) => void
) {
  const hasResume = resume.trim().length > 0

  const prompt = `分析以下职位，分三个部分回答，每部分用 [SALARY]、[COMPANY]、[RESUME] 标签开头：

职位信息：
- 职位名称：${job.title}
- 公司：${job.company}
- 薪资：${job.salary}
- 城市：${job.city}
- 经验要求：${job.experience}

${hasResume ? `求职者简历摘要：\n${resume.slice(0, 1000)}` : '（求职者未提供简历，跳过简历匹配部分）'}

请依次提供：
[SALARY] 薪资分析：该岗位薪资与市场行情对比，判断是否合理（2-3句）
[COMPANY] 公司背景：公司性质、规模、行业地位、稳定性评价（2-3句）
${hasResume ? '[RESUME] 简历匹配：匹配度百分比及具体优劣势（3-4句）' : ''}
`

  const response = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  })

  if (!response.ok || !response.body) {
    onError(`DeepSeek API 错误：${response.status}`)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let currentBlock: 'salary' | 'company' | 'resume' = 'salary'

  while (true) {
    const { done, value } = await reader.read()
    if (done) { onDone(); break }

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') { onDone(); return }

      try {
        const parsed = JSON.parse(data)
        const delta = parsed.choices?.[0]?.delta?.content ?? ''
        if (!delta) continue

        // 检测块标签
        if (delta.includes('[SALARY]')) { currentBlock = 'salary'; continue }
        if (delta.includes('[COMPANY]')) { currentBlock = 'company'; continue }
        if (delta.includes('[RESUME]')) { currentBlock = 'resume'; continue }

        onChunk(currentBlock, delta)
      } catch {
        // 忽略解析错误的行
      }
    }
  }
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
npm test tests/background/deepseek-extract.test.ts
```

Expected: PASS

- [ ] **Step 5: 在 service-worker.ts 中接入 parseSearchParams**

用以下完整版本替换 `service-worker.ts` 中的 `handleSearch` 函数（同时在文件顶部补充 import）：

```ts
// 在 service-worker.ts 顶部添加导入
import { parseSearchParams } from './deepseek'

// 替换 handleSearch 为完整实现
async function handleSearch(
  query: string,
  tabId: number,
  sendResponse: (response?: unknown) => void
) {
  const storage = await chrome.storage.local.get(['apiKey'])
  if (!storage.apiKey) {
    chrome.tabs.sendMessage(tabId, {
      type: 'ERROR',
      code: 'NO_API_KEY',
      message: '你还没有配置 DeepSeek API Key，请前往扩展设置页配置',
    })
    sendResponse()
    return
  }

  try {
    const params = await parseSearchParams(query, storage.apiKey)
    chrome.tabs.sendMessage(tabId, { type: 'FETCH_JOBS', params })
  } catch {
    chrome.tabs.sendMessage(tabId, {
      type: 'ERROR',
      code: 'API_ERROR',
      message: 'AI 解析失败，请检查 API Key 是否正确',
    })
  }
  sendResponse()
}
```

- [ ] **Step 6: Commit**

```bash
git add extension/background/deepseek.ts extension/tests/background/deepseek-extract.test.ts extension/background/service-worker.ts
git commit -m "feat: add DeepSeek intent extraction and streaming analysis"
```

---

## Task 7: Content Script — 职位搜索（API + DOM 降级）

**Files:**
- Create: `extension/content/job-search.ts`
- Modify: `extension/content/content-script.ts`
- Create: `extension/tests/content/job-search.test.ts`

> **⚠️ 实现前必须先执行以下调研步骤**

- [ ] **Step 1: 调研 hr.bjx.com.cn 搜索接口**

1. 打开 https://hr.bjx.com.cn，按 F12 打开 DevTools → Network → XHR/Fetch
2. 在网站搜索框输入"光伏工程师"并提交
3. 观察 Network 面板中的请求，找到返回职位列表的接口
4. 记录：
   - 接口 URL
   - Query 参数名称
   - 响应 JSON 结构（关键字段：职位名、公司、薪资、城市、URL）
5. 将实际接口信息更新到 `types/job.ts` 的 `JobSearchResponse` 接口

- [ ] **Step 2: 写失败测试（基于调研结果调整字段名）**

```ts
// tests/content/job-search.test.ts
import { describe, it, expect, vi } from 'vitest'
import { searchJobs } from '../../content/job-search'

globalThis.fetch = vi.fn()

describe('searchJobs', () => {
  it('calls the search API with correct params', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        // 根据实际调研结果调整此处结构
        data: {
          list: [
            {
              id: '123',
              positionName: '光伏工程师',
              companyName: '华能集团',
              salary: '15-20K',
              workCity: '北京',
              workYear: '3-5年',
              education: '本科',
              positionUrl: 'https://hr.bjx.com.cn/job/123',
              releaseTime: '2026-04-01',
            },
          ],
        },
      }),
    } as Response)

    const jobs = await searchJobs({ position: '光伏工程师', city: '北京' })
    expect(jobs).toHaveLength(1)
    expect(jobs[0].title).toBe('光伏工程师')
    expect(jobs[0].company).toBe('华能集团')
    expect(jobs[0].salary).toBe('15-20K')
  })

  it('returns empty array when API returns no results', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { list: [] } }),
    } as Response)

    const jobs = await searchJobs({ position: '不存在的职位' })
    expect(jobs).toEqual([])
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

```bash
npm test tests/content/job-search.test.ts
```

Expected: FAIL — searchJobs not defined

- [ ] **Step 4: 实现 content/job-search.ts**

```ts
import type { JobItem, JobSearchParams } from '../types/job'

// ⚠️ 根据实际调研结果替换以下 URL 和字段名
const SEARCH_API = 'https://hr.bjx.com.cn/api/position/search'  // 待确认

export async function searchJobs(params: JobSearchParams): Promise<JobItem[]> {
  try {
    return await searchViaApi(params)
  } catch {
    // API 失败时降级到 DOM 抓取
    return await searchViaDom(params)
  }
}

async function searchViaApi(params: JobSearchParams): Promise<JobItem[]> {
  const query = new URLSearchParams({
    keyword: params.position,
    ...(params.city && { city: params.city }),
    ...(params.salaryMin && { salaryMin: String(params.salaryMin) }),
    ...(params.salaryMax && { salaryMax: String(params.salaryMax) }),
    pageSize: '10',
    pageNum: '1',
  })

  const response = await fetch(`${SEARCH_API}?${query}`, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  })

  if (!response.ok) throw new Error(`API ${response.status}`)

  const data = await response.json()

  // ⚠️ 根据实际响应结构调整以下字段名
  const list = data?.data?.list ?? []
  if (!Array.isArray(list)) throw new Error('Unexpected response structure')

  return list.map((item: Record<string, string>) => ({
    id: item.id ?? item.positionId ?? String(Math.random()),
    title: item.positionName ?? item.title ?? '',
    company: item.companyName ?? item.company ?? '',
    salary: item.salary ?? item.salaryRange ?? '',
    city: item.workCity ?? item.city ?? '',
    experience: item.workYear ?? item.experience ?? '',
    education: item.education ?? '',
    url: item.positionUrl ?? item.url ?? '',
    publishedAt: item.releaseTime ?? item.publishTime ?? '',
  }))
}

async function searchViaDom(params: JobSearchParams): Promise<JobItem[]> {
  // 降级：通过 iframe 或直接请求搜索页 HTML，解析职位卡片
  // ⚠️ 根据调研时的页面结构调整选择器
  const searchUrl = `https://hr.bjx.com.cn/jobs/search?keyword=${encodeURIComponent(params.position)}`

  try {
    const html = await fetch(searchUrl).then((r) => r.text())
    const doc = new DOMParser().parseFromString(html, 'text/html')

    // ⚠️ 选择器需根据实际页面调整
    const cards = Array.from(doc.querySelectorAll('.job-item, .position-item'))
    return cards.slice(0, 10).map((card, i) => ({
      id: String(i),
      title: card.querySelector('.job-title, .position-name')?.textContent?.trim() ?? '',
      company: card.querySelector('.company-name')?.textContent?.trim() ?? '',
      salary: card.querySelector('.salary')?.textContent?.trim() ?? '',
      city: card.querySelector('.city, .work-city')?.textContent?.trim() ?? '',
      experience: card.querySelector('.experience')?.textContent?.trim() ?? '',
      education: card.querySelector('.education')?.textContent?.trim() ?? '',
      url: (card.querySelector('a') as HTMLAnchorElement)?.href ?? searchUrl,
      publishedAt: '',
    })).filter((job) => job.title)
  } catch {
    return []
  }
}
```

- [ ] **Step 5: content-script.ts 中处理 FETCH_JOBS 消息**

在 `content-script.ts` 中添加消息监听（在 `injectAssistant()` 之前）：

```ts
import { searchJobs } from './job-search'
import type { ContentMessage } from '../types/message'

chrome.runtime.onMessage.addListener((message: ContentMessage) => {
  if (message.type === 'FETCH_JOBS') {
    searchJobs(message.params).then((jobs) => {
      chrome.runtime.sendMessage({ type: 'JOBS_RESULT', jobs })
    }).catch(() => {
      chrome.runtime.sendMessage({
        type: 'ERROR',
        code: 'SCRAPE_FAILED',
        message: '无法获取职位数据，请刷新页面后重试',
      })
    })
  }
  // JOBS_READY 和 ERROR 由 popup 通过 window.postMessage 接收（见 Task 9）
})
```

- [ ] **Step 6: 运行测试，确认通过**

```bash
npm test tests/content/job-search.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add extension/content/ extension/tests/content/
git commit -m "feat: add job search via hr.bjx.com.cn API with DOM scraping fallback"
```

---

## Task 8: Background — DeepSeek 流式分析 + Long-lived Port

**Files:**
- Modify: `extension/background/service-worker.ts`

- [ ] **Step 1: 在 service-worker.ts 中添加 port 连接处理**

在 service-worker.ts 末尾追加：

```ts
import { streamJobAnalysis } from './deepseek'

// Long-lived port 用于流式分析
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'analyze') return

  port.onMessage.addListener(async (message) => {
    if (message.type !== 'ANALYZE') return

    const storage = await chrome.storage.local.get(['apiKey', 'resume'])
    if (!storage.apiKey) {
      port.postMessage({
        type: 'ERROR',
        code: 'NO_API_KEY',
        message: '请先配置 DeepSeek API Key',
      })
      return
    }

    await streamJobAnalysis(
      message.job,
      storage.resume ?? '',
      storage.apiKey,
      (block, delta) => port.postMessage({ type: 'CHUNK', block, delta }),
      () => port.postMessage({ type: 'ANALYZE_DONE' }),
      (msg) => port.postMessage({ type: 'ERROR', code: 'API_ERROR', message: msg })
    )
  })
})
```

- [ ] **Step 2: 构建确认**

```bash
npm run build
```

Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add extension/background/service-worker.ts
git commit -m "feat: add long-lived port for streaming job analysis"
```

---

## Task 9: Popup — ChatView（对话 + 职位列表）

**Files:**
- Modify: `extension/popup/App.tsx`
- Create: `extension/popup/views/ChatView.tsx`
- Create: `extension/popup/views/ChatView.module.css`
- Create: `extension/popup/components/JobCard.tsx`
- Create: `extension/popup/components/JobCard.module.css`
- Create: `extension/popup/components/ChatInput.tsx`
- Create: `extension/popup/components/ChatInput.module.css`
- Create: `extension/tests/components/JobCard.test.tsx`

- [ ] **Step 1: 写 JobCard 失败测试**

```tsx
// tests/components/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import JobCard from '../../popup/components/JobCard'

const mockJob = {
  id: '1', title: '光伏工程师', company: '华能集团',
  salary: '15-20K', city: '北京', experience: '3-5年',
  education: '本科', url: 'https://hr.bjx.com.cn/job/1', publishedAt: '2026-04-01',
}

describe('JobCard', () => {
  it('renders job title, company, salary and city', () => {
    render(<JobCard job={mockJob} onSelect={() => {}} />)
    expect(screen.getByText('光伏工程师')).toBeInTheDocument()
    expect(screen.getByText('华能集团')).toBeInTheDocument()
    expect(screen.getByText('15-20K')).toBeInTheDocument()
    expect(screen.getByText('北京')).toBeInTheDocument()
  })

  it('calls onSelect with job when clicked', () => {
    const onSelect = vi.fn()
    render(<JobCard job={mockJob} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('光伏工程师'))
    expect(onSelect).toHaveBeenCalledWith(mockJob)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npm test tests/components/JobCard.test.tsx
```

Expected: FAIL

- [ ] **Step 3: 实现 components/JobCard.tsx**

```tsx
import type { JobItem } from '../../types/job'
import styles from './JobCard.module.css'

interface Props {
  job: JobItem
  onSelect: (job: JobItem) => void
}

export default function JobCard({ job, onSelect }: Props) {
  return (
    <div className={styles.card} onClick={() => onSelect(job)}>
      <div className={styles.title}>{job.title}</div>
      <div className={styles.salary}>{job.salary}</div>
      <div className={styles.meta}>{job.company} · {job.city}</div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 JobCard.module.css**

```css
.card {
  background: #fff;
  border: 1px solid #e8e0f0;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: border-color .15s;
}
.card:hover { border-color: #6200ea; }
.title { font-size: 13px; font-weight: 600; color: #6200ea; margin-bottom: 2px; }
.salary { font-size: 12px; color: #e53935; font-weight: 500; }
.meta { font-size: 11px; color: #888; margin-top: 2px; }
```

- [ ] **Step 5: 实现 components/ChatInput.tsx**

```tsx
import { useState } from 'react'
import styles from './ChatInput.module.css'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="描述你想找的职位..."
        disabled={disabled}
      />
      <button className={styles.btn} onClick={handleSend} disabled={disabled || !value.trim()}>
        ↑
      </button>
    </div>
  )
}
```

- [ ] **Step 6: 实现 views/ChatView.tsx**

```tsx
import { useEffect, useState } from 'react'
import ChatInput from '../components/ChatInput'
import JobCard from '../components/JobCard'
import type { JobItem } from '../../types/job'
import type { ContentMessage } from '../../types/message'
import styles from './ChatView.module.css'

interface ChatMessage {
  role: 'user' | 'assistant'
  text?: string
  jobs?: JobItem[]
  isError?: boolean
}

interface Props {
  onSelectJob: (job: JobItem) => void
}

export default function ChatView({ onSelectJob }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: '👋 你好！告诉我你想找什么职位？例如："帮我找光伏工程师，15k 以上，北京"' },
  ])
  const [loading, setLoading] = useState(false)
  const [tabId, setTabId] = useState<number | null>(null)

  useEffect(() => {
    // 从 background 获取当前 tabId（比在 content script 中直接 query 更可靠）
    // background 在 REGISTER_TAB 时已记录 tabId，这里通过发消息取回
    chrome.runtime.sendMessage({ type: 'GET_TAB_ID' }, (response) => {
      if (response?.tabId) setTabId(response.tabId)
    })

    // 监听来自 background/content 的消息
    const listener = (message: ContentMessage) => {
      if (message.type === 'JOBS_READY') {
        setLoading(false)
        if (message.jobs.length === 0) {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            text: '没有找到符合条件的职位，你可以尝试放宽薪资范围或更换城市',
          }])
        } else {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            text: `为你找到 ${message.jobs.length} 个职位 👇`,
            jobs: message.jobs,
          }])
        }
      }
      if (message.type === 'ERROR') {
        setLoading(false)
        setMessages((prev) => [...prev, {
          role: 'assistant',
          text: message.message,
          isError: true,
        }])
      }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  const handleSend = (query: string) => {
    if (!tabId) return
    setMessages((prev) => [...prev, { role: 'user', text: query }])
    setLoading(true)
    chrome.runtime.sendMessage({ type: 'SEARCH', query, tabId })
  }

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            {msg.text && (
              <div className={msg.isError ? styles.errorBubble : styles.bubble}>
                {msg.text}
              </div>
            )}
            {msg.jobs?.map((job) => (
              <JobCard key={job.id} job={job} onSelect={onSelectJob} />
            ))}
          </div>
        ))}
        {loading && (
          <div className={styles.assistantMsg}>
            <div className={styles.bubble}>搜索中...</div>
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
```

- [ ] **Step 7: 创建 ChatView.module.css**

```css
.container { display: flex; flex-direction: column; height: 100%; }
.messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.userMsg { display: flex; justify-content: flex-end; }
.assistantMsg { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.bubble {
  background: #f3e5f5; border-radius: 12px 12px 12px 0;
  padding: 8px 12px; font-size: 12px; color: #333; max-width: 240px; line-height: 1.5;
}
.userMsg .bubble { background: #6200ea; color: #fff; border-radius: 12px 12px 0 12px; }
.errorBubble {
  background: #fff3f3; border: 1px solid #ffcdd2; color: #c62828;
  border-radius: 8px; padding: 8px 12px; font-size: 12px; max-width: 240px;
}
```

- [ ] **Step 8: 运行 JobCard 测试**

```bash
npm test tests/components/JobCard.test.tsx
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add extension/popup/views/ChatView* extension/popup/components/ extension/tests/components/JobCard.test.tsx
git commit -m "feat: implement ChatView with job search conversation flow"
```

---

## Task 10: Popup — DetailView（流式分析视图）

**Files:**
- Create: `extension/popup/views/DetailView.tsx`
- Create: `extension/popup/views/DetailView.module.css`
- Create: `extension/popup/components/AnalysisBlock.tsx`
- Create: `extension/popup/components/AnalysisBlock.module.css`
- Create: `extension/tests/components/AnalysisBlock.test.tsx`

- [ ] **Step 1: 写 AnalysisBlock 失败测试**

```tsx
// tests/components/AnalysisBlock.test.tsx
import { render, screen } from '@testing-library/react'
import AnalysisBlock from '../../popup/components/AnalysisBlock'

describe('AnalysisBlock', () => {
  it('renders label and content', () => {
    render(
      <AnalysisBlock
        icon="💰" label="薪资分析" badge="合理" badgeColor="green"
        content="该岗位薪资处于中上水平" done={true}
      />
    )
    expect(screen.getByText('薪资分析')).toBeInTheDocument()
    expect(screen.getByText('合理')).toBeInTheDocument()
    expect(screen.getByText('该岗位薪资处于中上水平')).toBeInTheDocument()
  })

  it('shows loading indicator when not done', () => {
    render(
      <AnalysisBlock icon="💰" label="薪资分析" content="" done={false} />
    )
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npm test tests/components/AnalysisBlock.test.tsx
```

Expected: FAIL

- [ ] **Step 3: 实现 components/AnalysisBlock.tsx**

```tsx
import styles from './AnalysisBlock.module.css'

interface Props {
  icon: string
  label: string
  badge?: string
  badgeColor?: 'green' | 'blue' | 'orange'
  content: string
  done: boolean
}

export default function AnalysisBlock({ icon, label, badge, badgeColor, content, done }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span>{icon}</span>
        <span className={styles.label}>{label}</span>
        {badge && (
          <span className={`${styles.badge} ${styles[badgeColor ?? 'green']}`}>
            {badge}
          </span>
        )}
        {!done && <span data-testid="loading-indicator" className={styles.loading}>···</span>}
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 AnalysisBlock.module.css**

```css
.block { margin-bottom: 14px; }
.header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.label { font-size: 12px; font-weight: 600; color: #333; }
.badge {
  margin-left: auto; border-radius: 10px; padding: 1px 8px; font-size: 10px; font-weight: 500;
}
.green { background: #e8f5e9; color: #388e3c; }
.blue { background: #e3f2fd; color: #1565c0; }
.orange { background: #fff3e0; color: #e65100; }
.loading { margin-left: auto; color: #aaa; font-size: 14px; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.content {
  background: #f9f9f9; border-radius: 8px; padding: 8px 10px;
  font-size: 11px; color: #555; line-height: 1.7; white-space: pre-wrap;
}
```

- [ ] **Step 5: 实现 views/DetailView.tsx**

```tsx
import { useEffect, useRef, useState } from 'react'
import AnalysisBlock from '../components/AnalysisBlock'
import type { JobItem } from '../../types/job'
import type { PortMessage } from '../../types/message'
import styles from './DetailView.module.css'

interface Props {
  job: JobItem
  resume: string
  onBack: () => void
}

interface BlockState {
  content: string
  done: boolean
}

export default function DetailView({ job, resume, onBack }: Props) {
  const [salary, setSalary] = useState<BlockState>({ content: '', done: false })
  const [company, setCompany] = useState<BlockState>({ content: '', done: false })
  const [resumeBlock, setResumeBlock] = useState<BlockState>({ content: '', done: false })
  const [error, setError] = useState<string | null>(null)
  const portRef = useRef<chrome.runtime.Port | null>(null)
  const hasResume = resume.trim().length > 0

  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'analyze' })
    portRef.current = port

    port.postMessage({ type: 'ANALYZE', job, resume })

    port.onMessage.addListener((message: PortMessage) => {
      if (message.type === 'CHUNK') {
        const setter = message.block === 'salary' ? setSalary
          : message.block === 'company' ? setCompany
          : setResumeBlock
        setter((prev) => ({ ...prev, content: prev.content + message.delta }))
      }
      if (message.type === 'ANALYZE_DONE') {
        setSalary((p) => ({ ...p, done: true }))
        setCompany((p) => ({ ...p, done: true }))
        setResumeBlock((p) => ({ ...p, done: true }))
      }
      if (message.type === 'ERROR') {
        setError(message.message)
        setSalary((p) => ({ ...p, done: true }))
        setCompany((p) => ({ ...p, done: true }))
        setResumeBlock((p) => ({ ...p, done: true }))
      }
    })

    return () => port.disconnect()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← 返回</button>
        <span className={styles.title}>职位分析</span>
      </div>

      <div className={styles.jobInfo}>
        <div className={styles.jobTitle}>{job.title}</div>
        <div className={styles.jobMeta}>
          <span className={styles.salary}>{job.salary}</span>
          <span> · {job.company} · {job.city}</span>
        </div>
        <a className={styles.link} href={job.url} target="_blank" rel="noreferrer">
          查看原始岗位 →
        </a>
      </div>

      {!hasResume && (
        <div className={styles.resumeBanner}>
          📋 <a href="#" onClick={(e) => { e.preventDefault(); chrome.runtime.openOptionsPage() }}>
            请先在设置页粘贴你的简历以启用匹配功能
          </a>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.analysis}>
        <AnalysisBlock icon="💰" label="薪资分析" content={salary.content} done={salary.done} />
        <AnalysisBlock icon="🏢" label="公司背景" content={company.content} done={company.done} />
        {hasResume && (
          <AnalysisBlock
            icon="📋" label="简历匹配"
            content={resumeBlock.content} done={resumeBlock.done}
          />
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.secondaryBtn} onClick={onBack}>继续对话</button>
        <a className={styles.primaryBtn} href={job.url} target="_blank" rel="noreferrer">
          投递简历
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 创建 DetailView.module.css**

```css
.container { display: flex; flex-direction: column; height: 100%; }
.header {
  background: #6200ea; color: #fff; padding: 10px 14px;
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.backBtn { background: none; border: none; color: #fff; cursor: pointer; font-size: 14px; padding: 0; }
.title { font-size: 13px; font-weight: 600; }
.jobInfo { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; background: #fafafa; flex-shrink: 0; }
.jobTitle { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
.jobMeta { font-size: 12px; color: #555; }
.salary { color: #e53935; font-weight: 600; }
.link { font-size: 11px; color: #6200ea; text-decoration: none; display: block; margin-top: 4px; }
.resumeBanner {
  background: #fff8e1; padding: 8px 14px; font-size: 11px; color: #f57f17; flex-shrink: 0;
}
.resumeBanner a { color: #f57f17; }
.error {
  background: #fff3f3; border-left: 3px solid #ef5350;
  padding: 8px 14px; font-size: 11px; color: #c62828; flex-shrink: 0;
}
.analysis { flex: 1; overflow-y: auto; padding: 12px 14px; }
.actions {
  padding: 10px 14px; border-top: 1px solid #f0f0f0;
  display: flex; gap: 8px; flex-shrink: 0;
}
.secondaryBtn {
  flex: 1; background: #f3e5f5; color: #6200ea; border: none;
  border-radius: 8px; padding: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.primaryBtn {
  flex: 1; background: #6200ea; color: #fff; border-radius: 8px;
  padding: 8px; font-size: 12px; font-weight: 600; text-align: center;
  text-decoration: none; display: flex; align-items: center; justify-content: center;
}
```

- [ ] **Step 7: 运行 AnalysisBlock 测试**

```bash
npm test tests/components/AnalysisBlock.test.tsx
```

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add extension/popup/views/DetailView* extension/popup/components/AnalysisBlock* extension/tests/components/AnalysisBlock.test.tsx
git commit -m "feat: implement DetailView with streaming analysis blocks"
```

---

## Task 11: Popup — App 根组件（视图切换）

**Files:**
- Modify: `extension/popup/App.tsx`
- Create: `extension/popup/App.module.css`

- [ ] **Step 1: 实现 App.tsx**

```tsx
import { useEffect, useState } from 'react'
import ChatView from './views/ChatView'
import DetailView from './views/DetailView'
import type { JobItem } from '../types/job'
import styles from './App.module.css'

export default function App() {
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null)
  const [resume, setResume] = useState('')

  useEffect(() => {
    chrome.storage.local.get(['resume'], (result) => {
      setResume(result.resume ?? '')
    })
  }, [])

  return (
    <div className={styles.app}>
      <div className={styles.titlebar}>
        <span>🤖 求职小助手</span>
        <button
          className={styles.settingsBtn}
          onClick={() => chrome.runtime.openOptionsPage()}
          title="设置"
        >
          ⚙
        </button>
      </div>

      <div className={styles.body}>
        {selectedJob ? (
          <DetailView
            job={selectedJob}
            resume={resume}
            onBack={() => setSelectedJob(null)}
          />
        ) : (
          <ChatView onSelectJob={setSelectedJob} />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 App.module.css**

```css
.app {
  width: 300px;
  max-height: 520px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

.titlebar {
  background: #6200ea;
  color: #fff;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.settingsBtn {
  background: none; border: none; color: rgba(255,255,255,.8);
  cursor: pointer; font-size: 16px; padding: 0; line-height: 1;
}

.body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
```

- [ ] **Step 3: 构建并手动测试完整流程**

```bash
npm run build
```

在 Chrome 中重新加载扩展，访问 hr.bjx.com.cn，测试：
1. 点击 🤖 按钮，弹窗出现
2. 在聊天框输入"帮我找光伏工程师，北京"，按回车
3. 确认出现职位卡片列表
4. 点击某个职位，确认切换到分析视图，三块分析内容流式显示
5. 点击"返回"，回到聊天视图

- [ ] **Step 4: Commit**

```bash
git add extension/popup/App.tsx extension/popup/App.module.css
git commit -m "feat: wire up App root with ChatView/DetailView switching"
```

---

## Task 12: 运行全量测试 + 最终构建验证

- [ ] **Step 1: 运行全量测试**

```bash
npm test
```

Expected: 所有测试 PASS，无失败

- [ ] **Step 2: 最终生产构建**

```bash
npm run build
```

Expected: `dist/` 生成，无错误

- [ ] **Step 3: 手动验收测试清单**

在 Chrome 中加载 `dist/` 扩展，逐项验证：

- [ ] hr.bjx.com.cn 主页右下角出现 🤖 悬浮按钮
- [ ] 点击按钮弹出对话框，再次点击关闭
- [ ] 未配置 API Key 时，发送消息后显示"请前往设置页配置"提示
- [ ] 设置页可保存 API Key 和简历文本
- [ ] 配置 API Key 后，输入职位需求可返回职位列表
- [ ] 点击职位卡片进入分析视图，三块内容逐步流式显示
- [ ] 未配置简历时，分析视图顶部显示配置简历提示条
- [ ] 点击"投递简历"跳转到网站原始职位页
- [ ] 点击"继续对话"返回聊天视图
- [ ] 点击 ⚙ 跳转到设置页

- [ ] **Step 4: 最终 Commit**

```bash
git add -A
git commit -m "feat: complete hr.bjx.com.cn job assistant browser extension v0.1.0"
```
