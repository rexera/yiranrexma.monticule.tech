# 安装指南 / Installation Guide

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

这份文档主要给这些用户：

- 想在本地预览网站
- 想在发布前本地跑构建检查
- 想理解 `package.json` 和 `package-lock.json` 的区别

如果你只想最快上线，不一定需要本地安装。你也可以直接：

1. 在 GitHub 网页编辑内容文件
2. 在 Vercel 导入仓库
3. 在线查看部署结果

## 1. 本地运行前先确认什么

### Node 版本

当前模板使用：

- Node `22.x`

相关文件：

- [../.nvmrc](../.nvmrc)
- [../package.json](../package.json)

### 依赖与脚本

查看：

- [../package.json](../package.json)

常用脚本：

- `npm run dev`
- `npm run build`
- `npm run lint`

## 2. `package.json` 和 `package-lock.json` 到底有什么区别

这两个文件都需要保留。

### `package.json`

文件：

- [../package.json](../package.json)

作用：

- 记录项目名称、脚本和依赖范围
- 告诉 npm “项目需要哪些包”

### `package-lock.json`

文件：

- [../package-lock.json](../package-lock.json)

作用：

- 记录一次已经解析完成的依赖结果
- 告诉 npm “具体装哪些版本”

### 为什么两个都需要

普通用户可以这样理解：

- `package.json` 负责说明“要什么”
- `package-lock.json` 负责固定“到底装哪一版”

这样做的好处是：

- 你本地安装和部署平台安装更容易保持一致
- `npm ci` 才能稳定工作
- 新用户 clone 后更不容易出现“我这里能跑、你那里不能跑”

所以：

- 不要删除 [../package-lock.json](../package-lock.json)
- 不要只保留一个文件

## 3. 本地首次运行命令

推荐流程：

```bash
nvm install
nvm use
npm ci
npm run dev
```

打开：

- `http://localhost:3000`

## 4. `npm ci`、`npm install`、`npm install --package-lock-only` 怎么选

| 场景 | 推荐命令 |
| --- | --- |
| 我是普通使用者，刚 clone 仓库，想跑起来 | `npm ci` |
| 我修改了依赖 | `npm install` |
| 我只想刷新 lockfile，不重新改依赖声明 | `npm install --package-lock-only` |

对大多数使用模板的人来说，优先使用：

```bash
npm ci
```

## 5. 本地检查命令

如果你准备正式发布，建议本地执行：

```bash
npm ci
npm run lint
npm run build
```

说明：

- `npm run lint`：检查明显的代码和配置问题
- `npm run build`：检查生产构建是否通过

## 6. 常见报错与处理

### 报错：`npm ci` 提示 `package.json and package-lock.json are not in sync`

说明：

- 依赖声明和锁文件不同步

处理方式：

```bash
npm install --package-lock-only
npm ci
```

如果你是仓库维护者，记得把更新后的：

- [../package-lock.json](../package-lock.json)

一起提交。

### 报错：`eslint: command not found`

说明：

- 依赖没有正确安装完成

处理方式：

```bash
npm ci
```

### 报错：`next: command not found`

说明：

- 依赖没有正确安装完成

处理方式：

```bash
npm ci
```

### 报错：Node 版本不对

处理方式：

```bash
nvm install
nvm use
```

## 7. 如果你根本不想本地安装

这完全没问题。

你仍然可以完成完整流程：

1. 在 GitHub 网页修改 [../content](../content) 里的文件
2. 在 Vercel 导入仓库
3. 在 Vercel 配置环境变量
4. 直接看线上结果

适合：

- 只想快速上线
- 只改内容，不改代码

## 8. 相关文档

- [README](../README.md)
- [内容维护指南](./CONTENT-MANAGEMENT.md)
- [部署指南](./DEPLOYMENT.md)
- [发布检查清单](./PUBLISH-CHECKLIST.md)

---

<a id="en-start"></a>

## English

This guide is mainly for users who:

- want local preview
- want to run a local build check before publishing
- want to understand `package.json` and `package-lock.json`

If you only want the fastest launch path, local installation is optional. You can also:

1. edit content files on GitHub
2. import the repository into Vercel
3. check the deployed result online

## 1. What should you confirm before local setup?

### Node version

This template uses:

- Node `22.x`

Related files:

- [../.nvmrc](../.nvmrc)
- [../package.json](../package.json)

### Dependencies and scripts

See:

- [../package.json](../package.json)

Common scripts:

- `npm run dev`
- `npm run build`
- `npm run lint`

## 2. What is the difference between `package.json` and `package-lock.json`?

You should keep both files.

### `package.json`

File:

- [../package.json](../package.json)

Purpose:

- defines the project name, scripts, and dependency ranges
- tells npm what the project needs

### `package-lock.json`

File:

- [../package-lock.json](../package-lock.json)

Purpose:

- records one resolved dependency tree
- tells npm exactly which versions were installed

### Why are both needed?

Simple explanation:

- `package.json` says what packages the project wants
- `package-lock.json` pins the exact resolved versions

Benefits:

- local installs and platform installs are more consistent
- `npm ci` can work reliably
- new users are less likely to hit “works on my machine” differences

So:

- do not delete [../package-lock.json](../package-lock.json)
- do not keep only one of the two files

## 3. First local run commands

Recommended flow:

```bash
nvm install
nvm use
npm ci
npm run dev
```

Open:

- `http://localhost:3000`

## 4. When should you use `npm ci`, `npm install`, or `npm install --package-lock-only`?

| Scenario | Recommended command |
| --- | --- |
| I am a normal user, just cloned the repo, and want to run it | `npm ci` |
| I changed dependencies | `npm install` |
| I only want to refresh the lockfile | `npm install --package-lock-only` |

For most template users, the normal choice is:

```bash
npm ci
```

## 5. Local verification commands

Before a real release, it is recommended to run:

```bash
npm ci
npm run lint
npm run build
```

Meaning:

- `npm run lint`: checks common code and configuration issues
- `npm run build`: checks whether the production build succeeds

## 6. Common errors and fixes

### Error: `npm ci` says `package.json and package-lock.json are not in sync`

Meaning:

- dependency declarations and lockfile are out of sync

Fix:

```bash
npm install --package-lock-only
npm ci
```

If you maintain the repository, commit the updated:

- [../package-lock.json](../package-lock.json)

### Error: `eslint: command not found`

Meaning:

- dependencies were not installed correctly

Fix:

```bash
npm ci
```

### Error: `next: command not found`

Meaning:

- dependencies were not installed correctly

Fix:

```bash
npm ci
```

### Error: wrong Node version

Fix:

```bash
nvm install
nvm use
```

## 7. What if you do not want local installation at all?

That is completely fine.

You can still complete the whole workflow:

1. edit files in [../content](../content) on GitHub
2. import the repository into Vercel
3. set environment variables in Vercel
4. check the live result

Best for:

- fastest launch
- content-only changes

## 8. Related guides

- [README_en.md](../README_en.md)
- [Content Management Guide](./CONTENT-MANAGEMENT.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Publish Checklist](./PUBLISH-CHECKLIST.md)
