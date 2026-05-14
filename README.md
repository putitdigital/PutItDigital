# PutItDigital

This repository contains the PutItDigital website, the EduKids app, and the site-upgrader tools.

## What to run

### EduKids app

```bash
cd eduKids
npm install
npm start
```

### Site upgrader

```bash
cd site-upgrader
npm install
npm start
```

### Static website preview

The live website files are in `website/`.

```bash
cd website
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Afrihost deploy

The GitHub Actions workflow deploys the contents of `website/` when you push a tag that starts with `v`.

```bash
git tag v1.0.2
git push origin v1.0.2
```

## Notes

- The deploy workflow uploads `website/` to the Afrihost FTP target directory.
- Make sure the GitHub Actions secrets are set before pushing a tag.