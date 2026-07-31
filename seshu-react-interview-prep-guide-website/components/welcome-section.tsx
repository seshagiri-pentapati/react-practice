import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Zap, Target, Clock, Users, ArrowRight, CheckCircle } from "lucide-react"

export function WelcomeSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Coverage",
      description: "From React basics to advanced patterns and TypeScript integration",
    },
    {
      icon: Code,
      title: "Code Examples",
      description: "Real-world examples with detailed explanations and best practices",
    },
    {
      icon: Target,
      title: "Interview Focused",
      description: "Common interview questions with detailed answers and solutions",
    },
    {
      icon: Zap,
      title: "Latest Features",
      description: "React 18+ features, concurrent rendering, and modern patterns",
    },
  ]

  const roadmap = [
    {
      level: "Beginner",
      topics: "JSX, Components, Props, State, Events",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      level: "Intermediate",
      topics: "Hooks, Context, Patterns, TypeScript",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      level: "Advanced",
      topics: "Component Patterns, Design Patterns, Advanced TypeScript",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
    {
      level: "Expert",
      topics: "Performance Optimization, Testing, Best Practices",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Complete React TypeScript Interview Guide</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
          Master React with TypeScript from fundamentals to expert level. This comprehensive guide covers everything you
          need for technical interviews and professional development.
        </p>
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Badge variant="secondary" className="text-sm">
            <Clock className="h-3 w-3 mr-1" />
            50+ Hours of Content
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Users className="h-3 w-3 mr-1" />
            Interview Ready
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Latest React 18+
          </Badge>
        </div>
        <a href="/fundamentals">
          <Button size="lg" className="mr-4">
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
        <a href="#roadmap">
          <Button variant="outline" size="lg">
            View Roadmap
          </Button>
        </a>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <feature.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Roadmap */}
      <Card className="mb-12" id="roadmap">
        <CardHeader>
          <CardTitle className="text-2xl">Learning Roadmap</CardTitle>
          <CardDescription>Structured path from beginner to expert level React development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <a href="/fundamentals" className="block">
              <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Beginner</Badge>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">JSX, Components, Props, State, Events</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </a>
            <a href="/hooks" className="block">
              <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Intermediate</Badge>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Hooks, Context, Patterns, TypeScript</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </a>
            <a href="/patterns" className="block">
              <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                    Advanced
                  </Badge>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Component Patterns, Design Patterns, Advanced TypeScript
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </a>
            <a href="/advanced" className="block">
              <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Advanced
                  </Badge>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Concurrent Features, Suspense, Error Boundaries</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </a>
            <a href="/performance" className="block">
              <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Expert</Badge>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Performance Optimization, Testing, Best Practices</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <p className="text-sm text-muted-foreground">Code Examples</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <p className="text-sm text-muted-foreground">Interview Questions</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">7</div>
            <p className="text-sm text-muted-foreground">Major Sections</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
