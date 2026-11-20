# WedPlan — The Luxury Wedding Planning Platform (Inspired by Loverly)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WedPlan** is a premier digital wedding planning marketplace inspired by [Loverly](https://loverly.com/). Built for **Assignment 9 — Category 004**, WedPlan connects discerning couples with verified luxury wedding professionals (photographers, estates, florists, caterers, makeup artists, and fashion designers) and provides an integrated suite of interactive digital wedding tools.

---

## 🌟 Key Features

### 1. 👰 For Couples & Brides (Customers)
* **Discover Curated Vendors:** Browse verified luxury wedding professionals across 6 specialized categories:
  * Photography & Videography
  * Wedding Venues & Estates
  * Decoration & Florist
  * Catering Services
  * Makeup & Styling
  * Wedding Fashion
* **Advanced Search & Filtering:** Filter by keyword, category, location, price range slider, and sort by price or rating.
* **Direct Booking Requests:** Submit event date, venue location, guest count, and personalized instructions with duplicate booking prevention.
* **Customer Dashboard:** Real-time tracking of pending, accepted, and rejected bookings with the ability to cancel pending requests.
* **Loverly Planning Suite:**
  * **Interactive 12-Month Wedding Checklist** with completion tracking, phase filters, and custom milestone creation.
  * **Interactive Wedding Budget Calculator** with customizable spending slider and category percentage allocation.
  * **Curated Real Wedding Inspiration Gallery** with aesthetic style filters.

### 2. 🏰 For Wedding Vendors (Pros)
* **Atelier & Studio Management:** Create and manage high-end service listings with rich descriptions, image galleries, and pricing packages.
* **Free vs. Premium Tiers:**
  * **Free Plan:** Maximum 3 active published services.
  * **Premium Plan ($49/mo):** Unlimited published services, Verified Luxury Pro badge, and priority search placement.
* **Booking Request Processing:** Direct dashboard notifications with instant **Accept** and **Reject** actions (strictly immutable once decided).
* **Stripe Checkout Integration:** Test mode Stripe payment flow with celebratory confetti and instant subscription upgrade.

### 3. 🛡️ For Platform Administrators
* **Operational Overview:** Aggregate metrics for registered users, vendors, brides, services, pending moderation items, and transactions.
* **User Management:** Search and filter registered accounts by role with instant **Block / Unblock** control (blocking immediately restricts protected actions).
* **Service Moderation:** Review pending service submissions with one-click **Approve**, **Reject**, or **Delete** actions.
* **Stripe Transaction Audit Log:** Immutable audit ledger of all Stripe subscription payments.

---

## 🛠️ Technology Stack

* **Frontend Framework:** Next.js 16.4.6 (App Router)
* **Library:** React 19.3.0
* **Styling & Design System:** Tailwind CSS v4, Lucide React Icons
* **Aesthetics:** Inspired by Loverly, Vogue Weddings, and Martha Stewart Weddings
* **State Management:** Reactive Client Context synced with `localStorage` persistence and fallback
* **Payments:** Stripe Checkout simulation with `canvas-confetti`
* **Typography:** Cormorant Garamond & Plus Jakarta Sans

---

## 🚀 How to Run the Project Locally

### Prerequisites
* Node.js 18.x or 20.x
* npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/mashukurmanilk/wed-plan-frontend.git

# Navigate to the frontend directory
cd wed-plan-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts for Instant Evaluation

WedPlan includes a **1-Click Demo Switcher** directly in the top header and on the Sign In page (`/auth/signin`):

| Role | Account Name | Email | Password | Key Testing Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Sarah Jenkins | `admin@wedplan.com` | `Admin123!` | Moderate pending services, block/unblock users, view Stripe transactions |
| **Vendor (Free)** | Aurora Rossi | `aurora@auroraphotography.com` | `Vendor123!` | Test 3-service limit, accept/reject booking requests, upgrade to Premium |
| **Vendor (Premium)** | Julian Montgomery | `julian@starlightestates.com` | `Vendor123!` | Unlimited service publishing, verified Pro badge |
| **Customer** | Emily & James Sterling | `emily@wedplan.com` | `Customer123!` | Request bookings, cancel pending bookings, checklist & budget tools |

---

## 📁 Repository Links

* **Frontend Repository:** [https://github.com/mashukurmanilk/wed-plan-frontend](https://github.com/mashukurmanilk/wed-plan-frontend)
* **Backend Repository:** [https://github.com/mashukurmanilk/wed-plan-backend](https://github.com/mashukurmanilk/wed-plan-backend)
