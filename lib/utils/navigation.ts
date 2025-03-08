/**
 * Säker navigation med fallbacks för att garantera att navigeringen alltid fungerar
 */

import { useRouter as useNextRouter } from 'next/navigation';

/**
 * Säker navigation som använder både Next.js router och window.location som fallback
 * @param url - Den URL som ska navigeras till
 * @param router - Router-objektet från next/navigation
 */
export const safeNavigate = (url: string, router?: ReturnType<typeof useNextRouter>) => {
    try {
        // Försök använda router om den tillhandahålls
        if (router) {
            router.push(url);
        } else {
            // Fallback till window.location om ingen router finns
            window.location.href = url;
        }
    } catch (e) {
        console.error('Router navigation failed, using window.location instead:', e);

        // Fallback till window.location om router.push misslyckas
        try {
            window.location.href = url;
        } catch (windowError) {
            console.error('Both navigation methods failed:', windowError);

            // Extra fallback om till och med window.location misslyckas
            try {
                window.open(url, '_self');
            } catch (finalError) {
                console.error('All navigation methods failed. Please try again.', finalError);
            }
        }
    }
};

/**
 * Returnerar ett anpassat hook för navigering som inkluderar både router.push och fallback-metoder
 */
export const useSafeRouter = () => {
    const router = useNextRouter();

    return {
        ...router,
        safeNavigate: (url: string) => safeNavigate(url, router),
        safePush: (url: string) => safeNavigate(url, router)
    };
}; 