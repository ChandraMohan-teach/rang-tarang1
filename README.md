# Rang Tarang Website

This folder is a complete, ready-to-run copy of your website.

## 1. One-time setup

You'll need **Node.js** installed on your computer first (it includes `npm`,
which is used below). If you don't have it, download it from
https://nodejs.org (the "LTS" version is fine) and install it like any
normal program.

## 2. Open this folder in VS Code

`File → Open Folder...` and select this `rang-tarang` folder.

## 3. Install the project's dependencies

Open a terminal inside VS Code: `Terminal → New Terminal`, then run:

```
npm install
```

This only needs to be done once (or again later if you add new packages).

## 4. Run the website

```
npm run dev
```

The terminal will print a link, usually `http://localhost:5173` — open
that in your browser to see the live site. Leave the terminal running
while you're working; press `Ctrl+C` in the terminal to stop it.

Any change you save in `src/RangTarang.jsx` will show up in the browser
automatically.

## 5. Add your EmailJS details

Open `src/RangTarang.jsx` in VS Code, and use `Ctrl+F` (or `Cmd+F` on Mac)
to search for:

```
EMAILJS_SERVICE_ID
```

Replace the three placeholder values (`YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`,
`YOUR_PUBLIC_KEY`) with the real ones from your https://www.emailjs.com
account, so the "Enroll now" form emails acm16082005@gmail.com correctly.

## Project structure

```
rang-tarang/
├── index.html          ← the basic page shell the browser loads first
├── package.json        ← lists the packages the project needs
├── vite.config.js       ← config for the dev server/build tool (Vite)
└── src/
    ├── main.jsx          ← tiny file that starts up the React app
    └── RangTarang.jsx    ← your actual website: layout, design, content,
                             animations, and the enrollment form
```

You'll only ever need to edit `src/RangTarang.jsx` day to day — everything
else is just plumbing that makes `npm run dev` work.

## Putting the site online later

When you're ready to make this live on the internet (not just on your own
computer), run:

```
npm run build
```

This creates a `dist` folder containing the finished, optimized website
files. Those are the files you'd upload to a hosting service (e.g.
Netlify, Vercel, or your own web host).
