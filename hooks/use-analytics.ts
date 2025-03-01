import { usePlausible } from 'next-plausible'

type AnalyticsEvent = 
  | { type: 'auth'; action: 'login' | 'signup' | 'logout' }
  | { type: 'platform'; action: 'connect' | 'disconnect'; platform: 'youtube' | 'facebook' }
  | { type: 'content'; action: 'create' | 'schedule' | 'publish' }
  | { type: 'api'; endpoint: string; status: number; duration: number }

export function useAnalytics() {
  const plausible = usePlausible()

  const trackEvent = (event: AnalyticsEvent) => {
    const eventName = `${event.type}_${('action' in event ? event.action : 'call')}`
    
    // Använd rest operator för att extrahera type och action, och spara resten i propsObj
    const { type, action, ...propsObj } = event as any;
    
    plausible(eventName, {
      props: propsObj
    })
  }

  const trackApiCall = (endpoint: string, status: number, duration: number) => {
    trackEvent({
      type: 'api',
      endpoint,
      status,
      duration
    })
  }

  const trackAuth = (action: 'login' | 'signup' | 'logout') => {
    trackEvent({
      type: 'auth',
      action
    })
  }

  const trackPlatform = (action: 'connect' | 'disconnect', platform: 'youtube' | 'facebook') => {
    trackEvent({
      type: 'platform',
      action,
      platform
    })
  }

  const trackContent = (action: 'create' | 'schedule' | 'publish') => {
    trackEvent({
      type: 'content',
      action
    })
  }

  return {
    trackApiCall,
    trackAuth,
    trackPlatform,
    trackContent
  }
} 