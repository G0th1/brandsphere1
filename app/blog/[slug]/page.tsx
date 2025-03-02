import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, MessageSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"

// Samma exempeldata som på bloggsidan
const blogPosts = [
  {
    id: 1,
    title: "Så använder du AI för att förbättra din sociala mediastrategi",
    titleEn: "How to use AI to improve your social media strategy",
    excerpt: "Lär dig hur AI-teknologi kan hjälpa dig att skapa bättre innehåll, spara tid och förbättra din räckvidd på sociala medieplattformar.",
    excerptEn: "Learn how AI technology can help you create better content, save time, and improve your reach on social media platforms.",
    coverImage: "/blog/ai-social-media.jpg",
    date: "2023-10-15",
    readTime: "6 min",
    author: "Anna Lindberg",
    authorImage: "/authors/anna.jpg",
    authorRole: "Social Media Specialist",
    authorRoleEn: "Social Media Specialist",
    slug: "ai-social-media-strategi",
    category: "AI Strategi",
    categoryEn: "AI Strategy",
    content: `
      <p>Artificiell intelligens (AI) revolutionerar just nu hur företag arbetar med sociala medier. Från innehållsskapande till analys och schemaläggning kan AI-verktyg hjälpa dig att effektivisera ditt arbetsflöde och förbättra resultaten.</p>
      
      <h2>Fördelar med AI i sociala medier</h2>
      <p>AI-verktyg kan analysera stora mängder data för att identifiera mönster och insikter som kan vara svåra att upptäcka manuellt. Här är några av de viktigaste fördelarna:</p>
      <ul>
        <li><strong>Tidsbesparingar:</strong> Automatisera rutinuppgifter som innehållsschemaläggning och grundläggande kundservice.</li>
        <li><strong>Datadriven strategi:</strong> Få djupare insikter om din målgrupp och vad som engagerar dem.</li>
        <li><strong>Personalisering i stor skala:</strong> Skapa anpassat innehåll för olika segment av din publik.</li>
        <li><strong>Kontinuerlig optimering:</strong> Förbättra dina resultat över tid med hjälp av maskininlärning.</li>
      </ul>
      
      <h2>5 sätt att använda AI i din sociala mediastrategi</h2>
      
      <h3>1. Innehållsskapande och idégenerering</h3>
      <p>AI-verktyg kan hjälpa dig att generera idéer för inlägg, skapa utkast till texter, och till och med föreslå visuellt innehåll som passar ditt varumärke. Detta är särskilt användbart när du behöver producera stora mängder innehåll konsekvent.</p>
      <p>Verktyg som BrandSphereAI kan föreslå ämnen baserat på vad som trendar i din bransch och hjälpa dig att skapa innehåll som resonerar med din målgrupp.</p>
      
      <h3>2. Optimera publiceringstider</h3>
      <p>AI kan analysera när din målgrupp är mest aktiv och engagerad på olika plattformar. Genom att schemalägga dina inlägg vid dessa optimala tider kan du maximera räckvidden och engagemanget.</p>
      
      <h3>3. Personalisera kundupplevelsen</h3>
      <p>Med AI kan du segmentera din publik baserat på deras intressen, beteenden och tidigare interaktioner. Detta möjliggör mer riktad och relevant kommunikation som är mer benägen att generera engagemang.</p>
      
      <h3>4. Förbättra kundservice</h3>
      <p>AI-drivna chatbots kan svara på vanliga frågor, ge produktrekommendationer och till och med hantera enkla kundserviceärenden. Detta frigör tid för ditt team att fokusera på mer komplexa uppgifter.</p>
      
      <h3>5. Mät och analysera resultat</h3>
      <p>AI-verktyg kan hjälpa dig att analysera data från dina sociala mediekampanjer för att förstå vad som fungerar och vad som inte gör det. Detta möjliggör datadriven beslutsfattande och kontinuerlig förbättring av din strategi.</p>
      
      <h2>Kom igång med AI i din sociala mediastrategi</h2>
      <p>Att börja använda AI i din sociala mediastrategi behöver inte vara komplicerat. Börja med att identifiera områden där du spenderar mycket tid på rutinuppgifter eller där du skulle vilja ha djupare insikter.</p>
      <p>BrandSphereAI erbjuder en intuitiv plattform som kombinerar många av dessa AI-funktioner i ett enda verktyg, vilket gör det enkelt att komma igång utan omfattande teknisk kunskap.</p>
      
      <h2>Slutsats</h2>
      <p>AI är inte längre framtiden - det är nutiden inom sociala mediehantering. Genom att utnyttja kraften i AI kan du spara tid, få djupare insikter och skapa bättre innehåll som engagerar din målgrupp och driver resultat för ditt företag.</p>
      <p>Kom ihåg att AI är ett verktyg som förstärker din strategi, inte ersätter den mänskliga kreativiteten och det strategiska tänkandet som är avgörande för framgång på sociala medier.</p>
    `,
    contentEn: `
      <p>Artificial intelligence (AI) is currently revolutionizing how businesses work with social media. From content creation to analysis and scheduling, AI tools can help you streamline your workflow and improve results.</p>
      
      <h2>Benefits of AI in Social Media</h2>
      <p>AI tools can analyze large amounts of data to identify patterns and insights that might be difficult to detect manually. Here are some of the key benefits:</p>
      <ul>
        <li><strong>Time savings:</strong> Automate routine tasks such as content scheduling and basic customer service.</li>
        <li><strong>Data-driven strategy:</strong> Gain deeper insights about your audience and what engages them.</li>
        <li><strong>Personalization at scale:</strong> Create customized content for different segments of your audience.</li>
        <li><strong>Continuous optimization:</strong> Improve your results over time with the help of machine learning.</li>
      </ul>
      
      <h2>5 Ways to Use AI in Your Social Media Strategy</h2>
      
      <h3>1. Content Creation and Idea Generation</h3>
      <p>AI tools can help you generate ideas for posts, create drafts of texts, and even suggest visual content that fits your brand. This is especially useful when you need to produce large amounts of content consistently.</p>
      <p>Tools like BrandSphereAI can suggest topics based on what's trending in your industry and help you create content that resonates with your audience.</p>
      
      <h3>2. Optimize Publishing Times</h3>
      <p>AI can analyze when your audience is most active and engaged on different platforms. By scheduling your posts at these optimal times, you can maximize reach and engagement.</p>
      
      <h3>3. Personalize the Customer Experience</h3>
      <p>With AI, you can segment your audience based on their interests, behaviors, and previous interactions. This enables more targeted and relevant communication that is more likely to generate engagement.</p>
      
      <h3>4. Improve Customer Service</h3>
      <p>AI-driven chatbots can answer common questions, provide product recommendations, and even handle simple customer service issues. This frees up time for your team to focus on more complex tasks.</p>
      
      <h3>5. Measure and Analyze Results</h3>
      <p>AI tools can help you analyze data from your social media campaigns to understand what works and what doesn't. This enables data-driven decision making and continuous improvement of your strategy.</p>
      
      <h2>Getting Started with AI in Your Social Media Strategy</h2>
      <p>Starting to use AI in your social media strategy doesn't have to be complicated. Begin by identifying areas where you spend a lot of time on routine tasks or where you would like to have deeper insights.</p>
      <p>BrandSphereAI offers an intuitive platform that combines many of these AI features in a single tool, making it easy to get started without extensive technical knowledge.</p>
      
      <h2>Conclusion</h2>
      <p>AI is no longer the future - it's the present in social media management. By leveraging the power of AI, you can save time, gain deeper insights, and create better content that engages your audience and drives results for your business.</p>
      <p>Remember that AI is a tool that enhances your strategy, not replaces the human creativity and strategic thinking that is crucial for success on social media.</p>
    `,
    relatedPosts: [2, 6, 3]
  },
  {
    id: 2,
    title: "5 trender inom sociala medier du behöver känna till 2023",
    titleEn: "5 social media trends you need to know in 2023",
    excerpt: "Vi utforskar de senaste trenderna inom sociala medier som kan hjälpa ditt varumärke att sticka ut och engagera din målgrupp på ett nytt sätt.",
    excerptEn: "We explore the latest trends in social media that can help your brand stand out and engage your audience in new ways.",
    coverImage: "/blog/social-trends.jpg",
    date: "2023-09-28",
    readTime: "4 min",
    author: "Johan Bergström",
    slug: "sociala-medier-trender-2023",
    category: "Trender",
    categoryEn: "Trends"
  },
  {
    id: 3,
    title: "Hur du mäter ROI på dina sociala mediekampanjer",
    titleEn: "How to measure ROI on your social media campaigns",
    excerpt: "Konkreta strategier för att spåra och mäta avkastningen på dina investeringar i sociala medier, så att du kan optimera dina kampanjer för bättre resultat.",
    excerptEn: "Concrete strategies for tracking and measuring the return on your social media investments, so you can optimize your campaigns for better results.",
    coverImage: "/blog/roi-measurement.jpg",
    date: "2023-09-10",
    readTime: "7 min",
    author: "Maria Eriksson",
    slug: "mata-roi-sociala-medier",
    category: "Marknadsföring",
    categoryEn: "Marketing"
  },
  {
    id: 4,
    title: "Att skapa en innehållskalender som faktiskt fungerar",
    titleEn: "Creating a content calendar that actually works",
    excerpt: "Praktiska tips för att planera och strukturera din innehållskalender för sociala medier, så att du kan vara konsekvent och maximera din närvaro online.",
    excerptEn: "Practical tips for planning and structuring your social media content calendar, so you can be consistent and maximize your online presence.",
    coverImage: "/blog/content-calendar.jpg",
    date: "2023-08-22",
    readTime: "5 min",
    author: "Per Andersson",
    slug: "innehallskalender-som-fungerar",
    category: "Innehållsskapande",
    categoryEn: "Content Creation"
  },
  {
    id: 5,
    title: "Fallstudie: Hur vi ökade vår kunds följarantal med 300% på 3 månader",
    titleEn: "Case Study: How we increased our client's followers by 300% in 3 months",
    excerpt: "En detaljerad titt på hur vi hjälpte ett modeföretag att drastiskt öka sin följarskara och engagemang på Instagram genom strategisk innehållsplanering.",
    excerptEn: "A detailed look at how we helped a fashion company dramatically increase their following and engagement on Instagram through strategic content planning.",
    coverImage: "/blog/case-study.jpg",
    date: "2023-08-05",
    readTime: "8 min",
    author: "Lisa Johansson",
    slug: "fallstudie-okad-foljarbas",
    category: "Fallstudie",
    categoryEn: "Case Study"
  },
  {
    id: 6,
    title: "Automatisering vs personlighet: Hitta den rätta balansen",
    titleEn: "Automation vs personality: Finding the right balance",
    excerpt: "Hur du kan använda automatisering för att effektivisera din närvaro på sociala medier utan att förlora den personliga touch som dina följare värdesätter.",
    excerptEn: "How you can use automation to streamline your social media presence without losing the personal touch that your followers value.",
    coverImage: "/blog/automation-personality.jpg",
    date: "2023-07-19",
    readTime: "6 min",
    author: "Karl Nilsson",
    slug: "automatisering-vs-personlighet",
    category: "Automatisering",
    categoryEn: "Automation"
  }
];

// Översättningar
const translations = {
  en: {
    backToBlog: "Back to blog",
    readTime: "min read",
    shareArticle: "Share this article:",
    relatedArticles: "Related articles",
    authorPrefix: "Expert author in social media and digital marketing with a focus on AI-driven strategies to help businesses grow online."
  },
  sv: {
    backToBlog: "Tillbaka till bloggen",
    readTime: "min läsning",
    shareArticle: "Dela denna artikel:",
    relatedArticles: "Relaterade artiklar",
    authorPrefix: "Expertförfattare inom sociala medier och digital marknadsföring med fokus på AI-drivna strategier för att hjälpa företag att växa online."
  }
};

// Format date function
function formatDate(dateString: string, language: 'en' | 'sv') {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', options);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage();
  const t = translations[language];

  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Hämta relaterade inlägg om de finns
  const relatedPosts = post.relatedPosts
    ? post.relatedPosts.map(id => blogPosts.find(post => post.id === id)).filter(Boolean)
    : [];

  // Får innehåll baserat på språk
  const getTitle = (post: any) => language === 'en' ? post.titleEn : post.title;
  const getExcerpt = (post: any) => language === 'en' ? post.excerptEn : post.excerpt;
  const getCategory = (post: any) => language === 'en' ? post.categoryEn : post.category;
  const getContent = (post: any) => language === 'en' && post.contentEn ? post.contentEn : post.content;
  const getAuthorRole = (post: any) => language === 'en' && post.authorRoleEn ? post.authorRoleEn : post.authorRole;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <article className="py-10 md:py-16">
          <div className="container px-4 md:px-6">
            {/* Breadcrumbs och tillbaka-knapp */}
            <div className="mb-8 animate-fade-in">
              <Link href="/blog" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToBlog}
              </Link>
            </div>

            {/* Artikelhuvud */}
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-sm">
                  {getCategory(post)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                {getTitle(post)}
              </h1>

              <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <div className="rounded-full bg-primary/10 h-10 w-10 flex items-center justify-center text-primary font-bold">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    {getAuthorRole(post) && <p className="text-xs">{getAuthorRole(post)}</p>}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.date, language)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} {t.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Artikelbild */}
            <div className="max-w-4xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="relative rounded-lg overflow-hidden aspect-[16/9]">
                {/* Här skulle vi normalt ha en riktig bild */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-muted flex items-center justify-center text-background text-3xl font-bold">
                  Artikelbild {post.id}
                </div>
              </div>
            </div>

            {/* Artikelinnehåll */}
            <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: getContent(post) || `<p>${getExcerpt(post)}</p><p>Fullständigt innehåll kommer snart...</p>` }}>
              </div>

              {/* Artikelåtgärder */}
              <div className="flex flex-wrap justify-between items-center border-t border-b py-4 mb-10">
                <div className="text-sm">
                  {t.shareArticle}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Dela</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Spara</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Kommentera</span>
                  </Button>
                </div>
              </div>

              {/* Författarsektion */}
              <div className="bg-muted/30 p-6 rounded-lg mb-12">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="rounded-full bg-primary/10 h-16 w-16 flex-shrink-0 flex items-center justify-center text-primary text-xl font-bold">
                    {post.author[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{post.author}</h3>
                    {getAuthorRole(post) && <p className="text-sm text-muted-foreground mb-4">{getAuthorRole(post)}</p>}
                    <p className="text-sm">
                      {t.authorPrefix}
                    </p>
                  </div>
                </div>
              </div>

              {/* Relaterade inlägg */}
              {relatedPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t.relatedArticles}</h2>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {relatedPosts.map((related) => related && (
                      <Link key={related.id} href={`/blog/${related.slug}`} className="group">
                        <div className="flex flex-col h-full">
                          <div className="relative h-40 rounded-t-lg overflow-hidden">
                            {/* Här skulle vi normalt ha en riktig bild */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-muted flex items-center justify-center text-background text-xl font-bold">
                              Artikelbild {related.id}
                            </div>
                          </div>
                          <div className="border border-t-0 rounded-b-lg p-4 h-full flex flex-col">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full self-start mb-2">
                              {getCategory(related)}
                            </span>
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                              {getTitle(related)}
                            </h3>
                            <div className="flex justify-between mt-auto pt-2 text-xs text-muted-foreground">
                              <span>{formatDate(related.date, language)}</span>
                              <span>{related.readTime} {t.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
} 