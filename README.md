# Paytm SmartShop AI Prototype

Clickable fintech-style prototype built with Next.js, React, and Tailwind CSS.

## What This Prototype Includes

- Landing screen with product overview and KPIs
- Merchant onboarding flow (virtual shop setup)
- Product and inventory setup with add/edit/delete
- Customer discovery (nearby shop search)
- Chat-based ordering panel with AI parsing simulation
- Auto-generated billing screen
- Simulated Paytm payment flow (link -> pay -> success)
- Merchant dashboard with incoming paid order
- Mini ERP view with stock auto-update logs
- Analytics and reports dashboard
- Demo Mode autoplay for full end-to-end showcase
- Loading states and empty states for polished UX

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- Mock local state only (no backend)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Demo Flow

You can present in two ways:

1. Manual click-through using sidebar navigation.
2. One-click autoplay using `Demo Mode: Auto Journey` in the sidebar.

The autoplay simulates:

1. Merchant setup
2. Inventory setup
3. Customer discovery
4. Chat order parsing
5. Bill generation
6. Payment success
7. Merchant dashboard notification
8. ERP stock update
9. Analytics refresh

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    smartshop/
      charts.tsx
      screen-meta.ts
      sidebar.tsx
      smartshop-prototype.tsx
      ui.tsx
      screens/
        analytics-screen.tsx
        billing-screen.tsx
        chat-screen.tsx
        dashboard-screen.tsx
        discovery-screen.tsx
        erp-screen.tsx
        inventory-screen.tsx
        landing-screen.tsx
        onboarding-screen.tsx
        payment-screen.tsx
  data/
    mock-data.ts
  lib/
    prototype-utils.ts
  types/
    prototype.ts
```

## Notes

- No authentication, no payment gateway, and no backend calls are used.
- All screens are connected through local mock state for realistic demo behavior.
- Inventory and analytics update automatically after successful payment simulation.
