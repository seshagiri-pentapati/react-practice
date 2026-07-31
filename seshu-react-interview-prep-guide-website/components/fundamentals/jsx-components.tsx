"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { Component, Lightbulb } from "lucide-react"

export function JSXComponents() {
  const jsxBasicsCode = `// JSX Basics with TypeScript
import React from 'react';

// Functional Component with TypeScript
const Welcome: React.FC = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to React!</h1>
      <p>This is JSX - JavaScript XML</p>
    </div>
  );
};

// Component with explicit return type
const Greeting = (): JSX.Element => {
  const name = "Developer";
  const isLoggedIn = true;
  
  return (
    <div>
      <h2>Hello, {name}!</h2>
      {isLoggedIn && <p>You are logged in</p>}
    </div>
  );
};

export default Welcome;`

  const componentTypesCode = `// Different Component Types in TypeScript

// 1. Function Component (Recommended)
const FunctionComponent: React.FC = () => {
  return <div>Function Component</div>;
};

// 2. Function Component with explicit return type
const ExplicitComponent = (): JSX.Element => {
  return <div>Explicit Return Type</div>;
};

// 3. Arrow Function Component
const ArrowComponent: React.FC = () => (
  <div>Arrow Function Component</div>
);

// 4. Regular Function Component
function RegularComponent(): JSX.Element {
  return <div>Regular Function</div>;
}

// 5. Component with Props Interface
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={"btn btn-" + variant}
      onClick={onClick}
    >
      {text}
    </button>
  );
};`

  const jsxRulesCode = `// JSX Rules and Best Practices

// ❌ Wrong - Multiple root elements without fragment
const WrongComponent = () => {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
};

// ✅ Correct - Using React Fragment
const CorrectComponent = () => {
  return (
    <React.Fragment>
      <h1>Title</h1>
      <p>Paragraph</p>
    </React.Fragment>
  );
};

// ✅ Correct - Using short fragment syntax
const ShortFragment = () => {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
};

// ✅ Correct - Self-closing tags
const SelfClosingTags = () => {
  return (
    <div>
      <img src="image.jpg" alt="Description" />
      <input type="text" />
      <br />
    </div>
  );
};

// ✅ Correct - className instead of class
const ClassNameExample = () => {
  return (
    <div className="container">
      <p className="text-primary">Styled paragraph</p>
    </div>
  );
};`

  const interviewQuestions = [
    {
      question: "What is JSX and how does it work?",
      answer:
        "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript. It gets transpiled to React.createElement() calls by Babel. JSX makes React components more readable and allows you to use the full power of JavaScript within your markup.",
      code: `// JSX
const element = <h1>Hello, World!</h1>;

// Transpiled to:
const element = React.createElement('h1', null, 'Hello, World!');`,
    },
    {
      question: "What are the key differences between JSX and HTML?",
      answer:
        "Key differences include: 1) className instead of class, 2) htmlFor instead of for, 3) camelCase for event handlers (onClick vs onclick), 4) self-closing tags must be closed, 5) style attribute takes an object, 6) all attributes are camelCase.",
      code: `// JSX differences from HTML
<div className="container">
  <label htmlFor="input">Label</label>
  <input id="input" onClick={handleClick} />
  <img src="image.jpg" alt="desc" />
  <div style={{ backgroundColor: 'red', fontSize: '16px' }} />
</div>`,
    },
    {
      question: "How do you handle TypeScript with React components?",
      answer:
        "Use React.FC for functional components, define interfaces for props, use proper event types, and leverage TypeScript's type inference. Always type your props and use generic types when needed.",
      code: `interface Props {
  name: string;
  age?: number;
  onClick: (id: string) => void;
}

const User: React.FC<Props> = ({ name, age, onClick }) => {
  return (
    <div onClick={() => onClick('user-1')}>
      {name} {age && \`(\${age})\`}
    </div>
  );
};`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Component className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">JSX & Components</h2>
        <Badge variant="secondary">Fundamental</Badge>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics">JSX Basics</TabsTrigger>
          <TabsTrigger value="components">Component Types</TabsTrigger>
          <TabsTrigger value="rules">JSX Rules</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding JSX</CardTitle>
              <CardDescription>
                JSX is a syntax extension that allows you to write HTML-like code in JavaScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={jsxBasicsCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Point:</strong> JSX expressions must have exactly one parent element. Use React.Fragment
                  or empty tags {"<>"} when you need multiple root elements.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Types with TypeScript</CardTitle>
              <CardDescription>Different ways to define React components with proper TypeScript typing</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={componentTypesCode} language="tsx" />

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">Best Practices:</h4>
                <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Use React.FC for simple components without complex generics</li>
                  <li>• Define interfaces for props to ensure type safety</li>
                  <li>• Use optional props with default values when appropriate</li>
                  <li>• Prefer function components over class components</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JSX Rules & Best Practices</CardTitle>
              <CardDescription>Essential rules and common patterns for writing clean JSX</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={jsxRulesCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Do</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use fragments for multiple elements</li>
                    <li>• Close all tags properly</li>
                    <li>• Use className instead of class</li>
                    <li>• Use camelCase for attributes</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Don't</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Return multiple root elements</li>
                    <li>• Use HTML attributes in JSX</li>
                    <li>• Forget to close self-closing tags</li>
                    <li>• Use reserved JavaScript keywords</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="space-y-6">
          <InterviewQuestions questions={interviewQuestions} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
