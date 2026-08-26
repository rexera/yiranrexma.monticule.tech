# GitHub 使用方式与模板流程 / GitHub Template Workflow

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

这份文档讲的是：

- 如何使用这个模板创建你自己的仓库
- 如何选择“只在 GitHub 网页改内容”还是“clone 到本地再改”
- 哪些文件要保留在仓库里

## 1. 最简单的使用方法：`Use this template`

如果你只是想拿模板做自己的网站，推荐顺序如下：

1. 在 GitHub 点击 `Use this template`
2. 创建你自己的仓库
3. 在你自己的仓库里修改内容文件
4. 将仓库导入 Vercel
5. 部署上线

这是大多数用户最省事的方式。

## 2. 你可以直接在 GitHub 网页上改文件

很多人第一次使用模板时，不需要先装本地环境。

你可以直接在 GitHub 网页编辑这些文件：

- [../content/site.json](../content/site.json)
- [../content/profile.json](../content/profile.json)
- [../content/pages/home.json](../content/pages/home.json)
- [../content/research.json](../content/research.json)
- [../content/publications.json](../content/publications.json)
- [../content/projects.json](../content/projects.json)
- [../content/timeline.json](../content/timeline.json)
- [../content/awards.json](../content/awards.json)
- [../content/updates.json](../content/updates.json)

如果你的改动只是：

- 替换姓名
- 替换单位
- 替换论文和项目
- 改首页文案
- 改语言配置

那么直接在 GitHub 网页改就够了。

## 3. 什么时候才需要 clone 到本地

建议在这些情况下再 clone：

- 你想本地预览页面
- 你要新增博客文章
- 你要替换很多资源文件
- 你要改代码、样式或组件
- 你要运行 `npm run build` 做发布前检查

本地基本命令：

```bash
git clone <你的仓库地址>
cd <你的仓库名>
nvm install
nvm use
npm ci
npm run dev
```

详细说明：

- [安装指南](./INSTALLATION.md)

## 4. 创建自己的仓库后，建议先改哪些文件

最短路径：

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../.env.example](../.env.example)

为什么先改这几个：

- `site.json` 决定语言模式和默认语言策略
- `profile.json` 决定网站是不是已经变成“你的站”
- `home.json` 决定首页第一屏是不是已经像你本人
- `.env.example` 告诉你部署时需要填哪些变量

## 5. 哪些文件必须保留在仓库里

下面这些文件不要删，它们属于项目运行和部署所需的配置：

- [../package.json](../package.json)
- [../package-lock.json](../package-lock.json)
- [../next.config.mjs](../next.config.mjs)
- [../edgeone.json](../edgeone.json)
- [../proxy.ts](../proxy.ts)
- [../tsconfig.json](../tsconfig.json)
- [../tailwind.config.ts](../tailwind.config.ts)
- [../eslint.config.mjs](../eslint.config.mjs)
- [../postcss.config.mjs](../postcss.config.mjs)
- [../next-env.d.ts](../next-env.d.ts)
- [../.nvmrc](../.nvmrc)
- [../.env.example](../.env.example)

特别说明：

- [../package-lock.json](../package-lock.json) 需要保留
- [../package.json](../package.json) 也需要保留

这两个文件不是二选一，而是都要一起提交。

## 6. 哪些文件不要提交

这些文件通常不应该进仓库：

- `.env`
- `.env.local`
- `node_modules`
- `.next`
- `out`
- `dist`
- `.DS_Store`

相关规则已经写在：

- [../.gitignore](../.gitignore)

## 7. 如果你想把这个仓库继续作为模板公开给别人

如果你是模板维护者，希望别人也能点 `Use this template`，需要在 GitHub 仓库页面打开：

1. `Settings`
2. `General`
3. `Template repository`

开启后，其他人就可以继续从你的仓库创建副本。

## 8. 建议的 GitHub 使用流程

### 方案 A：完全在线改内容

适合：

- 只想快速上线
- 不想先装本地环境

流程：

1. `Use this template`
2. 在 GitHub 网页改内容
3. 导入到 Vercel
4. 看线上结果

### 方案 B：本地改完再推送

适合：

- 改动比较多
- 需要本地预览
- 需要新增博客和资源文件

流程：

1. `Use this template`
2. `git clone`
3. 本地修改
4. `git push`
5. 部署

## 9. 发布前建议

如果你用了本地环境，建议在推送前执行：

```bash
npm run lint
npm run build
```

然后检查：

- [发布检查清单](./PUBLISH-CHECKLIST.md)

---

<a id="en-start"></a>

## English

This guide explains:

- how to create your own repository from this template
- when to use GitHub web editing vs local clone
- which files must stay in the repository

## 1. The simplest way to use this project: `Use this template`

If your goal is simply to build your own website from this template, the recommended path is:

1. click `Use this template` on GitHub
2. create your own repository
3. edit the content files in your repository
4. import the repository into Vercel
5. deploy

This is the easiest path for most users.

## 2. You can edit files directly on GitHub

Many first-time users do not need local setup at all.

You can edit these files directly in the GitHub web UI:

- [../content/site.json](../content/site.json)
- [../content/profile.json](../content/profile.json)
- [../content/pages/home.json](../content/pages/home.json)
- [../content/research.json](../content/research.json)
- [../content/publications.json](../content/publications.json)
- [../content/projects.json](../content/projects.json)
- [../content/timeline.json](../content/timeline.json)
- [../content/awards.json](../content/awards.json)
- [../content/updates.json](../content/updates.json)

If your changes are mostly:

- replacing your name
- replacing your affiliation
- updating publications and projects
- rewriting homepage copy
- changing locale settings

then GitHub web editing is usually enough.

## 3. When should you clone locally?

Use local clone when:

- you want local preview
- you want to add blog posts
- you need to replace many asset files
- you want to change code, styles, or components
- you want to run `npm run build` before release

Basic local commands:

```bash
git clone <your-repository-url>
cd <your-repository-name>
nvm install
nvm use
npm ci
npm run dev
```

More details:

- [Installation Guide](./INSTALLATION.md)

## 4. Which files should you edit first after creating your repository?

Shortest path:

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../.env.example](../.env.example)

Why these first:

- `site.json` controls locale mode and first-visit locale behavior
- `profile.json` makes the site yours
- `home.json` changes the first screen visitors see
- `.env.example` shows what deployment variables you must provide

## 5. Which files must stay in the repository?

Do not delete these files. They are part of the project's runtime and deployment setup:

- [../package.json](../package.json)
- [../package-lock.json](../package-lock.json)
- [../next.config.mjs](../next.config.mjs)
- [../edgeone.json](../edgeone.json)
- [../proxy.ts](../proxy.ts)
- [../tsconfig.json](../tsconfig.json)
- [../tailwind.config.ts](../tailwind.config.ts)
- [../eslint.config.mjs](../eslint.config.mjs)
- [../postcss.config.mjs](../postcss.config.mjs)
- [../next-env.d.ts](../next-env.d.ts)
- [../.nvmrc](../.nvmrc)
- [../.env.example](../.env.example)

Important note:

- keep [../package-lock.json](../package-lock.json)
- keep [../package.json](../package.json)

These are not alternatives. They belong together in the repository.

## 6. Which files should not be committed?

These files should normally stay out of the repository:

- `.env`
- `.env.local`
- `node_modules`
- `.next`
- `out`
- `dist`
- `.DS_Store`

The rules are already defined in:

- [../.gitignore](../.gitignore)

## 7. If you want to keep publishing this repository as a template

If you are the template maintainer and want other people to keep using `Use this template`, enable this in GitHub:

1. `Settings`
2. `General`
3. `Template repository`

After that, others can create their own copies from your repository.

## 8. Recommended GitHub usage paths

### Path A: Edit content fully online

Best for:

- fastest launch
- no local setup

Flow:

1. `Use this template`
2. edit content on GitHub
3. import to Vercel
4. check the live result

### Path B: Edit locally and push later

Best for:

- larger changes
- local preview
- blog and asset updates

Flow:

1. `Use this template`
2. `git clone`
3. edit locally
4. `git push`
5. deploy

## 9. Recommended check before release

If you use local setup, run:

```bash
npm run lint
npm run build
```

Then review:

- [Publish Checklist](./PUBLISH-CHECKLIST.md)
