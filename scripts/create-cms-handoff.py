from pathlib import Path
from datetime import date
from zipfile import ZipFile
from xml.etree import ElementTree
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'CMS_AI_AGENT_HANDOFF.docx'
doc = Document()
section = doc.sections[0]
section.top_margin = section.bottom_margin = Inches(0.7)
section.left_margin = section.right_margin = Inches(0.75)
normal = doc.styles['Normal']
normal.font.name = 'Calibri'
normal.font.size = Pt(10.5)
normal.paragraph_format.space_after = Pt(7)
for name in ['Heading 1', 'Heading 2', 'Heading 3']:
    doc.styles[name].font.color.rgb = RGBColor.from_string('236650')
header = section.header.paragraphs[0]
header.text = 'KORA  /  CUSTOM CMS ENGINEERING HANDOFF'
header.style = 'Caption'
footer = section.footer.paragraphs[0]
footer.text = 'Implementation specification | '
field = OxmlElement('w:fldSimple')
field.set(qn('w:instr'), 'PAGE')
footer._p.append(field)

def heading(text, level=1):
    doc.add_heading(text, level)

def p(text):
    doc.add_paragraph(text)

def bullet(text):
    doc.add_paragraph(text, style='List Bullet')

def table(rows, headers=('Area', 'Implementation requirements')):
    t = doc.add_table(rows=1, cols=2)
    t.style = 'Light Shading Accent 1'
    for cell, text in zip(t.rows[0].cells, headers):
        cell.text = text
    for a, b in rows:
        cells = t.add_row().cells
        cells[0].text, cells[1].text = a, b

heading('Site-wide lightweight CMS', 0)
p('AI agent implementation instructions • Next.js + Supabase + Cloudinary')
p(f'Prepared {date.today().isoformat()} for the existing Kora reproduction in C:/Users/Ghanchi/Desktop/trial.')
p('Purpose: replace all editorial hardcoding with a secure, lightweight administration application while preserving the existing public website and its responsive motion. This is a specification, not a claim that a CMS, database, authentication integration, or Cloudinary migration has already been implemented.')
p('Visual reference: https://kora.framer.media/. The live reference, not animation-incomplete PDF captures, is the source of truth. Existing local/reference captures are useful evidence, but complete pixel-perfect and frame-by-frame parity across every page has not been certified. The process video is not supplied; delivery endpoints require configuration; legal content requires review.')
heading('1. Instructions to the implementation agent')
for text in [
    'Begin with AGENTS.md, then graft map. Use graft ask, graft grep and graft callers to locate dependencies before changing a renderer. Do not rewrite the visual application or replace its design system with an admin template.',
    'Preserve Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 and Motion. Use the existing patterns and locked dependencies. Add only necessary packages, pinned to verified versions published at least seven days earlier. No new package or infrastructure is authorized merely by this document.',
    'The CMS controls all content and approved behavior parameters, not arbitrary executable JavaScript, raw CSS, database queries, webhook secrets, or HTML injection. Build a typed section registry and safe interaction/action registry.',
    'Inventory every rendered string, image, icon, link, badge, statistic, label, empty state, validation message and SEO field. Move them through typed content adapters. Do not stop after migrating the six existing collections.',
    'Never change production schema, delete assets, send real messages, reset databases, or alter security policies without approval. Use isolated development projects and mocked delivery in automated tests.',
    'Before modifying public renderers, capture approved baseline screenshots and scroll checkpoints at 1440, 1200, 810 and 390 pixels. Restore design regressions before advancing to the next milestone.'
]: bullet(text)
heading('2. Existing application map')
table([
    ('Public routes', '/; /services; /services/[slug]; /cases; /cases/[slug]; /insights; /insights/[slug]; /about; /contact; /privacy-policy; /terms-of-service; not-found handling. Preserve all existing slugs and query-string behaviors.'),
    ('Content and media defaults', 'src/lib/content.ts: Services, CaseStudy, Insight, TeamMember, Category, LegalPage and RichTextBlock plus relationship helpers. src/lib/site-config.ts: hero image/video mode, poster and overlay; process video. public/assets: current local media.'),
    ('Home motion', 'src/components/home-hero.tsx: Hero, StatementWord, Comparison, TrustBadge and LogoTicker. src/app/page.tsx: home-intro grouping and ordered home sections. The sticky grouping is functional, not a disposable layout wrapper.'),
    ('Home sections', 'src/components/home-sections.tsx: revenue chart, service panels, process phases/video, team dialog, testimonials, counters, founder callout, featured case, pricing selector and insight cards. Many labels and arrays still live here.'),
    ('Shared shell and utilities', 'src/components/site-shell.tsx: Header, Footer and MotionProvider. src/components/ui.tsx: Reveal, Button, Logo, BrandMark, Person, Dots and ServiceIcon. Footer includes circle wipe, scaling card, navigation/social hovers and email-copy feedback.'),
    ('Other components', 'src/components/faq.tsx: grouped questions and tab/accordion behavior. src/components/contact.tsx: form schemas currently in JSX, prehydration safety, service-prefill, validation and newsletter. src/components/inner-pages.tsx: intros, prose, cards, stats, testimonials and CTAs.'),
    ('Styles and delivery', 'src/app/globals.css plus contact.css and inner-page styles. src/app/api/contact/route.ts and api/newsletter/route.ts handle delivery. Preserve honest error states and do not expose webhook destinations to browser content.'),
    ('Verification', 'npm run typecheck; npm run build; npm test; node scripts/complete-content.mjs --validate; node scripts/verify-visuals.mjs; node scripts/inspect-reference.mjs --motion [--local]. Never run complete-content without --validate casually: it overwrites imported content.')
])
heading('3. Target architecture and scope')
p('Keep the public site server-rendered. Add /admin as a separate route group with its own layout and lazy-loaded editing tools. Supabase supplies PostgreSQL, invite-only authentication and row-level security. Cloudinary supplies image/video upload, transformation and delivery. The public bundle must not contain the editor, upload widget or service credentials.')
p('Use a ContentRepository interface between database access and UI. Suggested methods: getSiteSettings, getNavigation, getPageByPath, listDocuments, getDocumentBySlug, resolveReferences and getRelease. Server Components fetch one coherent published release and pass serializable typed props into existing client animation components. Do not fetch draft content inside each card or load all database rows in the browser.')
p('Provide a local-file adapter only for explicit development/migration mode. Production failures must not silently swap to unrelated sample content. Cache the last successfully published release where appropriate; expose operational failures to administrators without exposing stack traces to visitors.')
heading('4. Complete editable-content inventory')
table([
    ('Global brand and tokens', 'Site name; logo/wordmark media; accessible labels; favicon; colors; approved font family, weights, stylistic sets and heading scales; spacing and radius tokens; container widths; light/dark variants. Expose bounded design tokens to owners only; preserve defaults such as Manrope ss01, heading weight 585, cream/mint/charcoal and rounded panels.'),
    ('Header and all menus', 'Ordered navigation items with stable IDs, labels, internal/external/anchor targets, visibility and nesting if supported; mobile drawer links; logo target; book-call label/avatar; skip-link label; current-page state. Preserve keyboard, Escape, focus, backdrop and breakpoint behavior. Broken internal links block publishing.'),
    ('Hero', 'Heading segments and optional approved desktop/mobile line breaks; description; primary/secondary CTA text and actions; image or video selection; poster; alt text; focal points; overlay opacity; trust avatars; rating; company count; ordered client logos; ticker speed/direction; featured case relationship; case badge, metric and metric caption.'),
    ('Hero statement and comparison', 'Statement words derived from editable text, not hand-numbered spans; responsive line-break hints; accessible complete sentence; before/after titles, labels, logo variants, lists and icons. Preserve hero, statement, scroll-space and comparison grouping as a single validated scene unit.'),
    ('Services and revenue chart', 'Section heading/intro/footnote; series labels, amounts, units, tick marks, bar colors and caption; ordered service references; service number display; title, short/long description, icon, deliverables, CTA and testimonial. Graph numbers and accessible summary must derive from the same values.'),
    ('Process', 'Section title/description; ordered phases with title, description, icon and step label; initial active phase; accordion mode; video poster/video/captions/duration; preview copy if no video; play/close labels; operating-principle cards and icons. The displayed duration must match the selected media.'),
    ('Team and hiring', 'Section title; ordered team references; headshots, names, roles, biographies, socials; modal labels and CTA; hiring heading, description, image, action and enabled state. Profile modal fields must use the same team record as About and article bylines.'),
    ('Testimonials and founder CTA', 'Featured testimonial, full quote, short excerpt, person/company/role/avatar, background, score and review count/source; expandable testimonials; chart/counter values and prefixes/suffixes; founder heading, subcopy, image, attribution and CTA. Never invent business claims during migration.'),
    ('Featured case', 'Case reference; optional presentation override explicitly distinguished from canonical case content; date formatting, industry/size/timeline captions, result order, service chips, testimonial and CTA. Remove hardcoded +2; compute overflow count from relationships.'),
    ('Pricing', 'Section title, note, trust proof, advisor; plan names, currency, amount, interval, starts-at label, popular badge, descriptions, ordered benefits, CTA labels, selected default and visibility. Custom quotation is a typed price mode, not a magic string. Preserve keyboard tab selection and content transitions.'),
    ('FAQ', 'Heading, categories and order, questions/answers, initial open item, help-person reference and contact link. Stable question IDs must survive reorder. ARIA relationships and panel IDs derive from stable instance IDs, not editor-entered DOM IDs.'),
    ('Insights promotion', 'Section heading/description, view-all action, featured/manual/automatic selection, ordered article references, category display, dates and cards. Empty collections need an approved empty state or section hiding, never a runtime crash.'),
    ('Contact section and page', 'Heading, benefits/icons, background/focal point, testimonial, form intro, field labels/placeholders/help, service options from service records, revenue bands, constraints, consent text/legal link, submit/loading/success/error messages, stats, and support contact. The dedicated page and reusable section may have explicit variants without duplicate canonical service lists.'),
    ('Newsletter', 'Heading, email label/placeholder, submit/loading/sent labels, consent/legal link, success/error/disabled explanations and enabled state. Consent stays unchecked by default and cannot be removed by ordinary content editing.'),
    ('Footer', 'Address, brand, newsletter reference, founder quote/person, phone/email, copy feedback, social links, legal links, ordered navigation, copyright template, wordmark, approved motion preset. Year substitution is a safe template variable, not executable code.'),
    ('Listing pages', 'Services/cases/insights/about intros and metadata; sort/pagination/category-filter labels and empty states; featured selection; card content comes from records. Validate URL filters against category IDs and preserve shareable query strings.'),
    ('Detail pages', 'Service narrative, deliverables, related cases and CTA; case challenge/solution/results/client metadata/testimonial/services; insight title/cover/date/author/category/body; team bio/socials; legal title/body/effective date/version. Add approved structured rich-text blocks, not raw HTML.'),
    ('System content and SEO', '404 heading/copy/actions, unavailable states, image alt text, screen-reader labels, cookie/privacy copy if introduced, document titles/descriptions, OG image, canonical path, robots controls, sitemap inclusion and redirect rules. Never place personal form submissions in public content.')
])
heading('5. Database and versioning blueprint')
p('For a lightweight but site-wide CMS, use a shared document/revision core with discriminated typed payloads rather than one unvalidated settings blob. Keep relationship rows relational and indexed. The following tables are a blueprint: produce reviewed SQL migrations and generated database types before use.')
table([
    ('cms_members', 'user_id UUID FK auth.users; role enum owner/publisher/editor/viewer; active; created_at. Only owner-controlled invitations and role changes. A profile display name does not confer a role.'),
    ('cms_documents', 'id UUID; kind enum; stable_key; slug where routable; locale default en; draft_revision_id; version integer; archived_at; created_by/updated_by; timestamps. Unique kind+stable_key and appropriate route/locale constraints. Never use array position as identity.'),
    ('cms_revisions', 'id UUID; document_id FK; schema_version; payload JSONB; revision_number; created_by; created_at; change_note; checksum. Immutable after creation. Runtime schema depends on document kind and schema_version. Index document_id and revision_number.'),
    ('cms_document_references', 'revision_id FK; field_path; target_document_id FK; position; relationship_type. Validate allowed target kinds, archive restrictions and cyclic dependencies. Compile exact referenced revisions into a release so later draft edits cannot change a published page.'),
    ('cms_media_assets', 'id UUID; Cloudinary asset_id/public_id/version/resource_type/delivery_type/format; width/height/bytes/duration; secure delivery metadata; poster/caption references; license/source; status; created_by; timestamps. Alt text and focal point may be usage-specific overrides.'),
    ('cms_media_usage', 'revision_id; field_path; media_asset_id FK; crop/focal-point/alt overrides; decorative boolean. Index asset ID for where-used and deletion guards. Historical releases count as usage until their retention window expires.'),
    ('cms_releases', 'id UUID; immutable compiled public_payload; dependency_manifest; checksum; schema_version; created_by; created_at; label. Exclude private/admin/PII fields. Store enough historical snapshots to support reviewed rollback.'),
    ('cms_site_state', 'Singleton ID; active_release_id FK; version; updated_at. Only publisher/owner may switch the active release through a transaction. Scheduled releases belong in a private jobs table, not in the publicly selected active pointer.'),
    ('cms_publish_jobs', 'Private scheduled timestamp, candidate release ID, status, retry count and failure message. Database transaction checks current authorization/dependencies and advances active pointer exactly once. Use unique idempotency keys.'),
    ('cms_audit_events', 'Append-only actor, action, target, timestamp, request ID and redacted change summary. Editors cannot alter/delete audit records. No raw tokens, complete enquiry payloads or secrets in audit JSON.'),
    ('cms_redirects', 'Source path, destination type/path, 301/308 status, enabled and release association. Validate no loops or route collisions. Restrict external destinations to owner-approved domains.'),
    ('contact_enquiries / newsletter_requests', 'Separate private operational tables with strict grants and RLS; consent timestamp/version, delivery status and retention metadata. Optional scope requiring explicit approval. Never join these into published releases or expose anon SELECT.')
])
p('Recommended document kinds: site_settings, navigation, page, service, case_study, insight, team_member, category, testimonial, pricing_plan, faq_category, faq_item, process_phase, client_logo, form_definition, motion_preset and legal_page. Page payloads contain ordered section instances with stable UUIDs, a registry type, enabled state, typed props, reference IDs and constrained presentation settings.')
p('Use a discriminated union for every section. For example, hero props include heading segments, body, actions, media reference, trust references and featuredCaseId. A pricing section holds plan IDs, heading and defaultPlanId. A page cannot inject an unknown component name, arbitrary code, external script or unrestricted style object.')
heading('6. Authentication, roles and security')
p('Follow current Supabase Next.js SSR guidance using @supabase/ssr and separate browser/server clients. Use the Next.js 16 proxy convention for session refresh where appropriate. Verify identity server-side using getClaims or getUser as documented; do not authorize from the unvalidated user object returned by getSession. Check active membership and role for every sensitive operation, not just /admin navigation.')
table([
    ('Viewer', 'Read drafts and preview; no saves, uploads, publish, role administration or enquiries unless separately authorized.'),
    ('Editor', 'Create/edit drafts, reorder supported sections, upload approved media, request review. Cannot publish, change roles, alter delivery integrations or delete referenced assets.'),
    ('Publisher', 'Editor permissions plus publish/schedule/rollback after validation. Cannot promote users to owner or retrieve secret values.'),
    ('Owner', 'Invite/remove users, assign roles, manage approved integrations and sensitive design tokens. Require MFA for high-impact operations where supported and review stale sessions/revocation.'),
    ('Anonymous public visitor', 'Read only the currently active compiled release and approved public media. No drafts, historical/private releases, admin membership, audit events, enquiries or direct writes.')
])
p('Enable RLS on every exposed table and explicitly set least-privilege grants. Do not assume enabling RLS revokes grants. Anonymous access to cms_releases must be limited to the active pointer, not every historical release. Test both anon and authenticated nonmember access; authenticated does not mean CMS staff. Keep helper authorization functions narrowly scoped, schema-qualified and protected against search_path injection if SECURITY DEFINER is unavoidable.')
p('Prefer session-scoped operations so RLS enforces staff authorization. Server-only elevated credentials bypass RLS; isolate them to explicitly authorized administrative/background tasks. Never ship Supabase secret/service-role keys or Cloudinary API secrets in NEXT_PUBLIC variables, compiled JS, uploaded documents, logs or CMS payloads.')
p('Protect mutation routes against CSRF with same-origin checks and validated server-side sessions; use secure cookie options and route-level permissions. Rate-limit login, signatures, publish and public submissions. Validate sizes, enum values and references on the server. Escape plain text and sanitize allowed rich-text marks/links. Reject javascript:, data: executable content and arbitrary iframe/embed hosts. Do not fetch editor-supplied remote URLs server-side without strict SSRF protections.')
heading('7. Cloudinary media pipeline')
p('Use authenticated, signed direct uploads. An authorized editor requests a short-lived signature from an application route. The route validates the intended resource type, environment folder/prefix, size and format policy and signs only allowlisted parameters. The browser uploads directly to Cloudinary so large videos do not pass through a Next.js request body.')
for text in [
    'Do not trust a browser-supplied upload result as proof of ownership. Verify the returned signature and/or retrieve canonical asset metadata server-side using Cloudinary’s supported SDK. Confirm cloud/environment, resource type, public ID, size, format and ownership before marking an asset ready.',
    'Use immutable asset identifiers/versioned URLs. Replacement creates a new asset/version, updates a draft media reference and publishes normally. Do not overwrite a media asset used by a live or retained release without a reviewed versioning strategy.',
    'Restrict images to approved safe formats and dimensions; treat SVG as trusted/sanitized or disallow editor SVG uploads. For video, bound size, duration, codec, aspect ratio and transformation costs. Support resumable/chunked upload according to the current Cloudinary SDK.',
    'Store resource metadata, not base64 binaries or arbitrary transformed URLs in every document. Generate URLs with an allowlisted delivery helper: responsive widths, approved crop/focal point, quality and format policy. Keep image and video transformation rules distinct.',
    'Hero video requires a poster, muted autoplay, playsInline, a static reduced-motion fallback and appropriate loading priorities. Process videos require controls, captions/transcript where applicable and pause/reset on modal close. Defer offscreen video loading.',
    'Draft text protection does not automatically make Cloudinary public assets private. Use authenticated/private delivery or approved signed delivery for genuinely confidential draft media. Never promise unpublished media secrecy with public URLs.',
    'The media library must support search, tags, type, dimensions, preview, alt/decorative fields, captions, crop/focal controls, upload progress, failed/retry state and a where-used report. Confirm deletion explicitly and block hard deletion while a published or retained revision references the asset.',
    'Verify webhook signatures using the current provider SDK, reject replay/expired events as supported, and process idempotently. Upload and transformation status must be reconciled server-side; never accept arbitrary public IDs for deletion.'
]: bullet(text)
heading('8. Publishing, preview, revisions and cache')
p('Saving a draft creates a new immutable revision and updates draft_revision_id using optimistic concurrency. The client sends the expected document version. If another editor saved first, return a conflict, preserve both edits and offer compare/merge rather than silently overwriting.')
p('Publish flow: authorize publisher; freeze candidate revision IDs; validate the entire dependency graph, links, media readiness, consent requirements, SEO and schemas; compile a public-only release; in one database transaction insert release and atomically compare-and-swap active_release_id; record audit; after commit invalidate affected public caches. Failed validation or transaction leaves the previous release intact.')
p('Read the active release pointer once per request/render and resolve every component from that immutable snapshot. This prevents a new header, old page and mismatched plan list appearing together. If cache invalidation fails after commit, retry idempotently and surface operational status; do not claim publish failed and roll content back blindly.')
p('Use the current Next.js 16 cache APIs supported by this installed version. Separate public published reads from session/draft reads; never cache a response carrying authentication cookies for shared use. Invalidate route/tag dependencies including listings, linked case/service pages, sitemap and metadata. New slugs must render after publish without requiring a full build; verify dynamic route and generateStaticParams behavior.')
p('Preview uses an authenticated, uncached server path or short-lived signed preview token with scope, expiry and revocation. Return noindex/noarchive and no-store, visibly mark the preview, and implement a reliable exit-preview action. Never put a service key or raw session token in a share URL.')
p('Scheduling stores a candidate immutable release and timezone-aware UTC timestamp. The publishing worker uses a lock/idempotency key, validates authorization and dependencies again, records retries and reports failure. Rollback points to a validated retained release transactionally and invalidates caches; it does not rewrite history or destroy later drafts.')
heading('9. Admin editor workflows')
for text in [
    'Dashboard: published release, pending review, recent activity, broken-link/media warnings, scheduled releases and integration health. State clearly whether an action saved a draft or changed the public site.',
    'Pages: choose a route, edit SEO, inspect an ordered outline, add supported sections, reorder by drag-and-drop AND keyboard buttons, duplicate with new instance IDs, hide/unhide, select approved variants and preview at all four target widths.',
    'Inline content: use text controls for copy and structured headings. Let editors choose limited emphasis and responsive line-break hints. Expose character-count warnings and visual previews, not rigid truncation that destroys meaning.',
    'Collections: searchable/filterable service, case, insight, team, category, testimonial, FAQ and pricing lists. Forms expose all fields, relationships, order, preview, draft/published indicators and where-used impact. Archive by default; enforce explicit confirmation and reference checks for deletion.',
    'Rich text: support approved paragraphs, headings, lists, links, quotes, images, captions and video blocks. Validate heading hierarchy and link targets. Sanitize paste, preserve undo/redo and keep output deterministic across server/client rendering.',
    'Global settings: edit desktop/mobile/footer navigation, contact details, social links, brand assets, UI messages and approved tokens. Show all pages affected by a global change before publish.',
    'Forms: edit labels, option sources, required rules within policy, validation messages and destination identifier. Show delivery health but never reveal webhook secrets. Persist field IDs so analytics and submitted historical records remain interpretable.',
    'Review: show revision diff, affected URLs, validation results and media changes. Support review notes, approval, scheduled publish and rollback. Require reauthentication/MFA for owner and high-impact operations as designed.',
    'Editor resilience: dirty-state warning, debounced autosave only to drafts, conflict handling, retryable uploads, keyboard navigation, accessible labels and clear loading/error states. Do not add complex real-time collaborative editing in the initial lightweight scope.'
]: bullet(text)
heading('10. Motion must remain data-driven but code-controlled')
p('Keep animation algorithms in tested components. Store approved preset IDs and bounded parameters, not Motion expressions or event-handler source. Editors can configure content, select supported behavior, set enabled states and tune safe timing within owner-approved limits. Breakpoints and CSS tokens remain versioned schema contracts.')
table([
    ('Hero entrance', 'Preserve centered image expansion and image counter-zoom, staggered word blur/opacity/translation, delayed description/actions/trust reveal. Hero overlay default is 0.4. Keep preload priority on the selected poster/image and avoid layout shift while fonts load.'),
    ('Pinned introduction', 'Keep hero sticky, then separate sticky statement, one viewport scroll space, then comparison in the same clipped intro group. Current measured target: desktop 1000px viewport -> comparison begins around 3000px; mobile hero height is content-driven. Do not hardcode one total page height for every viewport.'),
    ('Hero scroll', 'Foreground displacement follows approximately -1.75 times scroll on desktop/tablet and -0.75 on narrow mobile. Scene scale rises from 1 to 1.4 as the hero end moves from viewport center to top. Blur overlay enters around hero-end at 60% to 50% viewport. Measure untransformed layout; sticky offsetTop can change while scrolling.'),
    ('Statement reveal', 'Reveal words progressively from 5px blur/zero opacity to sharp/opaque. Timing differs on mobile. Derive word count and schedule from content; editing sentence length must not leave words permanently hidden. Preserve complete accessible text and restore all content in reduced motion.'),
    ('Comparison', 'Heading lines separate sideways; before card becomes centered; after card enters and before becomes subdued. Maintain a static stacked readable layout where the mobile reference does so. Scene groups cannot be arbitrarily split/reordered.'),
    ('Footer transition', 'Measured desktop/tablet: 600px mint circle expands 1x to 10x between footer start entering viewport and footer end reaching viewport bottom. Footer card scales 0.85 to 1 over the same range. Preserve reverse scrolling and clipping so the circle cannot widen the document. Narrow mobile and reduced motion omit this wipe.'),
    ('Footer interactions', 'Navigation text transitions vertically with rotation/scale into mint hover pills; social icons swap similarly. Keyboard focus gets equivalent treatment. Copy-email has success and permission-denied feedback; timer cleanup on unmount.'),
    ('Shared motion', 'Reveal spring mass 1/stiffness 100/damping 20; entry Y 40; stagger approximately 0.1s. Accordion spring stiffness 170/damping 26. Button hover 1.03 with stiffness 300/damping 20. Card image scale 1.05. Logo ticker linear and seamless. Validate actual defaults in source before migration.'),
    ('Accessibility and performance', 'Reduced motion stops ticker/parallax/zoom and exposes final readable content. Dialogs close via Escape/button/backdrop, restore focus and stop media. Inactive panels have correct ARIA and cannot trap focus. Avoid layout thrashing and one state update per pixel; use Motion values and resize observation.')
])
p('Preset schema example: id, schemaVersion, effect enum, enabled, reducedMotionPolicy enum, durationMs, delayMs, staggerMs, spring parameters, scale bounds and breakpoint overrides. Validate finite bounded numbers and monotonic timelines. Preserve safe defaults when a field is absent; reject unknown properties. Never allow an editor to disable accessibility or bypass form security.')
heading('11. Forms, contact delivery and privacy')
p('Keep /api/contact and /api/newsletter as trusted server boundaries. CMS schemas configure labels, options and allowed validation policy; runtime handlers still validate every field independently. Service IDs must resolve to active published services, email must be syntactically valid, limits bounded, consent explicit and honeypot preserved. Maintain disabled-before-hydration submission protection and avoid PII in GET URLs.')
p('Map a CMS destination key to a server-side allowlisted integration. Actual CONTACT_WEBHOOK_URL and NEWSLETTER_WEBHOOK_URL stay in secret environment configuration. Missing delivery configuration must return honest unavailable status, not fake success. Add idempotency, rate limits and bounded retries where needed; never log complete sensitive form bodies.')
p('If storing submissions in Supabase is approved, restrict access to specifically permitted staff, define retention/deletion/export processes, encrypt transport, redact observability and audit access. Use synthetic test identities only. Newsletter double opt-in, unsubscribe and consent evidence must follow the chosen delivery provider and applicable law; obtain owner/legal approval rather than inventing policy.')
heading('12. Environment and dependency contract')
table([
    ('Public Supabase config', 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; these are public project configuration, not authorization. RLS and server permission checks remain mandatory.'),
    ('Server-only Supabase config', 'Use the current recommended Supabase server secret/elevated key only where explicitly required; document the chosen variable name. Never expose it through NEXT_PUBLIC. Normal staff mutations should use authenticated session clients.'),
    ('Cloudinary', 'Cloud name and API key may be returned as required by signed upload protocol; API secret remains server-only. Separate development/production asset namespaces and ideally isolated provider environments. Define approved upload presets and allowed transformation profiles.'),
    ('Other settings', 'Canonical SITE_URL, delivery secret variables, preview signing secret if applicable and scheduled-job authorization secret. Validate startup configuration. Do not populate real credentials in this DOCX or commit them.'),
    ('Dependencies', 'Plan @supabase/supabase-js, @supabase/ssr, Cloudinary SDK and a small schema validator only after checking installed packages and release age. Add rich-text/upload UI libraries only if their capabilities justify their size. Do not add an external CMS or a second app framework.')
])
heading('13. Migration sequence with acceptance gates')
for text in [
    'Milestone A — inventory and baseline: produce a field-to-renderer matrix for every item in section 4. Capture all pages, interaction states, scroll positions and reduced-motion behavior. Obtain approval for any known differences from the live reference before calling the design frozen.',
    'Milestone B — schemas and security: implement versioned runtime schemas, SQL migrations, generated database types, membership policies and positive/negative RLS tests. Seed development roles explicitly. Block further work if anon/nonmember access can see drafts or change state.',
    'Milestone C — read adapters: preserve current content.ts outputs through typed repository adapters. Seed all six collections and inline component strings/arrays into drafts. Compare output field-by-field and retain stable existing slugs; do not use a destructive live importer.',
    'Milestone D — media: inventory local asset hashes and usage, obtain source/license approval, upload to a development Cloudinary namespace, persist canonical metadata and map IDs. Keep local originals until an approved migration and rollback window are complete.',
    'Milestone E — admin essentials: implement invite-only auth, document lists, page/section editing, relationships, global navigation/settings and media management. Prove draft saves never affect anonymous public rendering.',
    'Milestone F — publishing: implement immutable snapshots, atomic pointer swap, preview, cache invalidation, scheduling, redirects, revision history and rollback. Test concurrency, failed validation, stale edits and cache/provider outages.',
    'Milestone G — complete renderer migration: replace imports/constants with props one section/page at a time. Preserve motion wrappers, CSS selectors, accessibility and responsive behavior. No public-content hardcoding remains except approved technical constants and schema defaults.',
    'Milestone H — acceptance: run the matrix below, restore a backup in an isolated environment, demonstrate editor workflows and obtain launch approval. Deliver setup instructions, secret variable names only, migration/rollback commands, media cost guardrails and remaining limitations.'
]: bullet(text)
heading('14. Required acceptance tests')
table([
    ('Editorial coverage', 'Edit at least one example of every field category and every section type; save -> preview -> publish -> inspect anonymous page -> rollback. Reorder/hide/duplicate cards and sections, update menus and legal links, replace image/video, change a plan/FAQ/author and confirm all linked views update.'),
    ('Permissions and RLS', 'Test anon, authenticated nonmember, viewer, editor, publisher, owner and removed member against SELECT/INSERT/UPDATE/DELETE and sensitive RPCs. Test draft/history/PII leakage, forged role metadata, direct upload signatures, replay, CSRF and unauthorized publish.'),
    ('Data integrity', 'Reject duplicate routes/slugs, invalid references, cyclic dependencies, missing required alt text, invalid rich text, malformed URL schemes, nonfinite stats, missing video posters, unknown section/preset kinds and dangerous media uploads. Block deletion of live references.'),
    ('Publishing consistency', 'Concurrent saves produce conflicts; concurrent publishes compare versions; all components read one release; failed dependency validation preserves live state; scheduled jobs execute once; rollback restores content and media references; cache invalidation retries are observable.'),
    ('Public pages', 'Run all existing routes plus newly created slugs at 1440/1200/810/390 widths. Check status codes, one meaningful H1, metadata, links, filters, image loading, layout shift, runtime/hydration errors, long content and empty states.'),
    ('Motion parity', 'Compare live/approved baseline at initial load and equal scroll checkpoints, not only full-page screenshots. Test wheel, touch, reverse scroll, reload mid-page, resized viewport, reduced motion and keyboard focus. Check hero words, pinned backgrounds, comparison, chart, counters, process, pricing, dialogs and footer circle/hover.'),
    ('Operations', 'Verify no secret in public bundle or content export. Mock all delivery. Exercise Cloudinary/Supabase outage, backup/restore, upload retry, revoked session, private media, quota limits and stale cache. Set bounded request/upload costs and actionable monitoring.')
])
heading('15. Final handoff contract for the next agent')
p('Do not report completion from a checklist alone. Supply passing verification output, an inventory with no unaccounted public-content fields, before/after visual evidence, RLS denial tests and a demonstrated publish/rollback workflow. Explicitly list any unverified motion, missing media, legal review, provider setup or production authorization still outstanding.')
p('The initial version should remain a focused CMS: structured documents, section registry, media library, roles, preview, revisions and publishing. Do not expand scope into ecommerce, arbitrary plugin execution, multitenancy, a generic freeform website builder or real-time multiplayer editing without a separate request.')
heading('16. Official sources and required revalidation')
p('Consult current provider documentation at implementation time. Authentication helpers, cache APIs, Cloudinary signing and private delivery options evolve; do not paste outdated examples unreviewed.')
for url in [
    'https://supabase.com/docs/guides/auth/server-side/nextjs',
    'https://supabase.com/docs/guides/database/postgres/row-level-security',
    'https://cloudinary.com/documentation/upload_images#authenticated_requests',
    'https://nextjs.org/docs/app/api-reference/functions/generate-metadata',
    'https://kora.framer.media/'
]: p(url)

doc.core_properties.title = 'Kora Site-wide CMS — AI Agent Implementation Handoff'
doc.core_properties.subject = 'Supabase authentication/database and Cloudinary media specification'
doc.core_properties.author = 'Project engineering handoff'
doc.save(OUTPUT)
with ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    for name in ['[Content_Types].xml', 'word/document.xml', 'word/styles.xml']:
        ElementTree.fromstring(archive.read(name))
loaded = Document(OUTPUT)
assert len(loaded.tables) >= 7
assert any('16. Official sources' in paragraph.text for paragraph in loaded.paragraphs)
words = sum(len(paragraph.text.split()) for paragraph in loaded.paragraphs)
words += sum(len(cell.text.split()) for t in loaded.tables for row in t.rows for cell in row.cells)
print(f'Created and verified {OUTPUT.name}: {words} words, {len(loaded.tables)} tables, {OUTPUT.stat().st_size} bytes.')
