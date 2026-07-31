"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { Database, Lightbulb } from "lucide-react"

export function PropsAndState() {
  const propsCode = `// Props with TypeScript - Complete Guide

// 1. Basic Props Interface
interface UserProps {
  name: string;
  age: number;
  email?: string; // Optional prop
  isActive: boolean;
}

const User: React.FC<UserProps> = ({ name, age, email, isActive }) => {
  return (
    <div className={isActive ? 'user-active' : 'user-inactive'}>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
    </div>
  );
};

// 2. Props with Default Values
interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick 
}) => {
  return (
    <button 
      className={'btn btn-' + variant + ' btn-' + size}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

// 3. Children Props
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={'container ' + (className || '')}>
      {children}
    </div>
  );
};

// 4. Function Props (Callbacks)
interface FormProps {
  onSubmit: (data: { name: string; email: string }) => void;
  onCancel: () => void;
}

const Form: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: 'John', email: 'john@example.com' });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};`

  const stateCode = `// State Management with useState and TypeScript

import React, { useState } from 'react';

// 1. Basic State Types
const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
    </div>
  );
};

// 2. Object State
interface User {
  id: number;
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <div>
      {user && (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => updateUser({ name: 'Updated Name' })}>
            Update Name
          </button>
        </div>
      )}
    </div>
  );
};

// 3. Array State
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => removeTodo(todo.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

// 4. Complex State with useReducer Alternative
type ActionType = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string };

interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserManager: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    loading: false,
    error: null
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      {state.user && <p>Welcome, {state.user.name}!</p>}
    </div>
  );
};`

  const stateRulesCode = `// State Management Best Practices

// ✅ DO: Use functional updates for state that depends on previous state
const [count, setCount] = useState(0);

const increment = () => {
  setCount(prev => prev + 1); // ✅ Correct
};

const incrementWrong = () => {
  setCount(count + 1); // ❌ Can cause issues with stale closures
};

// ✅ DO: Immutable updates for objects and arrays
const [user, setUser] = useState({ name: 'John', age: 30 });

const updateAge = () => {
  setUser(prev => ({ ...prev, age: prev.age + 1 })); // ✅ Correct
};

const updateAgeWrong = () => {
  user.age = user.age + 1; // ❌ Mutating state directly
  setUser(user);
};

// ✅ DO: Use multiple state variables for unrelated data
const UserComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Better than one large state object for unrelated data
};

// ✅ DO: Initialize state with proper types
const [items, setItems] = useState<string[]>([]); // ✅ Explicit type
const [user, setUser] = useState<User | null>(null); // ✅ Union type

// ❌ DON'T: Initialize with undefined when you know the type
const [count, setCount] = useState<number | undefined>(undefined); // ❌ Unnecessary

// ✅ DO: Use lazy initial state for expensive computations
const [expensiveValue, setExpensiveValue] = useState(() => {
  return computeExpensiveValue(); // Only runs once
});

// ❌ DON'T: Run expensive computations on every render
const [expensiveValue, setExpensiveValue] = useState(computeExpensiveValue()); // ❌ Runs every render`

  const interviewQuestions = [
    {
      question: "What's the difference between props and state?",
      answer:
        "Props are read-only data passed from parent to child components, while state is mutable data managed within a component. Props flow down the component tree, state is local to the component that declares it.",
      code: `// Props - passed from parent
const Child = ({ name }: { name: string }) => <div>{name}</div>;

// State - managed within component  
const Parent = () => {
  const [name, setName] = useState('John');
  return <Child name={name} />;
};`,
    },
    {
      question: "How do you update state that depends on the previous state?",
      answer:
        "Use the functional update pattern with setState. This ensures you're working with the most current state value and avoids issues with stale closures.",
      code: `const [count, setCount] = useState(0);

// ✅ Correct - functional update
const increment = () => setCount(prev => prev + 1);

// ❌ Wrong - can cause stale closure issues
const incrementWrong = () => setCount(count + 1);`,
    },
    {
      question: "How do you handle complex state in TypeScript?",
      answer:
        "Define interfaces for your state shape, use union types for different states, and consider useReducer for complex state logic. Always maintain immutability when updating state.",
      code: `interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const [state, setState] = useState<AppState>({
  user: null,
  loading: false,
  error: null
});

// Immutable update
setState(prev => ({ ...prev, loading: true }));`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Props & State</h2>
        <Badge variant="secondary">Core Concept</Badge>
      </div>

      <Tabs defaultValue="props" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="props" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Props with TypeScript</CardTitle>
              <CardDescription>Learn how to properly type and use props in React components</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={propsCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Always define interfaces for your props. This provides better IntelliSense,
                  catches errors at compile time, and serves as documentation for your components.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="state" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>State Management with useState</CardTitle>
              <CardDescription>Master state management patterns with TypeScript integration</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={stateCode} language="tsx" />

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <h4 className="font-semibold mb-2">State Update Patterns:</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>Primitive values:</strong> Direct assignment
                  </li>
                  <li>
                    • <strong>Objects:</strong> Spread operator for immutable updates
                  </li>
                  <li>
                    • <strong>Arrays:</strong> Use methods like map, filter, concat
                  </li>
                  <li>
                    • <strong>Previous state:</strong> Always use functional updates
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>State Management Best Practices</CardTitle>
              <CardDescription>Essential patterns and anti-patterns for React state management</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={stateRulesCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Best Practices</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use functional updates for dependent state</li>
                    <li>• Keep state immutable</li>
                    <li>• Split unrelated state into separate variables</li>
                    <li>• Use proper TypeScript types</li>
                    <li>• Initialize with lazy state when expensive</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Avoid</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Mutating state directly</li>
                    <li>• Using stale state in updates</li>
                    <li>• Large monolithic state objects</li>
                    <li>• Expensive computations in initial state</li>
                    <li>• Unnecessary re-renders</li>
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
