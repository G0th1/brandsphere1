/**
 * Säker navigation med fallbacks för att garantera att navigeringen alltid fungerar
 */

import { useRouter as useNextRouter } from 'next/navigation';

/**
 * Säker navigation som använder både Next.js router och window.location som fallback
 * Innehåller flera fallbacks för att säkerställa att navigeringen fungerar
 * även om en viss navigeringsmetod skulle misslyckas.
 * 
 * @param url - Den URL som ska navigeras till
 * @param router - Router-objektet från next/navigation
 */
export const safeNavigate = (url: string, router?: ReturnType<typeof useNextRouter>) => {
    if (!url) {
        console.error('No URL provided to safeNavigate');
        return; // Avbryt om ingen URL angetts
    }

    // Normalisera URL-format
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    try {
        // Försök använda router om den tillhandahålls
        if (router) {
            try {
                router.push(normalizedUrl);
                console.log(`Navigation using Next.js router to: ${normalizedUrl}`);
                return; // Avsluta om det lyckas
            } catch (routerError) {
                console.error('Router navigation failed:', routerError);
                // Fortsätt till nästa metod om detta misslyckas
            }
        }

        // Primär fallback: window.location.href
        try {
            console.log(`Fallback navigation using window.location to: ${normalizedUrl}`);
            window.location.href = normalizedUrl;
            return; // Avsluta om det lyckas
        } catch (locationError) {
            console.error('window.location navigation failed:', locationError);
            // Fortsätt till nästa metod
        }

        // Sekundär fallback: window.open
        try {
            window.open(normalizedUrl, '_self');
            console.log(`Secondary fallback navigation using window.open to: ${normalizedUrl}`);
            return; // Avsluta om det lyckas
        } catch (openError) {
            console.error('window.open navigation failed:', openError);
        }

        // Sista utvägen: skapa ett ankar-element och klicka på det
        try {
            const link = document.createElement('a');
            link.href = normalizedUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`Last resort navigation using anchor element to: ${normalizedUrl}`);
        } catch (anchorError) {
            console.error('All navigation methods failed. Please try manually navigating to the URL.', anchorError);
            alert(`Kunde inte navigera. Försök gå till ${normalizedUrl} manuellt.`);
        }
    } catch (globalError) {
        console.error('Unexpected error during navigation:', globalError);
        // Absolut sista utvägen
        window.location.href = normalizedUrl;
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