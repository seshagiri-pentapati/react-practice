import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Code, CheckCircle, AlertTriangle } from "lucide-react"

export function HooksOverview() {
  const topics = [
    {
      name: "Built-in Hooks",
      status: "covered",
      difficulty: "intermediate",
      description: "useState, useEffect, useContext, useReducer, useMemo, useCallback",
    },
    {
      name: "Custom Hooks",
      status: "covered",
      difficulty: "intermediate",
      description: "Creating reusable logic and patterns",
    },
    {
      name: "Context API",
      status: "covered",
      difficulty: "intermediate",
      description: "Global state management and provider patterns",
    },
    {
      name: "State Patterns",
      status: "covered",
      difficulty: "advanced",
      description: "Advanced state management strategies",
    },
  ]

  const hookRules = [
    "Only call hooks at the top level of React functions",
    "Don't call hooks inside loops, conditions, or nested functions",
    "Only call hooks from React function components or custom hooks",
    "Use the ESLint plugin to enforce these rules automatically",
  ]

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Hooks & State Management</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Master React Hooks and advanced state management patterns. Learn to build reusable logic and manage complex
          application state effectively.
        </p>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          <Zap className="h-3 w-3 mr-1" />
          Intermediate Level
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>What You'll Master</span>
            </CardTitle>
            <CardDescription>Essential hooks and state management patterns with TypeScript</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{topic.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-900 dark:text-amber-100">
              <AlertTriangle className="h-5 w-5" />
              <span>Rules of Hooks</span>
            </CardTitle>
            <CardDescription className="text-amber-800 dark:text-amber-200">
              Critical rules that must be followed when using hooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hookRules.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{index + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Why Hooks Matter</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Hooks revolutionized React by enabling state and lifecycle features in function components. They promote
                code reuse, better separation of concerns, and more predictable component behavior. Understanding hooks
                deeply is essential for modern React development and is heavily tested in interviews.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
