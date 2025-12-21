# Instagram Downloader

A premium, fast, and secure Instagram Video and Reel downloader built with Next.js and Tailwind CSS.

## Features
- 🎥 **Download Videos & Reels**: Support for standard Instagram posts and Reels.
- 🎨 **Premium UI**: Glassmorphism design with smooth animations.
- 📱 **Responsive**: Fully optimized for mobile and desktop.
- 🛡️ **Robust**: Uses a free scraping library by default, with a built-in fallback to RapidAPI for reliability.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it.

## 🔑 How to Get a Free RapidAPI Key (Optional)

This project works for free out of the box. However, if the free method stops working, you can enable the professional API fallback.

1.  **Visit RapidAPI**: Go to [Instagram Downloader & Viewer](https://rapidapi.com/messy-programmer/api/instagram-downloader-download-instagram-videos-stories).
2.  **Sign Up/Login**: Create a free account.
3.  **Subscribe**: Click the **"Pricing"** tab and subscribe to the **Basic (Free)** plan.
4.  **Get Your Key**:
    *   Go back to the **"Endpoints"** tab.
    *   Look for `X-RapidAPI-Key` in the "Header Parameters" section.
    *   Copy the string of characters (e.g., `a1b2c3d4...`).
5.  **Configure Project**:
    *   Rename `.env.local.example` to `.env.local`.
    *   Paste your key:
        ```env
        RAPIDAPI_KEY=your_copied_key_here
        ```
    *   Restart the server (`npm run dev`).

The app will now automatically use this premium API if you provide the key.
