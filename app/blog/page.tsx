import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, User, ArrowRight, Search, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

// Blog posts data
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
    slug: "ai-social-media-strategi",
    category: "AI Strategi",
    categoryEn: "AI Strategy"
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
    title: "Blog",
    subtitle: "Insights, trends, and tips to help you succeed with social media marketing",
    search: "Search articles...",
    featured: "Featured article",
    allArticles: "All articles",
    readMore: "Read more",
    readTime: "min read",
    searchResults: "Search results",
    searchResultsFor: "Search results for",
    noResults: "No articles found",
    tryDifferent: "Try a different search term",
    clearSearch: "Clear search",
    categories: "Categories",
    allCategories: "All categories",
    newsletter: {
      title: "Subscribe to our newsletter",
      subtitle: "Get the latest articles and insights direct to your inbox",
      placeholder: "Enter your email",
      button: "Subscribe",
      privacyNote: "We respect your privacy. Unsubscribe at any time."
    }
  },
  sv: {
    title: "Blogg",
    subtitle: "Insikter, trender och tips för att hjälpa dig lyckas med marknadsföring på sociala medier",
    search: "Sök artiklar...",
    featured: "Utvald artikel",
    allArticles: "Alla artiklar",
    readMore: "Läs mer",
    readTime: "min läsning",
    searchResults: "Sökresultat",
    searchResultsFor: "Sökresultat för",
    noResults: "Inga artiklar hittades",
    tryDifferent: "Prova en annan sökning",
    clearSearch: "Rensa sökning",
    categories: "Kategorier",
    allCategories: "Alla kategorier",
    newsletter: {
      title: "Prenumerera på vårt nyhetsbrev",
      subtitle: "Få de senaste artiklarna och insikterna direkt till din inkorg",
      placeholder: "Ange din e-post",
      button: "Prenumerera",
      privacyNote: "Vi respekterar din integritet. Avsluta prenumerationen när som helst."
    }
  }
};

// Format date function
function formatDate(dateString: string, language: 'en' | 'sv') {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', options);
}

export default function BlogPage() {
  const { language } = useLanguage();
  const t = translations[language];

  // State för sökning och kategorier
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Får innehåll baserat på språk
  const getTitle = (post: any) => language === 'en' ? post.titleEn : post.title;
  const getExcerpt = (post: any) => language === 'en' ? post.excerptEn : post.excerpt;
  const getCategory = (post: any) => language === 'en' ? post.categoryEn : post.category;

  // Hämta unika kategorier
  const uniqueCategories = Array.from(
    new Set(blogPosts.map(post => getCategory(post)))
  ).sort();

  // Filtrera inlägg baserat på sökning och kategorival
  useEffect(() => {
    let posts = blogPosts;

    // Filtrera efter kategori om en är vald
    if (selectedCategory) {
      posts = posts.filter(post => getCategory(post) === selectedCategory);
    }

    // Filtrera efter sökterm om en är angiven
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        getTitle(post).toLowerCase().includes(query) ||
        getExcerpt(post).toLowerCase().includes(query)
      );
    }

    setFilteredPosts(posts);
  }, [searchQuery, selectedCategory, language]);

  // Hantera sökning
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Rensa sökning
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  // Utvalt inlägg (det första i listan)
  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Bloggheader */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.title}</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.subtitle}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row w-full max-w-xl gap-2">
                <form onSubmit={handleSearch} className="flex w-full gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        <span className="sr-only">Clear search</span>
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button type="submit">
                    <span className="sr-only">Search</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge
                  variant={selectedCategory === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("")}
                >
                  {t.allCategories}
                </Badge>
                {uniqueCategories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Om sökresultat finns eller kategori är vald, visa bara sökresultat */}
        {(searchQuery || selectedCategory) ? (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-tighter">
                  {searchQuery
                    ? `${t.searchResultsFor} "${searchQuery}"`
                    : selectedCategory
                      ? selectedCategory
                      : t.searchResults
                  }
                </h2>
                <Button variant="outline" size="sm" onClick={clearSearch}>
                  {t.clearSearch}
                </Button>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 xl:gap-12">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-video">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 flex items-center justify-center text-white font-bold">
                            Post Image {post.id}
                          </div>
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                          <div className="space-y-2">
                            <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {getCategory(post)}
                            </span>
                            <h3 className="text-lg font-bold tracking-tight">
                              {getTitle(post)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {getExcerpt(post)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{formatDate(post.date, language)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{post.readTime} {language === 'sv' ? 'läsning' : 'read'}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">{t.noResults}</h3>
                  <p className="text-muted-foreground">{t.tryDifferent}</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Utvalt inlägg */}
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold tracking-tighter mb-8">{t.featured}</h2>
                <div className="grid gap-10 lg:gap-10 md:grid-cols-2">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 flex items-center justify-center text-white text-xl font-bold">
                      Feature Image {featuredPost.id}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {getCategory(featuredPost)}
                      </span>
                      <h3 className="text-3xl font-bold tracking-tight">
                        {getTitle(featuredPost)}
                      </h3>
                      <p className="text-muted-foreground">
                        {getExcerpt(featuredPost)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{formatDate(featuredPost.date, language)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{featuredPost.readTime} {language === 'sv' ? 'läsning' : 'read'}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                    </div>
                    <div>
                      <Button asChild>
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {t.readMore}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Alla inlägg */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold tracking-tighter mb-8">{t.allArticles}</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 xl:gap-12">
                  {blogPosts.slice(1).map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-video">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 flex items-center justify-center text-white font-bold">
                            Post Image {post.id}
                          </div>
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                          <div className="space-y-2">
                            <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {getCategory(post)}
                            </span>
                            <h3 className="text-lg font-bold tracking-tight">
                              {getTitle(post)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {getExcerpt(post)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{formatDate(post.date, language)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{post.readTime} {language === 'sv' ? 'läsning' : 'read'}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Nyhetsbrev */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-md mx-auto text-center space-y-6">
              <h2 className="text-2xl font-bold tracking-tighter">{t.newsletter.title}</h2>
              <p className="text-muted-foreground">
                {t.newsletter.subtitle}
              </p>
              <div className="flex flex-col space-y-2">
                <Input placeholder={t.newsletter.placeholder} />
                <Button>{t.newsletter.button}</Button>
                <p className="text-xs text-muted-foreground">
                  {t.newsletter.privacyNote}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 