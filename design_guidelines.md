# CineSense Design Guidelines

## Design Approach

**Reference-Based Approach** drawing inspiration from modern streaming platforms (Netflix, Spotify, Apple TV+) combined with entertainment discovery platforms (IMDb, Letterboxd). The design emphasizes visual storytelling, mood-driven aesthetics, and cinematic immersion while maintaining functional clarity.

---

## Core Design Principles

1. **Cinematic Immersion**: Large-format imagery creates emotional connection
2. **Mood-Driven Aesthetics**: Visual treatments reflect emotional states
3. **Content-First Layout**: Movie posters and backdrops take center stage
4. **Intelligent Hierarchy**: Guide users from mood → discovery → action
5. **Seamless Transitions**: Smooth navigation between emotional states and content

---

## Typography

**Primary Font**: Inter (via Google Fonts CDN)
- Headings: 600-700 weight, tracking-tight
- Body: 400-500 weight, leading-relaxed
- UI Elements: 500-600 weight, tracking-normal

**Type Scale**:
- Hero Headlines: text-5xl to text-7xl (landing), text-4xl (dashboard)
- Section Headers: text-3xl to text-4xl
- Card Titles: text-xl to text-2xl
- Body Text: text-base to text-lg
- Metadata: text-sm to text-xs

---

## Layout System

**Spacing Framework**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-24
- Card gaps: gap-4 to gap-6
- Grid gaps: gap-6 to gap-8

**Container Strategy**:
- Full-width hero sections with inner max-w-7xl
- Content sections: max-w-6xl centered
- Card grids: w-full with responsive columns
- Dashboard: max-w-7xl with sidebar layouts

**Grid Patterns**:
- Movie cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard widgets: grid-cols-1 lg:grid-cols-3

---

## Component Library

### Landing Page Components

**Hero Section** (Full viewport height):
- Large backdrop image with gradient overlay (bottom-to-top fade)
- Centered content with max-w-4xl
- Hero headline + subtitle with generous spacing (space-y-6)
- Dual CTAs: Primary "Get Started" + Secondary "Learn More" with backdrop-blur-md bg-white/10 treatment
- Floating "Trending Now" preview cards at bottom (absolute positioning)

**Mood Philosophy Section**:
- 2-column layout (image + content) on desktop, stacked mobile
- Large mood icon illustrations
- Numbered features list with text-lg descriptions

**Features Showcase** (3-column grid):
- Icon-based feature cards with hover lift effect
- Title + description + "Learn More" link
- Generous card padding (p-8) with rounded-2xl borders

**How It Works Timeline**:
- Horizontal step indicators on desktop, vertical on mobile
- Large step numbers with connecting lines
- Screenshot mockups for each step
- Alternating image-text layout

**Social Proof Section**:
- 3-column testimonial cards with user avatars
- Star ratings display
- User name + watching habits metadata

**CTA Footer Section**:
- Full-width with gradient background treatment
- Centered content with email capture form
- Inline form with primary button

### Authentication Pages

**Login/Register Forms**:
- Centered card layout max-w-md
- Form container with p-8 padding
- Input groups with space-y-6
- Social auth buttons in grid-cols-2
- Decorative background with subtle movie-themed patterns

### Dashboard Components

**Mood Selector Interface**:
- 6-card grid (grid-cols-2 md:grid-cols-3 lg:grid-cols-6)
- Large mood emoji/icon (text-6xl)
- Mood label below
- Active state: ring-4 border treatment with scale-105
- Smooth transition-all duration-300

**AI Mood Detector Card**:
- Prominent card with p-6 to p-8 padding
- Textarea with min-h-32
- "Analyze Mood" button with loading state
- Result display with detected mood + confidence meter

**Recommendation Cards** (Movie Cards):
- Poster image aspect-[2/3] with rounded-lg overflow-hidden
- Hover state: scale-105 transform with shadow-2xl
- Overlay gradient on hover revealing: title, rating, quick actions
- Watchlist heart icon (top-right absolute)
- Rating display (bottom-left absolute)

**Dashboard Sidebar** (lg:w-64):
- User profile section at top with avatar + name
- Navigation menu with space-y-2
- Active state: background treatment + left border accent
- Logout button at bottom

**Stats Cards**:
- Grid layout for mood distribution, total movies watched, ratings given
- Large number display (text-4xl to text-5xl)
- Label text-sm below
- Icon accent in corner

### Movie Discovery

**Search Bar**:
- Full-width with max-w-2xl centered
- Large input field (h-14) with rounded-full
- Search icon inside input (absolute left)
- Dropdown results with backdrop-blur effect

**Trending Section**:
- Horizontal scroll container on mobile
- Grid on desktop (grid-cols-4 to grid-cols-5)
- "Trending" badge on cards (top-left)

**Movie Detail Page**:
- Hero: Large backdrop image with heavy bottom gradient
- Content overlay: title, tagline, metadata row (year, runtime, rating)
- Action buttons: "Add to Watchlist", "Rate Movie", "Watch Trailer"
- 2-column layout below: Synopsis (2/3) + Details sidebar (1/3)
- Cast grid: grid-cols-3 md:grid-cols-4 with circular avatars
- Trailer embed section (16:9 aspect ratio)
- Similar movies section at bottom

### Watchlist

**Watchlist Grid**:
- Masonry-style layout or standard grid
- Filter/sort controls at top (flex justify-between)
- Remove button on hover (trash icon)
- Empty state: centered illustration + CTA

### Analytics Dashboard

**Mood Distribution Chart**:
- Bar chart or donut chart visualization
- Color-coded by mood type
- Interactive hover states

**Mood History Timeline**:
- Chronological list with date stamps
- Mood indicator icons
- View details expand/collapse

---

## Navigation

**Main Header** (sticky top-0):
- Logo on left (text-2xl font-bold)
- Center navigation: "Discover", "Watchlist", "Analytics" (hidden on mobile)
- Right: Search icon, User avatar dropdown
- Mobile: Hamburger menu with slide-out drawer

**Footer**:
- 4-column grid on desktop, stacked mobile
- Logo + tagline column
- Quick links (Discover, Trending, Genres)
- Resources (About, FAQ, Contact)
- Newsletter signup form
- Social icons + copyright at bottom

---

## Interactive States

**Buttons**:
- Primary: Large (h-12 px-8), rounded-lg, font-semibold
- Secondary: Outlined with hover fill transition
- Ghost: Transparent with hover background
- Icon buttons: Circular (h-10 w-10) with hover scale

**Cards**:
- Default: border + subtle shadow
- Hover: shadow-xl + translate-y-[-4px]
- Active/Selected: ring-2 treatment

**Form Inputs**:
- Height: h-12
- Padding: px-4
- Border: rounded-lg with focus ring-2
- Labels: text-sm font-medium mb-2

---

## Animations

**Use Sparingly - Only Where They Add Value**:
- Mood selector: Scale on selection (scale-105)
- Movie cards: Hover lift (translate-y-[-4px])
- Page transitions: Fade in content (opacity animation)
- Loading states: Pulse skeleton screens

---

## Images

**Hero Image** (Landing Page):
- Full-width cinematic movie backdrop (1920x1080 minimum)
- Scene showing diverse people enjoying movies together OR iconic movie montage
- Dark gradient overlay from bottom (opacity-90 to transparent)

**Feature Section Images**:
- Mood selector interface screenshot/illustration
- AI detection visualization mockup  
- Movie recommendation cards preview

**Dashboard Images**:
- Movie posters via TMDb API (aspect-[2/3])
- Movie backdrops for detail pages (aspect-[16/9])
- User avatars (circular, 40x40 to 200x200)

**Empty States**:
- Friendly illustrations for empty watchlist, no search results
- Simple, modern line-art style

---

## Responsive Behavior

- Mobile: Single column, stacked navigation, bottom tab bar
- Tablet: 2-3 column grids, visible main navigation
- Desktop: Full grid layouts, sidebar navigation, hover interactions

This design creates an emotionally engaging, visually rich platform that makes movie discovery feel personal and exciting while maintaining clear navigation and functionality.