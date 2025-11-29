Swipey – Software Specification
1. Overview

Swipey is a next-gen, TikTok/Tinder-style AI shopping platform.

Users scroll through an infinite feed of short product videos/cards.

They swipe right if they like a product, swipe left to skip.

Tapping a product opens a rich details view with:

More photos/video

AI-generated descriptions and styling tips

A “Try On” / virtual replica preview (Hack Vision)

A buy/visit store CTA (deep link or internal checkout).

A Brand Analytics Dashboard lets companies:

Upload products and creatives

Track engagement (views, watch time, likes, skips, CTR, conversions)

Read AI-generated insights about performance and audience.

The app should be:

Mobile-first (works like an app in mobile browser, PWA ready).

Built with modern UI kits such as shadcn/ui + Aceternity UI-style sections, on top of Tailwind CSS.

Heavily “AI-flavoured”: conversational onboarding, AI recommendations, AI insights.

2. High-Level Architecture
2.1 Suggested Tech Stack

Frontend:

React (SPA, mobile-first; can be Vite or Next.js)

TypeScript

Tailwind CSS

shadcn/ui components (Buttons, Cards, Navigation, Dialogs, Tabs, etc.)

Aceternity-style UI sections (hero, spotlight, card carousels, scroll animations)

Framer Motion for animations (swipe, transitions)

TanStack Query (React Query) for data fetching & caching

Zustand or Redux Toolkit for local state (user session, preferences, feed state)

Backend:

Supabase (primary backend):

Postgres DB

Auth

Row-level security where needed

Storage (product images/videos, user avatars)

Python Flask microservice(s) for:

AI integrations (e.g. Gemini, vision try-on service)

Any custom business logic not convenient directly in Supabase

Optional: Cloudflare for CDN/edge caching and reverse proxy

AI Services:

Gemini (or similar LLM) for:

Onboarding chat & preference extraction

Product description enhancement and style tips

Analytics summarization (insights for brands)

Vision/try-on service (“Hack Vision”):

HTTP API that takes user avatar + clothing item

Returns composite image/video of virtual try-on

3. User Roles

Shopper / End User

Browses product feed

Swipes like/dislike

Views details, tries virtual try-on

Clicks through to buy

Manages profile & preferences

Brand / Company User

Manages brand profile

Uploads products and creatives

Views dashboards, analytics, and AI insights

Admin

Manages users, brands, products

Moderates content

Oversees system health and feature flags

4. Frontend Pages & UI Components
4.1 Public Pages
4.1.1 Landing Page (/)

Purpose: Marketing + entry point for shoppers and brands.

Sections (use Aceternity/shadcn-style blocks):

Hero:

Big headline (“Swipe, Like, Shop – AI-Powered Product Discovery”)

Background video/animation of swipe UI

CTA buttons: “Start Swiping” & “For Brands”

How it works (3-step cards):

“Tell us your vibe”

“Swipe through smart feed”

“Shop in one tap”

Brand benefits section:

Cards highlighting analytics, AI insights, and easy product upload.

Live preview strip:

Horizontally scrollable fake product cards (shadcn Cards with Framer Motion hover effects).

Footer:

Links: About, Terms, Privacy, Contact, Brand Login, Admin Login.

4.1.2 Auth Pages

Login / Signup (/auth)

Tabs or segmented control for:

Shopper

Brand

Components:

shadcn forms (input, password, button, error messages).

Integrate Supabase Auth (email/password + optional OAuth).

Password reset flow.

4.2 Shopper Experience
4.2.1 Onboarding – AI Preference Chat (/onboarding)

Purpose: Gather style, size, product category preferences via conversational UI.

UI:

Split layout:

Left/top: Chat window (bubble list) with AI messages and user replies.

Right/bottom (optional): Live updating “Your vibe” summary card.

Use:

shadcn Chat-style components (or custom with Cards + Avatars)

Multi-choice quick replies (chips/pills)

Steps:

Basic profile confirmation (name, age range)

Style preferences (minimalist, streetwear, formal, etc.)

Sizes (e.g., clothing sizes, shoe size)

Budget range

On completion:

Persist “preference profile” to Supabase

Redirect to main feed

4.2.2 Swipe Feed (/app/feed)

Core screen; must be highly polished.

UI:

Full-screen, vertically scrollable “stack” of cards, each representing one product.

Each card:

Video/hero image (auto-playing short video like TikTok)

Overlays:

Product name, brand, price

Tags/chips (AI-generated style tags)

Floating action buttons (round shadcn buttons with icons):

❌ Dislike (left)

❤️ Like (right)

ⓘ Details (opens sheet/modal)

Gestures:

Swipe left = dislike

Swipe right = like

Swipe up / tap details for full view

Bottom bar:

Icons for: Feed, Saved, Profile.

State:

Feed loaded via API (paginated) using React Query.

Optimistic updates when user swipes.

Local state for “current card index” and animations.

4.2.3 Product Detail / Try-On (/app/product/:id)

UI elements:

Hero media:

Carousel of images + videos (shadcn Tabs or Carousel)

Product info:

Title, brand, price

AI-enhanced description (from AI service)

Key properties (material, fit, size chart)

Try-On section:

If user has avatar/body profile:

Image of avatar wearing clothing.

Button “Generate new look” to call vision API.

If not:

CTA to “Create your virtual self” (link to avatar setup).

Actions:

Primary button: “Buy now” (opens vendor link or internal checkout placeholder).

Secondary: “Save to Wishlist”.

Related products (horizontal scroll of product cards).

Micro-copy:

AI-generated styling tips (“Pairs well with…”).

4.2.4 Profile & Preferences (/app/profile)

Sections:

Profile header:

Avatar, name, basic bio

Preferences:

Chips/cards showing their style, size, categories, etc.

“Edit Preferences” button opens a multi-step form or mini AI chat to update.

Saved products:

Grid/list of liked items.

Settings:

Account settings, logout, notification preferences.

4.2.5 Avatar / Virtual Replica Setup (/app/avatar)

UI:

Instructions card about privacy and use of images.

Options:

Upload front-view photo (or multiple angles).

Choose from body templates (if user does not want to upload).

Preview:

Show generated avatar placeholder and status (“Processing…”).

On completion:

Store avatar URL & metadata in Supabase.

4.3 Brand / Company Dashboard
4.3.1 Brand Home (/brand)

Overview cards:

Total views

Likes

CTR

Conversion (if available)

AI Insight panel:

Text summary generated by AI:

“Your best performing segment is…”

“Users love your [category] among [age range]…”

Quick actions:

“Upload New Product”

“View Products”

“Export Data”

4.3.2 Product Management (/brand/products)

Table / grid of products:

Thumbnail, name, status (active/draft), creation date, engagement stats snippet.

Actions:

Create, edit, deactivate, delete.

Filters:

Category, active/inactive, performance (high/low).

Product Form (/brand/products/new or /brand/products/:id/edit):

Fields:

Name, category, price, SKU

Description (editable; can be AI-assisted)

Media upload (images/videos to Supabase Storage)

External purchase link

Button: “AI-suggest description & tags” (calls AI endpoint).

4.3.3 Analytics (/brand/analytics)

Use a modern dashboard layout with shadcn Cards and charts.

Sections:

Time-series charts:

Views over time

Likes vs. dislikes

Click-through rate

Funnel visualization:

Views → Likes → Detail views → Clicks

Audience breakdown:

Device, region (if tracked), preference segments

AI summary:

A card with LLM-generated insights: what worked, experiments to try.

4.4 Admin Panel
4.4.1 Admin Dashboard (/admin)

Cards summarizing:

Users
Brands
Products

Total swipes

Moderation queue:

List of content flagged for review.

4.4.2 User Management (/admin/users)

Table: id, email, role, created_at, status.

Actions: promote/demote, ban, view details.

4.4.3 Brand and Product Management (/admin/brands, /admin/products)

Similar to brand views but cross-brand.

Ability to approve/reject products, mark as featured.

5. Backend Design
5.1 Data Models (Supabase / Postgres)

users

id (uuid, PK)

email

role ("shopper" | "brand" | "admin")

created_at

display_name

avatar_url

onboarding_completed (bool)

brand_profiles

id (uuid, PK)

user_id (FK → users.id)

brand_name

logo_url

website_url

description

created_at

preference_profiles

id (uuid, PK)

user_id (FK → users.id)

style_tags (text[] or JSONB)

sizes (JSONB)

budget_range (JSONB or simple min/max)

categories (text[])

products

id (uuid, PK)

brand_id (FK → brand_profiles.id)

name

category

price (numeric)

description

external_url

status ("active" | "draft" | "archived")

created_at

updated_at

product_media

id (uuid, PK)

product_id (FK → products.id)

type ("image" | "video")

url

sort_order (int)

swipes

id (uuid, PK)

user_id (FK → users.id)

product_id (FK → products.id)

direction ("like" | "dislike")

created_at

views

id (uuid, PK)

user_id (FK → users.id, nullable for anon)

product_id

duration_ms

created_at

clicks

id (uuid, PK)

user_id (nullable)

product_id

created_at

target (e.g. "buy_link")

avatars

id (uuid, PK)

user_id (FK → users.id)

avatar_image_url

metadata (JSONB, optional – body metrics, etc.)

created_at

ai_logs (optional, for debugging/analytics)

id (uuid)

user_id (nullable)

type ("onboarding" | "analytics_summary" | "description_gen")

input (JSONB)

output (JSONB)

created_at

5.2 Core Backend Services / Functions
5.2.1 Auth

Use Supabase Auth (email/password).

Backend ensures role-based access:

Shopper vs brand vs admin.

Backend endpoints should verify JWTs (via Supabase client libs).

5.2.2 Feed Generation

Endpoint: GET /api/feed

Params:

cursor (optional, for pagination)

limit (optional)

Use user_id from auth token.

Logic (MVP):

Get user’s preference_profiles.

Prioritize products:

That match preferred categories/style tags.

That user has not swiped yet.

Order by recency and simple relevance.

Return:

products[] with embedded media and brand info.

next_cursor.

Later this can be replaced by more advanced recommendation logic.

5.2.3 Swipes & Events

Endpoint: POST /api/swipes

Body:

{
  "product_id": "uuid",
  "direction": "like" | "dislike"
}


Persist to swipes table.

Return updated summary (likes count, etc.) if needed.

Endpoint: POST /api/views

Endpoint: POST /api/clicks

All used to populate analytics.

5.2.4 Product CRUD (Brand)

Endpoint: GET /api/brand/products

List products filtered by brand_id from token.

Endpoint: POST /api/brand/products

Create product (name, price, category, description, etc.).

Endpoint: PUT /api/brand/products/:id

Update product if owned by brand.

Endpoint: DELETE /api/brand/products/:id

Soft delete or archive.

Media Upload Flow:

Use Supabase storage:

Request signed upload URL from backend or directly from client with Supabase.

Store resulting URLs in product_media.

5.2.5 Analytics API

Endpoint: GET /api/brand/analytics/overview

Returns aggregated metrics for brand:

Total views

Total likes/dislikes

CTR

Top products (by likes, watch time, clicks)

Endpoint: GET /api/brand/analytics/product/:id

Product-level breakdown.

Endpoint: POST /api/brand/analytics/ai-summary

Body:

{
  "time_range": "last_7_days",
  "focus": "engagement" 
}


Backend:

Fetch aggregated analytics data.

Call AI service (Gemini/LLM) with data summary.

Return generated text for UI panel.

5.2.6 Onboarding AI Service

Endpoint: POST /api/onboarding/ai

Body:

{
  "conversation": [ { "role": "user" | "assistant", "content": "..." } ]
}


Relay to AI model with a system prompt:

Goal: extract preferences, ask few targeted questions.

Return model’s reply for frontend chat.

Additional endpoint: POST /api/onboarding/finalize to parse conversation and store structured preference_profiles.

5.2.7 Product Description & Tag Generation

Endpoint: POST /api/brand/products/:id/generate-copy

Body:

{
  "base_description": "string",
  "tone": "playful" | "minimalist" | "luxury"
}


Call LLM to create improved description + style tags.

Save back to DB or just return to UI for confirmation.

5.2.8 Virtual Try-On Service Integration (Hack Vision)

Endpoint (internal): POST /api/tryon/generate

Body:

{
  "user_id": "uuid",
  "product_id": "uuid"
}


Backend:

Fetch user avatar from avatars table.

Fetch product media (or a specific try-on compatible image).

Call external vision API:

Input: avatar image + product image + any metadata

Save resulting composite image URL in Supabase storage.

Return the URL to frontend.

5.2.9 Admin APIs

User listing: GET /api/admin/users

Brand listing: GET /api/admin/brands

Product moderation: PUT /api/admin/products/:id/status

Flagged content handling.

All secured by role check (admin).

6. Non-Functional Requirements

Responsive UI: Designed mobile-first, but works on desktop.

Performance:

Lazy-load media.

Prefetch next few products in feed.

Security:

All endpoints require auth tokens where applicable.

Row-level security in Supabase enforced for per-brand data.

Observability:

Basic logging for AI calls, feed performance.

PWA Ready:

Add manifest, icons, and a service worker for offline shell and home screen install.

7. Implementation Notes for AI Code Generation

Use TypeScript throughout frontend.

Use a modular structure:

/frontend

src/components/* (shadcn + custom UI)

src/pages/**/* (if Next) or src/routes/**/* (if Vite+router)

src/hooks/*

src/lib/api.ts (API client)

src/state/* (Zustand/Redux stores)

/backend

app/main.py (Flask entry)

app/routes/*.py (grouped by feature: auth, feed, analytics, ai, tryon, admin)

app/services/*.py (LLM client, Supabase client)

app/models (if using SQLAlchemy) – note: DB is Supabase Postgres.

Clearly separate:

Core APIs (CRUD, feed, analytics)

AI helper APIs (onboarding, copy generation, analytics summary)

Media/try-on integration.

This spec should give an AI coding assistant enough structure to:

Scaffold the frontend (React + Tailwind + shadcn + Aceternity-style sections).

Scaffold the backend (Flask + Supabase integration + AI routes).

Implement pages, components, and endpoints aligned with the described flows