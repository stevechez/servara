# ⚡ Neighborhood Blitz: AI-Powered Field Service OS

**Neighborhood Blitz** is a high-performance, full-stack platform designed for field service contractors (plumbers, landscapers, roofers) to automate the entire lifecycle of a job—from geographic lead generation to automated SMS payments.

## 🚀 The "Founder Mode" Feature Set

- **🛰️ Neighborhood Blitz (AI Growth Engine):** Uses Google Maps API to center on active job sites and deploy "While We're Here" SMS marketing campaigns to nearby high-intent leads via Twilio.
- **🧠 AI Conflict Resolver:** Automatically scans the master schedule for travel-time overlaps and suggests one-tap rescheduling logic to optimize the day.
- **📍 Deep-Linked Dispatch:** An interactive Command Center where clicking any job "flies" the map to the customer's location for instant neighborhood context.
- **💳 Driveway Checkout:** One-tap "Job Complete" trigger that generates a Stripe Checkout link and texts it to the customer instantly.
- **📈 Live Pulse Feed:** A real-time activity stream merging inbound leads, job updates, and payment confirmations using Supabase Realtime.

## 🛠 Tech Stack

| Layer              | Technology                                  |
| :----------------- | :------------------------------------------ |
| **Framework**      | Next.js 15 (App Router, Server Actions)     |
| **Styling**        | Tailwind CSS (Framer Motion for animations) |
| **Database**       | Supabase (PostgreSQL)                       |
| **Payments**       | Stripe (Checkout & Webhooks)                |
| **Communications** | Twilio SMS API                              |
| **Maps**           | Google Maps JavaScript API & SDK            |

## 📦 Rapid Deployment

### 1. Database Setup

Run the migrations in the Supabase SQL editor to enable the `lat/lng` columns and the `stripe_link` fields. Enable **Realtime** on the `jobs` and `leads` tables to support the Live Pulse Feed.

### 2. Environment Variables

Rename `.env.example` to `.env.local` and populate:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_signing_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# App
NEXT_PUBLIC_URL=http://localhost:3000
```
