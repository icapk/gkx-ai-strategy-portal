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

## Recommendation content layout and Arco category icons — 2026-11-01

Source truth: the user approves the recommendation-page UI audit with two explicit constraints: content titles remain16px, and the existing Arco component styles remain. A subsequent annotation authorizes replacing the eight sidebar category icons; publication to the existing online site is explicitly requested. Copy, fields, data, links and business behavior are preserved.

Implementation: one new `recommendations-content-polish.css` handles the custom content surfaces and layout. The neutral#F7F9FC base retains the original top image/mask at.12 opacity. Custom panels/cards use subtle ice-gray-to-white surfaces,10–12px corners and faint borders; list rows remain white. Native content headings are16px/24px, weight600; native metadata uses13px/20px,#667085. Paper/talent primary metrics share one desktop row, and report metrics allow extra room for complete date/time. The mobile controls container wraps horizontally, the obsolete paper grid row is cleared, and narrow-tablet abstracts wrap naturally. Arco buttons, tabs, select, checkbox, tags, menu, switch, pagination and focus rules are unchanged; homepage and header sources are unchanged.

Icons: the existing React renderer now uses eight official icons from the locked MIT-licensed Arco2.66.18 package. An icon-only prefix avoids the library's extra menu icon margin;16×16px dimensions, existing menu gap, labels, selected/hover states and click bridge remain. The official48-unit viewBox and4-unit stroke are preserved. A baseline build matches the preceding bundle after CRLF normalization; the final JS deterministically rebuilds from the scoped icon imports/map/renderer. Vendor CSS and both license notices retain their original bytes; package/lock and build configuration are unchanged.

Verification: before/after desktop1651×871 and phone390×844 screenshots were opened separately and in `artifacts/recommendations-ui-polish-20261101/comparison.html`. Desktop paper metrics shrink88→42px, and the first row362.67→300.67px. Phone first row452.67→350.67px and begins at380px instead of443.17px. All eight desktop categories were visited; paper checks at320/375/390/768/1024/1651px report no document overflow, and checked native text has no horizontal clipping. The final content stylesheet's33 rules match no Arco node or descendant.79 desktop and74 phone Arco HTML elements retain all26 sampled style properties; SVG content is the authorized exception. Other category samples taken directly after switching show only the original selected-menu color transition's intermediate color/currentColor values; these are recorded separately, not asserted as stable differences. Stable selected menu colors remain brand blue.

The native Arco dropdown opens, saved-only filtering produces the two saved papers and restores the normal list, and keyboard focus retains the original component outline. No saved/followed records, rating/comment actions or external business navigation were changed. Browser error log is empty. `source-check.json` confirms unchanged HTML fields/links, business scripts and all old CSS; `browser-check.json` records the runtime checks, and the icon build/source receipts are under `artifacts/recommendations-ui-20261101/`. Production build and response checks are recorded separately after publication.

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

## Education scene illustrations — 2026-11-01

Source truth: the user's education-region annotation and subsequent clarifications require less childish imagery, a stylized blue-white material consistent with the site, coherent perspective and scenes rather than flattened prop/icon arrangements. Existing copy, links, card layout and backgrounds remain. The final four standalone images use one laboratory workstation as the material/camera reference and depict integrated laboratory, study, computational workflow and project-demonstration spaces. Physical supports, shared surfaces and foreground/background overlap provide scene context. No readable fields, claims, labels or new controls.

Evidence: `artifacts/education-professional-20261101/before-desktop.jpg` and`after-desktop.jpg` share1651×871 CSS viewport,1636×862 screenshot pixels, the same heading anchor and neutral card state. `comparison-final.png` displays both at800px wide and was opened and reviewed. Original PNGs and native desktop screenshots were separately inspected by two agents for scene integration, major parallel edges, style and visible defects. The final supporting scenes share the main scene's pane direction and moderate three-quarter view; no earlier reversed pane/high-pitch diamond layout remains. There is no apparent disconnected or broken apparatus in the final illustrations.

Implementation: four original generated transparent PNGs are rendered with existing contain rules and no external illustration frame, skew, crop, filter or alpha edit. The main is1536×1024; each supporting image1254×1254. Each workspace copy exactly matches its generator source bytes. Tool, full prompts, references and source paths are documented in`assets/education-professional-20261101/README.md`. Discarded candidates remain in ignored artifacts.

Verification: normalization confirms index.html outside the four illustration tags is exactly unchanged fromHEAD. All displayed text and link arrays remain identical; all four desktop card widths/heights are unchanged. Desktop and390×844 mobile have zero horizontal overflow; all four images load, remain within existing image slots and preserve aspect ratios. `mobile-top.jpg` and`mobile-scenes.jpg` were opened and inspected. The existing native link focus outline and white title text remain visible. No browser errors. Existing first-screen, partner, footer and module styling are untouched. `verification.json` records passed source, asset and responsive checks. No remaining P0/P1/P2 finding in the edited scope.

final result: passed

## Formal homepage palette with brand blue retained — 2026-11-01

Source truth: the user states that the page is too blue, then explicitly requires retaining the primary brand color and a more formal official-homepage presentation, excluding the dialogue/search first screen. Existing illustration scenes, fields, copy, links and layout remain. `artifacts/home-neutral-palette-20261101/before-education.jpg` records the preceding scene version;`after-education.jpg` shows the final palette at the same1651×871 CSS viewport/1636×862 screenshot density and heading anchor. The combined`comparison-final.png` was opened and reviewed at equal800px widths. Native evaluation, strategy and loop captures were also inspected.

Palette: brand blue#165DFF remains the title-band start and existing primary-action color. The former cyan-heavy band endpoint is narrowed to#367FFF. Broad surfaces use neutral gray-white with a subtle ice-blue-gray gradient, neutral borders and lighter low shadows. Body copy#57616F and headings#28313D reduce stacked blue tones. The original wave image, scale and240px entry mask are unchanged; its opacity is.18. A neutral base fades in across the same240px entry zone. Original illustrations and PNG alpha remain untouched. All surface selectors are scoped to#mgResearchContent.research-home, leaving partner originals and navy footer outside the change.

Verification:145 first-screen elements retain all13 checked computed style properties after entry animations settle. HTML normalization confirms no source change outside the four education image tags and surface-stylesheet version. Text/link arrays and education-card dimensions are unchanged. At1651px desktop and390×844 mobile the document and checked cards have no horizontal overflow; images load. Mobile education/evaluation captures were opened and inspected. Browser errors are empty. `verification.json` records passed scope, brand-color, hero, source, content and responsive checks. The initial screenshot with a stale compositor frame was rejected and replaced after checking anchor coordinates. No remaining P0/P1/P2 issue in the edited scope.

final result: passed

## Education text-link entries — 2026-11-01

Source truth: the user marks the simulation entry and requests text-button styling. The four matching education entries now use blue text plus the existing arrow without border, fill, corner rounding or horizontal padding. The original whole-card anchors remain; no nested button/link or new action was added. Hover/focus/active keeps blue text and transparent background with an underline. Desktop/mobile reserved heights are retained so card and illustration layout stays stable.

Evidence: `artifacts/education-text-links-20261101/comparison-final.png` shows the preceding and updated module at the same1651×871 CSS viewport, normalized equally to800px wide. The combined image and390×844 `mobile-focus.jpg` were opened and inspected. The dedicated local preview preserves the user's existing search-tab state. Four normal desktop/mobile CTA styles all report transparent background,0px border/padding and brand-blue text; the focused compact entry remains transparent/blue with an underline and visible whole-card outline. Education text, original href/labels and all four desktop card dimensions match the preceding page. Desktop/mobile document overflow is zero and browser errors are empty. No remaining P0/P1/P2 issue in this scoped change.

final result: passed

## Homepage motion audit implementation and release — 2026-11-01

Source truth: the user authorizes direct implementation and online publication of the homepage motion audit, and explicitly corrects that recommendation cards still require expand/collapse animation. Copy, fields, native links and the dialogue/search first-screen appearance remain. The accepted education scenes, neutral surfaces and text-link entries above are included in this release.

Implementation: recommendation cards expand and collapse together over260ms with150ms detail opacity; native CSS transitions retarget rapid choices. A bounded requestAnimationFrame follow keeps the actual mobile expanded card visible, cancels on newer selection, pointer/wheel gesture or page hiding, and respects reduced motion. Desktop menus enter150ms/exit120ms with3px displacement, avoid rebuilding/replaying the same group, settle interrupted state and become inert during exit. Real education, talent, report and supercomputing-center entries receive140ms non-geometric feedback. Focus outlines and underlines remain immediate; education touch feedback no longer dims the illustration. Static cards, report sheets and original partner artwork remain still.

The loop observer now watches the entire section, so visible explanation steps keep running after the figure leaves the phone viewport. Existing AI halos and step emphasis are softened; default step text uses the neutral theme variable. No orbit balls or trails are restored. Manual pause, document hiding, offscreen and reduced-motion behavior remain.

Verification: actual browser checks at1651×871 desktop and390×844 mobile pass. Rapid desktop selection ends at the latest card; sampled widths378.65px/309.34px confirm concurrent collapse/expand intermediate layout. Keyboard expansion preserves one selected item, aria-expanded and hidden/inert details. Mobile horizontal scrolling and selecting a visible report card work without document overflow. The specific prior loop bug is fixed: figure bottom-115.69px, final three steps visible and all step animations running; manual pause/resume and whole-section offscreen pause work. Menu exit sampled opacity.571 with inert set, keyboard reopening focuses the correct group's first link. All education CTAs stay transparent text with immediate keyboard outline and underline. Strategy still has exactly one native link and zero buttons. Two evaluation articles and three static partners retain no transitions; partner images have no filter.

Evidence: `artifacts/home-motion-release-20261101/browser-check.json`, `source-check.json` and eight browser screenshots. Full inline JavaScript and23 standalone JS files parse; diff whitespace passes. Static text,22 native links and seven homepage regions matchHEAD; the only image changes are the four previously accepted education scene sources/intrinsic sizes. Normalizing script bodies, cache versions and those four img tags leaves the entire HTML identical. No microphone, real search submission or external business navigation was triggered. System reduced-motion settings were not changed; their implementation branches were inspected rather than claimed as a native OS test. Production build/response verification is recorded separately after publication.

final result: passed
