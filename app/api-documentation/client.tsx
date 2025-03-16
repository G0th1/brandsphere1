"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Translations
const translations = {
    en: {
        title: "API Documentation",
        subtitle: "Integrate BrandSphereAI with your applications",
        overview: "Overview",
        endpoints: "Endpoints",
        authentication: "Authentication",
        rateLimit: "Rate Limits",
        errors: "Error Handling",
        sdks: "SDKs & Libraries",
        getStarted: "Get Started",
        apiKey: "API Key",
        apiKeyDescription: "All API requests require authentication using an API key. You can generate an API key in your account settings.",
        request: "Request",
        response: "Response",
        rateLimitDescription: "Our API is rate limited to protect our services from abuse. The standard rate limits are:",
        rateLimits: [
            {
                plan: "Free",
                requests: "100 requests per day",
                burst: "10 requests per minute"
            },
            {
                plan: "Pro",
                requests: "5,000 requests per day",
                burst: "60 requests per minute"
            },
            {
                plan: "Business",
                requests: "50,000 requests per day",
                burst: "300 requests per minute"
            }
        ],
        errorCodes: [
            {
                code: "400",
                message: "Bad Request",
                description: "The request was invalid or cannot be served."
            },
            {
                code: "401",
                message: "Unauthorized",
                description: "Authentication failed or user does not have permissions."
            },
            {
                code: "403",
                message: "Forbidden",
                description: "The request is understood, but has been refused or access is not allowed."
            },
            {
                code: "404",
                message: "Not Found",
                description: "The requested resource could not be found."
            },
            {
                code: "429",
                message: "Too Many Requests",
                description: "Request was rejected due to rate limiting."
            },
            {
                code: "500",
                message: "Internal Server Error",
                description: "Something went wrong on our end."
            }
        ],
        endpointList: [
            {
                name: "Get Posts",
                method: "GET",
                path: "/api/v1/posts",
                description: "Retrieve posts from your connected social media accounts",
                parameters: [
                    {
                        name: "platform",
                        type: "string",
                        required: false,
                        description: "Filter by platform (facebook, youtube, etc.)"
                    },
                    {
                        name: "status",
                        type: "string",
                        required: false,
                        description: "Filter by post status (published, scheduled, draft)"
                    },
                    {
                        name: "limit",
                        type: "integer",
                        required: false,
                        description: "Number of posts to return (default: 10, max: 100)"
                    }
                ]
            },
            {
                name: "Create Post",
                method: "POST",
                path: "/api/v1/posts",
                description: "Create a new post for your social media accounts",
                parameters: [
                    {
                        name: "content",
                        type: "string",
                        required: true,
                        description: "The post content/text"
                    },
                    {
                        name: "platforms",
                        type: "array",
                        required: true,
                        description: "Array of platforms to post to"
                    },
                    {
                        name: "schedule_time",
                        type: "string (ISO 8601)",
                        required: false,
                        description: "Time to schedule the post (if not provided, post will be saved as draft)"
                    }
                ]
            },
            {
                name: "Get Analytics",
                method: "GET",
                path: "/api/v1/analytics",
                description: "Retrieve analytics data for your social media accounts",
                parameters: [
                    {
                        name: "platform",
                        type: "string",
                        required: false,
                        description: "Filter by platform"
                    },
                    {
                        name: "start_date",
                        type: "string (ISO 8601)",
                        required: true,
                        description: "Start date for the analytics period"
                    },
                    {
                        name: "end_date",
                        type: "string (ISO 8601)",
                        required: true,
                        description: "End date for the analytics period"
                    },
                    {
                        name: "metrics",
                        type: "array",
                        required: false,
                        description: "Specific metrics to return (e.g., impressions, engagement, clicks)"
                    }
                ]
            }
        ]
    },
    sv: {
        title: "API-dokumentation",
        subtitle: "Integrera BrandSphereAI med dina applikationer",
        overview: "Översikt",
        endpoints: "Slutpunkter",
        authentication: "Autentisering",
        rateLimit: "Hastighetsbegränsningar",
        errors: "Felhantering",
        sdks: "SDK:er och bibliotek",
        getStarted: "Kom igång",
        apiKey: "API-nyckel",
        apiKeyDescription: "Alla API-förfrågningar kräver autentisering med en API-nyckel. Du kan generera en API-nyckel i dina kontoinställningar.",
        request: "Förfrågan",
        response: "Svar",
        rateLimitDescription: "Vårt API är hastighetsbegränsat för att skydda våra tjänster från missbruk. Standardbegränsningarna är:",
        rateLimits: [
            {
                plan: "Gratis",
                requests: "100 förfrågningar per dag",
                burst: "10 förfrågningar per minut"
            },
            {
                plan: "Pro",
                requests: "5 000 förfrågningar per dag",
                burst: "60 förfrågningar per minut"
            },
            {
                plan: "Business",
                requests: "50 000 förfrågningar per dag",
                burst: "300 förfrågningar per minut"
            }
        ],
        errorCodes: [
            {
                code: "400",
                message: "Felaktig förfrågan",
                description: "Förfrågan var ogiltig eller kan inte hanteras."
            },
            {
                code: "401",
                message: "Obehörig",
                description: "Autentisering misslyckades eller användaren har inte behörighet."
            },
            {
                code: "403",
                message: "Förbjuden",
                description: "Förfrågan förstås, men har nekats eller åtkomst är inte tillåten."
            },
            {
                code: "404",
                message: "Hittades inte",
                description: "Den begärda resursen kunde inte hittas."
            },
            {
                code: "429",
                message: "För många förfrågningar",
                description: "Förfrågan avvisades på grund av hastighetsbegränsning."
            },
            {
                code: "500",
                message: "Internt serverfel",
                description: "Något gick fel på vår sida."
            }
        ],
        endpointList: [
            {
                name: "Hämta inlägg",
                method: "GET",
                path: "/api/v1/posts",
                description: "Hämta inlägg från dina anslutna sociala mediekonton",
                parameters: [
                    {
                        name: "platform",
                        type: "string",
                        required: false,
                        description: "Filtrera efter plattform (facebook, youtube, etc.)"
                    },
                    {
                        name: "status",
                        type: "string",
                        required: false,
                        description: "Filtrera efter inläggsstatus (published, scheduled, draft)"
                    },
                    {
                        name: "limit",
                        type: "integer",
                        required: false,
                        description: "Antal inlägg att returnera (standard: 10, max: 100)"
                    }
                ]
            },
            {
                name: "Skapa inlägg",
                method: "POST",
                path: "/api/v1/posts",
                description: "Skapa ett nytt inlägg för dina sociala mediekonton",
                parameters: [
                    {
                        name: "content",
                        type: "string",
                        required: true,
                        description: "Inläggets innehåll/text"
                    },
                    {
                        name: "platforms",
                        type: "array",
                        required: true,
                        description: "Array med plattformar att publicera till"
                    },
                    {
                        name: "schedule_time",
                        type: "string (ISO 8601)",
                        required: false,
                        description: "Tid att schemalägga inlägget (om ej angiven sparas inlägget som utkast)"
                    }
                ]
            },
            {
                name: "Hämta analys",
                method: "GET",
                path: "/api/v1/analytics",
                description: "Hämta analysdata för dina sociala mediekonton",
                parameters: [
                    {
                        name: "platform",
                        type: "string",
                        required: false,
                        description: "Filtrera efter plattform"
                    },
                    {
                        name: "start_date",
                        type: "string (ISO 8601)",
                        required: true,
                        description: "Startdatum för analysperioden"
                    },
                    {
                        name: "end_date",
                        type: "string (ISO 8601)",
                        required: true,
                        description: "Slutdatum för analysperioden"
                    },
                    {
                        name: "metrics",
                        type: "array",
                        required: false,
                        description: "Specifika mätvärden att returnera (t.ex. visningar, engagemang, klick)"
                    }
                ]
            }
        ]
    }
};

export function ApiDocumentationClient() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center max-w-[800px] mx-auto mb-10">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                                {t.title}
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl">
                                {t.subtitle}
                            </p>
                            <div className="mt-6">
                                <Button>
                                    {t.getStarted}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <Tabs defaultValue="overview">
                            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
                                <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                                <TabsTrigger value="authentication">{t.authentication}</TabsTrigger>
                                <TabsTrigger value="endpoints">{t.endpoints}</TabsTrigger>
                                <TabsTrigger value="rate-limits">{t.rateLimit}</TabsTrigger>
                                <TabsTrigger value="errors">{t.errors}</TabsTrigger>
                                <TabsTrigger value="sdks">{t.sdks}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t.overview}</h2>
                                    <div className="space-y-4">
                                        <p className="text-muted-foreground">
                                            {language === 'en'
                                                ? "The BrandSphereAI API provides programmatic access to our platform functionality. Using our API, you can create, schedule, and manage social media posts, retrieve analytics data, and integrate our AI-powered content generation capabilities into your applications."
                                                : "BrandSphereAI API ger programmatisk åtkomst till vår plattformsfunktionalitet. Med vårt API kan du skapa, schemalägga och hantera inlägg på sociala medier, hämta analysdata och integrera våra AI-drivna innehållsgenereringsfunktioner i dina applikationer."}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {language === 'en'
                                                ? "Our API follows RESTful principles, uses JSON for data formatting, and requires authentication via API keys. This documentation provides everything you need to integrate with BrandSphereAI."
                                                : "Vårt API följer RESTful-principer, använder JSON för dataformatering och kräver autentisering via API-nycklar. Denna dokumentation ger dig allt du behöver för att integrera med BrandSphereAI."}
                                        </p>
                                        <div className="bg-muted/30 p-4 rounded-lg mt-6">
                                            <h3 className="font-semibold mb-2">
                                                {language === 'en' ? "Base URL" : "Bas-URL"}
                                            </h3>
                                            <code className="text-sm bg-background p-2 rounded block">
                                                https://api.brandsphereai.com/v1
                                            </code>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="authentication">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t.authentication}</h2>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{t.apiKey}</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {t.apiKeyDescription}
                                        </p>

                                        <div className="space-y-4 mt-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">{t.request}</h4>
                                                <div className="bg-muted/30 p-4 rounded-lg">
                                                    <code className="text-sm block">
                                                        <span className="text-primary">GET</span> /api/v1/posts<br />
                                                        Authorization: Bearer YOUR_API_KEY<br />
                                                        Content-Type: application/json
                                                    </code>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <h4 className="font-semibold mb-2">
                                                    {language === 'en' ? "API Key Security" : "API-nyckelsäkerhet"}
                                                </h4>
                                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                                    <li>
                                                        {language === 'en'
                                                            ? "Never share your API key or expose it in client-side code."
                                                            : "Dela aldrig din API-nyckel eller exponera den i klientkod."}
                                                    </li>
                                                    <li>
                                                        {language === 'en'
                                                            ? "Implement proper key rotation and revocation procedures."
                                                            : "Implementera lämpliga procedurer för nyckelrotation och återkallande."}
                                                    </li>
                                                    <li>
                                                        {language === 'en'
                                                            ? "Use environment variables to store your API key in your applications."
                                                            : "Använd miljövariabler för att lagra din API-nyckel i dina applikationer."}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="endpoints">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t.endpoints}</h2>
                                    <div className="space-y-8">
                                        {t.endpointList.map((endpoint, index) => (
                                            <div key={index} className="border-b pb-8 last:border-0">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground">
                                                        {endpoint.method}
                                                    </span>
                                                    <code className="text-sm font-semibold">{endpoint.path}</code>
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">{endpoint.name}</h3>
                                                <p className="text-muted-foreground mb-4">
                                                    {endpoint.description}
                                                </p>

                                                <h4 className="font-semibold mt-4 mb-2">
                                                    {language === 'en' ? "Parameters" : "Parametrar"}
                                                </h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="text-left py-2 px-4">
                                                                    {language === 'en' ? "Name" : "Namn"}
                                                                </th>
                                                                <th className="text-left py-2 px-4">
                                                                    {language === 'en' ? "Type" : "Typ"}
                                                                </th>
                                                                <th className="text-left py-2 px-4">
                                                                    {language === 'en' ? "Required" : "Krävs"}
                                                                </th>
                                                                <th className="text-left py-2 px-4">
                                                                    {language === 'en' ? "Description" : "Beskrivning"}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {endpoint.parameters.map((param, paramIndex) => (
                                                                <tr key={paramIndex} className="border-b last:border-0">
                                                                    <td className="py-2 px-4 font-mono text-sm">
                                                                        {param.name}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-sm">
                                                                        {param.type}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-sm">
                                                                        {param.required
                                                                            ? (language === 'en' ? "Yes" : "Ja")
                                                                            : (language === 'en' ? "No" : "Nej")}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-sm text-muted-foreground">
                                                                        {param.description}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm">
                                                        {language === 'en' ? "View Example" : "Visa exempel"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="rate-limits">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t.rateLimit}</h2>
                                    <p className="text-muted-foreground mb-6">
                                        {t.rateLimitDescription}
                                    </p>

                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2 px-4">
                                                        {language === 'en' ? "Plan" : "Plan"}
                                                    </th>
                                                    <th className="text-left py-2 px-4">
                                                        {language === 'en' ? "Daily Limit" : "Daglig gräns"}
                                                    </th>
                                                    <th className="text-left py-2 px-4">
                                                        {language === 'en' ? "Burst Limit" : "Momentan gräns"}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {t.rateLimits.map((limit, index) => (
                                                    <tr key={index} className="border-b last:border-0">
                                                        <td className="py-2 px-4 font-semibold">
                                                            {limit.plan}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {limit.requests}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {limit.burst}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">
                                            {language === 'en' ? "Rate Limit Headers" : "Hastighetsbegränsningsheaders"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {language === 'en'
                                                ? "The API includes rate limit information in the response headers:"
                                                : "API:et inkluderar information om hastighetsbegränsningar i svarsheaderna:"}
                                        </p>
                                        <code className="text-sm block">
                                            X-RateLimit-Limit: 100<br />
                                            X-RateLimit-Remaining: 95<br />
                                            X-RateLimit-Reset: 1620046889
                                        </code>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="errors">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t.errors}</h2>
                                    <p className="text-muted-foreground mb-6">
                                        {language === 'en'
                                            ? "Our API uses conventional HTTP response codes to indicate the success or failure of an API request. In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that failed given the information provided, and codes in the 5xx range indicate an error with our servers."
                                            : "Vårt API använder konventionella HTTP-svarskoder för att indikera om en API-förfrågan lyckades eller misslyckades. Generellt indikerar koder i 2xx-intervallet framgång, koder i 4xx-intervallet indikerar ett fel baserat på den information som tillhandahållits, och koder i 5xx-intervallet indikerar ett fel med våra servrar."}
                                    </p>

                                    <div className="space-y-6">
                                        {t.errorCodes.map((error, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                                                <div className="w-16 h-16 flex items-center justify-center bg-muted/30 rounded-lg text-lg font-bold">
                                                    {error.code}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {error.message}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {error.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="font-semibold text-lg mb-4">
                                            {language === 'en' ? "Error Response Format" : "Format för felsvar"}
                                        </h3>
                                        <div className="bg-muted/30 p-4 rounded-lg">
                                            <code className="text-sm block">
                                                {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded",
    "details": "You have exceeded your rate limit. Please try again later."
  }
}`}
                                            </code>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="sdks">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t.sdks}</h2>
                                    <p className="text-muted-foreground mb-6">
                                        {language === 'en'
                                            ? "We provide official client libraries and SDKs to make integrating with our API easier in various programming languages."
                                            : "Vi tillhandahåller officiella klientbibliotek och SDK:er för att göra det enklare att integrera med vårt API i olika programmeringsspråk."}
                                    </p>

                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {[
                                            { name: "JavaScript", url: "#", icon: "JS" },
                                            { name: "Python", url: "#", icon: "PY" },
                                            { name: "PHP", url: "#", icon: "PHP" },
                                            { name: "Ruby", url: "#", icon: "RB" },
                                            { name: "Java", url: "#", icon: "JV" },
                                            { name: ".NET", url: "#", icon: "NET" }
                                        ].map((sdk, index) => (
                                            <Link href={sdk.url} key={index}>
                                                <div className="p-4 border rounded-lg flex items-center gap-4 hover:bg-muted/20 transition-colors">
                                                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                        {sdk.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{sdk.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {language === 'en' ? "View Documentation" : "Visa dokumentation"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                                        <h3 className="font-semibold mb-2">
                                            {language === 'en' ? "Community Libraries" : "Gemenskapsbibliotek"}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {language === 'en'
                                                ? "In addition to our official SDKs, there are several community-maintained libraries available. These are not officially supported by BrandSphereAI."
                                                : "Utöver våra officiella SDK:er finns det flera gemenskapsunderhållna bibliotek tillgängliga. Dessa stöds inte officiellt av BrandSphereAI."}
                                        </p>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 