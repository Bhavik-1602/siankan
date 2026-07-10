# Siankan Studio — Premium Handcrafted Indian Wear

Siankan is a bespoke e-commerce platform for high-end, hand-dyed, and custom-tailored Indian wear (Lehengas, Gowns, Kurti Sets, and Anarkalis). Built with a premium, editorial design aesthetic, it features smooth scrolling, immersive zoom-parallax visual storytelling, and detailed custom measurements fitting forms.

---

## 📂 Project Structure

The codebase is split into two main sections:
- `/frontend`: Next.js App Router project providing the premium editorial store interface.
- `/backend`: Node.js + Express.js API project interfacing with Supabase PostgreSQL database.

---

## ⚡ Tech Stack

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP (ScrollTrigger) & Framer Motion
- **Scroll Utility**: Lenis (Smooth Scroll)
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js + Express.js
- **Database / Auth**: Supabase (PostgreSQL)
- **Validation**: Joi
- **Logger**: Winston & Morgan

---

## 🚀 Getting Started

Follow these steps to set up and run Siankan Studio locally.

### 1. Database & Backend Configuration

1. Open the `/backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `/backend` directory and add your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```
4. Seed the database with categories and product listings (this resets and writes all Siankan items):
   ```bash
   npm run seed
   ```
5. Start the backend development API server:
   ```bash
   npm run dev
   ```
   *The backend will be running at `http://localhost:5000`.*

---

### 2. Frontend Configuration

1. Open the `/frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Create or check the `.env` file in the `/frontend` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the frontend Next.js development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.*

---

## 💎 Features Built

- **Infinite Carousel Marquee**: Displays scrolling catalog items automatically on the homepage.
- **Scroll Parallax Hero**: A premium full-screen header powered by GSAP ScrollTrigger.
- **Zoom Parallax Gallery**: A sticky full-screen gallery that expands images as the user scrolls.
- **Besoke Tailoring Form**: Enables customers to enter custom measurements (Bust, Waist, Height, Neckline) on product pages, or select standard sizes.
- **Sliding Cart Drawer**: A slide-out panel showing cart items, quantity controls, and custom fitting notes.
- **Filterable Catalogue**: Shop page with live backend category mapping, search, and pricing sorting.
- **Demo Secure Checkout**: Allows full address, contact details, and payment validation inputs.
