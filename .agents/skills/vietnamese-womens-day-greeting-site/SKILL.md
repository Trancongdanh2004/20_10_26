---
name: vietnamese-womens-day-greeting-site
description: Build a vivid, animated, static single-page website (pure HTML, CSS, JavaScript, no backend) to celebrate Vietnamese Women's Day on October 20, featuring a romantic love-wish card for a partner and a random "small meaningful gifts" gift box. Use when asked to create a greeting/tribute page for 20/10 with rich visual effects, static data, and Vietnamese-language content.
---

# Vietnamese Women's Day (20/10) Greeting Website

## 1. Goal

Create a beautiful, lively, emotionally warm tribute website for **Vietnamese Women's Day (Ngày Phụ nữ Việt Nam, October 20)**. The page must feel festive and polished: rich motion, soft gradients, floating flowers, interactive greeting cards, and smooth scroll storytelling. It is a **static site**: all content lives in a local JavaScript data file. No server, no database, no build step required.

**Primary use case:** the site is mainly a gift from a boyfriend/husband to his girlfriend/wife (and can also be reused for mothers, sisters, friends). Its two signature features are:
1. A **romantic love-wish card** (thiệp lời chúc người yêu) that is personalized with the recipient's name and the sender's name, with random sweet wishes.
2. A **random small meaningful gifts box** (hộp quà nhỏ ý nghĩa), where the visitor opens virtual gifts and gets a random surprise each time (coupons, promises, love letters, mini games, flower of the day, etc.).

Everything is virtual and static; gifts are "digital love tokens" that the sender can later redeem in real life.

## 2. Hard Constraints

- Languages: **HTML5, CSS3, vanilla JavaScript (ES6+)** only. No frameworks, no bundlers, no npm install required to run.
- The site must work by **opening `index.html` directly** in a browser (double-click). Do not use ES module `import`/`export` or `fetch()` for local files, because both break on `file://`. Load scripts with plain `<script src="...">` tags in the right order, and expose data as a global (e.g. `window.SITE_DATA`).
- **Static database**: store all content in `js/data.js` as plain JS objects/arrays. No external API calls for content.
- Allowed external resources: Google Fonts and, optionally, a CDN animation helper (e.g. a tiny confetti or GSAP build). Everything must still degrade gracefully if the CDN fails (the page must remain readable and functional without it). Prefer writing effects by hand in canvas/CSS.
- All user-facing text is in **Vietnamese** with correct diacritics. Code, comments, and file names are in English.
- Do not use real photos of identifiable people. Use illustrations, SVG, emoji-free vector flowers, gradients, or placeholder-free decorative art drawn with CSS/SVG/canvas.

## 3. File Structure

```
/
├── index.html
├── css/
│   ├── base.css          # reset, tokens, typography
│   ├── layout.css        # sections, grid, responsive
│   └── effects.css       # keyframes, glows, transitions
├── js/
│   ├── data.js           # static database (window.SITE_DATA)
│   ├── petals.js         # falling petals canvas
│   ├── confetti.js       # confetti burst
│   ├── lovecard.js       # flip card, hearts, love letters
│   ├── giftbox.js        # weighted random gifts, collection drawer
│   ├── main.js           # init, rendering, interactions
│   └── reveal.js         # scroll-reveal + counters
└── assets/               # optional SVGs
```

Keep files small and readable. Comment non-obvious logic briefly.

## 4. Static Data Schema (`js/data.js`)

```js
window.SITE_DATA = {
  event: { name: "Ngày Phụ nữ Việt Nam", date: "20/10", year: 2026 },
  hero: { title: "...", subtitle: "...", cta: "Gửi lời chúc" },
  wishes: [ { id, category, text } ],          // 12+ wishes, categories: mẹ, bà, chị em, cô giáo, đồng nghiệp, bạn gái/vợ
  quotes: [ { text, author } ],                // 6+ original or public-domain style quotes; avoid fabricating attributions
  history: [ { year, title, description } ],   // short factual timeline of Vietnam Women's Union (founded 20/10/1930)
  heroines: [ { name, era, summary } ],        // e.g. Hai Bà Trưng, Bà Triệu, Nguyễn Thị Minh Khai, Võ Thị Sáu, Nguyễn Thị Định
  qualities: [ { icon, title, description } ], // 6 cards: Dịu dàng, Kiên cường, Tảo tần, Sáng tạo, Thông minh, Yêu thương
  stats: [ { label, value, suffix } ],         // decorative counters (clearly framed as symbolic, not factual claims)
  gallery: [ { title, gradient, caption } ],   // CSS/SVG art cards, no photos
  flowers: [ { name, meaning, colors } ],      // hoa hồng, hoa sen, hoa cúc, hoa tulip, hoa lan
  loveWishes: [ { id, tone, text } ],          // 25+ romantic wishes; tones: ngọt ngào, hài hước, sâu lắng, lãng mạn, trưởng thành. Use {name} and {sender} placeholders
  loveLetters: [ { id, title, body } ],        // 6+ short heartfelt letters (3-6 sentences), supports {name}/{sender}
  gifts: [
    {
      id, type, rarity,                        // type: "coupon" | "promise" | "letter" | "flower" | "playlist-idea" | "date-idea" | "mini-game" | "compliment"
      title, description, icon,                // icon = key of an inline SVG/CSS icon, not an emoji
      redeemText                               // how the sender will fulfill it, e.g. "Đổi vé: 1 buổi hẹn hò do em chọn"
    }
  ],                                           // 24+ gifts across all types
  giftRarity: { common: 60, rare: 30, legendary: 10 } // weighted random percentages
};
```

Gift ideas (write the final Vietnamese copy yourself, keep it sweet and sincere, never cheesy to the point of cringe):
- **Coupons:** "Phiếu một cái ôm vô thời hạn", "Phiếu em chọn phim, anh không than phiền", "Phiếu một bữa tối anh nấu", "Phiếu massage 15 phút", "Phiếu được hờn 5 phút rồi anh xin lỗi".
- **Promises:** "Hứa luôn nghe em kể hết câu chuyện", "Hứa nhắc em uống nước mỗi ngày".
- **Date ideas:** a random date plan (cafe sách, đi dạo hoàng hôn, làm gốm, picnic, xem phim ở nhà).
- **Compliments:** specific, genuine lines about her character, not just looks.
- **Flower of the day:** a drawn SVG flower with its meaning.
- **Mini-games (legendary):** "Đoán xem anh yêu em bao nhiêu" slider that always ends sweetly, or a love-quiz with 3 questions where every answer is correct.
- **Letters:** a longer love letter that opens with an envelope animation.

Let the sender customize the content easily by editing `data.js` only; add a clearly commented "EDIT ME" block at the top with `senderName`, `defaultRecipientName`, `specialDate` (anniversary, optional), and a `personalNote` field.

Rules for content:
- Historical facts must be accurate and modest. The Vietnam Women's Union was founded on **October 20, 1930**. If unsure about a fact, leave it out rather than invent it.
- Wishes must be warm, sincere, varied in tone (formal, playful, heartfelt). Never use stereotypes or patronizing language.

## 5. Page Sections (in order)

1. **Hero** — Full-viewport. Animated gradient background (rose, coral, soft gold, lavender). Large display title with a staggered letter-by-letter reveal. A glowing "20/10" badge with a pulsing ring. Primary CTA scrolls to the greeting generator. Subtle parallax on mouse move for decorative flowers.
2. **Countdown / Today banner** — If today is 20/10 show "Hôm nay là ngày của bạn!" with a confetti burst on first load. Otherwise show a live countdown to the next 20/10. Compute using `new Date()` in the user's local time.
3. **Qualities** — 6 glassmorphism cards with hover tilt (3D transform), animated gradient borders, and icon float.
4. **Greeting Card Generator (interactive centerpiece)** — Inputs: recipient name, sender name (optional), category select (người yêu, mẹ, bà, chị em, cô giáo, đồng nghiệp), card theme (3–5 color themes). Button "Tạo thiệp" picks a random matching wish from `SITE_DATA.wishes` (or `loveWishes` when category is "người yêu"), renders an animated card with a typewriter effect, flower bloom animation, and confetti. Buttons: "Chúc mừng khác" (re-roll without repeating the last wish), "Sao chép lời chúc" (Clipboard API with fallback), "Tải thiệp" (render card to canvas and download PNG using canvas only, no library required). Persist the last-entered names in `localStorage` (wrapped in try/catch).
4b. **Love Card (thiệp tình yêu)** — A dedicated, more romantic section placed right after the generator, or merged with it when the category is "người yêu". Design: a 3D flip card (front: envelope or heart seal with a pulsing glow; click to open; back: personalized wish + signature "Yêu em, {sender}"). Include floating hearts rising behind the card, a handwritten script font for the signature, and a slow glowing gradient border. If `specialDate` is set, show "Đã bên nhau X ngày" with a counting-up number. Include a "Đọc thư tình" button that opens a random `loveLetters` entry in a modal with an envelope-unfolding animation and typewriter text.
4c. **Random Gift Box (hộp quà nhỏ ý nghĩa)** — Show 3 to 6 beautifully drawn (SVG/CSS) wrapped gift boxes with ribbons that gently bob. The visitor clicks a box to open it: lid pops with a bounce, light rays and sparkles burst out, confetti fires, and a gift card slides up showing the gift title, description, rarity badge (common/rare/legendary with different glow colors) and `redeemText`. Rules:
   - Selection is **weighted random** by `giftRarity`, never repeating a gift already opened in this session (reset when all are opened).
   - A "Mở thêm quà" button reshuffles the boxes; a "Quà đã nhận" drawer lists collected gifts (stored in `localStorage`, try/catch) with a counter such as "Đã nhận 5/24 món quà", so the visitor is motivated to collect them all.
   - Legendary gifts get an extra-special effect: full-screen golden glow, heart rain, and a short vibration (`navigator.vibrate`) on supported devices.
   - A "Chụp màn hình để đổi quà" hint under each opened gift; optionally a "Tải phiếu quà" button that renders the gift as a PNG via canvas.
   - Mini-game gifts open a small interactive widget inside the gift card (keep each under ~60 lines of JS).
5. **Heroines timeline** — Vertical timeline with scroll-linked line drawing and cards that slide in from alternating sides.
6. **Flower language** — Horizontal carousel or grid of flowers with meanings; hover/click makes the flower bloom (SVG/CSS animation) and releases petals.
7. **Quotes slider** — Auto-rotating, fade/slide transitions, pause on hover, keyboard accessible controls.
8. **Closing** — Large heartfelt message, a "Thả hoa" button that triggers a full-screen petal and confetti shower, footer with a small credit line.

A sticky, translucent nav with smooth scrolling and active-section highlighting is welcome. Include a mute-free design: **no autoplaying audio**. If music is added, it must be opt-in via a button and use a user-provided local file.

## 6. Visual Design System

- **Palette (CSS variables in `:root`)**: rose `#ff4d8d`, coral `#ff7a6b`, blush `#ffd6e0`, lavender `#b79cff`, gold `#ffcf6e`, cream `#fff7f2`, deep plum `#3a1030` for text/dark accents. Allow a dark-plum "night" hero variant if it looks better.
- **Typography** (Google Fonts, all with the `vietnamese` subset): display serif such as *Playfair Display* or *Be Vietnam Pro* for headings, *Dancing Script* or *Pacifico* for accent script, *Be Vietnam Pro* for body. Verify diacritics render correctly at every weight used.
- **Style**: soft glassmorphism, large radii (20–32px), layered shadows, gradient text for key words, generous whitespace. Avoid generic templated look; give the page a distinct, elegant, feminine-but-confident identity.
- Use CSS custom properties for colors, spacing, radii, and easing so themes are easy to tweak.

## 7. Effects Catalog (implement with care and polish)

- **Falling petals**: full-screen `<canvas>` with 40–80 petals, each with random size, rotation, sway (sine drift), and depth-based speed/blur. Pointer-events none, sits behind content. Pause when the tab is hidden (`visibilitychange`).
- **Confetti burst**: canvas particle system with gravity, drag, rotation, and color variety; triggered on load (if 20/10), on card generation, and on "Thả hoa".
- **Hero text reveal**: split text into spans, animate with staggered `transform`/`opacity`.
- **Animated gradient mesh** background using layered radial gradients with slow keyframe motion.
- **Floating blobs / sparkles**: CSS-only, `will-change: transform`.
- **Scroll reveal** with `IntersectionObserver` (fade-up, scale-in, slide-in variants). Unobserve after reveal.
- **Number counters** that count up when visible.
- **3D tilt cards** following the pointer using `perspective` and `rotateX/Y`, with smooth reset.
- **Cursor sparkle trail** (desktop only, throttled, small particle count).
- **Typewriter effect** with blinking caret for wishes.
- **SVG flower bloom**: path-based petals scaling/rotating from center with staggered delays.
- **Button micro-interactions**: ripple, magnetic hover, glow pulse.

Motion quality rules: use `transform` and `opacity` for animation, ease with `cubic-bezier` curves, keep durations 300–900ms for UI and longer for ambient loops. Avoid janky layout-thrashing animations.

## 8. Performance & Accessibility

- Target smooth 60fps on mid-range phones. Cap particle counts based on `window.innerWidth`, and use `requestAnimationFrame` with delta time.
- Honor **`prefers-reduced-motion: reduce`**: disable petals, confetti, parallax, tilt, and trail; keep content fully usable with simple fades.
- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1`, logical heading order, `alt`/`aria-label` where needed, visible focus styles, and color contrast of at least WCAG AA for text.
- All interactive elements reachable and operable by keyboard. Slider controls need labels and `aria-live="polite"` for rotating quotes.
- Include `<meta name="viewport">`, `lang="vi"`, a descriptive `<title>`, meta description, and Open Graph tags.
- Fully **responsive**: mobile-first, test mentally at 360px, 768px, 1280px, and 1920px widths. No horizontal scroll.

## 9. Implementation Workflow

1. Write `data.js` first with rich, accurate Vietnamese content.
2. Build the HTML skeleton and CSS tokens; get static layout correct at all breakpoints.
3. Add scroll reveal and core interactions (generator, slider, timeline).
4. Add canvas effects (petals, confetti) and polish micro-interactions.
5. Add reduced-motion handling, accessibility pass, and performance pass.
6. Run the checklist below before delivering.

## 10. Definition of Done (Checklist)

- [ ] Opens and works by double-clicking `index.html`, with no console errors.
- [ ] No frameworks, no backend, no external content API; all content from `js/data.js`.
- [ ] All Vietnamese text has correct diacritics; fonts include the Vietnamese subset.
- [ ] Hero, qualities, generator, timeline, flowers, quotes, and closing sections all present.
- [ ] Greeting generator works: random wish, typewriter, confetti, copy, and PNG download.
- [ ] Love card works: personalized names, flip/open animation, floating hearts, random love letter modal.
- [ ] Gift box works: weighted random gifts, no repeats in a session, rarity effects, collection drawer with persistence, legendary effect.
- [ ] All romantic and gift content is editable from `js/data.js` alone, with an "EDIT ME" block at the top.
- [ ] Romantic tone is sincere and respectful; no stereotypes, no pressure, no cringe overload.
- [ ] Petals and confetti run smoothly and stop when the tab is hidden.
- [ ] `prefers-reduced-motion` respected.
- [ ] Responsive on mobile, tablet, and desktop with no horizontal scroll.
- [ ] Keyboard navigable, visible focus, AA contrast.
- [ ] Historical statements are accurate; no invented quotes attributed to real people.
- [ ] Code is clean, commented where needed, and organized per the file structure above.

## 11. Deliverable

The complete project folder with all files above, plus a short `README.md` (in English) explaining how to open the site, where to edit content in `js/data.js`, and how to change theme colors in `css/base.css`.
