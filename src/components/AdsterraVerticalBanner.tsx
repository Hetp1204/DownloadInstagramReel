'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraVerticalBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bannerRef.current) {
            // Check if iframe already exists to prevent duplicate ads on re-renders
            if (bannerRef.current.querySelector('iframe')) return;

            const iframe = document.createElement('iframe');
            iframe.style.border = 'none';
            iframe.style.width = '160px';
            iframe.style.height = '300px';
            iframe.style.overflow = 'hidden';
            iframe.scrolling = 'no';

            bannerRef.current.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <body style="margin:0;padding:0;background:transparent;">
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '960f2998a6a30cf1cc6a893f8070dba3',
                                'format' : 'iframe',
                                'height' : 300,
                                'width' : 160,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/960f2998a6a30cf1cc6a893f8070dba3/invoke.js"></script>
                    </body>
                    </html>
                `);
                doc.close();
            }
        }
    }, []);

    return (
        <div ref={bannerRef} className="flex justify-center items-center my-8 min-h-[300px]" />
    );
}
