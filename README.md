# 学术主页模板 Academic Homepage Template
[🇺🇸 English](./README_en.md) | 🇨🇳 中文

![状态](https://img.shields.io/badge/状态-可用模板-success) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-149eca) ![Node](https://img.shields.io/badge/Node-22.x-339933) ![部署](https://img.shields.io/badge/部署-Vercel%20%7C%20EdgeOne-blue)

在线预览： [https://academic-homepage-template-orpin.vercel.app/](https://academic-homepage-template-orpin.vercel.app/)

这个仓库是一个可直接复用的主页模板，适合：

- 个人主页
- 学术主页
- 实验室主页
- 项目介绍页
- 作品集站点

你不需要先改代码，也不需要先在本地编译。大多数用户只需要：

1. 在 GitHub 点击 `Use this template`
2. 修改内容文件
3. 在 Vercel 导入你的仓库
4. 部署上线

## 最快上线流程

如果你的目标是“尽快把网站上线”，按下面做即可：

### 第 1 步：创建你自己的仓库

在 GitHub 页面点击 `Use this template`，创建你自己的仓库。

详细说明：

- [GitHub 使用方式与模板流程](./docs/GITHUB-TEMPLATE.md)

### 第 2 步：先改这 4 处

先打开并修改：

1. [content/site.json](./content/site.json)
2. [content/profile.json](./content/profile.json)
3. [content/pages/home.json](./content/pages/home.json)
4. [.env.example](./.env.example)

这 4 处分别控制：

- 网站是双语还是单语
- 你的姓名、单位、社交链接、头像、CV
- 首页自我介绍和按钮文案
- 联系页邮箱和页脚仓库链接

下一步该改什么，见：

- [内容维护指南](./docs/CONTENT-MANAGEMENT.md)

### 第 3 步：把改动推送到你自己的 GitHub 仓库

如果你直接在 GitHub 网页上编辑文件，保存后就已经完成这一步。

如果你在本地编辑，再执行：

```bash
git add .
git commit -m "Customize homepage content"
git push
```

### 第 4 步：在 Vercel 导入仓库并部署

1. 打开 [Vercel](https://vercel.com/)
2. 点击 `Add New Project`
3. 选择你的 GitHub 仓库
4. Framework 保持 `Next.js`
5. 在环境变量里填写邮箱等信息
6. 点击 `Deploy`

详细步骤：

- [部署指南](./docs/DEPLOYMENT.md)

## 最重要的配置：`content/site.json`

文件：

- [content/site.json](./content/site.json)

默认配置：

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": ""
  }
}
```

这两个参数决定了你的站点如何显示语言。

### `i18n.mode`

可选值：

- `bilingual`
- `en-only`
- `zh-only`

含义：

- `bilingual`：同时生成中英文页面
- `en-only`：只生成英文页面
- `zh-only`：只生成中文页面

### `i18n.primaryLocale`

可选值：

- `"en"`
- `"zh"`
- `""`

这个参数一定要理解清楚：

- `primaryLocale: "en"`：首次访问固定进入英文，不启用浏览器语言识别
- `primaryLocale: "zh"`：首次访问固定进入中文，不启用浏览器语言识别
- `primaryLocale: ""`：只有留空时，首次访问才按浏览器语言识别；识别不到时回退到英文

当前模板默认值就是：

```json
"primaryLocale": ""
```

也就是：

- 默认按浏览器语言决定首屏语言
- 用户手动切换语言后，会优先记住用户自己的选择

语言判断顺序是：

1. 先看 `locale` cookie
2. 如果没有 cookie，并且 `primaryLocale` 留空，再读浏览器语言
3. 如果仍然无法判断，则回退到英文

完整说明与示例：

- [内容维护指南中的语言配置部分](./docs/CONTENT-MANAGEMENT.md)

## 你最可能会改的文件

下面这些文件，基本涵盖了大多数用户第一次使用模板时需要修改的内容。

### 站点级配置

- [content/site.json](./content/site.json)
  控制双语/单语、默认语言策略

### 个人信息

- [content/profile.json](./content/profile.json)
  控制姓名、单位、地点、关键词、社交链接、头像路径、CV 路径

### 首页文案

- [content/pages/home.json](./content/pages/home.json)
  控制首页自我介绍、按钮文字、首页各区块标题

### 研究内容

- [content/research.json](./content/research.json)
  控制研究兴趣和研究经历

### 成果列表

- [content/publications.json](./content/publications.json)
  控制论文、专利、投稿中稿件等条目

### 项目列表

- [content/projects.json](./content/projects.json)
  控制项目分组、项目简介、链接、指标

### 教育与经历

- [content/timeline.json](./content/timeline.json)
  控制教育背景和实习/工作经历

### 奖项

- [content/awards.json](./content/awards.json)

### 首页动态

- [content/updates.json](./content/updates.json)

### 博客

- [content/blog/en](./content/blog/en)
- [content/blog/zh](./content/blog/zh)

### 页面文案

- [content/pages](./content/pages)

### 资源文件

- [public/images/avatar-placeholder.svg](./public/images/avatar-placeholder.svg)
- [public/files/sample-cv.pdf](./public/files/sample-cv.pdf)

## 联系页环境变量

模板示例文件：

- [.env.example](./.env.example)

你最需要关心的是：

| 变量名 | 是否必填 | 作用 |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL_B64` | 必填 | 联系页真实邮箱，使用 Base64 编码保存 |
| `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT` | 选填 | 打开邮件客户端时的默认标题 |
| `NEXT_PUBLIC_REPOSITORY_URL` | 选填 | 页脚显示的仓库链接 |

邮箱转 Base64 示例：

```bash
echo -n "hi@example.com" | base64
```

更多说明：

- [安装与环境变量说明](./docs/INSTALLATION.md)
- [部署时如何填写环境变量](./docs/DEPLOYMENT.md)

## 本地预览是可选的

很多用户并不需要本地运行，只需要：

- 用 GitHub 网页改文件
- 在 Vercel 导入仓库
- 在线看部署结果

只有在你想做这些事情时，才建议本地运行：

- 提前预览页面
- 大量修改内容
- 增加博客文章
- 改组件或样式
- 排查构建报错

本地预览命令：

```bash
nvm install
nvm use
npm ci
npm run dev
```

打开：

- `http://localhost:3000`

如果你遇到 `npm ci`、`package-lock.json`、Node 版本等问题，直接看：

- [安装指南](./docs/INSTALLATION.md)

## 默认主题行为

模板默认支持浅色 / 深色主题自动跟随系统设置。

也就是说：

- 用户第一次访问时，会跟随操作系统或浏览器当前的深浅色偏好
- 用户手动切换后，会记住自己的选择

这部分不需要你额外配置，直接可用。

## 文档入口

按任务来找文档：

- 我想最快上线： [部署指南](./docs/DEPLOYMENT.md)
- 我想知道每个内容文件改什么： [内容维护指南](./docs/CONTENT-MANAGEMENT.md)
- 我想本地运行： [安装指南](./docs/INSTALLATION.md)
- 我想把仓库作为 GitHub 模板使用： [GitHub 使用方式与模板流程](./docs/GITHUB-TEMPLATE.md)
- 我想上线前逐项检查： [发布检查清单](./docs/PUBLISH-CHECKLIST.md)
- 我想让 Recent Updates / stars 自动更新： [可选自动化指南](./docs/WORKFLOW-OPTIMIZATION.md)
- 我接手的是一个已经上线的网站： [维护手册](./docs/maintenance-guide.md)

## 上线前建议至少做一次检查

如果你使用了本地环境，建议在正式发布前执行：

```bash
npm ci
npm run lint
npm run build
```

然后对照：

- [发布检查清单](./docs/PUBLISH-CHECKLIST.md)

## License

- [MIT](./LICENSE)
