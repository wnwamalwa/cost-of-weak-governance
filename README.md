# Cost of Weak Governance dashboard (standalone)

A separate dashboard for the ELGIA/KISP booth at GDSAI 2026 (Strathmore, 19–20 Nov 2026), built by IEA Kenya from the World Bank Kenya Economic Update No. 34 (governance special focus).

It is a plain static site: no install, no build step.

## Folder
```
ELGIA_APP/
  index.html        page layout (sections and headings)
  assets/styles.css look and colours (light and dark)
  assets/app.js     draws the dashboard, live figures, scenario switch, calculator
  data/data.js      ALL figures and sources: edit numbers here only
  README.md
```

## Run it
- Double-click `index.html`. It works offline, except the font and the live figures.
- Live figures (public debt, GDP, population) are read from the Kenya National Debt Counter
  (`kenyadebtcounter.vercel.app/api/...`). If it can't be reached, the page shows the fallback
  values in `data/data.js`, tagged "offline estimate".

## Update a figure
Open `data/data.js`, change the number or text, save, refresh the browser.
Sections: headline, fiscal, channels, benchmarks, scenarios, calculator, levers.

## Put it online (its own link, separate from the debt counter)
1. Create a new GitHub repo, e.g. `cost-of-weak-governance`, and push this folder.
2. In Vercel: Add New → Project → import that repo → Framework "Other" → Deploy.
   No build command and no environment variables are needed.
3. Optional: add a domain such as `governance.ieakenya.or.ke` in the Vercel project.

## To check before the event
- `headline.gdpKsh` fallback (KSh 18.9 tn): confirm against the latest KNBS figure.
- Intermediate scenario jobs (~4.5 m) is an IEA conversion (16% of ~28.4 m workers in 2035), marked with *.
- Benchmarks: Auditor-General adoption uses 19.5% (midpoint of 18–21%); FDI peers use 1.75% (midpoint of 1.5–2.0%).
