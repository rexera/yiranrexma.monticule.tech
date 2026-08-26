# 维护手册 / Maintenance Guide

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

这份文档适合这些情况：

- 网站已经上线
- 你之后要持续更新内容
- 你是接手别人网站的人

重点不是“怎么第一次部署”，而是“上线后怎么继续维护”。

## 1. 日常最常改的内容

### 个人信息变化

改：

- [../content/profile.json](../content/profile.json)

适用场景：

- 换学校、换实验室、换公司
- 改头衔
- 改社交链接
- 换头像
- 换 CV 路径

### 首页介绍变化

改：

- [../content/pages/home.json](../content/pages/home.json)

适用场景：

- 研究方向变化
- 首页按钮文案变化
- 想让首页口吻更简洁

### 新论文或专利

改：

- [../content/publications.json](../content/publications.json)

### 新项目

改：

- [../content/projects.json](../content/projects.json)

### 新博客

改：

- [../content/blog/en](../content/blog/en)
- [../content/blog/zh](../content/blog/zh)

### 新奖项或新经历

改：

- [../content/awards.json](../content/awards.json)
- [../content/timeline.json](../content/timeline.json)

## 2. 语言模式改变时怎么处理

文件：

- [../content/site.json](../content/site.json)

如果你以后决定：

- 从双语改成单语
- 从固定英文默认改成浏览器语言识别
- 从浏览器语言识别改成固定中文默认

都应该先改这个文件。

重点规则：

- `primaryLocale: "en"`：首次访问固定英文
- `primaryLocale: "zh"`：首次访问固定中文
- `primaryLocale: ""`：首次访问按浏览器语言自动识别

## 3. 联系邮箱或仓库链接变化时怎么处理

参考：

- [../.env.example](../.env.example)

常改变量：

- `NEXT_PUBLIC_CONTACT_EMAIL_B64`
- `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`
- `NEXT_PUBLIC_REPOSITORY_URL`

注意：

- 环境变量改完后，通常要重新部署

## 4. 更换头像和 CV

头像：

1. 把文件放到 [../public/images](../public/images)
2. 修改 [../content/profile.json](../content/profile.json) 里的 `avatar`

CV：

1. 把文件放到 [../public/files](../public/files)
2. 修改 [../content/profile.json](../content/profile.json) 里的 `cvLink`

## 5. 什么时候需要重新部署

只要你改了仓库内容并推送到 GitHub，部署平台一般就会重新构建。

最常见需要重新部署的场景：

- 改了内容文件
- 改了资源文件
- 改了环境变量
- 改了样式或组件

其中：

- 环境变量变化通常一定要重新部署

## 6. 什么时候才需要改代码

只有在这些情况下，才建议改：

- [../app](../app)
- [../components](../components)

例如：

- 新增页面
- 修改布局
- 修改导航结构
- 加新组件
- 加后端能力

如果你只是维护内容，优先改：

- [../content](../content)
- [../public](../public)

## 7. 每次更新后建议检查什么

至少检查：

- 首页是否正常
- 语言切换是否正常
- 联系页邮箱是否正常
- 论文与项目链接是否正常
- CV 下载是否正常

如果改了语言配置，再重点检查：

- `/`
- `/en`
- `/zh`

## 8. 如果接手的是别人的站

建议先按下面顺序看：

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../.env.example](../.env.example)
5. [../next.config.mjs](../next.config.mjs)
6. [../edgeone.json](../edgeone.json)

这样能最快理解：

- 当前是双语还是单语
- 默认语言怎么设置
- 站主是谁
- 邮箱和仓库链接怎么配置
- 站点部署方式是什么

## 9. 相关文档

- [README](../README.md)
- [内容维护指南](./CONTENT-MANAGEMENT.md)
- [部署指南](./DEPLOYMENT.md)
- [发布检查清单](./PUBLISH-CHECKLIST.md)

---

<a id="en-start"></a>

## English

This guide is for situations like:

- the site is already live
- you want to keep updating it over time
- you are taking over someone else's site

The focus here is not “how to deploy for the first time”, but “how to maintain the site after launch”.

## 1. The content you will update most often

### Profile changes

Edit:

- [../content/profile.json](../content/profile.json)

Common cases:

- changing school, lab, or company
- updating title
- updating social links
- replacing avatar
- changing CV path

### Homepage introduction changes

Edit:

- [../content/pages/home.json](../content/pages/home.json)

Common cases:

- research focus changes
- homepage button text changes
- rewriting the homepage voice

### New papers or patents

Edit:

- [../content/publications.json](../content/publications.json)

### New projects

Edit:

- [../content/projects.json](../content/projects.json)

### New blog posts

Edit:

- [../content/blog/en](../content/blog/en)
- [../content/blog/zh](../content/blog/zh)

### New awards or new timeline entries

Edit:

- [../content/awards.json](../content/awards.json)
- [../content/timeline.json](../content/timeline.json)

## 2. How to handle locale-mode changes

File:

- [../content/site.json](../content/site.json)

If you later decide to:

- switch from bilingual to single-language
- switch from fixed English default to browser-language detection
- switch from browser-language detection to fixed Chinese default

start with this file first.

Key rule:

- `primaryLocale: "en"`: first visit is fixed to English
- `primaryLocale: "zh"`: first visit is fixed to Chinese
- `primaryLocale: ""`: first visit follows browser language

## 3. How to update contact email or repository link

Reference:

- [../.env.example](../.env.example)

Common variables:

- `NEXT_PUBLIC_CONTACT_EMAIL_B64`
- `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`
- `NEXT_PUBLIC_REPOSITORY_URL`

Important note:

- after changing environment variables, you usually need a redeploy

## 4. Replacing avatar and CV

Avatar:

1. put the file in [../public/images](../public/images)
2. update `avatar` in [../content/profile.json](../content/profile.json)

CV:

1. put the file in [../public/files](../public/files)
2. update `cvLink` in [../content/profile.json](../content/profile.json)

## 5. When do you need to redeploy?

As long as you change repository content and push to GitHub, the platform will usually rebuild automatically.

Common redeploy cases:

- content files changed
- asset files changed
- environment variables changed
- styles or components changed

In particular:

- environment variable changes usually require a redeploy

## 6. When should you edit code?

Only edit:

- [../app](../app)
- [../components](../components)

when you need things like:

- a new page
- a new layout
- changed navigation structure
- new components
- backend features

For normal content maintenance, start with:

- [../content](../content)
- [../public](../public)

## 7. What should you check after each update?

At minimum, check:

- homepage
- language switching
- contact-page email
- publication and project links
- CV download

If locale settings changed, pay special attention to:

- `/`
- `/en`
- `/zh`

## 8. If you are taking over someone else's site

Recommended reading order:

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../.env.example](../.env.example)
5. [../next.config.mjs](../next.config.mjs)
6. [../edgeone.json](../edgeone.json)

This is the fastest way to understand:

- whether the site is bilingual or single-language
- how first-visit locale is configured
- who the site belongs to
- how email and repository links are configured
- how the site is deployed

## 9. Related guides

- [README_en.md](../README_en.md)
- [Content Management Guide](./CONTENT-MANAGEMENT.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Publish Checklist](./PUBLISH-CHECKLIST.md)
