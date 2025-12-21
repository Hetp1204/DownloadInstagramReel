import React from 'react';
import { Download, ExternalLink, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadCardProps {
    thumbnail: string;
    videoUrl: string;
    author: string;
    caption: string;
}

const DownloadCard: React.FC<DownloadCardProps> = ({ thumbnail, videoUrl, author, caption }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card w-full max-w-md rounded-2xl overflow-hidden p-4 mx-auto mt-8"
        >
            <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden mb-4 bg-gray-800">
                <img
                    src={`/api/proxy?url=${encodeURIComponent(thumbnail)}`}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 text-white/90">
                        <User size={16} />
                        <span className="font-medium text-sm">@{author}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-gray-400 line-clamp-2">{caption}</p>

                <a
                    href={videoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/25"
                >
                    <Download size={20} />
                    Download Video
                </a>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        If download doesn't start, right click and select "Save Video As"
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default DownloadCard;
