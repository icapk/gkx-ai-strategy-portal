# Four homepage modules — visual QA

Source visual truth: `artifacts/homepage-reference-20261101/reference.png` (842×1867), plus Figma file `3ONY69uOGJhsz8QWTLGch0`, homepage `2:2`.

Implementation: localhost homepage, content root `#mgResearchContent`. Desktop capture: `artifacts/homepage-reference-20261101/desktop-full-final.jpg`; cropped module capture and side-by-side evidence: `desktop-modules-final.png` and `comparison-final.png` in the same folder. Focused evidence: `loop-final.jpg` and `mobile-strategy.jpg`.

Viewport: 1440×900 CSS pixels, device pixel ratio 1. The source is a scaled content reference with no browser chrome. For comparison the module crop is resized proportionally to842px wide; source and implementation are placed together. Responsive checks:390×844 and1024×900; no content overflow observed.

State: homepage, four content modules. Existing header/search/recommendation DOM and scripts are unchanged. The latest supplied blue-ribbon background replaces the earlier backdrop; a240pxtransparent-to-opaque mask blends it into the unchanged hero.

## Comparison history

1. Initial comparison found a mismatched infinity illustration, oversized loop heading, wrong learning/report images, missing peer comparison cards, and a displaced consultation arrow. Replaced source assets, restored card layouts, adjusted heading size and arrow positioning.
2. User flagged connection-point alignment and flat annotation backgrounds. Replaced these with the original Figma vector assets. All six points now use diagram coordinates, with blue/orange outlines and no duplicate pseudo-element points. Restored the original overall background as requested.
3. Post-fix comparison inspected the whole composition and focused loop details. All24local image/background resources exist and are nonempty; all15image elements were observed loaded in the browser. Desktop, tablet and mobile content remained inside the viewport. Browser error log was empty during the check.

## Fidelity surfaces

- Typography: native selectable Chinese text, explicit heading/body sizes and line heights; the play-card copy wraps to two lines. Platform font rasterization can differ slightly from the supplied image.
- Layout: four sections, left/right learning cards, two evaluation columns, connected strategy engine and report; mobile layouts reflow into readable columns.
- Colors: source blue/cyan ribbons, original directional note gradients and blue/orange connection points. The overall background now uses the user's supplied image continuously across all four sections.
- Assets: original Figma learning/report art and loop vector layers; existing3D capability icons. The decorative talent network adapts the existing project vector; its node topology is a remaining minor difference from the reference.
- Copy: existing business text and destinations retained; added the visible small/large peer comparison labels.

## Interaction verification limit

The existing consultation click handlers and anchor destinations are preserved. Automated click attempts were intercepted by the active browser comment overlay (`codex-browser-sidebar-comments-root`), so no end-to-end click success is claimed. This change is scoped to visual presentation and does not change those handlers.

## Follow-up polish

P3: operating-system font smoothing and exact decorative-network topology may differ from the supplied raster reference. No remaining blocking layout or asset-loading issue was observed.

## Background revision

Source: `assets/figma-home-modules/service-background.png`, copied byte-for-byte from the new user attachment (763×2060). The image is rendered once on the content wrapper, sized to the full four-section area. Its upper240pxfade from transparent to opaque, exposing the existing hero backdrop at the boundary. No layout or foreground styling changes. Evidence: `artifacts/homepage-reference-20261101/background-transition.jpg`. Verified computed background source,100%×100%size, transparent root, mask stops and pointer-events:none; desktop shows no horizontal overflow.

## Loop motion enhancement

The original loop artwork and its centering transform are retained. New layers add three slow travelling signals (two on mobile), a subtle AI halo and sequential timeline highlights. Motion is decorative and hidden from accessibility announcements; labels and the six connector positions remain fixed. A keyboard-accessible pause/play control is provided.

Browser checks observed changing offset-distance values, paused state after pressing the pause control, resumed state after play, and paused animation-play-state after navigating outside the loop. Mobile390×844 verification found diagram and motion-layer widths both350px, scale350/605, two visible signals and no document overflow. Reduced-motion CSS explicitly disables all new animations; the system-preference change listener also pauses the controller. No browser errors were logged. Script syntax and diff whitespace checks passed.

Evidence: `artifacts/homepage-reference-20261101/loop-motion.jpg`. Original illustration, background, typography and surrounding modules remain the visual target; only the requested depth and motion layers are added.

final result: passed

## Recommendation card accordion — 2026-11-01

Source visual truth: Figma `3ONY69uOGJhsz8QWTLGch0`, node `1206:205`, high-fidelity design context and screenshot. Local source capture: `artifacts/recommendation-cards-20261101/reference.png` (1024×175). Implemented component: `#mgRecommendationPreview` for paper, expert and strategy only.

Comparison evidence: `artifacts/recommendation-cards-20261101/comparison.png` places the source and implementation together. The native component screenshot, `paper-row.jpg`, is 1200×204 CSS pixels and raster pixels; it is proportionally normalized to1024×174 for comparison with the scaled source. Desktop viewport1413×871, content viewport1398px wide. Focused native-resolution evidence: `paper-expanded-cards.jpg` (1232×236), including the header and all four cards. The entire component is readable at this size, so further focused crops are unnecessary. Page context: `paper-final.jpg`; other states: `expert-expanded.jpg`, `strategy-expanded.jpg`, `mobile-last-card.jpg` in the same folder.

State: first card open by default; clicking a different card leaves only that card expanded. Existing recommendation data and ordering remain in place instead of repeating the Figma sample on all four cards. Thus the first paper remains the existing AlphaFold resource, and the sample generative-agent paper is the second card. The existing hero background is retained as previously requested.

Fidelity surfaces:

- Typography:12/20 type labels and metadata,14/22 medium title/action,16/24 section title; existing platform font fallback retained. Titles clamp to two lines and expose the complete title via their title attribute.
- Layout: browser measurements confirm232×160 basic cards,456×160 expanded cards,16px gaps at1200px. Details start226px into the expanded card and measure230px wide. Padding16px, details left padding22px,8px radii match the design.
- Colors: white basic panels,60% white details, source text colors#1d2129/#616b78/#86909c/#9ea6b0 and blue#165dff. No decorative corner artwork, numbering, card shadows or extra arrows.
- Assets: exact downloaded Figma smart-recommendation SVG is nonempty(1981bytes), loaded from a local path, and observed at24×24 in the browser. No temporary Figma URL is used at runtime.
- Copy: resource titles, summaries, metadata, original URLs and queries retained. Prototype/access status remains visible in expanded details. Expert and strategy use corresponding bilingual type labels and original resource actions.

Interaction verification:

- Mouse switching and keyboard Left/Right/Home/End preserve exactly one expanded card; previous details become aria-hidden and inert. Width transitions320ms and detail opacity220ms are separate from existing category-change motion. Reduced-motion CSS disables both transitions.
- All three groups render their corresponding style; switching back to simulation restores the four original simulation links and removes the accordion class.
- Clicking the third report action opens the existing search flow with query `全球人工智能 科技创新态势`, keyword mode and report filter. Existing external links retain target=_blank and noopener/noreferrer.
- At390×844, selecting the last card scrolls the strip to574px; expanded card spans approximatelyx16..359 within the343px container. The document has no horizontal overflow.
- Initial responsive inspection found an expanded card could remain offscreen after shrinking the desktop window. Fixed with a width-only ResizeObserver, also covering hidden→visible homepage restoration. Re-tested desktop→390px resize: selected last card is fully visible atx16 with343px width.
- Browser error log empty; inline JavaScript syntax and git diff whitespace checks passed.

No remaining P0/P1/P2 finding. P3: narrow screens use horizontal scrolling; the first expanded card fills the strip, so adjacent-card discovery relies on swiping. No extra hint was added outside the supplied design.

### User revision: remove card motion

Removed width/flex-basis transitions, details fade/translation and smooth horizontal positioning. Card details now switch immediately; single-card expansion, the original resource actions and responsive positioning remain. Browser computed styles confirm transition:none on both card and details, with transform:none. Evidence: `artifacts/recommendation-cards-20261101/no-motion.jpg`. Existing category-change motion and the other homepage modules were not modified. Source review and inline-script syntax/whitespace checks passed. Automated repeat clicks did not trigger selection during this revision, so no new end-to-end click-test claim is made; the previously tested selection logic is retained.

final result: passed

## Education card styling and illustration revision — 2026-11-01

Scope: only the four education cards. Source truth is the existing layout and the user's browser annotations, with these accepted revisions: regenerate all four illustrations in a unified frosted-glass style; make the play illustration clearly resemble a virtual laboratory; remove illustration backplates/borders; retain existing copy without extra fields; use an ice-blue-to-white card gradient.

Evidence: `artifacts/education-cards-20261101/before.jpg`, `comparison-cards-final.png`, `cards-final.jpg` (1264×592 native card region), and `desktop-viewport-final.jpg`. Desktop viewport1651×871, content width1636, card grid1264 CSS pixels. The before/after card regions are normalized to780px wide in the combined comparison; the different heights reflect the added explicit resource action and consistent compact card spacing. The focused native card capture is readable without further crops. Mobile evidence: `mobile-final.jpg`, captured at390×844; the final background-only revision does not change its layout.

Fidelity surfaces:

- Typography: blue title ribbons keep white text in base/hover/focus-visible/active states. Clear14px action labels,16px compact body and18px main body. Mobile reflows to15px/25px. Existing business descriptions are retained.
- Layout: the original large-left/three-right arrangement remains. Whole cards are single links; each explicit action is a span inside that link. No nested buttons. Previous folded-corner arrows are removed. Illustration containers have transparent backgrounds, zero borders and no clipping; artwork uses contain with original proportions.
- Colors:115-degree gradient from ice-blue rgba(219,234,255,.94), through rgba(239,247,255,.93) at52%, to white rgba(255,255,255,.98). Hover uses the same blue-to-white direction. Blue action fill/white text provides clear interactive feedback. No extra animation.
- Assets: all four new transparent PNGs are locally saved and observed loaded in the browser. Material, camera, light and palette share a single frosted-glass brief. Main image is revised to a microscope, test tubes, optical experiment and small digital controls. Generated alpha was copied intact; no post-generation background removal, warping or filters. Built-in image_gen was used; runtime files and full final prompts are documented in `assets/education-frosted-20261101/README.md`.
- Content: no extra process labels, capability tags, metrics or other fields. The proposed extra fields were removed immediately after the user's correction. Original external URLs are preserved with target=_blank and noopener/noreferrer.

Verification: at390px the document and viewport widths both375px, with no horizontal overflow; compact text ends before the action and before the illustration zone. Keyboard Tab moves between the native card links; focused title remains rgb(255,255,255) while the action becomes white on blue. Native pointer hover was intercepted by the browser's comment overlay during testing, so the shared hover/focus/active selector was additionally reviewed for specificity. In the final desktop browser all four PNGs load, all illustration backgrounds/borders are absent, no proposed extra fields remain and no console errors are logged. Inline JavaScript syntax and diff whitespace checks pass. Other modules and the recommendation-card motion removal remain intact.

Comparison history: the first play draft was too generic, so it was replaced with the explicit laboratory composition; illustration frames were removed at the user's request; the initially flat/white card treatment was replaced by the requested ice-blue-to-white gradient; extra tags/process fields were withdrawn. Final combined comparison shows the four cards with the requested style and existing copy. No remaining P0/P1/P2 finding.

final result: passed

## AI evaluation refinement and release — 2026-11-01

Source truth: current-module screenshot `artifacts/ai-evaluation-audit-20261101/01-desktop.jpg` and the user's approval of its five-point review. Keep the three-card hierarchy and existing business copy, unify with the education section, and publish through the existing GitHub Pages site.

Evidence: `artifacts/ai-evaluation-release-20261101/comparison-final.png` contains the source and final implementation side by side. Desktop capture `desktop-final.jpg`:1651×871 CSS viewport,1636×862 screenshot pixels; both source and implementation share the same capture density and are normalized to800px wide in the combined image. Focused mobile evidence `mobile-module.jpg`:350px content region at390×844 CSS viewport. No device-chrome or density mismatch is used as a finding.

Fidelity surfaces:20/28 white titlebars,18/26 inner titles and14/22 supporting copy; source descriptions unchanged. Three ice-blue-to-white cards, lighter inner panes and consistent spacing. Original title semantics, peer center alignment and expert left alignment are retained. Talent graph uses the approved frosted-glass material with clear people/research relationships, genuinely transparent background and no image frame;1672×941 PNG is loaded locally with contain sizing at420×240 desktop. All generated-asset paths and full prompts are documented in `assets/evaluation-frosted-20261101/README.md`.

Only the original talent card is a native link, with a small decorative entry arrow and explicit new-window label; lower two cards remain static articles. No extra fields, claims, links or animation. Keyboard focus is visible and the title remains white. At390px, the document has no horizontal overflow; all three cards are350px wide without internal overflow, and the talent image is308.67px wide. Talent text and image reflow vertically. Browser error log is empty.

Comparison history: desktop review found expert inner titles sat at different vertical positions because their descriptions had different lengths. Changed expert panes to align content at the top and enabled prettier text wrapping; final browser measurements show both headings at the same y coordinate639.33px. The final combined comparison and mobile crop were opened and inspected. No remaining P0/P1/P2 finding.

Release preparation: all155local references across the homepage, its styles and new script resolve to tracked nonempty files;28newPNG/SVG assets are tracked. Remote main052f995 was merged, preserving its keyword-search labels and vendor bundle update, together with the local loop-motion import. Inline JavaScript syntax and git diff whitespace checks pass. Publication is verified separately against the production HTML and asset responses after pushing.

final result: passed

## AI strategy static report presentation — 2026-11-01

Source truth: the user's current strategy-module screenshot and final clarification: static demonstration, unchanged image assets, a separate report-page button, and a visual stack of many reports. Existing copy, section background and report destination are retained. The scope is the strategy section; earlier module interactions remain unchanged.

Evidence: `artifacts/strategy-static-20261101/desktop-before.jpg` was captured from the existing local page before reload; `desktop-final.jpg` shows the updated implementation at the same1651×871 CSS viewport. `comparison-final.png` normalizes both captures to800px wide side by side. `mobile-top.jpg` and `mobile-report.jpg` show the390×844 responsive layout; measurements are saved in `responsive.json`.

Fidelity and revisions: original report PNG is reused in five complete, contain-sized static layers, with no asset edit, filter, crop or generated replacement. Only the front layer is announced as an image. Original four70×73 capability images remain unchanged. Request/platform cards use an ice-blue-to-white gradient. Four capability icons and titles share the same desktop top coordinate; corrected inherited block align-content:center, which previously shifted shorter content downward. Balanced14/22 copy avoids isolated final characters. Flow labels use#616b78 for readable contrast, with small decorative arrows. No added business fields, counts, animations or hover movement.

Verification: at1651px the strategy flow is1200px wide. At1024px and390px the document width equals its client width, all images load and no strategy descendant has visible overflow. Mobile capabilities and static labels use two columns; report sheets remain within the350px pane. The section contains exactly one focusable link and no buttons/inputs. Its44px-high standalone native link has a visible2px keyboard outline and retains the original target with noopener/noreferrer. Removed obsolete shortcut listeners and data attributes. Inline JavaScript parses; local CSS asset references and diff whitespace checks pass; browser error log is empty.

Destination check: read-only HTTPS request returns200 and title“ZWrite 智库深度创作 MVP”. Browser click/Enter attempts did not provide a reliable external navigation result while the browser annotation surface was active; no end-to-end navigation claim is made. The rendered link's native href, target, semantics and focus state are verified. The external page is outside this module's changes.

The combined comparison and both mobile regions were opened and inspected. No remaining P0/P1/P2 finding in the edited module.

final result: passed

## Homepage visual polish and orbit removal — 2026-11-01

Source truth: current homepage screenshots and the user's approved style-only review. All fields, wording, numbers, original images/marks, links and actions must remain. Additional instruction explicitly removes the three rolling balls and their trails from the research-loop illustration. Existing AI glow, step emphasis and pause behavior are retained.

Evidence: `artifacts/homepage-polish-20261101/before-*.jpg` and `after-*.jpg`; combined `comparison-final.png` was opened and reviewed with source and implementation together. The source education capture is the accepted `artifacts/homepage-overall-audit-20261101/03-education.jpg`, copied as before-education because a rapid capture initially returned a stale compositor frame. Invalid captures were rejected and replaced. Both desktop sets use1651×871 CSS viewports and1636×862 screenshot pixels, normalized equally to800px wide in the comparison. The partner/footer frame ends at document bottom, so its title's viewport position changes with the approved shorter section heights; this is an expected layout change. Native focused screenshots were also opened for card copy, partner names and mobile entry details.

Typography: all four primary titles32/42 desktop,28/38 tablet,24/34 mobile. Copy unchanged. Education ribbon text remains white in its interaction states. Existing pale hero/recommendation helper text is darker. Partner names remain15/22, small names improve from8px to12/18, footer helper copy13/22. Partner title32/40 with lighter weight than core titles.

Layout and colors: common ice-blue-to-white gradient,16px corners, subtle border/shadow; existing grid hierarchy retained. Strategy width aligns to the other content edges, static labels have no button border or selected fill, talent's existing arrow is40px white-on-blue. Mobile section spacing is reduced and the existing single44px report link precedes the report stack, without changing its href or adding controls. Original artwork proportions and report-sheet rotations remain intact.

Image/content verification: exact source comparison proves index.html differs only by two stylesheet imports and loop CSS/JS cache versions. Browser snapshots show identical text and link arrays. Illustration references are identical after accounting for the explicitly removed three moving decorative image instances; image files themselves are unchanged. Original loop layers and six fixed connector points remain. See `source-verification.json`, `content-before.json` and `content-after.json`.

Responsive checks:1651,1280,1024,768,390 and375px widths have matching document/client widths and no measured text overflow. Existing strategy link count remains one at all sizes.390×844 mobile evidence includes education/evaluation/strategy/partners and focused `mobile-report-entry.jpg`; the report link has a visible focus outline and precedes a complete350px report stack. All partner small text is12px and unclipped. No browser errors. Removed actual `.mg-loop-motion`/`.mg-loop-signal` nodes are absent, six fixed `.mg-loop-pin` nodes remain. Pause/play was clicked successfully: running→paused→running. JS parsing and diff whitespace checks pass.

Comparison history: peer review identified a lone final Chinese character in the first desktop partner name. Added balanced text wrapping without changing copy or size; the final capture shows natural multiline names. Added an80px anchor offset to prevent the partner title hiding under the fixed header. Initial stale screenshot frames were replaced before final comparison. No remaining P0/P1/P2 finding. Existing baked white backgrounds in the four strategy icon files are retained as required; they were not regenerated or filtered.

final result: passed

## Lower-content surface colors; hero preserved — 2026-11-01

Source truth: the user's approved near-white background/local ice-blue gradient direction from the Fluent2/Carbon reference research, with the explicit constraint that the entire first screen remains unchanged. Current-page source captures are `artifacts/content-surfaces-20261101/before-*.jpg`; final captures are `after-*.jpg`. `comparison-final.png` contains both sets together and was opened and inspected, including a native-size evaluation capture and390×844 mobile evaluation/partners captures. All desktop frames share1651×871 CSS viewport and1636×862 screenshot pixels, normalized equally to800px in the combined image. No layout, route, content or selected-state differences were introduced.

Fonts/copy: existing fonts, weights, sizes, line heights and all text/fields are unchanged. Exact source normalization proves index.html only changes the stylesheet imports; browser content and link arrays are identical. The144 hero descendants retain all18 checked computed style properties. Before/after first-screen JPEG SHA256 is identical: `0b47971c65240ec42aec7c2398f073db307636d80ee8484fa0d7bd14a6e654a1`.

Layout/image fidelity: no dimensional or placement properties change in the new surface stylesheet. Original illustrations, report stack, fixed loop pins, background image and its240px entry mask remain. Only the background pseudo-element opacity changes to.67. Prior removal of rolling balls remains intact. No generated artwork, new animation or extra fields. Shadows remain low and do not obscure adjacent content.

Color hierarchy: pale local115-degree ice-blue-to-white outer cards; slightly stronger main education card; nearly white inner evidence/capability panes; light gray-blue borders and subtle cold-gray shadows. Existing white title text uses a more restrained brand-blue-to-cyan band. Partner surfaces are lighter and the existing footer becomes navy#14243F, retaining the original light logo and text. Body text contrast remains strong against the lighter surfaces. All new core selectors are restricted to#mgResearchContent.research-home; partner/footer selectors are restricted to its existing adjacent siblings.

Verification: desktop1651px, tablet1024px and phone390px have matching document/client widths, with no measured text clipping. The strategy section still has one report link. Mobile screenshots were opened and inspected; browser error log is empty. Source checks, CSS scope review and diff whitespace checks pass. Peer comparison found no P0/P1/P2 issue. Evidence receipts: `verification.json`, `responsive.json`, `baseline.json` and `after-state.json`.

final result: passed

## Original ITIC partner images — 2026-11-01

Source truth: the user's follow-up explicitly points to https://itic-sci.com/ and clarifies that all partner content is images without separate captions. The original homepage partner array was inspected as text, without executing downloaded code. Its four original360×200 PNG assets were downloaded or decoded directly from the original PNG data URIs. All runtime files are byte-identical to those source files. Tracked provenance is in`assets/partners-itic-20261101/README.md`.

Evidence: `artifacts/partners-refine-20261101/before-partners.jpg` and`after-partners.jpg` use the same1651×871 CSS viewport and1636×862 screenshot pixels. Both are shown equally at800px wide in`comparison-final.png`, which was opened and inspected. Captures end at document bottom, so the section heading moves vertically with its shorter image-only layout; the footer stays aligned in the comparison. Native desktop,1024×900 tablet and390×844 mobile top/bottom captures were opened and reviewed by two agents. No density mismatch is treated as a layout finding.

Implementation: complete original artwork preserves its embedded names, backgrounds, rounded corners, colors and9:5 ratio. No filters, redraws, crops or extra visible captions. The old placeholder letters, simulated icons and double wrappers are removed. Desktop four equal columns have24px gaps; tablet has two columns; mobile has one centered column with300×166.67px images. Existing light section background and typography remain. Only the original supercomputing-center link is focusable, with unchanged href, target and rel attributes and a visible2px keyboard outline. Static images have institution alternative text. No added animation or business fields.

Verification: source normalization confirms all index.html outside the partner section and stylesheet cache version is exactly unchanged. All10 footer CSS rules are unchanged. Four image files match the original SHA256 hashes, all load, and all checked sizes have zero horizontal overflow. Browser errors are empty. The combined comparison and focused mobile frames have no remaining P0/P1/P2 issue. `verification.json` records the passed source/asset/responsive checks. Publication is checked separately against the production responses.

final result: passed
