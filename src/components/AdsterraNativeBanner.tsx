'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraNativeBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if the script is already loaded to avoid duplicates
        const scriptId = 'adsterra-native-script';

        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://pl28343008.effectivegatecpm.com/24b9a394db3bba853e35df7fbbf0d5fb/invoke.js";
            script.async = true;
            script.setAttribute("data-cfasync", "false");

            // Append to body or inside the component if the script supports it.
            // Usually appending to body is safer for these types of ad scripts
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div ref={bannerRef} className="w-full flex justify-center items-center my-8 min-h-[250px] overflow-hidden">
            <div id="container-24b9a394db3bba853e35df7fbbf0d5fb"></div>
        </div>
    );
}
