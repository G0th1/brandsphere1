import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Så använder du AI för att förbättra din sociala mediastrategi",
    excerpt: "Lär dig hur AI-teknologi kan hjälpa dig att skapa bättre innehåll, spara tid och förbättra din räckvidd på sociala medieplattformar.",
    coverImage: "/blog/ai-social-media.jpg",
    date: "2023-10-15",
    readTime: "6 min",
    author: "Anna Lindberg",
    slug: "ai-social-media-strategi",
    category: "AI Strategi"
  },
  {
    id: 2,
    title: "5 trender inom sociala medier du behöver känna till 2023",
    excerpt: "Vi utforskar de senaste trenderna inom sociala medier som kan hjälpa ditt varumärke att sticka ut och engagera din målgrupp på ett nytt sätt.",
    coverImage: "/blog/social-trends.jpg",
    date: "2023-09-28",
    readTime: "4 min",
    author: "Johan Bergström",
    slug: "sociala-medier-trender-2023",
    category: "Trender"
  },
  {
    id: 3,
    title: "Hur du mäter ROI på dina sociala mediekampanjer",
    excerpt: "Konkreta strategier för att spåra och mäta avkastningen på dina investeringar i sociala medier, så att du kan optimera dina kampanjer för bättre resultat.",
    coverImage: "/blog/roi-measurement.jpg",
    date: "2023-09-10",
    readTime: "7 min",
    author: "Maria Eriksson",
    slug: "mata-roi-sociala-medier",
    category: "Marknadsföring"
  },
  {
    id: 4,
    title: "Att skapa en innehållskalender som faktiskt fungerar",
    excerpt: "Praktiska tips för att planera och strukturera din innehållskalender för sociala medier, så att du kan vara konsekvent och maximera din närvaro online.",
    coverImage: "/blog/content-calendar.jpg",
    date: "2023-08-22",
    readTime: "5 min",
    author: "Per Andersson",
    slug: "innehallskalender-som-fungerar",
    category: "Innehållsskapande"
  },
  {
    id: 5,
    title: "Fallstudie: Hur vi ökade vår kunds följarantal med 300% på 3 månader",
    excerpt: "En detaljerad titt på hur vi hjälpte ett modeföretag att drastiskt öka sin följarskara och engagemang på Instagram genom strategisk innehållsplanering.",
    coverImage: "/blog/case-study.jpg",
    date: "2023-08-05",
    readTime: "8 min",
    author: "Lisa Johansson",
    slug: "fallstudie-okad-foljarbas",
    category: "Fallstudie"
  },
  {
    id: 6,
    title: "Automatisering vs personlighet: Hitta den rätta balansen",
    excerpt: "Hur du kan använda automatisering för att effektivisera din närvaro på sociala medier utan att förlora den personliga touch som dina följare värdesätter.",
    coverImage: "/blog/automation-personality.jpg",
    date: "2023-07-19",
    readTime: "6 min",
    author: "Karl Nilsson",
    slug: "automatisering-vs-personlighet",
    category: "Automatisering"
  }
];

// Format date function
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('sv-SE', options);
}

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                BrandSphereAI Blogg
              </h1>
              <p className="text-muted-foreground max-w-[700px] md:text-xl">
                Insikter, tips och strategier för att förbättra din närvaro på sociala medier
              </p>
            </div>
            
            {/* Featured Post */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Link href={`/blog/${featuredPost.slug}`} className="group">
                <Card className="overflow-hidden">
                  <div className="md:grid md:grid-cols-2 md:gap-6">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      {/* Här skulle vi normalt ha en riktig bild */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-muted flex items-center justify-center text-background text-2xl font-bold">
                        Artikelbild {featuredPost.id}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col">
                      <div className="flex items-center text-sm mb-4">
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                          {featuredPost.category}
                        </span>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl mb-3 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </CardTitle>
                      <CardDescription className="mb-6 flex-grow">
                        {featuredPost.excerpt}
                      </CardDescription>
                      <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-2 md:mb-0">
                          <User className="h-4 w-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2 md:mb-0">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(featuredPost.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredPost.readTime} läsning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
            
            {/* Regular Posts */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      {/* Här skulle vi normalt ha en riktig bild */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-muted flex items-center justify-center text-background text-xl font-bold">
                        Artikelbild {post.id}
                      </div>
                    </div>
                    <CardHeader className="pb-3 flex-grow">
                      <div className="flex items-center text-xs mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 mt-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 border-t text-xs text-muted-foreground">
                      <div className="flex justify-between w-full">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime} läsning</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-16 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Card className="bg-muted/50">
                <CardContent className="py-8 px-6 md:py-12 md:px-8">
                  <div className="text-center max-w-2xl mx-auto space-y-6">
                    <h2 className="text-2xl font-bold">Prenumerera på vårt nyhetsbrev</h2>
                    <p className="text-muted-foreground">
                      Få de senaste nyheterna, tipsen och trenderna inom sociala medier direkt till din inkorg.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-4">
                      <input
                        type="email"
                        placeholder="Din e-postadress"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                      <Button type="submit">Prenumerera</Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                      Vi skickar endast relevant innehåll och du kan avsluta prenumerationen när som helst.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 