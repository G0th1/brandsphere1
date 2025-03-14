/**
 * Safe navigation with fallbacks to ensure navigation always works
 */

import { useRouter as useNextRouter } from 'next/navigation';

/**
 * Safe navigation that uses both Next.js router and fallbacks
 * Has multiple fallbacks to ensure navigation works
 * even if a particular navigation method fails.
 * 
 * @param url - The URL to navigate to
 * @param router - Router object from next/navigation
 */
export const safeNavigate = (url: string, router?: ReturnType<typeof useNextRouter>) => {
    if (!url) {
        console.error('No URL provided to safeNavigate');
        return;
    }

    // Normalize URL format
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    try {
        // First attempt: Use direct window.location for the most reliable navigation
        window.location.href = normalizedUrl;
        console.log(`Direct navigation using window.location to: ${normalizedUrl}`);
        return;
    } catch (error) {
        console.error('Primary navigation method failed:', error);

        // Try Next.js router if available
        if (router) {
            try {
                router.push(normalizedUrl);
                console.log(`Fallback navigation using Next.js router to: ${normalizedUrl}`);
                return;
            } catch (routerError) {
                console.error('Router navigation failed:', routerError);
            }
        }

        // Try window.open as a fallback
        try {
            window.open(normalizedUrl, '_self');
            console.log(`Secondary fallback navigation using window.open to: ${normalizedUrl}`);
            return;
        } catch (openError) {
            console.error('window.open navigation failed:', openError);
        }

        // Last resort: create and click an anchor element
        try {
            const link = document.createElement('a');
            link.href = normalizedUrl;
            link.setAttribute('target', '_self');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 100);
            console.log(`Last resort navigation using anchor element to: ${normalizedUrl}`);
        } catch (anchorError) {
            console.error('All navigation methods failed:', anchorError);
            alert(`Navigation failed. Please try going to ${normalizedUrl} manually.`);
        }
    }
};

/**
 * Returns a custom navigation hook that includes both router.push and fallback methods
 */
export const useSafeRouter = () => {
    const router = useNextRouter();

    return {
        ...router,
        navigate: (url: string) => safeNavigate(url, router),
        push: (url: string) => safeNavigate(url, router),
        safeNavigate: (url: string) => safeNavigate(url, router)
    };
}; 