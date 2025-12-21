import { NextResponse } from 'next/server';
import { instagramGetUrl } from 'instagram-url-direct';
import axios from 'axios';

// Configuration for RapidAPI (Optional fallback)
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'instagram120.p.rapidapi.com';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Basic validation
        if (!url.includes('instagram.com')) {
            return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 });
        }

        let data = null;

        // Strategy: Prefer Free Library, but allow switching to RapidAPI via Env Var
        // or use RapidAPI as fallback if free library fails (advanced implementation)

        // Strategy: Always prefer Free Library first. 
        // Only use RapidAPI if the free library explicitly fails or returns no data.

        console.log('Attempting download with Free Library...');
        try {
            data = await fetchFromFreeLibrary(url);
        } catch (freeError: any) {
            console.warn('Free library failed:', freeError.message);
            data = null;
        }

        // If free library failed (data is null) AND we have a key, try RapidAPI
        if (!data && RAPIDAPI_KEY) {
            console.log('Free library failed/empty. Switching to RapidAPI fallback...');
            try {
                data = await fetchFromRapidApi(url);
            } catch (rapidError: any) {
                console.error('RapidAPI fallback also failed:', rapidError.message);
                throw new Error('All download services failed. Please try again later.');
            }
        } else if (!data) {
            // Free failed and no RapidAPI key configured
            throw new Error('Download service unavailable. Please check the URL or try again later.');
        }

        if (data) {
            return NextResponse.json(data);
        }

        return NextResponse.json({
            error: 'Could not extract video. Please check the URL and try again.'
        }, { status: 422 });

    } catch (error: any) {
        console.error('Download error:', error.message);
        return NextResponse.json({
            error: error.message || 'Failed to process URL'
        }, { status: 500 });
    }
}

async function fetchFromFreeLibrary(url: string) {
    const result = await instagramGetUrl(url);

    if (result && result.url_list && result.url_list.length > 0) {
        return {
            videoUrl: result.url_list[0],
            thumbnail: result.media_details?.[0]?.thumbnail || '',
            author: result.post_info?.owner_username || 'Instagram User',
            caption: result.post_info?.caption || 'Instagram Video',
        };
    }
    return null;
}

async function fetchFromRapidApi(url: string) {
    // Implementation for "Instagram 120" on RapidAPI
    // Endpoint for downloading/extracting links from a URL is /api/instagram/links

    const targetUrl = `https://${RAPIDAPI_HOST}/api/instagram/links`;

    const options = {
        method: 'POST',
        url: targetUrl,
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': RAPIDAPI_HOST,
            'x-rapidapi-key': RAPIDAPI_KEY
        },
        data: {
            url: url
        }
    };

    try {
        const response = await axios.request(options);
        const result = response.data;

        console.log('RapidAPI Response:', JSON.stringify(result, null, 2));

        // MAPPING BASED ON USER'S LOG (ARRAY OF OBJECTS)
        if (Array.isArray(result) && result.length > 0) {
            const item = result[0];

            // Extract Video URL from nested "urls" array
            let videoUrl = '';
            if (item.urls && Array.isArray(item.urls) && item.urls.length > 0) {
                videoUrl = item.urls[0].url;
            }

            // Extract Metadata from "meta" object and "pictureUrl"
            const title = item.meta?.title || 'Instagram Video';
            const username = item.meta?.username || 'Instagram User';
            const thumbnail = item.pictureUrl || '';

            return {
                videoUrl: videoUrl,
                thumbnail: thumbnail,
                author: username,
                caption: title,
            };
        }

        console.error('Unexpected RapidAPI response structure:', result);
        return null;

    } catch (error) {
        console.error('RapidAPI request failed:', error);
        throw new Error('Premium download service failed.');
    }
}
