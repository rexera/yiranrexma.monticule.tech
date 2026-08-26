# 内容维护指南 / Content Management Guide

[🇺🇸 English](#en-start) | [🇨🇳 中文](#zh-start)

<a id="zh-start"></a>

## 中文

这份文档告诉你：

- 先改哪些文件
- 每个文件控制什么内容
- 各个字段大致怎么填
- 单语模式和双语模式怎么维护

如果你只是想尽快上线，可以先看：

- [README](../README.md)
- [部署指南](./DEPLOYMENT.md)

## 1. 第一次使用时，建议先改哪些文件

推荐顺序：

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../content/research.json](../content/research.json)
5. [../content/publications.json](../content/publications.json)
6. [../content/projects.json](../content/projects.json)
7. [../content/timeline.json](../content/timeline.json)
8. [../content/awards.json](../content/awards.json)
9. [../content/updates.json](../content/updates.json)
10. [../public/images/avatar-placeholder.svg](../public/images/avatar-placeholder.svg)
11. [../public/files/sample-cv.pdf](../public/files/sample-cv.pdf)
12. [../content/blog/en](../content/blog/en) 和 [../content/blog/zh](../content/blog/zh)

如果你只是改文案、链接、论文、项目、头像、简历，优先改 `content/` 和 `public/`，通常不需要改 `app/` 或 `components/`。

## 2. 站点语言配置：`content/site.json`

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

行为规则：

- `primaryLocale: "en"`：首次访问固定英文
- `primaryLocale: "zh"`：首次访问固定中文
- `primaryLocale: ""`：只有留空时才会按浏览器语言自动识别

语言判定顺序：

1. 先读取 `locale` cookie
2. 没有 cookie 且 `primaryLocale` 为空时，读取浏览器语言
3. 仍然无法判断时，回退到英文

### 常见配置示例

双语，按浏览器语言自动识别：

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": ""
  }
}
```

双语，固定英文默认：

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": "en"
  }
}
```

仅英文：

```json
{
  "i18n": {
    "mode": "en-only",
    "primaryLocale": "en"
  }
}
```

仅中文：

```json
{
  "i18n": {
    "mode": "zh-only",
    "primaryLocale": "zh"
  }
}
```

## 3. 个人资料：`content/profile.json`

文件：

- [../content/profile.json](../content/profile.json)

这个文件控制：

- 侧栏个人信息
- 顶部名称
- 联系页的基础信息
- CV 页里的基础资料

常用字段：

| 字段 | 作用 |
| --- | --- |
| `name` | 当前语言下显示的姓名 |
| `nativeName` | 另一种语言下的姓名，可选 |
| `aka` | 英文页里额外显示的昵称，可选 |
| `title` | 头衔，例如博士生、研究员、工程师 |
| `affiliation` | 单位、实验室、公司 |
| `location` | 城市或地区 |
| `keywords` | 关键词数组，建议 2 到 4 个 |
| `social` | 社交链接数组，格式是 `{ label, href }` |
| `cvLink` | 简历 PDF 的相对路径 |
| `avatar` | 头像文件路径 |

相关资源文件夹：

- [../public/images](../public/images)
- [../public/files](../public/files)

## 4. 首页文案：`content/pages/home.json`

文件：

- [../content/pages/home.json](../content/pages/home.json)

这个文件控制：

- 首页开头自我介绍 `heroIntro`
- 首页按钮文字 `buttons`
- 首页信息摘要 `highlights`
- 首页各区块标题 `sections`

如果你打开网站后，觉得“这还是模板口吻，不像我自己”，通常先改这个文件。

## 5. 研究内容：`content/research.json`

文件：

- [../content/research.json](../content/research.json)

结构分两部分：

- `interests`
- `experiences`

### `interests`

每一项包含：

- `title`
- `description`

适合放研究方向、方法主题、应用方向。

### `experiences`

每一项包含：

- `title`
- `period`
- `role`
- `advisor`
- `funding`
- `summary`
- `bullets`
- `tags`

适合放科研项目、合作课题、阶段性研究经历。

## 6. 成果列表：`content/publications.json`

文件：

- [../content/publications.json](../content/publications.json)

每一项常用字段：

| 字段 | 作用 |
| --- | --- |
| `id` | 编号，例如 `J.1`、`C.2` |
| `type` | 类型：`C`、`J`、`P`、`S` |
| `title` | 标题 |
| `authors` | 作者列表 |
| `venue` | 会议、期刊、专利或状态信息 |
| `year` | 年份 |
| `tags` | 主题标签 |
| `links` | 外链数组，格式 `{ label, href }` |
| `notes` | 附加说明，可选 |

`type` 含义：

- `C`：会议
- `J`：期刊
- `P`：专利
- `S`：投稿中 / 审稿中

## 7. 项目列表：`content/projects.json`

文件：

- [../content/projects.json](../content/projects.json)

最外层是 `groups`，每个分组包含：

- `title`
- `kind`
- `items`

每个项目常用字段：

| 字段 | 作用 |
| --- | --- |
| `name` | 项目名 |
| `summary` | 一句话说明项目内容 |
| `period` | 时间范围，例如 `2025 – Present` |
| `role` | 你的角色 |
| `tags` | 标签 |
| `links` | 外链数组 |
| `metrics` | 指标，例如 stars、users、scenes |

分组 `kind` 常见值：

- `academic`
- `open-source`

## 8. 教育与经历：`content/timeline.json`

文件：

- [../content/timeline.json](../content/timeline.json)

分为两部分：

- `education`
- `experience`

每一项包含：

- `title`
- `period`
- `location`
- `details`

`details` 是字符串数组，适合写 1 到 3 条简洁说明。

## 9. 奖项：`content/awards.json`

文件：

- [../content/awards.json](../content/awards.json)

每一项包含：

- `title`
- `issuer`
- `year`
- `notes`

建议只保留最重要的奖项，不必把所有行政性奖项都放进去。

## 10. 首页动态：`content/updates.json`

文件：

- [../content/updates.json](../content/updates.json)

每一项包含：

- `date`
- `type`
- `title`
- `summary`
- `link`

这部分可以：

- 手动维护
- 也可以交给 GitHub Actions 自动更新

可选自动化说明：

- [可选自动化指南](./WORKFLOW-OPTIMIZATION.md)

## 11. 页面文案：`content/pages/*.json`

目录：

- [../content/pages](../content/pages)

这里放的是页面级文案，不是数据内容。

主要文件：

- [../content/pages/home.json](../content/pages/home.json)
- [../content/pages/research.json](../content/pages/research.json)
- [../content/pages/publications.json](../content/pages/publications.json)
- [../content/pages/projects.json](../content/pages/projects.json)
- [../content/pages/cv.json](../content/pages/cv.json)
- [../content/pages/contact.json](../content/pages/contact.json)
- [../content/pages/blog.json](../content/pages/blog.json)
- [../content/pages/experience.json](../content/pages/experience.json)

如果你要改的是：

- 页面标题
- 页面描述
- 按钮文案
- 空状态提示
- 表单文字

通常应该先在这里改，而不是去改组件代码。

## 12. 博客：`content/blog/en` 与 `content/blog/zh`

目录：

- [../content/blog/en](../content/blog/en)
- [../content/blog/zh](../content/blog/zh)

博客支持 `.md` 和 `.mdx`。

常见 Frontmatter 字段：

- `title`
- `date`
- `summary`
- `tags`
- `type`
- `draft`

其中：

- `type` 可用值：`research` 或 `note`
- `draft: true` 表示不发布

## 13. 单语模式怎么维护

如果你把 [../content/site.json](../content/site.json) 设为：

- `en-only`
- `zh-only`

那么：

- 顶部语言切换按钮会自动隐藏
- 只生成一种语言的页面
- 你可以只保留一种语言的数据块

例如在 `en-only` 模式下，很多内容文件可以只保留：

```json
{
  "en": {
    "...": "..."
  }
}
```

博客目录也一样：

- 英文单语：保留 [../content/blog/en](../content/blog/en)
- 中文单语：保留 [../content/blog/zh](../content/blog/zh)

## 14. 资源文件怎么替换

头像：

- 放到 [../public/images](../public/images)
- 然后修改 [../content/profile.json](../content/profile.json) 里的 `avatar`

简历：

- 放到 [../public/files](../public/files)
- 然后修改 [../content/profile.json](../content/profile.json) 里的 `cvLink`

## 15. 常见错误

### 错误 1：只改了一个地方，页面上还有模板名字

处理方式：

- 继续检查 [../content/profile.json](../content/profile.json)
- 继续检查 [../content/pages/home.json](../content/pages/home.json)
- 全局搜索示例占位词，例如 `Alex Chen`、`陈明远`、`Example University`

### 错误 2：想改文案，却去改组件代码

大多数文字先看：

- [../content](../content)
- [../content/pages](../content/pages)

### 错误 3：单语模式下还保留双语维护习惯

如果你已经明确只做一种语言，先改：

- [../content/site.json](../content/site.json)

然后再删掉另一种语言内容，会更省事。

## 16. 发布前

如果你有本地环境，建议至少执行：

```bash
npm run lint
npm run build
```

然后对照：

- [发布检查清单](./PUBLISH-CHECKLIST.md)

---

<a id="en-start"></a>

## English

This guide explains:

- which files to edit first
- what each file controls
- what the main fields mean
- how to maintain bilingual or single-language content

If you only want the shortest path to launch, start with:

- [README_en.md](../README_en.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 1. Recommended file order for first-time setup

Recommended order:

1. [../content/site.json](../content/site.json)
2. [../content/profile.json](../content/profile.json)
3. [../content/pages/home.json](../content/pages/home.json)
4. [../content/research.json](../content/research.json)
5. [../content/publications.json](../content/publications.json)
6. [../content/projects.json](../content/projects.json)
7. [../content/timeline.json](../content/timeline.json)
8. [../content/awards.json](../content/awards.json)
9. [../content/updates.json](../content/updates.json)
10. [../public/images/avatar-placeholder.svg](../public/images/avatar-placeholder.svg)
11. [../public/files/sample-cv.pdf](../public/files/sample-cv.pdf)
12. [../content/blog/en](../content/blog/en) and [../content/blog/zh](../content/blog/zh)

If you are only changing text, links, projects, publications, avatar, or CV, start with `content/` and `public/`. You usually do not need to edit `app/` or `components/`.

## 2. Site language settings: `content/site.json`

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

### `i18n.mode`

Available values:

- `bilingual`
- `en-only`
- `zh-only`

Meaning:

- `bilingual`: generate both English and Chinese pages
- `en-only`: generate English pages only
- `zh-only`: generate Chinese pages only

### `i18n.primaryLocale`

Available values:

- `"en"`
- `"zh"`
- `""`

Behavior:

- `primaryLocale: "en"`: first visit is fixed to English
- `primaryLocale: "zh"`: first visit is fixed to Chinese
- `primaryLocale: ""`: browser-language detection runs only when this value is empty

Locale decision order:

1. Read the `locale` cookie first
2. If there is no cookie and `primaryLocale` is empty, read browser language
3. If still undecidable, fall back to English

### Common examples

Bilingual, detect browser language:

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": ""
  }
}
```

Bilingual, fixed English default:

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": "en"
  }
}
```

English only:

```json
{
  "i18n": {
    "mode": "en-only",
    "primaryLocale": "en"
  }
}
```

Chinese only:

```json
{
  "i18n": {
    "mode": "zh-only",
    "primaryLocale": "zh"
  }
}
```

## 3. Profile: `content/profile.json`

File:

- [../content/profile.json](../content/profile.json)

This file controls:

- sidebar profile information
- header name
- contact-page base information
- CV-page base information

Common fields:

| Field | Meaning |
| --- | --- |
| `name` | Name shown in the current locale |
| `nativeName` | Name in the other language, optional |
| `aka` | Optional nickname, usually on English pages |
| `title` | Professional title |
| `affiliation` | Institution, lab, or company |
| `location` | City or region |
| `keywords` | Array of short keywords |
| `social` | Array of `{ label, href }` links |
| `cvLink` | Relative path to the CV PDF |
| `avatar` | Avatar file path |

Related asset folders:

- [../public/images](../public/images)
- [../public/files](../public/files)

## 4. Homepage copy: `content/pages/home.json`

File:

- [../content/pages/home.json](../content/pages/home.json)

This file controls:

- homepage introduction `heroIntro`
- homepage buttons `buttons`
- homepage summary block `highlights`
- homepage section headings `sections`

If the site still sounds like a template, this is usually the first file to rewrite.

## 5. Research content: `content/research.json`

File:

- [../content/research.json](../content/research.json)

It has two main parts:

- `interests`
- `experiences`

### `interests`

Each item contains:

- `title`
- `description`

Use this for research themes, methods, or application areas.

### `experiences`

Each item contains:

- `title`
- `period`
- `role`
- `advisor`
- `funding`
- `summary`
- `bullets`
- `tags`

Use this for research projects, collaborations, or major research phases.

## 6. Publications: `content/publications.json`

File:

- [../content/publications.json](../content/publications.json)

Common fields:

| Field | Meaning |
| --- | --- |
| `id` | Identifier such as `J.1` or `C.2` |
| `type` | Type: `C`, `J`, `P`, `S` |
| `title` | Title |
| `authors` | Author list |
| `venue` | Venue or status |
| `year` | Year |
| `tags` | Topic tags |
| `links` | Array of `{ label, href }` |
| `notes` | Optional note |

`type` meanings:

- `C`: conference
- `J`: journal
- `P`: patent
- `S`: submission / under review

## 7. Projects: `content/projects.json`

File:

- [../content/projects.json](../content/projects.json)

Top-level structure:

- `groups`

Each group contains:

- `title`
- `kind`
- `items`

Each project commonly uses:

| Field | Meaning |
| --- | --- |
| `name` | Project name |
| `summary` | One-sentence description |
| `period` | Time range such as `2025 – Present` |
| `role` | Your role |
| `tags` | Tags |
| `links` | External links |
| `metrics` | Metrics such as stars, users, scenes |

Common `kind` values:

- `academic`
- `open-source`

## 8. Timeline: `content/timeline.json`

File:

- [../content/timeline.json](../content/timeline.json)

It has two sections:

- `education`
- `experience`

Each item contains:

- `title`
- `period`
- `location`
- `details`

`details` is an array of short bullet strings.

## 9. Awards: `content/awards.json`

File:

- [../content/awards.json](../content/awards.json)

Each item contains:

- `title`
- `issuer`
- `year`
- `notes`

Usually it is better to keep only selected awards instead of every administrative record.

## 10. Recent updates: `content/updates.json`

File:

- [../content/updates.json](../content/updates.json)

Each item contains:

- `date`
- `type`
- `title`
- `summary`
- `link`

This section can be:

- maintained manually
- or updated automatically by GitHub Actions

Optional automation:

- [Optional Automation Guide](./WORKFLOW-OPTIMIZATION.md)

## 11. Page copy: `content/pages/*.json`

Directory:

- [../content/pages](../content/pages)

These files hold page-level copy, not structured research/project data.

Main files:

- [../content/pages/home.json](../content/pages/home.json)
- [../content/pages/research.json](../content/pages/research.json)
- [../content/pages/publications.json](../content/pages/publications.json)
- [../content/pages/projects.json](../content/pages/projects.json)
- [../content/pages/cv.json](../content/pages/cv.json)
- [../content/pages/contact.json](../content/pages/contact.json)
- [../content/pages/blog.json](../content/pages/blog.json)
- [../content/pages/experience.json](../content/pages/experience.json)

If you want to change:

- page titles
- descriptions
- button labels
- empty states
- form text

you should usually edit these files before touching component code.

## 12. Blog: `content/blog/en` and `content/blog/zh`

Directories:

- [../content/blog/en](../content/blog/en)
- [../content/blog/zh](../content/blog/zh)

Blog posts support `.md` and `.mdx`.

Common frontmatter fields:

- `title`
- `date`
- `summary`
- `tags`
- `type`
- `draft`

Notes:

- `type` can be `research` or `note`
- `draft: true` keeps a post unpublished

## 13. How to maintain single-language mode

If [../content/site.json](../content/site.json) is set to:

- `en-only`
- `zh-only`

then:

- the language switcher is hidden automatically
- only one locale route tree is generated
- you may keep only one language block in many content files

For example, in `en-only` mode, many files may contain only:

```json
{
  "en": {
    "...": "..."
  }
}
```

The same applies to blog directories:

- English only: keep [../content/blog/en](../content/blog/en)
- Chinese only: keep [../content/blog/zh](../content/blog/zh)

## 14. How to replace assets

Avatar:

- put the file in [../public/images](../public/images)
- update `avatar` in [../content/profile.json](../content/profile.json)

CV:

- put the file in [../public/files](../public/files)
- update `cvLink` in [../content/profile.json](../content/profile.json)

## 15. Common mistakes

### Mistake 1: You changed one file but still see template names

Check:

- [../content/profile.json](../content/profile.json)
- [../content/pages/home.json](../content/pages/home.json)

Also search globally for placeholders such as `Alex Chen`, `陈明远`, and `Example University`.

### Mistake 2: You want to change text, but start editing components

Most text belongs in:

- [../content](../content)
- [../content/pages](../content/pages)

### Mistake 3: You keep maintaining two languages even after switching to single-language mode

If you already know the site will be single-language, update:

- [../content/site.json](../content/site.json)

first. Then clean up the unused locale content.

## 16. Before publishing

If you use a local environment, it is recommended to run:

```bash
npm run lint
npm run build
```

Then review:

- [Publish Checklist](./PUBLISH-CHECKLIST.md)
