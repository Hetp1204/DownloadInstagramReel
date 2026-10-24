import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuration for optional RapidAPI fallback
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'instagram120.p.rapidapi.com';

/**
 * SnapSave Token Decoders
 */
function decodeSnapApp(args: string[]): string {
    const [h, u, n, t, e, r] = args;
    const tNum = Number(t);
    const eNum = Number(e);

    function decode(d: string, e: number, f: number): string {
        const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
        const hArr = g.slice(0, e);
        const iArr = g.slice(0, f);
        let j = d
            .split('')
            .reverse()
            .reduce((a, b, c) => {
                const idx = hArr.indexOf(b);
                if (idx !== -1) return a + idx * Math.pow(e, c);
                return a;
            }, 0);
        let k = '';
        while (j > 0) {
            k = iArr[j % f] + k;
            j = Math.floor(j / f);
        }
        return k || '0';
    }

    let result = '';
    for (let i = 0, len = h.length; i < len;) {
        let s = '';
        while (i < len && h[i] !== n[eNum]) {
            s += h[i];
            i++;
        }
        i++;
        for (let j = 0; j < n.length; j++) {
            s = s.replace(new RegExp(n[j], 'g'), j.toString());
        }
        result += String.fromCharCode(Number(decode(s, eNum, 10)) - tNum);
    }

    try {
        const bytes = new Uint8Array(result.split('').map((char) => char.charCodeAt(0)));
        return new TextDecoder('utf-8').decode(bytes);
    } catch {
        return result;
    }
}

function getEncodedSnapApp(data: string): string[] {
    return data
        .split('decodeURIComponent(escape(r))}(')[1]
        .split('))')[0]
        .split(',')
        .map((v) => v.replace(/"/g, '').trim());
}

function getDecodedSnapSave(data: string): string {
    const errorMessage = data?.split('document.querySelector("#alert").innerHTML = "')?.[1]?.split('";')?.[0]?.trim();
    if (errorMessage) {
        throw new Error(errorMessage);
    }
    return data
        .split('getElementById("download-section").innerHTML = "')[1]
        .split('"; document.getElementById("inputData").remove(); ')[0]
        .replace(/\\(\\)?/g, '');
}

function decryptSnapSave(data: string): string {
    return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
}

/**
 * Strategy 1: SnapSave Extraction (High reliability, no auth required)
 */
async function fetchFromSnapSave(targetUrl: string) {
    const formData = new URLSearchParams();
    formData.append('url', targetUrl.split('?')[0]);

    const res = await axios.post('https://snapsave.app/action.php?lang=en', formData.toString(), {
        headers: {
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://snapsave.app',
            'referer': 'https://snapsave.app/',
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        },
        timeout: 15000,
    });

    const decryptedHtml = decryptSnapSave(res.data);
    const $ = cheerio.load(decryptedHtml);

    let videoUrl = '';
    let thumbnail = '';

    if ($('div.download-items').length) {
        $('div.download-items').each((_, el) => {
            const itemThumbnail = $(el).find('div.download-items__thumb > img').attr('src') || '';
            const itemBtn = $(el).find('div.download-items__btn');
            const downloadUrl = itemBtn.find('a').attr('href') || '';
            const type = itemBtn.find('span').text().trim() === 'Download Photo' ? 'image' : 'video';

            if (!videoUrl && (type === 'video' || downloadUrl)) {
                videoUrl = downloadUrl || itemThumbnail;
                thumbnail = itemThumbnail;
            }
        });
    } else if ($('table.table').length) {
        thumbnail = $('article.media > figure').find('img').attr('src') || '';
        $('tbody > tr').each((_, el) => {
            const $td = $(el).find('td');
            const _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick') || '';
            if (!videoUrl && _url) {
                videoUrl = _url;
            }
        });
    } else if ($('div.card').length) {
        $('div.card').each((_, el) => {
            const cardBody = $(el).find('div.card-body');
            const url = cardBody.find('a').attr('href') || '';
            if (!videoUrl && url) {
                videoUrl = url;
            }
        });
    }

    if (videoUrl) {
        return {
            videoUrl,
            thumbnail,
            author: 'Instagram User',
            caption: 'Instagram Video',
        };
    }

    return null;
}

/**
 * Strategy 2: Cheerio OpenGraph Meta scrape fallback
 */
async function fetchFromMetaTags(targetUrl: string) {
    try {
        const resp = await axios.get(targetUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
            timeout: 10000,
        });
        const $ = cheerio.load(resp.data);
        const videoUrl =
            $('meta[property="og:video"]')?.attr('content') ||
            $('meta[property="og:video:url"]')?.attr('content') ||
            '';
        const thumbnail = $('meta[property="og:image"]')?.attr('content') || '';
        const author = $('meta[property="og:title"]')?.attr('content') || 'Instagram User';

        if (videoUrl) {
            return {
                videoUrl,
                thumbnail,
                author,
                caption: 'Instagram Video',
            };
        }
    } catch {
        // Ignore fallback error
    }
    return null;
}

/**
 * Strategy 3: RapidAPI Fallback (if key is set and quota available)
 */
async function fetchFromRapidApi(url: string) {
    if (!RAPIDAPI_KEY) return null;

    const targetUrl = `https://${RAPIDAPI_HOST}/api/instagram/links`;
    const options = {
        method: 'POST',
        url: targetUrl,
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': RAPIDAPI_HOST,
            'x-rapidapi-key': RAPIDAPI_KEY,
        },
        data: { url },
        timeout: 12000,
    };

    try {
        const response = await axios.request(options);
        const result = response.data;

        if (Array.isArray(result) && result.length > 0) {
            const item = result[0];
            let videoUrl = '';
            if (item.urls && Array.isArray(item.urls) && item.urls.length > 0) {
                videoUrl = item.urls[0].url;
            }

            return {
                videoUrl,
                thumbnail: item.pictureUrl || '',
                author: item.meta?.username || 'Instagram User',
                caption: item.meta?.title || 'Instagram Video',
            };
        }
    } catch (e: any) {
        console.warn('RapidAPI fallback failed:', e.message);
    }
    return null;
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!url.includes('instagram.com')) {
            return NextResponse.json({ error: 'Please enter a valid Instagram URL' }, { status: 400 });
        }

        let cleanUrl = url.trim();
        // Resolve share redirects if necessary
        if (cleanUrl.includes('/share/')) {
            try {
                const headRes = await axios.head(cleanUrl, { maxRedirects: 5, timeout: 5000 });
                if (headRes.request?.res?.responseUrl) {
                    cleanUrl = headRes.request.res.responseUrl;
                }
            } catch {
                // proceed with original URL
            }
        }

        let result = null;

        // 1. Primary: SnapSave engine
        console.log('[1] Fetching via SnapSave engine...');
        try {
            result = await fetchFromSnapSave(cleanUrl);
            if (result) console.log('[1] ✓ Success via SnapSave');
        } catch (e: any) {
            console.warn('[1] ✗ SnapSave failed:', e.message);
        }

        // 2. Secondary: Meta tags scrape
        if (!result) {
            console.log('[2] Trying meta tags scrape...');
            result = await fetchFromMetaTags(cleanUrl);
            if (result) console.log('[2] ✓ Success via Meta Tags');
        }

        // 3. Tertiary: RapidAPI fallback
        if (!result && RAPIDAPI_KEY) {
            console.log('[3] Trying RapidAPI fallback...');
            result = await fetchFromRapidApi(cleanUrl);
            if (result) console.log('[3] ✓ Success via RapidAPI');
        }

        if (!result || !result.videoUrl) {
            return NextResponse.json(
                { error: 'Could not extract video. Ensure the Instagram post/reel is public and try again.' },
                { status: 422 },
            );
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Download route error:', error.message);
        return NextResponse.json({ error: error.message || 'Failed to process URL' }, { status: 500 });
    }
}
