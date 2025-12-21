import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        default: 'Instagram Downloader - Download Video, Reels, Photo from Instagram',
        template: '%s | Instagram Downloader',
    },
    description: 'Fast and free Instagram Downloader. Save Instagram videos, Reels, photos, and IGTV in high quality (MP4/JPG). No login required, works on mobile and desktop.',
    keywords: ['instagram downloader', 'download instagram reels', 'save instagram video', 'instagram photo downloader', 'ig downloader', 'reels saver', 'instagram story saver'],
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
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://instagram-downloader-demo.vercel.app', // Replace with actual URL when deployed
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
        google: 'google-site-verification-code', // Placeholder
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
