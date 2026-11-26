# KinderESL clip-art library

176 original KinderESL line drawings (cute, clean coloring-book style, Andy the Ant look): black ink (`#1F2933`) on a transparent background, longest side 1024px. Made for the picture flashcard maker, picture bingo, I Spy maker, and other tools.

## Layout

- `public/clipart/<theme>/<slug>.png` is served at `/clipart/<theme>/<slug>.png`.
- 12 vector items also have `<slug>.svg` next to the PNG (Christmas icons, snowflake, shapes).
- `src/data/clipart-manifest.json` lists every item. Paths in `file` and `svg` are relative to `public/clipart`.
- `src/lib/clipart.ts` is the typed helper. `scripts/validate-clipart.mjs` checks the manifest against the files.

Each item lives in one primary theme folder. Secondary themes go in `tags` (for example `penguin` is in `animals` and tagged `winter`).

| Theme | Items |
|---|---|
| animals | 10 |
| body | 7 |
| christmas | 7 |
| classroom | 12 |
| clothes | 8 |
| fall | 8 |
| farm | 9 |
| feelings | 6 |
| food | 11 |
| halloween | 8 |
| helpers | 6 |
| household | 8 |
| nature | 8 |
| routines | 12 |
| shapes | 4 |
| spring | 8 |
| summer | 8 |
| transport | 8 |
| valentines | 8 |
| weather | 8 |
| winter | 12 |

## Manifest fields

`id`, `name` (English word to show on a card), `theme`, `tags`, `cvc` (`false` or `{ "word": "cat" }`), `file`, `svg` (optional), `width`, `height`, `style` (`lineart`), `variantOf` (optional).

`variantOf` marks a near-duplicate of another item (`hen` of `chicken`, `kit` of `bag`, `boots` of `boot`, `heart-arrow` of `heart`). Don't put both in one bingo or I Spy set.

## Helper API (`@/lib/clipart`)

```ts
getClipart('cat')                                  // ClipartItem | undefined
getClipartByTheme('winter')                        // variants skipped by default
getClipartByTheme('winter', { includeVariants: true })
listClipart({ includeVariants: false })
listThemes()                                       // [{ theme, count }]
clipartUrl(item)                                   // '/clipart/animals/cat.png'
clipartUrl(item, 'svg')                            // throws if the item has no SVG
await fetchClipartBytes(item, baseUrl?)            // Uint8Array for pdf-lib
```

pdf-lib example:

```ts
const png = await pdfDoc.embedPng(await fetchClipartBytes(getClipart('cat')!));
page.drawImage(png, { x, y, width, height: width * (item.height / item.width) });
```

## Add a drawing

1. Draw one object as clean black line art on white, at least 1024px on the long side, no text. For generated art, clean it first (grayscale, white background).
2. Trim to the ink, add about 6% even padding, turn white into transparency, scale the longest side to 1024px, and use ink `#1F2933`.
3. Save as `public/clipart/<theme>/<slug>.png` (kebab-case). For vector art, add a matching `.svg`.
4. Add a record to `src/data/clipart-manifest.json`. For a new theme, also add it to `ClipartTheme` in `src/lib/clipart.ts`.
5. Run `node scripts/validate-clipart.mjs`.

## License

Original KinderESL art for kinderesl.com worksheets and tools. Don't resell it as standalone clip art.
