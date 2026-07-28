## 1. Design Intent
Khattak Eyewear should feel like an international luxury eyewear house: polished, confident, editorial, and modern. The system must avoid generic marketplace UI and instead emphasize visual restraint, premium image framing, sharp hierarchy, and elegant motion.

### Core Principles
1. Premium before promotional
2. Editorial before template
3. Clarity before ornament
4. Consistency before novelty
5. Motion with purpose, never noise
6. Trust signals integrated into the visual language
7. Components first, one-off layouts last

## 2. Brand Personality
- Premium
- Luxury
- Fashion-forward
- Elegant
- Minimal
- Modern
- Editorial
- Professional
- Trustworthy
- Innovative

### Experience Tone
- Calm, deliberate, refined
- Strong imagery with generous whitespace
- Sharp pricing and product information hierarchy
- High-quality micro-interactions that feel tactile and intentional

## 3. Color System

### 3.1 Core Tokens
| Token | Value | Usage |
|------|-------|-------|
| `color.brand.primary` | `#111111` | Primary text, core buttons, anchors, premium emphasis |
| `color.bg.canvas` | `#FFFFFF` | Main page background |
| `color.bg.surface` | `#F8F9FA` | Secondary surfaces, cards, elevated sections |
| `color.accent.teal` | `#0F766E` | Premium accent, trust callouts, success leaning actions |
| `color.accent.blue` | `#2563EB` | Informational emphasis, secondary accents, interactive highlights |
| `color.border.default` | `#E5E7EB` | Inputs, cards, dividers |
| `color.text.secondary` | `#6B7280` | Supporting text, metadata, helper content |

### 3.2 Semantic Tokens
| Token | Value | Usage |
|------|-------|-------|
| `color.text.primary` | `#111111` | Headings, body, price |
| `color.text.secondary` | `#6B7280` | Metadata, subdued content |
| `color.text.inverse` | `#FFFFFF` | Text on dark surfaces |
| `color.text.tertiary` | `#9CA3AF` | Disabled or tertiary metadata |
| `color.success` | `#15803D` | Stock, order success, positive status |
| `color.warning` | `#D97706` | Warnings, low stock |
| `color.danger` | `#DC2626` | Error, destructive actions |
| `color.info` | `#2563EB` | Info banners, instructional messaging |

### 3.3 Interactive States
| Token | Value |
|------|-------|
| `color.interactive.primary.hover` | `#000000` |
| `color.interactive.primary.active` | `#1F1F1F` |
| `color.interactive.secondary.hover` | `#F3F4F6` |
| `color.interactive.outline.hover` | `#F9FAFB` |
| `color.interactive.teal.hover` | `#115E59` |
| `color.interactive.blue.hover` | `#1D4ED8` |
| `color.interactive.disabled.bg` | `#E5E7EB` |
| `color.interactive.disabled.text` | `#9CA3AF` |
| `color.focus.ring` | `rgba(37, 99, 235, 0.35)` |

### 3.4 Badge Colors
| Badge | Background | Text |
|------|------------|------|
| Discount | `#111111` | `#FFFFFF` |
| New Arrival | `#0F766E` | `#FFFFFF` |
| Limited | `#7C2D12` | `#FFF7ED` |
| Out of Stock | `#F3F4F6` | `#6B7280` |
| Success | `#DCFCE7` | `#166534` |
| Warning | `#FEF3C7` | `#92400E` |
| Danger | `#FEE2E2` | `#991B1B` |
| Info | `#DBEAFE` | `#1D4ED8` |

### 3.5 Gradient and Section Backgrounds
| Token | Value | Usage |
|------|-------|-------|
| `gradient.hero.mist` | `linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 55%, #EEF2F7 100%)` | Luxury hero and editorial intros |
| `gradient.accent.deep` | `linear-gradient(135deg, #111111 0%, #1F2937 100%)` | Dark CTA bands |
| `gradient.surface.soft` | `linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)` | Subtle premium sections |
| `section.bg.default` | `#FFFFFF` | Primary sections |
| `section.bg.soft` | `#F8F9FA` | Feature and testimonial sections |
| `section.bg.dark` | `#0F172A` | High-contrast narrative or CTA sections |

### 3.6 Dark Mode Ready Mapping
| Light Token | Dark Equivalent |
|------------|-----------------|
| `#FFFFFF` | `#0B0B0C` |
| `#F8F9FA` | `#111214` |
| `#111111` | `#F5F5F5` |
| `#6B7280` | `#A1A1AA` |
| `#E5E7EB` | `#27272A` |
| `#0F766E` | `#14B8A6` |
| `#2563EB` | `#60A5FA` |

## 4. Typography System

### Font Roles
- Display and headings: `Playfair Display`
- Body, labels, buttons, forms, helper text: `Inter`

### Typography Scale
| Style | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|------|
| Display XL | `72px` | `80px` | 700 | Hero headlines on large desktop |
| Display | `60px` | `68px` | 700 | Section-defining statements |
| H1 | `48px` | `56px` | 700 | Major page titles |
| H2 | `40px` | `48px` | 700 | Section headers |
| H3 | `32px` | `40px` | 600 | Subsection headers |
| H4 | `28px` | `36px` | 600 | Card or feature group titles |
| H5 | `24px` | `32px` | 600 | Dense sections |
| H6 | `20px` | `28px` | 600 | Utility headings |
| Body Large | `18px` | `30px` | 400 | Lead paragraphs |
| Body | `16px` | `28px` | 400 | Default text |
| Small | `14px` | `22px` | 400 | Metadata and secondary copy |
| Caption | `12px` | `18px` | 500 | Tiny support text |
| Button Large | `16px` | `24px` | 600 | Main CTAs |
| Button | `14px` | `20px` | 600 | Standard buttons |
| Label | `13px` | `18px` | 600 | Field labels |
| Helper Text | `12px` | `18px` | 400 | Help and assistive copy |
| Error Text | `12px` | `18px` | 500 | Validation messages |

### Typography Rules
- Use Playfair Display sparingly for prestige moments; never for dense UI.
- Keep body text in Inter for legibility, pricing clarity, and filtering flows.
- Reduce font variety by leaning on size, spacing, and weight rather than switching families.
- Maintain generous heading margins to preserve editorial rhythm.

## 5. Spacing, Grid, Radius, and Shadows

### 5.1 Spacing Scale
8px base system:

| Token | Value |
|------|-------|
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.5` | `20px` |
| `space.6` | `24px` |
| `space.8` | `32px` |
| `space.10` | `40px` |
| `space.12` | `48px` |
| `space.16` | `64px` |
| `space.20` | `80px` |
| `space.24` | `96px` |

### 5.2 Layout Rules
| Item | Value |
|------|-------|
| Max container | `1440px` |
| Content container | `1280px` |
| Desktop columns | `12` |
| Tablet columns | `8` |
| Mobile columns | `4` |
| Desktop gutter | `24px` |
| Tablet gutter | `20px` |
| Mobile gutter | `16px` |
| Section spacing desktop | `96px - 144px` |
| Section spacing tablet | `72px - 96px` |
| Section spacing mobile | `56px - 72px` |

### 5.3 Component Padding
| Item | Value |
|------|-------|
| Card padding compact | `20px` |
| Card padding standard | `24px` |
| Card padding spacious | `32px` |
| Button horizontal | `16px / 20px / 24px` by size |
| Button vertical | `10px / 12px / 14px` by size |
| Input horizontal | `16px` |
| Input vertical | `12px` |

### 5.4 Border Radius
| Token | Value | Usage |
|------|-------|-------|
| `radius.sm` | `8px` | Small badges, chips |
| `radius.md` | `12px` | Inputs, buttons |
| `radius.lg` | `16px` | Cards, dropdowns |
| `radius.xl` | `24px` | Feature cards, large overlays |
| `radius.full` | `999px` | Pills, round buttons |

### 5.5 Shadow Levels
| Token | Value | Usage |
|------|-------|-------|
| `shadow.sm` | `0 4px 12px rgba(17, 17, 17, 0.06)` | Inputs, soft lifts |
| `shadow.md` | `0 12px 30px rgba(17, 17, 17, 0.08)` | Cards |
| `shadow.lg` | `0 20px 50px rgba(17, 17, 17, 0.12)` | Hovered cards, floating panels |
| `shadow.xl` | `0 28px 80px rgba(17, 17, 17, 0.16)` | Modals, premium hero overlays |

## 6. Iconography
- Style: premium stroke icons with consistent optical weight and slightly rounded terminals
- Visual tone: refined, quiet, high legibility
- Default stroke width: `1.75`

### Sizing
| Size | Value | Usage |
|------|-------|-------|
| XS | `14px` | Dense metadata |
| SM | `16px` | Inputs, compact actions |
| MD | `20px` | Standard navigation and buttons |
| LG | `24px` | Feature highlights |
| XL | `32px` | Empty states or hero utility |

### Sets
- Navigation icons: menu, search, profile, heart, cart, location
- Action icons: close, plus, minus, chevron, filter, sort, share
- Product icons: frame, lens, UV, fit, material
- Feature icons: shipping, guarantee, premium care, authenticity
- Status icons: success, warning, error, info
- Social icons: Instagram, Facebook, TikTok, YouTube, WhatsApp

## 7. Button System

### Variants
| Variant | Base Treatment |
|--------|----------------|
| Primary | Black fill, white text, luxury depth |
| Secondary | Soft surface fill, dark text, understated contrast |
| Outline | Transparent fill, dark border, subtle hover fill |
| Ghost | Text-first action for low emphasis |
| Danger | Red-tinted destructive action |
| Success | Teal/green positive action |
| Icon Button | Circular or rounded-square icon action |
| Floating Button | Elevated fixed helper action |
| Large CTA | High-importance conversion action |
| Small CTA | Compact promotional or inline action |

### State Rules
- Hover: darker or deeper surface, stronger shadow, 1-2px lift
- Focus: visible focus ring using semantic focus token
- Disabled: muted background, muted text, no shadow, no lift
- Loading: preserve width, show spinner, reduce pointer events
- Active / Pressed: shadow compresses slightly and transform returns to base

## 8. Input System

### Shared Rules
- Height: `48px` standard, `56px` large search field
- Border: 1px neutral border
- Focus: accent ring plus darker label
- Error: border and helper text switch to danger tone
- Disabled: surface fill and muted text

### Supported Inputs
- Text Input
- Search Input
- Password
- Textarea
- Dropdown
- Select
- Checkbox
- Radio
- Toggle
- Slider
- OTP
- Quantity Selector
- Image Upload
- Coupon Field
- Payment Upload

### States
Default, Hover, Focused, Disabled, Error

## 9. Card System

### Card Types
- Product Card
- Category Card
- Brand Card
- Review Card
- Feature Card
- Statistic Card
- Dashboard Card
- Information Card
- Empty State Card

### Universal Card Rules
- Use consistent radius and shadow tiers
- Prioritize image quality and whitespace
- Avoid overcrowded metadata
- Use sectional dividers sparingly
- Support skeleton loading and hover elevation when interactive

## 10. Signature Product Card
This is the most important reusable component in the entire storefront.

### Required Elements
- Large product image
- Hover image transition
- Discount badge
- Wishlist action
- Quick view action
- Rating and review count
- Brand
- Product name
- Price and old price
- Color swatches
- Stock badge
- Add to cart action

### Behavior
- Card lift: `translateY(-4px)` with `shadow.lg`
- Image zoom: `scale(1.04)` on media hover
- Secondary image fade: crossfade over `240ms`
- Wishlist: icon fill transition with tactile scale pop
- Add to cart: reveal or intensify on hover for desktop, always visible on touch

### Visual Hierarchy
1. Product image
2. Brand and product name
3. Price stack
4. Secondary metadata
5. Action controls

## 11. Navigation System
- Announcement Bar
- Sticky Navbar
- Mega Menu
- Mobile Navigation Drawer
- Sidebar
- Breadcrumb
- Tabs
- Pagination

### Navigation Rules
- Navbar stays visually light until scroll threshold, then gains blur and shadow
- Mega menu uses editorial columns, brand storytelling, and premium category thumbnails
- Mobile navigation should feel calm and layered, not cramped
- Breadcrumbs stay minimal and text-led

## 12. Component Library
- Accordion
- Modal
- Drawer
- Tooltip
- Popover
- Toast
- Alert
- Badge
- Chip
- Avatar
- Tag
- Divider
- Progress Bar
- Timeline
- Rating
- Review Stars
- Price Badge
- Quantity Stepper
- Filter Panel
- Search Overlay
- Newsletter Box
- Footer

## 13. Animation System
Framer Motion is the shared motion engine.

### Motion Principles
- Duration range: `180ms` to `700ms`
- Easing: refined cubic-bezier curves, not bouncy consumer-app motion
- Reduced motion: convert non-essential motion to fade

### Motion Presets
| Motion | Usage |
|-------|-------|
| Fade | Text, overlays, helper transitions |
| Slide | Drawers, panels, mega menus |
| Scale | Buttons, wishlist, image emphasis |
| Rotate | Minimal use for loaders or icon cues |
| Reveal | Section entry, editorial content |
| Image Zoom | Product media and hero photography |
| Floating | Subtle layered objects in hero |
| Hero Animation | Staggered text and image entrance |
| Card Hover | Lift, shadow deepen, media zoom |
| Button Hover | Lift and background transition |
| Navbar Transition | Background blur, shadow, compact state |
| Page Transition | Soft fade/slide between major views |
| Loading Animation | Skeleton shimmer or pulse |
| Modal Animation | Fade + scale |
| Drawer Animation | Lateral slide with backdrop fade |
| Scroll Reveal | Once-per-section luxury reveal |
| Counter Animation | Statistics and metrics only |
| Scroll Progress | Thin top progress indicator on editorial pages |

## 14. Parallax Language
Use sparingly and only where it deepens perceived premium quality.

### Approved Uses
- Hero background drift
- Floating glasses layers
- Background shapes
- Brand story image bands
- CTA sections
- Image feature sections
- Premium collection showcase
- Testimonials backdrop

### Rules
- Keep movement low amplitude
- Never compromise readability
- Disable or simplify on low-power/mobile contexts

## 15. Micro-Interactions
- Buttons: depth and press feedback
- Cards: lift and image refinement
- Wishlist: fill + scale
- Cart: count pulse on change
- Search: overlay fade with keyboard focus capture
- Forms: label, helper, and validation transitions
- Filters: chip activation and count updates
- Navigation: hover indicators and underline glide
- Images: zoom and cursor cue
- Dropdowns: rotate chevron and reveal
- Tabs: animated active bar
- Accordions: measured height and icon rotation

## 16. Loading States
- Skeleton Cards
- Skeleton Product
- Skeleton Hero
- Table Loading
- Dashboard Loading
- Image Loading
- Button Loading

### Loading Rules
- Match final layout proportions exactly
- Use soft shimmer, not flashy motion
- Reserve space to avoid layout shift

## 17. Empty States
- Wishlist
- Cart
- Orders
- Search
- Reviews
- 404
- No Products

### Empty State Rules
- Elegant illustration or icon support
- Short, confidence-building copy
- One primary action and one optional secondary action

## 18. Responsive System
Desktop first.

### Breakpoints
| Label | Width |
|------|-------|
| Desktop XL | `1440px+` |
| Desktop | `1200px - 1439px` |
| Laptop | `992px - 1199px` |
| Tablet | `768px - 991px` |
| Mobile | `<768px` |

### Responsive Rules
- Use fluid spacing between breakpoints
- Scale type and section spacing proportionally
- Convert hover-only interactions into always-visible or tap-first behavior on touch
- Keep product imagery dominant on all screen sizes

## 19. Accessibility
- WCAG-friendly contrast for text and controls
- Full keyboard navigation
- Strong visible focus states
- ARIA-ready overlays, menus, tabs, and dialogs
- Minimum touch target: `44px`
- Respect `prefers-reduced-motion`

## 20. UX Guidelines
- Keep key purchase decisions visible without clutter
- Reinforce trust through restrained messaging, authenticity signals, and premium service highlights
- Minimize friction in filtering, wishlisting, and adding to cart
- Maintain visual consistency between browsing and checkout-related experiences

## 21. Naming Convention
- Foundations: `FoundationColorScale`, `FoundationTypography`
- Primitives: `Button`, `Input`, `Badge`, `Modal`
- Commerce components: `ProductCard`, `FilterPanel`, `PriceBadge`
- Variant examples: `variant="primary"`, `size="lg"`, `tone="teal"`, `state="error"`
- Motion presets: `motion.card.hover`, `motion.modal.enter`, `motion.navbar.compress`

## 22. Folder Structure
```text
src/
  components/
    foundations/
    primitives/
    commerce/
    navigation/
    feedback/
  lib/
    tokens/
    motion/
    icons/
    utils/
    fixtures/
  styles/
  docs/
```

## 23. Governance
- No new component should be added until existing primitives cannot solve the use case
- New colors, shadows, or radii require token review first
- Every component must ship with documented states and accessibility notes
- Signature commerce components should receive design review before release

## 24. Deliverables Covered by This Foundation
1. Complete design system
2. Color tokens
3. Typography scale
4. Spacing rules
5. Grid system
6. Component library
7. Button library
8. Form library
9. Card library
10. Navigation system
11. Animation guidelines
12. Parallax guidelines
13. Hover interaction guidelines
14. Responsive rules
15. UI design principles
16. UX guidelines
17. Reusable component structure
18. Naming convention
19. Folder structure for UI components
20. Design documentation
