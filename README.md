# KinderESL.com

> **KinderESL.com** is a high-performance, educational resource hub offering free printable PDF worksheets, phonics packs, and ESL vocabulary sets for preschool, kindergarten, and early childhood educators and homeschooling parents across the USA, UK, and Canada.

---

## 🌟 Key Architectural Features

- **Adult / Teacher Positioning**: Thoughtfully designed and worded as an instructional resource for **teachers and parents** (strictly adhering to COPPA, GDPR, and Google AdSense policies regarding non-child-directed content).
- **Modern Tech Stack**: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, SSG (Static Site Generation).
- **Core Web Vitals & Performance**: Lightweight bundle, Zero Cumulative Layout Shift (CLS ~0), Next.js Image optimization (`next/image`), and pre-rendered static HTML routes.
- **E-E-A-T Author Authority**: Complete verified educator profile, credentials list, and author bio box on every resource page.
- **AdSense & Monetization Architecture**:
  - Non-intrusive AdSense units: In-content (1), Sidebar (1), Pre-download (1) separated from the download button.
  - Dedicated `<DownloadButton />` component with built-in hooks for future AdSense Offerwall / Rewarded Ad gating.
  - Compliance pages: Privacy Policy, Cookie Policy (with GDPR/CMP banner), Terms of Use, About Us, Contact Us.
- **SEO & GEO (Generative Engine Optimization)**:
  - Schema.org JSON-LD structured data: `LearningResource`, `CreativeWork`, `Organization`, `WebSite` (with `SearchAction`), `BreadcrumbList`, `FAQPage`, and `Person`.
  - Dynamic `sitemap.xml` and `robots.txt` (specifically permitting `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Pinterestbot`).
  - `/llms.txt` file detailing site purpose, core categories, and resource URLs for AI search engines.
  - 2-3 sentence overview card at the top of each worksheet + Teacher Q&A accordion.
- **Pinterest Optimization**:
  - 1000×1500 vertical pin previews on every worksheet page.
  - One-click "Pin It" button with dynamic URL parameters.
  - Pinterest verification meta tag slot in `src/config/site.ts`.
- **Future Expansion Ready**:
  - `/games`: Interactive HTML5 classroom smartboard games with **zero advertisements** on the game screen and fullscreen mode.
  - `/tr`: Complete Turkish bilingual landing page and `hreflang` / `i18n` metadata architecture.

---

## 📂 Project Structure

```
kinderesl/
├── public/
│   ├── llms.txt                     # AI Search Engine Summary (GEO)
│   ├── images/
│   │   ├── author-avatar.jpg        # Author photo
│   │   └── og-default.jpg           # 1200x630 OpenGraph social image
│   └── worksheets/                  # Downloadable PDFs, previews & Pinterest pins
│       ├── letter-a-tracing-and-phonics/
│       ├── counting-1-to-5-ladybug-party/
│       ├── winter-odd-one-out-visual-discrimination/
│       └── farm-animals-esl-vocabulary-and-tracing/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout, Schema.org org/website, Pinterest verify
│   │   ├── page.tsx                 # Homepage with value prop, hubs, featured & FAQ
│   │   ├── worksheets/
│   │   │   ├── page.tsx             # All worksheets directory
│   │   │   └── [category]/
│   │   │       ├── page.tsx         # Category hubs (literacy, math, etc.)
│   │   │       └── [slug]/page.tsx  # Worksheet detail page with previews, download & pin
│   │   ├── themes/
│   │   │   ├── page.tsx             # All themes directory
│   │   │   └── [theme]/page.tsx     # Theme hubs (winter, farm-animals, etc.)
│   │   ├── preschool-themes/
│   │   │   ├── page.tsx             # 12-month calendar index
│   │   │   └── [month]/page.tsx     # Monthly themes (january to december)
│   │   ├── games/page.tsx           # Classroom Smartboard games (NO ADS)
│   │   ├── tr/page.tsx              # Turkish edition roadmap
│   │   ├── about/page.tsx           # Author profile & pedagogy (E-E-A-T)
│   │   ├── contact/page.tsx         # Teacher request & feedback form
│   │   ├── privacy-policy/page.tsx  # COPPA/GDPR/AdSense compliant privacy policy
│   │   ├── cookie-policy/page.tsx   # Cookie policy
│   │   ├── terms/page.tsx           # Free classroom license & copyright
│   │   ├── robots.ts                # Dynamic robots.txt
│   │   └── sitemap.ts               # Dynamic sitemap.xml
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── WorksheetCard.tsx
│   │   ├── DownloadButton.tsx       # Download component + Offerwall hook
│   │   ├── PinterestShare.tsx       # 1000x1500 Pin + Pin It button
│   │   ├── AdUnit.tsx               # AdSense isolated slots
│   │   ├── AuthorBox.tsx            # E-E-A-T educator box
│   │   ├── CookieConsent.tsx        # GDPR/CMP consent banner
│   │   └── FAQAccordion.tsx         # Q&A + FAQPage schema
│   ├── config/
│   │   └── site.ts                  # Site settings, author info, Pinterest, AdSense
│   ├── data/
│   │   ├── worksheets.ts            # Worksheets catalog & query helpers
│   │   ├── categories.ts            # Category metadata & pedagogical focus
│   │   ├── themes.ts                # Seasonal themes metadata
│   │   └── months.ts                # 12-month preschool calendar data
│   └── types/
│       └── worksheet.ts             # TypeScript definitions
```

---

## 📝 How to Add a New Worksheet (İçerik Ekleme Rehberi)

Adding a new worksheet takes only 2 simple steps:

### 1. Place the Assets in `/public/worksheets/[your-slug]/`
Create a folder inside `public/worksheets/` named after your slug (e.g. `letter-b-tracing-and-phonics`):
- `your-worksheet.pdf` (High-resolution printable PDF)
- `preview-page-1.png` (Page 1 preview image)
- `preview-page-2.png` (Page 2 preview image if multi-page)
- `pinterest-pin.jpg` (1000×1500 vertical pin image)

### 2. Add an Entry to `src/data/worksheets.ts`
Simply copy an existing block in `src/data/worksheets.ts`:

```typescript
{
  id: 'ws-literacy-letter-b',
  title: 'Letter B Tracing & Phonics: Benny the Bear Bakes Bread',
  slug: 'letter-b-tracing-and-phonics',
  category: 'literacy', // 'literacy' | 'math' | 'thinking-skills' | 'esl-vocabulary' | 'shapes-colors'
  categoryName: 'Literacy & Phonics',
  ages: 'Ages 3–5',
  gradeLevel: 'Pre-K & Kindergarten',
  skill: 'Letter B recognition, uppercase & lowercase formation, initial /b/ phonics sound.',
  pages: 1,
  description: 'Detailed description for teachers and parents...',
  quickSummary: '2-3 sentence overview displayed at the top of the page for GEO & AI engines.',
  teacherNote: {
    skillFocus: 'Letter B stroke order and sound association.',
    learningGoal: 'Child identifies uppercase and lowercase B and writes the strokes.',
    teachingTip: 'Say "down, around, and around" for uppercase B.',
    extensionActivity: 'Have students find 3 items in the classroom that begin with B.',
  },
  pdfPath: '/worksheets/letter-b-tracing-and-phonics/benny-bear-letter-b.pdf',
  pdfFileSize: '115 KB',
  previewImages: ['/worksheets/letter-b-tracing-and-phonics/preview-page-1.png'],
  pinterestPinImage: '/worksheets/letter-b-tracing-and-phonics/pinterest-pin.jpg',
  keywords: ['letter b tracing worksheet', 'letter of the week pre-k', 'alphabet printable'],
  theme: 'alphabet', // matches a theme in src/data/themes.ts
  themeName: 'Alphabet & Phonics',
  monthTheme: 'september', // matches a month in src/data/months.ts
  relatedSlugs: ['letter-a-tracing-and-phonics', 'counting-1-to-5-ladybug-party'],
  faqs: [
    {
      question: 'What stroke sequence is taught for letter B?',
      answer: 'Start at the top dot, pull down straight, then make two curved loops to the right.',
    },
  ],
  datePublished: '2025-02-18',
  dateModified: '2025-02-18',
}
```

That's it! Next.js will automatically:
1. Generate the static page at `/worksheets/[category]/[slug]`
2. Add it to the sitemap at `/sitemap.xml`
3. Update the category, theme, and monthly theme hubs
4. Inject all Schema.org `LearningResource` and `BreadcrumbList` tags

---

## 👩‍🏫 How to Update the Author Profile (E-E-A-T)

Open `src/config/site.ts`:

```typescript
author: {
  name: "Sarah Jenkins, M.Ed.", // <-- Change to your spouse's name
  slug: "sarah-jenkins",
  role: "Early Childhood ESL Educator & Curriculum Specialist",
  shortBio: "Preschool & Kindergarten ESL educator with over 10 years of classroom experience...",
  fullBio: "...",
  credentials: [
    "M.Ed. in Early Childhood Curriculum & Instruction",
    "Certified ESL/ELL Early Years Specialist",
    ...
  ],
  avatar: "/images/author-avatar.jpg",
}
```

---

## 🚀 How to Deploy to Vercel

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete KinderESL educational platform"
   git branch -M main
   git remote add origin https://github.com/your-username/kinderesl.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository `kinderesl`.
4. Leave default settings (Next.js preset) and click **"Deploy"**.
5. Your site will be live instantly with global CDN caching and free SSL!

---

## 💰 How to Enable Google AdSense

Open `src/config/site.ts`:
1. Update `client`: Change `ca-pub-XXXXXXXXXXXXXXXX` to your real Google AdSense Publisher ID.
2. Update `slots`: Enter your AdSense slot IDs for `inContent`, `sidebar`, and `preDownload`.
3. Set `enabled: true`.

When ready to enable the AdSense Offerwall (rewarded ads for downloads), toggle `rewardedAdEnabled: true`.

---

## 📌 How to Verify Pinterest

Configure Pinterest domain verification directly in `/admin -> Settings` (stored in Neon Postgres) or via `NEXT_PUBLIC_PINTEREST_VERIFICATION`. The layout injects `<meta name="p:domain_verify" content="..." />`.

---

## 🤖 Bot Bulk Upload API (Token-Authenticated)

External automation scripts and bots can bulk-publish worksheets, manage RSS visibility (`includeInRss`), and toggle draft/published state using the shared admin backend (Neon Postgres + Cloudflare R2 at `cdn.kinderesl.com`).

### Authentication & Rate Limit

- Pass `Authorization: Bearer $ADMIN_API_TOKEN` on all API requests (`crypto.timingSafeEqual` against the `ADMIN_API_TOKEN` environment variable).
- **Rate limit:** **30 requests per minute** per token (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, HTTP `429` with `Retry-After` if exceeded).
- Existing browser password cookie login for `/admin` remains unchanged.

### Upload Strategy on Vercel (Multipart vs. Presigned R2)

Both direct `multipart/form-data` and **Presigned R2 URLs** are supported using the same shared service (`src/lib/worksheet-service.ts`):
- **Direct `multipart/form-data`** (`POST /api/admin/worksheets`): Easiest single-request upload when total payload (`pdf` + `preview` + `pin`) fits comfortably under Vercel's `4.5 MB` serverless request body limit.
- **Presigned Direct-to-R2 Flow** (`POST /api/admin/uploads/presign` → R2 `PUT` → `POST /api/admin/worksheets` JSON): **Chosen for PDFs > 4 MB (up to 20 MB)** so large vector PDFs and high-res images bypass Vercel's serverless body limit and upload directly to `worksheets/<slug>/...` in Cloudflare R2.

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/admin/worksheets` | List all worksheets (`slug, title, subject, published, inRss, updatedAt`) |
| `POST` | `/api/admin/uploads/presign` | Generate 10-minute presigned R2 `PUT` URL (`pdf`, `preview`, or `pin`) |
| `POST` | `/api/admin/worksheets` | Create worksheet (`?upsert=true` updates existing, `?dryRun=true` validates only) |
| `PATCH` | `/api/admin/worksheets/[slug]` | Partial metadata update without files (`includeInRss`, `published`, etc.) |
| `DELETE` | `/api/admin/worksheets/[slug]` | Delete worksheet and clean up its R2 assets |

### `curl` Examples

#### 1. Dry-Run Validation (`?dryRun=true`)
```bash
curl -sS -X POST "https://kinderesl.com/api/admin/worksheets?dryRun=true" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -F "pdf=@./worksheet.pdf;type=application/pdf" \
  -F "preview=@./page-1.png;type=image/png" \
  -F "pin=@./pin.jpg;type=image/jpeg" \
  -F 'metadata={
    "slug": "letter-b-tracing-and-phonics",
    "title": "Letter B Tracing & Phonics: Benny Bear",
    "description": "Free 2-page printable Letter B tracing and beginning sound /b/ worksheet for preschool and ESL learners.",
    "subject": "alphabet",
    "topics": ["animals"],
    "activityTypes": ["tracing", "coloring"],
    "ageBands": ["3-4", "4-5"],
    "vocabulary": ["bear", "ball", "banana"],
    "months": [9],
    "pageCount": 2,
    "published": true,
    "includeInRss": true
  }'
```

#### 2. Create Worksheet (`POST /api/admin/worksheets` — Multipart)
```bash
curl -sS -X POST "https://kinderesl.com/api/admin/worksheets" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -F "pdf=@./worksheet.pdf;type=application/pdf" \
  -F "preview=@./page-1.png;type=image/png" \
  -F "pin=@./pin.jpg;type=image/jpeg" \
  -F 'metadata={"slug":"letter-b-tracing-and-phonics","title":"Letter B Tracing & Phonics: Benny Bear","description":"Free 2-page printable Letter B worksheet for preschool & kindergarten.","subject":"alphabet","ageBands":["3-4","4-5"],"includeInRss":true,"published":true}'
```

#### 3. Large PDF Create via Presigned R2 URL (Up to 20 MB PDF)
```bash
# Step A: Get presigned URL for PDF (and optionally preview / pin)
PRESIGN=$(curl -sS -X POST "https://kinderesl.com/api/admin/uploads/presign" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"letter-b-tracing-and-phonics","kind":"pdf","filename":"letter-b.pdf","contentType":"application/pdf","sizeBytes":6500000}')

UPLOAD_URL=$(echo "$PRESIGN" | jq -r '.uploadUrl')
PDF_URL=$(echo "$PRESIGN" | jq -r '.publicUrl')

# Step B: Upload directly to Cloudflare R2
curl -sS -X PUT "$UPLOAD_URL" -H "Content-Type: application/pdf" --data-binary "@./letter-b.pdf"

# Step C: Commit metadata + asset URLs
curl -sS -X POST "https://kinderesl.com/api/admin/worksheets" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"slug\":\"letter-b-tracing-and-phonics\",\"title\":\"Letter B Tracing & Phonics\",\"description\":\"Free 2-page Letter B phonics printable.\",\"subject\":\"alphabet\",\"pdfUrl\":\"$PDF_URL\",\"pdfSizeBytes\":6500000}"
```

#### 4. Upsert Existing Worksheet (`?upsert=true`)
```bash
curl -sS -X POST "https://kinderesl.com/api/admin/worksheets?upsert=true" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"letter-b-tracing-and-phonics","title":"Letter B Tracing & Phonics (Updated)","description":"Updated 2-page Letter B printable for Pre-K & Kindergarten.","subject":"alphabet","includeInRss":true}'
```

#### 5. List All Worksheets (`GET /api/admin/worksheets`)
```bash
curl -sS "https://kinderesl.com/api/admin/worksheets" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN"
```

#### 6. Update Metadata Only (`PATCH /api/admin/worksheets/[slug]`)
```bash
curl -sS -X PATCH "https://kinderesl.com/api/admin/worksheets/letter-b-tracing-and-phonics" \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"includeInRss":false,"published":true}'
```
