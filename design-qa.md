# AI evaluation module — design QA (2026-11-02)

Source visual truth: `artifacts/evaluation-refine-20261102/approved-reference.png` (the user-selected Image Gen result `exec-ba5a5da1-11d2-479c-b317-e7f7e45b338c`).
Implementation: `http://127.0.0.1:8000/index.html?page=home#mgEvaluationTitle`.
Scope: only the homepage AI科技评价 module. Existing hero, education, loop, strategy, recommendations, footer, navigation and business copy remain intact.

## Evidence and normalization

- Approved raster: 1726 × 911 pixels, PNG.
- Desktop comparison: 1728 × 912 CSS viewport; `artifacts/evaluation-refine-20261102/desktop-final.jpg`, 1713 × 904 captured pixels. The Windows browser capture excludes its scrollbar and slightly scales the viewport; comparison uses matched section/heading state and proportional display, rather than treating this capture-density difference as layout drift.
- Full-view source and implementation were opened together for comparison. An independent visual review of the corrected pair also found no P0/P1/P2 issues.
- Focused review: the three icon/title pairs, talent entry, graph boundary, tags and lower capability columns were inspected in that pair. Browser metrics additionally verify 32px icon slots, 20px library glyphs, 18px/600 headings and common baselines. `keyboard-focus.jpg` records visible keyboard focus.
- Responsive evidence: `mobile-390.jpg`, `mobile-375-capabilities.jpg`, `tablet-768.jpg`, `desktop-1024.jpg` in the same artifact folder. Metrics are in `responsive-checks.json`.
- Final user viewport restored to 1651 × 871 CSS pixels: `desktop-user.jpg`.
- State: normal homepage module, plus talent-card hover/focus and native new-window link.

## Comparison history

1. Initial desktop comparison found the old shared-surface selectors still applying white inner-card/tag backgrounds. This weakened the approved unboxed columns and tags.
2. Scoped the replacement stylesheet to the research root, loaded it after shared surfaces, removed the legacy title classes, and rechecked normal, hover, focus and responsive rules. Corrected evidence is `desktop-final.jpg`: neutral light tags, transparent columns with thin dividers, no title ribbons.
3. Softened the network opacity and made the text entry 16px. The regenerated transparent mesh is clipped at the card's right and bottom edges, fades toward the copy and does not obscure text.
4. Rechecked desktop and four responsive widths after these changes. No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- **Typography:** existing CJK system font stack preserved. Compact dark 18px/600 card titles, 16px desktop body / 15px mobile body, readable 14px support text. The generated reference is an approximate raster; existing homepage type/container tokens are retained instead of globally enlarging the page. All heading pairs align vertically.
- **Spacing/layout:** wide talent card over two peer cards; 24px desktop gap, 28px padding, consistent 12px corners. Capability content uses two columns with a quiet vertical divider, becoming stacked with a horizontal divider at 375px. No document/copy/column overflow at 375, 390, 768 or 1024px.
- **Colors/tokens:** restrained ice-blue-to-white card gradients, pale icon backplates, dark slate titles, light tags, fine neutral borders and minimal shadow. Brand blue remains on glyphs and the visible text entry. Original surrounding homepage background is intentionally preserved.
- **Images/icons:** new original-alpha 1942 × 809 PNG mesh, checked on the real light card; no visible dark matte, fringe noise, avatar or image frame. Four official Tabler SVGs are vendored unchanged with MIT license and pinned provenance. No handcrafted replacement icons or diagrams.
- **Copy/content:** source verification confirms all original module wording and the existing talent URL/target/rel/ARIA attributes are unchanged. The approved visible 查看人才图谱 entry is the only added text. All homepage HTML outside this module and its stylesheet import is byte-identical after newline normalization.

## Behavior and validation

- Native keyboard Tab reaches the talent card; visible blue focus outline is present.
- Clicking the card opens a new tab at `https://vip.itic-sci.com/talent/index/`; the test tab was closed afterward.
- No extra nested link/button was introduced; the lower cards remain static articles.
- Decorative image has empty alt text, explicit dimensions, lazy loading and pointer-events disabled.
- Browser error/warning log empty during final checks.
- Source/local HTTP verification: 15 checks passed across 7 runtime files, including unchanged surrounding HTML, exact asset bytes, SVG/license presence and responsive metrics. See `artifacts/evaluation-refine-20261102/source-checks.json`.
- Temporary viewport overrides were reset. No motion was added; reduced-motion users retain an instantaneous hover-state change.

## Implementation checklist

- [x] Approved icon/title and surface treatment implemented.
- [x] Relationship mesh enters from card edges and stays subordinate to copy.
- [x] Original wording, native links and surrounding modules preserved.
- [x] Desktop, tablet, phone, focus and native link checked.
- [x] Asset provenance and stylesheet cache version updated.
- [x] No P0/P1/P2 findings remain.

## Follow-up polish

Raster-node topology is illustrative and need not exactly reproduce every connection in the generated mock. Browser antialiasing differs from the reference raster; the runtime SVGs remain sharp at any scale.

final result: passed
