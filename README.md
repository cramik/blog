# Cramik blog

A high-performance personal technical blog.

---

## 🎨 Theme & Styling

The blog features a custom minimalist dark theme:
* **Background:** Deep dark `#111111` theme.
* **Typography:** Clean, readable **Noto Sans** for body copy and **Noto Mono** for code fragments and terminals.
* **Accents:** Vivid orange `#ff6600` links, navigation points, and hover actions.
* **Responsiveness:** Fluid grid layouts scaling down seamlessly to mobile screens.

---

## 🛠️ Development & Build Process

This site is built using **Eleventy (11ty)**, leveraging pre-compilers and assets bundling for high-speed page loading.

### Prerequisites
* **Node.js** (v16+ recommended)

### Installation
Install the Eleventy dependencies and markdown plugins:
```bash
npm install
```

### Local Development
To launch the Eleventy development server with live reload:
```bash
npm run serve
```

### Production Build
Since the templates rely on compiled JavaScript hashes to generate Content Security Policies (CSPs), you must compile assets before running the Eleventy builder:

1. **Bundle & Minify Scripts (Rollup):**
   ```bash
   npm run js-build
   ```
2. **Build Static Site (Eleventy):**
   ```bash
   npx @11ty/eleventy --pathprefix='/blog/'
   ```
   *The generated static site will be written to the `_site/` directory.*