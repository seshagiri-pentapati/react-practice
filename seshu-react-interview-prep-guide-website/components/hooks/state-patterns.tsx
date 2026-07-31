"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState, useCallback, useMemo } from "react"
import { CodeBlock } from "../code-block"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { InterviewQuestions } from "../interview-questions"

// State Management Patterns and Strategies

interface User {
  id: string
  name: string
  preferences: any
}

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const addTodo = useCallback((text: string) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    setTodos((prev) => [...prev, newTodo])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }, [])

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed)
      case "completed":
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  }, [todos, filter])

  return (
    <div>
      <TodoInput onAddTodo={addTodo} />
      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
    </div>
  )
}

const TodoInput: React.FC<{ onAddTodo: (text: string) => void }> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Add a todo..." />
      <button type="submit">Add</button>
    </form>
  )
}

const TodoFilter: React.FC<{ currentFilter: string; onFilterChange: (filter: string) => void }> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div>
      <button onClick={() => onFilterChange("all")} className={currentFilter === "all" ? "active" : ""}>
        All
      </button>
      <button onClick={() => onFilterChange("active")} className={currentFilter === "active" ? "active" : ""}>
        Active
      </button>
      <button onClick={() => onFilterChange("completed")} className={currentFilter === "completed" ? "active" : ""}>
        Completed
      </button>
    </div>
  )
}

const TodoList: React.FC<{ todos: TodoItem[]; onToggleTodo: (id: string) => void }> = ({ todos, onToggleTodo }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => onToggleTodo(todo.id)}>{todo.completed ? "Undo" : "Complete"}</button>
        </li>
      ))}
    </ul>
  )
}

type LoadingState = "idle" | "loading" | "success" | "error"

interface DataState<T> {
  status: LoadingState
  data: T | null
  error: string | null
}

const useAsyncData = <T,>(fetchFn: () => Promise<T>) => {
  const [state, setState] = useState<DataState<T>>({
    status: "idle",
    data: null,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ status: "loading", data: null, error: null })

    try {
      const data = await fetchFn()
      setState({ status: "success", data, error: null })
    } catch (error) {
      setState({
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }, [fetchFn])

  return {
    ...state,
    execute,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
  }
}

interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

type FormAction =
  | { type: "SET_FIELD_VALUE"; field: string; value: any }
  | { type: "SET_FIELD_ERROR"; field: string; error: string }
  | { type: "SET_FIELD_TOUCHED"; field: string; touched: boolean }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "RESET_FORM"; initialValues: Record<string, any> }
  | { type: "VALIDATE_FORM"; errors: Record<string, string> }

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: "" },
      }
    case "SET_FIELD_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      }
    case "SET_FIELD_TOUCHED":
      return {
        ...state,
        touched: { ...state.touched, [action.field]: action.touched },
      }
    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      }
    case "VALIDATE_FORM":
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0,
      }
    case "RESET_FORM":
      return {
        values: action.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
      }
    default:
      return state
  }
}

interface NormalizedState<T> {
  byId: Record<string, T>
  allIds: string[]
}

const createNormalizedState = <T extends { id: string }>(): NormalizedState<T> => ({
  byId: {},
  allIds: [],
})

const addEntity = <T extends { id: string }>(state: NormalizedState<T>, entity: T): NormalizedState<T> => ({
  byId: { ...state.byId, [entity.id]: entity },
  allIds: state.allIds.includes(entity.id) ? state.allIds : [...state.allIds, entity.id],
})

interface Post {
  id: string
  title: string
  content: string
  authorId: string
}

const PostManager: React.FC = () => {
  const [posts, setPosts] = useState<NormalizedState<Post>>(createNormalizedState())

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => addEntity(prev, post))
  }, [])

  const allPosts = useMemo(() => posts.allIds.map((id) => posts.byId[id]), [posts])

  return (
    <div>
      {allPosts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}

const UserContext = React.createContext<User | null>(null)

const AppWithContext: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)

  return (
    <UserContext.Provider value={user}>
      <div className="layout">
        <div className="header">{user ? `Welcome, ${user.name}` : "Please log in"}</div>
        <div className="main">
          <div className="sidebar">Sidebar content</div>
          <div className="content">Content area</div>
        </div>
      </div>
    </UserContext.Provider>
  )
}

const interviewQuestions = [
  {
    question: "When would you choose useReducer over useState?",
    answer:
      "Use useReducer when: 1) State logic is complex with multiple sub-values, 2) Next state depends on previous state, 3) You need to optimize performance by passing dispatch down instead of callbacks, 4) State transitions follow predictable patterns (like a state machine), 5) You want to separate state logic from component logic for better testing.",
  },
  {
    question: "What are the different patterns for state management in React?",
    answer:
      "1) Local state (useState) for component-specific data, 2) Lifted state for sibling communication, 3) Context API for global application state, 4) State colocation (keeping state close to where it's used), 5) Derived state (computing values from existing state), 6) State normalization for complex nested data, 7) State machines for predictable state transitions.",
  },
  {
    question: "How do you prevent unnecessary re-renders when passing state down?",
    answer:
      "1) Use useCallback for event handlers, 2) Use useMemo for computed values, 3) Split context providers to avoid passing everything in one context, 4) Use React.memo for components that don't need to re-render, 5) Pass primitive values instead of objects when possible, 6) Use state colocation to minimize the scope of re-renders.",
  },
  {
    question: "What is state normalization and when should you use it?",
    answer:
      "State normalization is organizing nested/relational data in a flat structure with entities stored by ID and arrays of IDs for relationships. Use it when: 1) You have nested data that needs frequent updates, 2) Multiple components need to access the same entities, 3) You need to avoid deep object updates, 4) You're building features like real-time updates or optimistic updates.",
  },
  {
    question: "How do you implement optimistic updates in React?",
    answer:
      "1) Immediately update the UI with the expected result, 2) Make the async request in the background, 3) On success, update with server response, 4) On failure, revert to previous state and show error, 5) Track pending states to show loading indicators, 6) Use techniques like versioning or timestamps to handle race conditions.",
  },
]

export function StatePatterns(): ReactElement {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">State Management Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Learn advanced patterns for managing state effectively in React applications, from simple local state to
          complex global state architectures.
        </p>
      </div>

      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">State Patterns</TabsTrigger>
          <TabsTrigger value="complex">Complex State</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="questions">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>State Management Patterns & Strategies</CardTitle>
              <CardDescription>Learn when and how to use different state management patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`// Todo App with State Management Patterns
const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const addTodo = useCallback((text: string) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    setTodos((prev) => [...prev, newTodo])
  }, [])

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active": return todos.filter((todo) => !todo.completed)
      case "completed": return todos.filter((todo) => todo.completed)
      default: return todos
    }
  }, [todos, filter])

  return (
    <div>
      <TodoInput onAddTodo={addTodo} />
      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
    </div>
  )
}`}
                language="typescript"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complex State Management</CardTitle>
              <CardDescription>Advanced patterns for managing complex application state</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`// Normalized State Pattern
interface NormalizedState<T> {
  byId: Record<string, T>;
  allIds: string[];
}

const PostManager: React.FC = () => {
  const [posts, setPosts] = useState<NormalizedState<Post>>(createNormalizedState());

  const addPost = useCallback((post: Post) => {
    setPosts(prev => addEntity(prev, post));
  }, []);

  const allPosts = useMemo(() => 
    posts.allIds.map(id => posts.byId[id]), 
    [posts]
  );

  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};`}
                language="typescript"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>State Architecture Guidelines</CardTitle>
              <CardDescription>Decision-making framework for state management architecture</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`// Context API Pattern
const UserContext = React.createContext<User | null>(null);

const AppWithContext: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={user}>
      <div className="layout">
        <Header />
        <Main>
          <Sidebar />
          <Content />
        </Main>
      </div>
    </UserContext.Provider>
  );
};`}
                language="typescript"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <InterviewQuestions questions={interviewQuestions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
