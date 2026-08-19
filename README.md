# saanvi

Private family planning dashboard for Saanvi's Fall 2027 university applications.

**This is not a public document.** Treat the URL as the only access control.

Live site: https://mailtovmat.github.io/saanvi/

Tabs: Dashboard · Progress · Calendar · Docs-status · G-Drive · Universities · Financial Aid · People.

Sources for a future agent: `C:\Amogh-Saanvi-College\SAANVI-DASHBOARD-SOURCES.md`.

The vault now lives in Saanvi's Google Drive folder, not on the local PC.

Every page load, browser refresh, and the blue **Refresh** button reloads **Tasks** and **Documents Needed** from **saanvi-application-plan**, and rebuilds the G-Drive file tree from the live vault (markdown notes stay hidden). The spreadsheet is shared as anyone-with-link so this static site can read it — there is no Google key in the page. Universities, aid, people, and the gantt still come from the committed JS files.

Edit `js/data.js` only for those remaining static pages, or as a fallback if Refresh cannot reach the sheet.
