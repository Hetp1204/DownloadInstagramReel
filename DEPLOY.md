# Deployment Guide

This project is built with Next.js and is best deployed on **Vercel**.

## Method 1: Deploy from Git (Recommended)

1.  **Push your code to GitHub/GitLab/Bitbucket.**
2.  Go to [Vercel.com](https://vercel.com) and log in.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your repository.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add the following keys (copy values from your local `.env.local`):
        *   `RAPIDAPI_KEY`
        *   `RAPIDAPI_HOST`
6.  Click **"Deploy"**.

## Method 2: Deploy Command Line (Vercel CLI)

1.  Open your terminal.
2.  Install Vercel CLI (if not installed):
    ```bash
    npm i -g vercel
    ```
3.  Run the deploy command:
    ```bash
    vercel
    ```
4.  Follow the prompts.
5.  When asked **"Want to modify these settings?"**, say `y` if you want to add env vars, or add them later in the dashboard.
    *   *Tip: It is often easier to add Environment Variables in the Vercel Dashboard after the first deployment, or using `vercel env add`.*

## Important Note on RapidAPI

Since we use a fallback to RapidAPI, ensuring the formatting of the environment variables is correct in Vercel is crucial. verify `RAPIDAPI_HOST` matches `instagram120.p.rapidapi.com`.
