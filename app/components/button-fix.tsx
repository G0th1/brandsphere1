"use client"

import { useEffect } from "react"

export default function ButtonFixScript() {
    useEffect(() => {
        // Add CSS to ensure buttons and links are properly clickable
        const style = document.createElement('style')
        style.innerHTML = `
      button, 
      [role="button"], 
      a, 
      .pointer-events-auto, 
      a[href], 
      button:not([disabled]),
      [role="link"] {
        cursor: pointer !important;
        pointer-events: auto !important;
        position: relative !important;
        z-index: 1 !important;
      }
      
      a > *, button > * {
        pointer-events: none !important;
      }
      
      /* Ensure Links inside Buttons work */
      button a, 
      [role="button"] a {
        display: block !important;
        position: relative !important;
        z-index: 2 !important;
        pointer-events: auto !important;
      }
    `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    return null
} 