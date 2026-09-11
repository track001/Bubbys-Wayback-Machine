# Bubby's Wayback Machine 🐻🚀🐭 ⋆｡°✩

> **A little corner of the internet for keeping bubby's writing safe ♡**

A personal archive and portfolio for preserving articles originally published on GameRant.

This project originally started as a way to give old articles a permanent home instead of relying on the original links staying alive forever (e.g. GameRant URLs). The end result is a searchable React archive backed by independently stored HTML snapshots.

Looks like: **find article → find preserved copy → user initiated action (open original, open copy, save PDF, print)**

---

## ✿ Technical Overview

The frontend is a React application originally developed in CodeSandbox and deployed as a static site through GitHub Pages.

Archived articles live separately from the application in a Cloudflare R2 object-storage bucket. The React frontend maps each original GameRant article URL to its corresponding preserved HTML snapshot in R2.

### How it works

```text
Original GameRant URL
        │
        ▼
React Frontend
        │
        ├── Normalize article URL
        │
        ▼
Archived URL → Filename Mapping
        │
        ▼
Cloudflare R2
        │
        ▼
Preserved HTML Snapshot
```

I decided to keep these pieces separate so that the website itself could change without touching the actual archive.

**GitHub Pages = the Wayback Machine**

**Cloudflare R2 = Bubby's archive**

**React = the little guy connecting everything together**

---

## ♡ Archive Resolution

GameRant URLs can appear with or without a trailing `/`, so the application normalizes each URL before looking for its archived copy.

```js
function normalizeArticleUrl(url) {
  const trimmedUrl = url.trim();
  return trimmedUrl.endsWith("/") ? trimmedUrl : `${trimmedUrl}/`;
}
```

That means:

```text
https://gamerant.com/example-article
```

and:

```text
https://gamerant.com/example-article/
```

are treated as the same article.

The normalized URL is matched against a mapping of original GameRant URLs to preserved HTML filenames.

I chose to map the original URLs directly instead of trying to reconstruct filenames from article titles. Titles can contain changed punctuation or formatting, so using the original URL gives the archive a much more reliable lookup key.

---

## ☁ Cloudflare R2 Archive

The preserved HTML snapshots are stored in a Cloudflare R2 object-storage archive.

When someone requests an archived copy, the React frontend resolves the article to its stored filename and retrieves that snapshot from R2.

Cross-origin access is controlled through the R2 bucket's CORS configuration so the GitHub Pages frontend can retrieve archived files directly from the browser.

``No R2 write credentials are exposed in the React frontend.``

```text
React / GitHub Pages
        │
        │  GET archived copy
        ▼
Cloudflare R2
        │
        ▼
articles/<preserved-file>.html
```

The archive then stays independent of both GameRant and the frontend hosting environment.

---

## 🚀 GitHub Pages

The production frontend is deployed through GitHub Pages.

Because this is a Create React App project hosted beneath a GitHub Pages repository path, the production homepage is defined in `package.json`:

```json
"homepage": "https://track001.github.io/Bubbys-Wayback-Machine/"
```

Public assets also use Create React App's `PUBLIC_URL` so they resolve correctly beneath the repository path instead of looking at the root `track001.github.io` domain.

For example:

```jsx
src={`${process.env.PUBLIC_URL}/handPuppies.png`}
```

This keeps all of Bubby's little guys where they're supposed to be. 🐻

---

## ✿ Stack

- React 19
- Create React App / `react-scripts`
- JavaScript
- CSS
- GitHub
- GitHub Pages
- Cloudflare R2
- CodeSandbox

---

## ⚙ Deployment

The project uses the `gh-pages` package to build and publish the production React bundle.

```bash
npm run deploy
```

The deployment process first runs:

```bash
npm run build
```

and then publishes the generated `build/` directory to the `gh-pages` branch.

The corresponding scripts are configured in `package.json`:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

---

## 📁 Project Structure

```text
Bubbys-Wayback-Machine/
├── public/
│   ├── bubblePuppies.png
│   ├── handPuppies.png
│   ├── heartPuppies.png
│   └── parkviewPuppies.png
│
├── src/
│   ├── App.js
│   ├── articles.js
│   ├── PortfolioBuilder.js
│   └── styles.css
│
└── package.json
```

---

## ♡ Why It's Built This Way

I could have just saved all the URL's in HTML format, but then what kind of sister would I be? Now we have a collection that allows multiple user-initiated interactions and honors the work she put into each article. 

Original webpages can move, change, or disappear, so the preserved copy shouldn't depend on the original website continuing to exist. This project intentionally separates the frontend from the archival storage:

- **GitHub Pages**  
Hosts the React application and the actual Wayback Machine interface.

- **Cloudflare R2**  
Stores the preserved HTML article snapshots independently.

- **React**  
Handles searching, filtering, article metadata, URL normalization, archive resolution, and access to the preserved copies.

This also means I can keep changing the frontend, adding features, or moving the application later without having to rebuild the underlying archive.

---

## 🐻⋆｡°✩ Bubby's Wayback Machine ✩°｡⋆🐭

Made for my little bubby, so the things she wrote don't just disappear into the internet void.

Some React, a cloud storage learning curve, and **282 GameRant articles well worth keeping.** ♡

**I built you a bookshelf and you filled it with stories (: My love always.**

`♡`
