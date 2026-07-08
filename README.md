
# 🎮 GameVault

GameVault is a modern, visually stunning, and highly interactive React-based gaming storefront and library application. Browse, search, filter, and buy your favorite video games with a seamless, responsive user interface.


![GameVault Preview](<img width="1918" height="857" alt="Screenshot 2026-06-29 233745" src="https://github.com/user-attachments/assets/e3bf229f-7203-4ab8-9fb4-952e6611d553" />) 

## ✨ Key Features

- **🔐 Interactive User Authentication**: Log in, register, or browse immediately as a guest gamer.
- **🔍 Game Catalog & Swiper Carousel**: Dynamic showcases featuring trending titles like *Elden Ring*, *Cyberpunk 2077*, and *God of War*.
- **🏷️ Multi-Category Filtering**: Instant client-side filtering by categories (Action, RPG, Adventure, Shooter, Indie, etc.).
- **🛒 Shopping Bag (Cart)**: Add/remove items with realtime price calculations, discounts, and item count indicators.
- **📚 Personal Games Library**: Keep track of purchased games.
- **💳 Fully-Functional Checkout**: Interactive order confirmation flow.
- **🔔 Dynamic Toast Notifications**: Clean UI alerts for key actions (e.g., adding to cart, logging in/out).
- **📱 Fully Responsive Design**: Built with custom HSL/RGB colors, modern typography, glassmorphism card layouts, and responsive breakpoints using Bootstrap and Vanilla CSS.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, HTML5, Vanilla CSS
- **Styling & Layout**: Bootstrap 5 + Bootstrap Icons
- **Swiper Engine**: Swiper.js (for smooth touch/swipe carousels)
- **Local DB**: Client-side JSON database (`public/api/gamesData.json`)

---

## 🚀 Getting Started

To run the project locally, follow these steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kiranv739/gamevault-react.git
   ```
2. Navigate into the project directory:
   ```bash
   cd gamevault-react
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local development server:
```bash
npm start
```
This opens the development server at [http://localhost:3000](http://localhost:3000).

### Build for Production

To build the project for production:
```bash
npm run build
```
This bundles the app into static files in the `build` folder, ready for deployment.

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI Components (Cards, Menus, Toast)
│   ├── GameCard.jsx
│   ├── GameSwiper.jsx
│   ├── SideMenu.jsx
│   └── Toast.jsx
├── data/                # Static data arrays and lists
├── hooks/               # Custom React hooks (useToast)
├── pages/               # Page components (Home, Library, Cart, Checkout, Auth)
│   ├── Main.jsx
│   ├── Home.jsx
│   ├── Bag.jsx
│   └── Auth.jsx
├── App.js               # Main App component & AppContext
└── index.js             # App entry point
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
