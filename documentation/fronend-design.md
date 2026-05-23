# AI Emoji Maker — Frontend Design Overview

**Tech stack (brief):** Next.js 16 App Router with React 19, TypeScript, Tailwind CSS, Radix UI primitives, and a FastAPI + Supabase backend. All auth and generation state is managed client-side via React Context.

---

## Landing Page

The entry point is a bold, full-screen hero page built around a dark-to-light gradient background with two large ambient glow blobs — one purple in the top-left, one primary-blue in the bottom-right — giving the page a modern, atmospheric depth. A sticky header sits above with the app logo (a rounded square icon housing a smile glyph) and navigation links that adapt based on authentication state: unauthenticated users see **Sign In** and **Sign Up** buttons styled with a gradient fill; authenticated users see **Dashboard** and **Start Creating** instead.

The hero section opens with a large badge chip reading *"Your Personal Emoji Studio"*, followed by a bold display headline — "Unleash Your Inner **Emoji Artist.**" — where the accent words are rendered in a vivid purple-to-pink gradient text. A two-line subtitle sits below in muted tones, and the primary call-to-action is an inline tabbed card that lets users sign in or sign up without ever leaving the page. Below the fold, three feature cards arranged in a responsive grid highlight **Multiple Styles**, **Iterative Remixing**, and **Lightning Fast** generation, each with a coloured icon badge, bold title, and short description.

---

## Authentication Screens

The `/sign-in` and `/sign-up` pages share the same auth layout: a centred card floats over a gradient backdrop with blur-glass decorative orbs. Each form is clean and minimal — an email field and password field with left-aligned icons, clear labels, and rounded pill-style inputs. Error messages appear inline as a red alert strip with an icon. The Sign Up flow additionally shows a dedicated **email verification screen** after successful registration, with a green mail icon and a prompt to check their inbox before signing in.

---

## Studio Dashboard (App Page)

After authentication, users land on the **Studio Dashboard** — a three-column layout at large screen widths that collapses gracefully to a stacked single-column on mobile.

### Left Panel — Studio Generator
The leftmost column is the creative control centre. It contains a multi-line textarea for the natural-language prompt (with a placeholder like *"A happy steaming coffee cup during early morning standup call..."*), plus a row of **Quick Suggestion** chips below it for instant inspiration. Three segmented button groups let users pick **Image Size** (128 / 256 / 512 px), **Art Style** (Flat, Sticker, Doodle, Pixel, Mascot), and **Mood** (Happy ☕, Tired, Confused 🤔, Celebrate 🚀). Selected options highlight with a primary-colour ring and fill. At the bottom is a full-width gradient **Generate Emoji** button; while generating it shows an animated spinner with the label *"Crafting Emoji..."* A small usage counter below the button tells users how many free generations remain.

### Center Panel — Generated Gallery
The middle column is the emoji gallery. A tab bar at the top filters between **All**, **Favorites** (with a filled heart icon), and **Stickers**. Each emoji card has a coloured SVG or AI-generated image thumbnail, a style badge chip, a favouriting heart button, the original prompt text, the mood, and a footer row of quick actions: **Remix** (reloads the prompt into the left panel), a download icon, and a delete button that fades in only on hover. Cards subtly lift on hover with a shadow and slight upward translate. A pulsing dashed skeleton card appears at the top of the grid during generation.

### Right Panel — Inspector & Export
The rightmost column is the export station. When an emoji is selected, a large preview renders it at 160×160 px with a hover-scale animation. Below it are **Remix** and **Favorite** action chips. A labelled toggle switch controls transparent vs. coloured background for the export. Four resolution presets — 400 px (Ultra HD), 128 px (Slack/Teams), 72 px (Discord), and 32 px (Favicon) — are displayed as selectable cards with a checkmark on the active one. Two export buttons sit at the bottom: a solid primary-coloured **Download PNG** and an outlined **Download ZIP Package** that bundles all four sizes plus a metadata JSON file.

---

## Navbar & Upgrade Modal

The sticky top navbar shows the logo, a pill-shaped **generation counter** (with a lightning bolt icon that pulses red when depleted), and a plan badge. Clicking either opens the **Upgrade Modal** — a centred dialog with blurred glow accents, a gradient sparkle icon, three plan tiers (Free, Premium at ₹100/mo, Ultra at ₹500/mo), and a live progress bar showing weekly usage. The current plan is highlighted and buttons adapt contextually (Current Plan, Upgrade, or Downgrade).
