import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL('https://download-instagram-reel.vercel.app'),
    title: {
        default: 'Instagram Downloader - Download Video, Reels, Photo from Instagram',
        template: '%s | Instagram Downloader',
    },
    description: 'Fast and free Instagram Downloader. Save Instagram videos, Reels, photos, and IGTV in high quality (MP4/JPG). No login required, works on mobile and desktop.',
    keywords: ['instagram downloader', 'download instagram reels', 'save instagram video', 'instagram photo downloader', 'ig downloader', 'reels saver', 'instagram story saver', 'insta saver', 'instagram video download'],
    authors: [{ name: 'Instagram Downloader' }],
    creator: 'Instagram Downloader',
    publisher: 'Instagram Downloader',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://download-instagram-reel.vercel.app',
        title: 'Instagram Downloader - Download Video, Reels, Photo',
        description: 'Fast and free Instagram Downloader. Save Instagram videos, Reels, photos, and IGTV in high quality.',
        siteName: 'Instagram Downloader',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instagram Downloader - Download Video, Reels, Photo',
        description: 'Fast and free Instagram Downloader. Save Instagram videos, Reels, photos, and IGTV in high quality.',
    },
    verification: {
        google: 'google6c7d4d842e42d0f3',
    },
}

import Script from 'next/script' // Import Script

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Analytics />
                {/* Adsterra Script */}
                <Script
                    src="https://pl28303064.effectivegatecpm.com/06/e9/e9/06e9e956e3726f7200e2db5d1cdb1c20.js"
                    strategy="lazyOnload"
                />
                {/* Adsterra Popunder Script */}
                {/* <Script
                    src="https://pl28303183.effectivegatecpm.com/99/2c/ca/992ccaa070bc43fb629e951b611be356.js"
                    strategy="lazyOnload"
                /> */}
            </body>
        </html>
    )
}
