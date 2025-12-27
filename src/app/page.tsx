"use client";

import { useState } from 'react';
import { Instagram, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DownloadCard from '@/components/DownloadCard';
import AdsterraNativeBanner from '@/components/AdsterraNativeBanner';
import AdsterraVerticalBanner from '@/components/AdsterraVerticalBanner';

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<any>(null);

    const handleDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setData(null);

        try {
            // Basic validation
            if (!url.includes('instagram.com')) {
                throw new Error('Please enter a valid Instagram URL');
            }

            const response = await axios.post('/api/download', { url });
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to fetch video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-24 relative overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-8 flex-grow justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-4">
                        <Instagram size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
                        Instagram Downloader
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
                        Download Reels, Videos, and Photos from Instagram in high quality. Fast, free, and secure.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-xl"
                >
                    <form onSubmit={handleDownload} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                        <div className="relative flex items-center bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 transition-all duration-300 focus-within:border-purple-500/50">
                            <Search className="ml-4 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste Instagram URL here..."
                                className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Download'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </motion.div>

                {data && (
                    <DownloadCard
                        thumbnail={data.thumbnail}
                        videoUrl={data.videoUrl}
                        author={data.author}
                        caption={data.caption}
                    />
                )}

                <AdsterraNativeBanner />
                <AdsterraVerticalBanner />

                {/* SEO Content Section */}
                <div className="mt-24 grid gap-12 text-left max-w-4xl w-full">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Why Use Our Instagram Downloader?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-xl font-semibold text-purple-200 mb-2">High Quality</h3>
                                <p className="text-gray-400">Download videos and reels in their original high definition quality (HD/4K).</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-xl font-semibold text-pink-200 mb-2">No Watermark</h3>
                                <p className="text-gray-400">Save content cleanly without any added watermarks or logos.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-xl font-semibold text-blue-200 mb-2">Fast & Free</h3>
                                <p className="text-gray-400">Unlimited downloads with lightning-fast processing speeds.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2">How to download Instagram Reels?</h3>
                                <p className="text-gray-400">Copy the URL of the Reel you want to save, paste it into the search box above, and click the Download button. The video will be processed and ready for download in seconds.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2">Is it safe to use this downloader?</h3>
                                <p className="text-gray-400">Yes, our tool is completely safe. We do not require any login or personal information. All downloads are processed securely.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2">Does it work on iPhone and Android?</h3>
                                <p className="text-gray-400">Absolutely! Our Instagram Downloader is a web-based tool that works perfectly on all devices including iOS, Android, Windows, and Mac.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="w-full text-center text-gray-600 text-sm mt-12 pb-4 z-10">
                <p>© {new Date().getFullYear()} Instagram Downloader. Not affiliated with Instagram.</p>
            </footer>
        </main>
    );
}
