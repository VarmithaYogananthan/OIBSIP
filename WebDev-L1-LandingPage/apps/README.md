# EduSpark — Separate Learner & Admin Web App Demos

These two frontend demos extend the **Oasis Infobyte Level 1 landing-page project** without replacing the original HTML/CSS-only landing page.

## Open locally

From the repository root run:

```bat
python -m http.server 8000
```

Then open:

- Landing page: `http://localhost:8000/WebDev-L1-LandingPage/`
- Learner app: `http://localhost:8000/WebDev-L1-LandingPage/apps/user/`
- Admin app: `http://localhost:8000/WebDev-L1-LandingPage/apps/admin/`

The landing page has direct buttons/cards to both experiences. The apps share `apps/store.js` and `apps/app.css`, and each has its own HTML and JavaScript. No build system or server database is necessary.

## Learner app — functional demo

- Enter a display name and demo email to create/select a **local learner profile**. This is not an authentication process.
- Overview: personal course stats, featured course previews and announcements.
- Explore: browse, search and filter available courses, join a course.
- My Learning: open enrolled courses, check/uncheck lessons, track progress.
- Announcements: read notices published in the same-browser admin demo.
- Profile: update name or switch demo learner. Returning to the same demo email reopens local progress.

## Admin app — functional demo

- Admin overview showing local catalog, learner and enrollment totals.
- Course management: create, edit, show/hide and delete courses. Courses and lessons added here appear on the same-browser learner demo.
- Learner table: local learner profiles, enrollment/progress summaries and delete with confirmation.
- Announcements: publish and delete demo notices.
- Reports: active courses, completed lesson totals, average progress and CSV export.
- Settings: reset all local demo data to its sample state, with confirmation.

## Storage, privacy & security limitations

**These are educational client-side prototypes only.** Anyone can navigate to the Admin Demo; it has **no passwords, real authentication, authorization, protected APIs, backend, database, payment integration or multi-device sync**. The demo name/email is not identity verification. Do not enter real or confidential data.

Both apps store local state in the current browser's `localStorage`; a restricted browser may use in-memory state only. Course edits, learner enrollments and admin updates appear across tabs/pages on the **same origin and browser profile**. They do not appear on other computers or browsers. Use the local HTTP server rather than relying on inconsistent `file://` storage behavior.

Before real deployment, implement secure server authentication, hashed passwords, role-based API authorization, user ownership checks, database persistence, input validation, CSRF/session protection, rate limiting, audit logs, privacy policy and backup/recovery.

## Testing

A Playwright cross-app test script is included:

```sh
python tests/eduspark-apps.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
```

The test covers signup demo, course search and filters, join/lesson progress, admin learner metrics, course creation/edit/visibility/deletion, announcement sync, reports and CSV, responsive widths and reset. **Test script added; it must be executed in a local Chromium/Playwright environment to confirm runtime behavior.** The earlier general `TESTING.md` reports were recorded before adding these two web apps.

All landing-page course information remains illustrative; this is not a real educational service.
