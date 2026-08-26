# 部署指南 / Deployment Guide

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

这份文档的目标很简单：

- 帮你尽快把模板部署上线
- 告诉你应该在哪个平台做什么
- 告诉你部署后应该检查哪些页面

如果你只想走最省事的路线，优先使用 **Vercel**。

## 1. 部署前先确认这几件事

### 仓库已经在 GitHub

如果你还没创建自己的仓库，先看：

- [GitHub 使用方式与模板流程](./GITHUB-TEMPLATE.md)

### 这几个文件已经改过

至少先检查：

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../.env.example](../.env.example)

### 联系页邮箱已经准备好

部署时要填写：

- `NEXT_PUBLIC_CONTACT_EMAIL_B64`

如果你还没有准备好编码值，可以本地执行：

```bash
echo -n "hi@example.com" | base64
```

## 2. 推荐方案：部署到 Vercel

官方文档：

- [Vercel: Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel: Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

### 最短步骤

1. 打开 [Vercel](https://vercel.com/)
2. 登录并连接 GitHub
3. 点击 `Add New Project`
4. 选择你的仓库
5. Framework 保持 `Next.js`
6. 填写环境变量
7. 点击 `Deploy`

### 需要填写的环境变量

参考文件：

- [../.env.example](../.env.example)

最常见的是：

| 变量名 | 是否必填 | 作用 |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL_B64` | 必填 | 联系页邮箱 |
| `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT` | 选填 | 邮件标题 |
| `NEXT_PUBLIC_REPOSITORY_URL` | 选填 | 页脚仓库链接 |

### Vercel 上通常不需要你额外处理的事情

- 不需要自己写 `vercel.json`
- 一般会自动识别 `Next.js`
- 可以直接使用仓库里的 `package.json`

### Node 版本建议

这个模板当前使用：

- Node `22.x`

相关文件：

- [../package.json](../package.json)
- [../.nvmrc](../.nvmrc)

如果你要在 Vercel 控制台手动指定 Node 版本，也建议选 `22.x`。

## 3. 可选方案：部署到 EdgeOne Pages

如果你明确要使用 EdgeOne Pages，也可以部署。

官方文档：

- [EdgeOne Pages: Next.js framework guide](https://pages.edgeone.ai/document/framework-nextjs)
- [EdgeOne Pages: edgeone.json configuration](https://pages.edgeone.ai/document/edgeone-json)

### 这个模板在 EdgeOne 上的部署方式

这个模板当前为 EdgeOne 准备的是 **静态导出模式**，相关文件是：

- [../next.config.mjs](../next.config.mjs)
- [../edgeone.json](../edgeone.json)
- [../app/(redirects)](../app/%28redirects%29)

核心点：

- 构建命令：`EDGEONE=1 npm run build`
- 输出目录：`out`
- `/en` 会兼容到 `/en/`
- `/zh` 会兼容到 `/zh/`

### EdgeOne 建议配置

查看：

- [../edgeone.json](../edgeone.json)

你会看到这些关键项：

- `installCommand`
- `buildCommand`
- `outputDirectory`
- `nodeVersion`
- `redirects`

当前模板使用的 Node 版本是：

- `22.11.0`

## 4. 默认语言策略会影响部署后的首屏行为

文件：

- [../content/site.json](../content/site.json)

默认值：

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": ""
  }
}
```

务必记住：

- `primaryLocale: "en"`：首次访问固定英文
- `primaryLocale: "zh"`：首次访问固定中文
- `primaryLocale: ""`：只有留空时才按浏览器语言自动识别

优先级：

1. `locale` cookie
2. 浏览器语言
3. 英文回退

完整说明：

- [内容维护指南](./CONTENT-MANAGEMENT.md)

## 5. 部署后应检查哪些地址

建议至少检查：

- `/`
- `/en`
- `/en/`
- `/zh`
- `/zh/`
- `/en/research`
- `/zh/research`
- `/en/projects`
- `/zh/projects`
- `/en/publications`
- `/zh/publications`
- `/en/contact`
- `/zh/contact`
- `/en/cv`
- `/zh/cv`

如果你使用单语模式，也要检查：

- 另一种语言是否不再生成
- 顶部语言切换按钮是否消失

## 6. 部署后要确认哪些功能

### 语言是否符合预期

- 首次访问语言是否正确
- 手动切换语言后是否能记住用户选择

### 主题是否正常

- 浅色 / 深色是否会跟随系统设置
- 用户手动切换后是否能记住

### 联系页是否正常

- 邮箱能否显示
- 复制按钮是否可用
- 打开邮件客户端是否正常

### 资源是否正常

- 头像是否显示
- CV 是否能下载
- 外部链接是否正确

## 7. Vercel 与 EdgeOne 对应的关键文件

如果你之后要排查部署行为，可以优先看这些文件：

- [../package.json](../package.json)
- [../next.config.mjs](../next.config.mjs)
- [../proxy.ts](../proxy.ts)
- [../edgeone.json](../edgeone.json)
- [../content/site.json](../content/site.json)
- [../app/(redirects)](../app/%28redirects%29)

它们分别控制：

- 脚本与 Node 版本
- 是否导出静态站点
- 请求进入时的语言跳转
- EdgeOne 构建与重定向
- 默认语言策略
- 静态部署时的语言入口跳转

## 8. 常见问题

### 问题：部署成功了，但打开后语言不是我想要的

先检查：

- [../content/site.json](../content/site.json)

重点看：

- `mode`
- `primaryLocale`

### 问题：EdgeOne 上 `/en` 和 `/en/` 表现不同

先检查：

- [../edgeone.json](../edgeone.json)
- [../next.config.mjs](../next.config.mjs)

### 问题：我改了环境变量，页面却没变

处理：

- 在平台上重新部署一次

### 问题：我只想快速上线，不想折腾本地环境

你完全可以：

1. 直接在 GitHub 网页修改内容文件
2. 直接在 Vercel 导入仓库
3. 直接看线上结果

本地环境是可选项，不是必选项。

## 9. 上线前最后一步

对照：

- [发布检查清单](./PUBLISH-CHECKLIST.md)

---

<a id="en-start"></a>

## English

This guide is focused on one goal:

- getting the template deployed quickly
- showing what to configure on each platform
- showing what to test after deployment

If you want the simplest path, use **Vercel** first.

## 1. Confirm these things before deployment

### Your repository already exists on GitHub

If not, start here:

- [GitHub template workflow](./GITHUB-TEMPLATE.md)

### These files have already been edited

At minimum, check:

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../.env.example](../.env.example)

### Your contact email is ready

You will need:

- `NEXT_PUBLIC_CONTACT_EMAIL_B64`

If you still need the Base64 value:

```bash
echo -n "hi@example.com" | base64
```

## 2. Recommended path: deploy to Vercel

Official docs:

- [Vercel: Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel: Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

### Shortest path

1. Open [Vercel](https://vercel.com/)
2. Sign in and connect GitHub
3. Click `Add New Project`
4. Select your repository
5. Keep the framework as `Next.js`
6. Add environment variables
7. Click `Deploy`

### Environment variables to set

Reference:

- [../.env.example](../.env.example)

Most common variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL_B64` | Yes | Contact-page email |
| `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT` | Optional | Default email subject |
| `NEXT_PUBLIC_REPOSITORY_URL` | Optional | Footer repository link |

### Things you usually do not need to do on Vercel

- you do not need a custom `vercel.json`
- Vercel usually detects `Next.js` automatically
- you can deploy directly from the repository's `package.json`

### Recommended Node version

This template currently uses:

- Node `22.x`

Related files:

- [../package.json](../package.json)
- [../.nvmrc](../.nvmrc)

If you set the version manually in the Vercel dashboard, use `22.x`.

## 3. Optional path: deploy to EdgeOne Pages

If you specifically want EdgeOne Pages, the template also supports it.

Official docs:

- [EdgeOne Pages: Next.js framework guide](https://pages.edgeone.ai/document/framework-nextjs)
- [EdgeOne Pages: edgeone.json configuration](https://pages.edgeone.ai/document/edgeone-json)

### How this template is configured for EdgeOne

This template currently uses **static export mode** on EdgeOne. The key files are:

- [../next.config.mjs](../next.config.mjs)
- [../edgeone.json](../edgeone.json)
- [../app/(redirects)](../app/%28redirects%29)

Core behavior:

- build command: `EDGEONE=1 npm run build`
- output directory: `out`
- `/en` is made compatible with `/en/`
- `/zh` is made compatible with `/zh/`

### Recommended EdgeOne configuration

See:

- [../edgeone.json](../edgeone.json)

Key fields:

- `installCommand`
- `buildCommand`
- `outputDirectory`
- `nodeVersion`
- `redirects`

The current template uses:

- `22.11.0`

## 4. Your locale settings affect the first page visitors see

File:

- [../content/site.json](../content/site.json)

Default:

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": ""
  }
}
```

Remember:

- `primaryLocale: "en"`: first visit is fixed to English
- `primaryLocale: "zh"`: first visit is fixed to Chinese
- `primaryLocale: ""`: browser-language detection runs only when left empty

Priority:

1. `locale` cookie
2. browser language
3. English fallback

Full explanation:

- [Content Management Guide](./CONTENT-MANAGEMENT.md)

## 5. URLs to test after deployment

At minimum, test:

- `/`
- `/en`
- `/en/`
- `/zh`
- `/zh/`
- `/en/research`
- `/zh/research`
- `/en/projects`
- `/zh/projects`
- `/en/publications`
- `/zh/publications`
- `/en/contact`
- `/zh/contact`
- `/en/cv`
- `/zh/cv`

If you use single-language mode, also confirm:

- the unused locale is no longer generated
- the language switcher is hidden

## 6. Features to verify after deployment

### Locale behavior

- first-visit language matches your expectation
- manual language switching is remembered

### Theme behavior

- light / dark mode follows the system preference
- manual theme selection is remembered

### Contact page

- email can be revealed
- copy button works
- mail client opens correctly

### Assets

- avatar loads
- CV downloads
- external links are correct

## 7. Key files for Vercel and EdgeOne behavior

If you later need to troubleshoot deployment behavior, start with:

- [../package.json](../package.json)
- [../next.config.mjs](../next.config.mjs)
- [../proxy.ts](../proxy.ts)
- [../edgeone.json](../edgeone.json)
- [../content/site.json](../content/site.json)
- [../app/(redirects)](../app/%28redirects%29)

These control:

- scripts and Node version
- static export behavior
- request-time locale redirects
- EdgeOne build and redirect settings
- default locale policy
- client-side locale entry for static deployments

## 8. Common questions

### Problem: the deployed site opens in the wrong language

Check:

- [../content/site.json](../content/site.json)

Focus on:

- `mode`
- `primaryLocale`

### Problem: `/en` and `/en/` behave differently on EdgeOne

Check:

- [../edgeone.json](../edgeone.json)
- [../next.config.mjs](../next.config.mjs)

### Problem: I changed an environment variable but the page did not change

Action:

- redeploy the project on the platform

### Problem: I want the fastest path and do not want local setup

That is completely valid:

1. edit content files on GitHub
2. import the repository into Vercel
3. check the deployed result online

Local setup is optional.

## 9. Final step before launch

Review:

- [Publish Checklist](./PUBLISH-CHECKLIST.md)
