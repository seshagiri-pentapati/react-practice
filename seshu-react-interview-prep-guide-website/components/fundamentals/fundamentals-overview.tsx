import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Code, CheckCircle, AlertCircle } from "lucide-react"

export function FundamentalsOverview() {
  const topics = [
    { name: "JSX & Components", status: "covered", difficulty: "beginner" },
    { name: "Props & State", status: "covered", difficulty: "beginner" },
    { name: "Event Handling", status: "covered", difficulty: "beginner" },
    { name: "Conditional Rendering", status: "covered", difficulty: "beginner" },
  ]

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">React Fundamentals</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Master the core concepts of React with TypeScript integration. These fundamentals form the foundation of all
          React applications.
        </p>
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <BookOpen className="h-3 w-3 mr-1" />
          Beginner Level
        </Badge>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>What You'll Learn</span>
          </CardTitle>
          <CardDescription>
            Essential React concepts with TypeScript best practices and real-world examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {topics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{topic.name}</span>
                <Badge variant="outline" className="text-xs">
                  {topic.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Interview Focus</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                These fundamentals are tested in 90% of React interviews. Pay special attention to TypeScript
                integration, component lifecycle, and state management patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
