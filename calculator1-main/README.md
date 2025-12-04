# calculator1 (local copy)

This folder contains a small collection starter for calculators.

Files:
- `index.html` — Home page with links to calculator types.
- `margin-calculator.html` — Improved margin & revenue calculator UI.

Preview locally (Windows PowerShell):

```powershell
cd "\\fs1\folderredirection$\josh\Desktop\delete\copi-git\calculator1"
# Open home page in default browser
Start-Process index.html
# Or open the calculator directly
Start-Process margin-calculator.html
```

Notes:
- The calculator uses Tailwind CDN and `localStorage` to persist values.
- Exchange rate is fetched from `https://api.exchangerate-api.com` (falls back to default if unreachable).

If you want, I can:
- Push these changes back to your GitHub repo (requires remote credentials),
- Add more calculator pages (loan, VAT, ROI), or
- Improve styling/theme (dark mode).