# 可选自动化指南 / Optional Automation Guide

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

自动化不是使用这个模板的必选项。

如果你不想让机器人帮你更新内容，可以完全不启用这部分。

这份文档只回答两个问题：

- 自动化会改哪些文件
- 什么时候值得开启

## 1. 这套自动化会改哪些内容

相关工作流文件：

- [../.github/workflows/update-content.yml](../.github/workflows/update-content.yml)

相关脚本：

- [../scripts/update-recent-updates.mjs](../scripts/update-recent-updates.mjs)
- [../scripts/update-project-stars.mjs](../scripts/update-project-stars.mjs)

会改动的内容主要是：

- [../content/updates.json](../content/updates.json)
- [../content/projects.json](../content/projects.json)

## 2. 自动化分别做什么

### Recent Updates 自动更新

脚本：

- [../scripts/update-recent-updates.mjs](../scripts/update-recent-updates.mjs)

作用：

- 读取最近的提交记录
- 回写首页的 Recent Updates

对应文件：

- [../content/updates.json](../content/updates.json)

### GitHub stars 自动更新

脚本：

- [../scripts/update-project-stars.mjs](../scripts/update-project-stars.mjs)

作用：

- 读取项目里配置的 GitHub 仓库链接
- 自动更新项目的 stars 数值

对应文件：

- [../content/projects.json](../content/projects.json)

## 3. 什么情况下建议开启

建议开启：

- 你经常提交代码，希望首页动态自动刷新
- 你希望项目 stars 自动更新
- 你不想手动维护这些数字和时间线

## 4. 什么情况下建议关闭

建议关闭：

- 你想完全手动维护内容
- 你不希望出现机器人提交
- 你的项目链接并不稳定

## 5. 开启前要知道什么

自动化需要：

- 仓库已经在 GitHub
- GitHub Actions 已启用
- 工作流具备写回仓库内容的权限

## 6. 如果你不用自动化，是否影响网站使用

不会。

网站可以完全正常运行。你只需要手动维护：

- [../content/updates.json](../content/updates.json)
- [../content/projects.json](../content/projects.json)

## 7. 常见问题

### 问题：工作流运行了，但没有新提交

通常说明：

- 内容没有变化

### 问题：首页动态不是我想要的

你可以：

- 直接关闭自动化
- 手动编辑 [../content/updates.json](../content/updates.json)

### 问题：某个项目 stars 不对

检查：

- [../content/projects.json](../content/projects.json) 里的 GitHub 链接是否正确

---

<a id="en-start"></a>

## English

Automation is optional.

If you do not want bots to update content for you, you can completely skip this part.

This guide answers two questions:

- which files automation changes
- when it is worth enabling

## 1. Which files can automation change?

Workflow file:

- [../.github/workflows/update-content.yml](../.github/workflows/update-content.yml)

Scripts:

- [../scripts/update-recent-updates.mjs](../scripts/update-recent-updates.mjs)
- [../scripts/update-project-stars.mjs](../scripts/update-project-stars.mjs)

The main content files it can modify are:

- [../content/updates.json](../content/updates.json)
- [../content/projects.json](../content/projects.json)

## 2. What does each automation do?

### Recent Updates automation

Script:

- [../scripts/update-recent-updates.mjs](../scripts/update-recent-updates.mjs)

Purpose:

- reads recent commit history
- rewrites the homepage Recent Updates feed

Target file:

- [../content/updates.json](../content/updates.json)

### GitHub stars automation

Script:

- [../scripts/update-project-stars.mjs](../scripts/update-project-stars.mjs)

Purpose:

- reads GitHub repository links from project entries
- updates star counts automatically

Target file:

- [../content/projects.json](../content/projects.json)

## 3. When is it worth enabling?

Enable it if:

- you commit often and want the Recent Updates feed to stay fresh
- you want project star counts to update automatically
- you do not want to maintain those numbers manually

## 4. When should you disable it?

Disable it if:

- you want full manual control over content
- you do not want bot commits
- your project links are not stable

## 5. What should you know before enabling it?

Automation requires:

- the repository is on GitHub
- GitHub Actions is enabled
- the workflow has permission to write back to the repository

## 6. What if you do not use automation?

That is completely fine.

The website still works normally. You just maintain these files manually:

- [../content/updates.json](../content/updates.json)
- [../content/projects.json](../content/projects.json)

## 7. Common questions

### Problem: the workflow ran, but there was no new commit

Usually this means:

- the generated content did not change

### Problem: the Recent Updates feed is not what I want

You can:

- disable automation
- edit [../content/updates.json](../content/updates.json) manually

### Problem: one project's stars look wrong

Check whether the GitHub link in:

- [../content/projects.json](../content/projects.json)

is correct.
