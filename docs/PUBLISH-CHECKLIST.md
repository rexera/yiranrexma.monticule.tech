# 发布检查清单 / Publish Checklist

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

正式发布前，建议逐项检查下面内容。

## 1. 语言配置已经确认

文件：

- [../content/site.json](../content/site.json)

确认：

- `mode` 是你真正想要的模式
- `primaryLocale` 是你真正想要的首次访问策略

一定要再次确认：

- `"en"`：首次访问固定英文
- `"zh"`：首次访问固定中文
- `""`：首次访问按浏览器语言自动识别

## 2. 核心内容已经替换为你自己的信息

至少检查：

- [../content/profile.json](../content/profile.json)
- [../content/pages/home.json](../content/pages/home.json)
- [../content/research.json](../content/research.json)
- [../content/publications.json](../content/publications.json)
- [../content/projects.json](../content/projects.json)
- [../content/timeline.json](../content/timeline.json)
- [../content/awards.json](../content/awards.json)
- [../content/updates.json](../content/updates.json)

## 3. 资源文件已经替换

至少检查：

- [../public/images/avatar-placeholder.svg](../public/images/avatar-placeholder.svg)
- [../public/files/sample-cv.pdf](../public/files/sample-cv.pdf)

如果你已经换成自己的文件，也别忘了同步检查：

- [../content/profile.json](../content/profile.json) 里的 `avatar`
- [../content/profile.json](../content/profile.json) 里的 `cvLink`

## 4. 环境变量已经配置

参考：

- [../.env.example](../.env.example)

重点检查：

- `NEXT_PUBLIC_CONTACT_EMAIL_B64` 已填写
- `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT` 按需填写
- `NEXT_PUBLIC_REPOSITORY_URL` 按需填写

## 5. 示例占位内容已经清理

建议全文搜索以下关键词并替换：

- `Alex Chen`
- `陈明远`
- `Example University`
- `your-handle`
- `YOUR_ID`
- `0000-0000-0000-0000`
- `example.com`

## 6. 页面地址检查

至少打开：

- `/`
- `/en`
- `/zh`
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

如果是单语模式，还要确认：

- 另一种语言不会误生成
- 语言切换按钮已隐藏

## 7. 功能检查

### 联系页

- 邮箱可以显示
- 复制按钮可用
- 邮件客户端可以正常打开

### 简历

- CV 下载链接正确

### 外链

- GitHub / Scholar / ORCID 等链接正确

### 主题

- 首次访问会按系统深浅色展示
- 手动切换后会记住选择

## 8. 如果你使用了本地环境

建议执行：

```bash
npm ci
npm run lint
npm run build
```

要求：

- 无错误

## 9. 平台专项检查

### Vercel

- 仓库导入成功
- 环境变量填写完成
- 首次访问语言符合预期

### EdgeOne

- 构建命令使用 `EDGEONE=1 npm run build`
- `/en -> /en/` 正常
- `/zh -> /zh/` 正常
- [../edgeone.json](../edgeone.json) 配置仍然存在

## 10. 仓库内容最终确认

这些文件应该保留：

- [../package.json](../package.json)
- [../package-lock.json](../package-lock.json)
- [../next.config.mjs](../next.config.mjs)
- [../proxy.ts](../proxy.ts)
- [../edgeone.json](../edgeone.json)
- [../.nvmrc](../.nvmrc)
- [../.env.example](../.env.example)

这些内容不要提交：

- `.env`
- `.env.local`
- `node_modules`
- `.next`
- `out`
- 临时调试文件

---

<a id="en-start"></a>

## English

Before publishing, review the items below one by one.

## 1. Locale settings are confirmed

File:

- [../content/site.json](../content/site.json)

Confirm:

- `mode` matches your real target
- `primaryLocale` matches your intended first-visit behavior

Double-check:

- `"en"`: first visit is fixed to English
- `"zh"`: first visit is fixed to Chinese
- `""`: first visit follows browser language

## 2. Core content has been replaced with your own information

At minimum, check:

- [../content/profile.json](../content/profile.json)
- [../content/pages/home.json](../content/pages/home.json)
- [../content/research.json](../content/research.json)
- [../content/publications.json](../content/publications.json)
- [../content/projects.json](../content/projects.json)
- [../content/timeline.json](../content/timeline.json)
- [../content/awards.json](../content/awards.json)
- [../content/updates.json](../content/updates.json)

## 3. Asset files have been replaced

At minimum, check:

- [../public/images/avatar-placeholder.svg](../public/images/avatar-placeholder.svg)
- [../public/files/sample-cv.pdf](../public/files/sample-cv.pdf)

If you already replaced them, also verify:

- `avatar` in [../content/profile.json](../content/profile.json)
- `cvLink` in [../content/profile.json](../content/profile.json)

## 4. Environment variables are configured

Reference:

- [../.env.example](../.env.example)

Main checks:

- `NEXT_PUBLIC_CONTACT_EMAIL_B64` is set
- `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT` is set if needed
- `NEXT_PUBLIC_REPOSITORY_URL` is set if needed

## 5. Placeholder content has been removed

Search and replace at least:

- `Alex Chen`
- `陈明远`
- `Example University`
- `your-handle`
- `YOUR_ID`
- `0000-0000-0000-0000`
- `example.com`

## 6. URL checks

At minimum, open:

- `/`
- `/en`
- `/zh`
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

- the unused locale is not generated
- the language switcher is hidden

## 7. Feature checks

### Contact page

- email can be revealed
- copy button works
- mail client opens correctly

### CV

- CV download link is correct

### External links

- GitHub / Scholar / ORCID and other links are correct

### Theme

- first visit follows system light/dark preference
- manual switching is remembered

## 8. If you use a local environment

Recommended commands:

```bash
npm ci
npm run lint
npm run build
```

Requirement:

- no errors

## 9. Platform-specific checks

### Vercel

- repository import succeeds
- environment variables are configured
- first-visit locale behavior is correct

### EdgeOne

- build command uses `EDGEONE=1 npm run build`
- `/en -> /en/` works
- `/zh -> /zh/` works
- [../edgeone.json](../edgeone.json) still exists

## 10. Final repository check

These files should stay:

- [../package.json](../package.json)
- [../package-lock.json](../package-lock.json)
- [../next.config.mjs](../next.config.mjs)
- [../proxy.ts](../proxy.ts)
- [../edgeone.json](../edgeone.json)
- [../.nvmrc](../.nvmrc)
- [../.env.example](../.env.example)

These should not be committed:

- `.env`
- `.env.local`
- `node_modules`
- `.next`
- `out`
- temporary debug files
