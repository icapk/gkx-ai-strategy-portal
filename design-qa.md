# Homepage evaluation feedback — design QA (2026-11-02)

## Source and scope

The visual foundation is the user-approved `exec-ba5a5da1-11d2-479c-b317-e7f7e45b338c` preview, saved in `artifacts/evaluation-refine-20261102/approved-reference.png`.
The latest source of truth is the user's browser feedback on the deployed version `2331b0e`: retain the edge-entering relation mesh, make talent nodes solid person silhouettes, reduce bottom whitespace in the two evaluation articles, and make the static 生成报告 step clearer.
All other homepage content and behavior stay unchanged.

## Evidence and comparison state

- Baseline: `artifacts/evaluation-refine-20261102/desktop-user.jpg`.
- Updated evaluation: `artifacts/evaluation-feedback-20261102/evaluation-desktop.jpg`.
- Updated strategy: `artifacts/evaluation-feedback-20261102/strategy-desktop.jpg`.
- Matched desktop viewport: 1651 × 871 CSS pixels, normal module view; the Windows viewport screenshots are proportionally captured at 1636 × 863 pixels. Baseline and updated screenshots use the same capture density. Native browser antialiasing is distinct from the original Image Gen PNG, not a change to production fonts.
- The baseline and updated screenshots were opened together for comparison, including a focused pass over the three person glyphs, card bottoms, heading rows, dividers and generation indicator. Independent desktop review also passed with no P0/P1/P2 findings.
- Browser metrics: `artifacts/evaluation-feedback-20261102/browser-checks.json`.

## Comparison history and fixes

1. The earlier blue title bars and nested inner cards were replaced with compact library icons, dark headings, light gradients and simple columns, as approved. The previous release's four responsive widths and native talent link were verified; that history remains in `artifacts/evaluation-refine-20261102/`.
2. The user found that the abstract dot mesh lacked talent meaning. A three-node outline-person trial was rejected as too linear. The final asset uses three small **solid round-head/shoulder silhouettes** with very pale circle backgrounds. Network lines, cropped edge continuations and leftward fade remain.
3. Removed the articles' 300px minimum-height and capability rows' 72px minimum-height. Desktop article heights are now approximately 251.3px, with measured content-to-bottom space approximately 28.7px, matching the intended 28px padding.
4. The static output indicator now uses 14px/600 brand-blue text and a 36px official arrow glyph in a 76px flow area. It remains a div with a default cursor; the separate report link is unchanged.
5. Rechecked the final desktop view after all corrections. The glyphs remain subordinate to the copy; no overlap, clipping of text, horizontal overflow or P0/P1/P2 issues remain.

## Required fidelity surfaces

- **Fonts/typography:** existing system CJK stack, 18px/600 card headings and current body sizes are retained. Card and capability headings maintain their original alignment and hierarchy.
- **Spacing/layout rhythm:** the same wide talent card and two-column lower row remain. The article bottoms now follow actual content rather than fixed height floors; dividers and labels retain their spacing. The rest of the homepage layout is unchanged.
- **Colors/tokens:** quiet ice-blue-to-white cards, pale icon backplates, brand-blue links/flow cue and slate copy. The relation graph retains low opacity and a left-side fade.
- **Image quality:** original-alpha 1944 × 809 PNG, checked on the actual light card. Three face-free solid person symbols are recognizable at the final small size. No photorealistic portraits, dark plaques, thick glass coins or new background frame. Original generated pixels are copied without image post-processing. Existing pinned official Tabler icon SVGs remain unchanged.
- **Copy/content:** all business wording, native links, ARIA attributes and surrounding HTML are unchanged. Source verification permits only the decorative image tag and two stylesheet cache versions in the homepage HTML.

## Behavior and test coverage

- Desktop: no document, copy or article overflow; asset loaded at its declared natural dimensions; article bottoms measured at approximately 28.7px.
- Both talent and report links remain their original destinations and native new-window links. The earlier release's native talent click and keyboard focus checks remain applicable; no link or focus code changed in this patch.
- Generation indicator is static and not a new button or link. Existing mobile downward-arrow rotation is retained.
- No console errors observed during the final desktop check.
- Current source/local HTTP check passes for all four changed runtime files, including exact served bytes and PNG alpha/dimensions. See `artifacts/evaluation-feedback-20261102/source-checks.json`.
- The preceding release was browser-verified at 375, 390, 768 and 1024px. This follow-up's viewport override did not apply to the intended tab, so no new mobile-browser pass is claimed; overrides were reset. The established responsive structure remains, with only minimum heights removed and the static arrow size increased.

## Implementation checklist

- [x] Solid talent symbols on the light relation mesh.
- [x] Natural article height and correct bottom padding.
- [x] Stronger static generation cue, original report button retained.
- [x] Original copy, links and unrelated sections preserved.
- [x] Final desktop visual review and source/HTTP checks passed.
- [x] Asset provenance and cache versions updated.

## Follow-up polish

Additional device-specific visual checks can be repeated in a later UI iteration. No known desktop P0/P1/P2 issues remain.


## Final detail follow-up

The user's latest annotations additionally asked for clearer person nodes and an uncropped footer backdrop.

- Final evaluation capture: `artifacts/evaluation-detail-20261102/evaluation-desktop.jpg`, compared with the preceding `artifacts/evaluation-feedback-20261102/evaluation-desktop.jpg` at the same 1651 × 871 CSS viewport. The three solid person nodes are individually larger and stronger; text, fine relation lines, card dimensions and approved edge-entering composition are retained.
- Active image is now `talent-network-solid-emphasis.png`, 1945 × 809 original-alpha PNG, SHA256 `5aa50ce65ab90016ea8b4209cdd918354b041bf6c69b04960e07766c346d54c7`. No programmatic image editing or resampling.
- Footer capture: `artifacts/evaluation-detail-20261102/footer-desktop.jpg`. Its natural 400px minimum height and `background-size: contain` preserve the complete city illustration; logo, all original text and copyright remain inside the footer. Copyright ends 28px above the footer bottom. On narrow screens the footer retains natural content height.
- Browser measurements and source/local HTTP checks are saved in the same artifact folder. Full homepage HTML is identical to base `6ee3848` except the decorative image tag and footer stylesheet cache version. No new text or controls.
- Final desktop image, footer, typography, spacing, color, image quality and copy checks found no P0/P1/P2 issue; no console errors were observed. Earlier responsive coverage and this follow-up's mobile coverage limitation remain as documented above.
final result: passed
