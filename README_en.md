# Academic Homepage Template

🇺🇸 English | [🇨🇳 中文](./README.md)

![Status](https://img.shields.io/badge/status-template%20ready-success) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-149eca) ![Node](https://img.shields.io/badge/Node-22.x-339933) ![Deploy](https://img.shields.io/badge/deploy-Vercel%20%7C%20EdgeOne-blue)

Live demo: [https://academic-homepage-template-orpin.vercel.app/](https://academic-homepage-template-orpin.vercel.app/)

This repository is a reusable homepage template for:

- personal websites
- academic websites
- lab websites
- project landing pages
- portfolio-style sites

You do not need to edit code first. You also do not need local setup just to publish your site.

For most users, the path is simply:

1. Click `Use this template`
2. Edit the content files
3. Import your repository into Vercel
4. Deploy

## Fastest Path To Launch

If your goal is “get the site online as quickly as possible”, follow this path.

### Step 1: Create your own repository

On GitHub, click `Use this template` and create your own repository.

Details:

- [GitHub template workflow](./docs/GITHUB-TEMPLATE.md)

### Step 2: Edit these 4 places first

Open and edit:

1. [content/site.json](./content/site.json)
2. [content/profile.json](./content/profile.json)
3. [content/pages/home.json](./content/pages/home.json)
4. [.env.example](./.env.example)

These four places control:

- whether your site is bilingual or single-language
- your name, affiliation, social links, avatar, and CV
- your homepage introduction and button labels
- your contact email and footer repository link

What to edit next:

- [Content Management Guide](./docs/CONTENT-MANAGEMENT.md)

### Step 3: Push the changes to your own GitHub repository

If you edit directly on GitHub, this step is already done when you save the file.

If you edit locally, run:

```bash
git add .
git commit -m "Customize homepage content"
git push
```

### Step 4: Import the repository into Vercel and deploy

1. Open [Vercel](https://vercel.com/)
2. Click `Add New Project`
3. Select your GitHub repository
4. Keep the framework as `Next.js`
5. Add your environment variables
6. Click `Deploy`

Step-by-step instructions:

- [Deployment Guide](./docs/DEPLOYMENT.md)

## Most Important Configuration: `content/site.json`

File:

- [content/site.json](./content/site.json)

Default configuration:

```json
{
  "i18n": {
    "mode": "bilingual",
    "primaryLocale": ""
  }
}
```

These two parameters decide how your site handles language.

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

This rule is important:

- `primaryLocale: "en"`: first visit is fixed to English, browser-language detection is disabled
- `primaryLocale: "zh"`: first visit is fixed to Chinese, browser-language detection is disabled
- `primaryLocale: ""`: browser-language detection runs only when this value is empty; unresolved cases fall back to English

The template default is:

```json
"primaryLocale": ""
```

That means:

- first visit follows the visitor's browser language when possible
- after a visitor manually switches language, their own choice is remembered

Locale decision order:

1. Check the `locale` cookie first
2. If no cookie exists and `primaryLocale` is empty, read browser language
3. If still undecidable, fall back to English

Full explanation and examples:

- [Language configuration in the Content Management Guide](./docs/CONTENT-MANAGEMENT.md)

## Files You Will Most Likely Edit

These files cover most first-time customization work.

### Site-level settings

- [content/site.json](./content/site.json)
  Controls bilingual / single-language mode and first-visit locale behavior.

### Profile information

- [content/profile.json](./content/profile.json)
  Controls name, affiliation, location, keywords, social links, avatar path, and CV path.

### Homepage copy

- [content/pages/home.json](./content/pages/home.json)
  Controls the homepage introduction, buttons, and section titles.

### Research content

- [content/research.json](./content/research.json)
  Controls research interests and research experience.

### Publications

- [content/publications.json](./content/publications.json)
  Controls papers, patents, submissions, and related links.

### Projects

- [content/projects.json](./content/projects.json)
  Controls project groups, summaries, links, and metrics.

### Education and experience

- [content/timeline.json](./content/timeline.json)

### Awards

- [content/awards.json](./content/awards.json)

### Recent updates

- [content/updates.json](./content/updates.json)

### Blog

- [content/blog/en](./content/blog/en)
- [content/blog/zh](./content/blog/zh)

### Page copy

- [content/pages](./content/pages)

### Assets

- [public/images/avatar-placeholder.svg](./public/images/avatar-placeholder.svg)
- [public/files/sample-cv.pdf](./public/files/sample-cv.pdf)

## Contact Page Environment Variables

Template file:

- [.env.example](./.env.example)

The main variables are:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL_B64` | Yes | Real contact email, stored in Base64 |
| `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT` | Optional | Default subject for the mail client |
| `NEXT_PUBLIC_REPOSITORY_URL` | Optional | Repository link shown in the footer |

Base64 example:

```bash
echo -n "hi@example.com" | base64
```

More details:

- [Installation and environment-variable notes](./docs/INSTALLATION.md)
- [How to set environment variables during deployment](./docs/DEPLOYMENT.md)

## Local Preview Is Optional

Many users do not need local setup at all. They simply:

- edit files on GitHub
- import the repository into Vercel
- check the deployed result online

Local setup is mainly useful when you want to:

- preview the site before deploying
- make many content changes at once
- add blog posts
- change components or styles
- debug build issues

Local preview commands:

```bash
nvm install
nvm use
npm ci
npm run dev
```

Open:

- `http://localhost:3000`

If you run into `npm ci`, `package-lock.json`, or Node-version issues, go straight to:

- [Installation Guide](./docs/INSTALLATION.md)

## Default Theme Behavior

The template already supports automatic light / dark theme following.

That means:

- on first visit, the site follows the visitor's OS or browser light-dark preference
- after a manual theme switch, the user's own choice is remembered

No extra configuration is required.

## Documentation Map

Choose by task:

- I want the fastest path to launch: [Deployment Guide](./docs/DEPLOYMENT.md)
- I want to know what each content file does: [Content Management Guide](./docs/CONTENT-MANAGEMENT.md)
- I want to run locally: [Installation Guide](./docs/INSTALLATION.md)
- I want to use this as a GitHub template: [GitHub template workflow](./docs/GITHUB-TEMPLATE.md)
- I want a pre-launch checklist: [Publish Checklist](./docs/PUBLISH-CHECKLIST.md)
- I want Recent Updates / stars automation: [Optional Automation Guide](./docs/WORKFLOW-OPTIMIZATION.md)
- I am maintaining an already-launched site: [Maintenance Guide](./docs/maintenance-guide.md)

## Recommended Check Before Publishing

If you use local setup, run this before going live:

```bash
npm ci
npm run lint
npm run build
```

Then review:

- [Publish Checklist](./docs/PUBLISH-CHECKLIST.md)

## License

- [MIT](./LICENSE)
