# EduSpark — Learn Today, Lead Tomorrow.

**Oasis Infobyte · Web Development & Designing · Level 1 · Task 1: Landing Page**

## Objective

Design an original, professional, responsive landing page for an approachable online learning platform concept. EduSpark introduces three skill areas and sample learning journeys without claiming to provide live courses, purchases, or enrollment.

## Technology

HTML5 and CSS3 only. No JavaScript, frameworks, libraries, external fonts, build tools, backend, database, or installation. Illustrations and icons are original CSS shapes and inline SVG, so the page has no external asset dependencies.

## Features

- Sticky navigation: Home, Courses, Features, About, Contact, and Get Started.
- Two-column hero with the requested headline, course CTA, and static learning dashboard.
- Three course cards: Web Development, UI/UX Design, and Python Programming.
- Four learning benefits and a three-step “How It Works” journey.
- About section explaining the concept and internship purpose.
- Three explicitly illustrative learning experiences; no invented testimonials or learner statistics.
- Final course CTA, quick links, and a clearly identified contact placeholder.
- Blue/navy/purple palette, fluid typography, hover states, and responsive grids.

The course links jump to their matching sample paths. Explore Courses and Get Started jump to Courses; Why EduSpark? jumps to Features. The dashboard is a non-interactive illustration. Its 25% progress represents the displayed example lesson (01/04), not a real learner record.

## Folder structure

```text
WebDev-L1-LandingPage/
├── index.html
├── styles.css
├── README.md
└── screenshots/
    ├── desktop.png
    └── mobile.png
```

## Run locally

1. Clone the existing repository:
   `git clone https://github.com/VarmithaYogananthan/OIBSIP.git`
2. Check out the existing review branch:
   `git checkout feat/level-1-web-development`
3. Open `WebDev-L1-LandingPage/index.html` in a modern browser. The page needs no server and works offline.

If your browser or organization blocks local files, optionally serve the repository with `python3 -m http.server 8000`, then visit `http://localhost:8000/WebDev-L1-LandingPage/`. Python is optional and is not used by the website.

## Responsive design

CSS Grid and Flexbox adjust the desktop hero, course grid, feature cards, learning journey, and footer. At smaller widths, navigation remains visible on two rows; no menu script or hidden checkbox is needed. Cards stack on phones and the learning dashboard scales to the available space. Content is capped at 1160px for comfortable reading on wide screens.

Chromium verification covers 320, 375, 390, 768, 1024, 1440, and 1920 CSS-pixel widths. See the landing page update in [TESTING.md](../TESTING.md) for actual results and limitations.

## Screenshots

- [Desktop full-page capture](screenshots/desktop.png) — 1440 × 1000 viewport.
- [Mobile full-page capture](screenshots/mobile.png) — 390 × 844 viewport.

To refresh: open the page in Chromium, use developer tools to set the relevant viewport, return to the top, and choose **Capture full size screenshot**. Replace the PNGs above using the exact filenames. Full-page image height extends beyond the viewport.

## Accessibility

Semantic header, navigation, main, sections, articles, ordered steps, and footer; one primary heading; descriptive link labels; keyboard-visible focus outlines; skip link; CSS anchor offsets for the sticky header; and reduced-motion support. Decorative SVGs and shapes are hidden from assistive technology. Main text and controls use dark navy or blue on light backgrounds. No content relies on animation or JavaScript.

## Known limitations

- This is a static demonstration; no lessons, login, enrollment, payment, or contact form are implemented.
- Contact is intentionally `[Add your email]`. Replace it with verified information before public use; no real support address has been invented.
- The dashboard and learning journeys are illustrations, not an interactive application or student endorsements.
- Direct local-file browser navigation was blocked by the testing environment’s Chromium policy. Browser checks used a local static server with JavaScript disabled; relative local asset references were inspected. Ordinary unrestricted browsers can open the self-contained HTML/CSS files directly.
- Firefox, Safari, physical-device, and screen-reader testing have not been performed.

## Internship submission guidance

1. Review the page at desktop and mobile sizes and confirm all anchors.
2. Replace the contact placeholder only if you have a verified address to share.
3. Include the repository branch/PR link and refreshed screenshots in your submission.
4. In a demonstration, show the hero, course-to-path links, responsive navigation, and all page sections; explain that this is an HTML/CSS-only concept.
5. Keep Task 2 and Task 3 unchanged. Submit changes through existing PR #1; do not merge automatically.
