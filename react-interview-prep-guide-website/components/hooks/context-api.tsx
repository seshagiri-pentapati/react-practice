"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { Layers, Lightbulb } from "lucide-react"

export function ContextAPI() {
  const basicContextCode = `// Context API - Basic Implementation with TypeScript

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// 1. Basic Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create context with undefined default (will be provided by provider)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = React.useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Components using the context
const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '1rem'
    }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
};

const Content: React.FC = () => {
  const { theme } = useTheme();

  return (
    <main style={{
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#222',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '2rem',
      minHeight: '400px'
    }}>
      <p>Current theme: {theme}</p>
      <p>This content adapts to the theme!</p>
    </main>
  );
};

// App component
const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div>
        <Header />
        <Content />
      </div>
    </ThemeProvider>
  );
};

// 2. User Authentication Context
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
        setUser(userData);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const value = React.useMemo(() => ({
    user,
    login,
    logout,
    loading,
    error
  }), [user, login, logout, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Login component
const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Protected component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};`

  const advancedContextCode = `// Advanced Context Patterns

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// 1. Context with useReducer for Complex State
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoState['filter'] } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'LOAD_TODOS'; payload: { todos: Todo[] } };

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        createdAt: new Date()
      };
      return {
        ...state,
        todos: [...state.todos, newTodo]
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error
      };

    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload.todos,
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

const initialTodoState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null
};

// Context type includes both state and actions
interface TodoContextType {
  state: TodoState;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoState['filter']) => void;
  loadTodos: () => Promise<void>;
  filteredTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const addTodo = useCallback((text: string) => {
    dispatch({ type: 'ADD_TODO', payload: { text } });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: { id } });
  }, []);

  const setFilter = useCallback((filter: TodoState['filter']) => {
    dispatch({ type: 'SET_FILTER', payload: { filter } });
  }, []);

  const loadTodos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTodos: Todo[] = [
        {
          id: '1',
          text: 'Learn React Context',
          completed: false,
          createdAt: new Date()
        },
        {
          id: '2',
          text: 'Build Todo App',
          completed: true,
          createdAt: new Date()
        }
      ];
      
      dispatch({ type: 'LOAD_TODOS', payload: { todos: mockTodos } });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: 'Failed to load todos' } 
      });
    }
  }, []);

  // Computed value - filtered todos
  const filteredTodos = React.useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);

  const value = React.useMemo(() => ({
    state,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    loadTodos,
    filteredTodos
  }), [state, addTodo, toggleTodo, deleteTodo, setFilter, loadTodos, filteredTodos]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

// 2. Multiple Contexts Pattern
interface AppSettings {
  language: 'en' | 'es' | 'fr';
  currency: 'USD' | 'EUR' | 'GBP';
  timezone: string;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    currency: 'USD',
    timezone: 'UTC'
  });

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const value = React.useMemo(() => ({
    settings,
    updateSettings
  }), [settings, updateSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Combined providers pattern
const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <TodoProvider>
            {children}
          </TodoProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// 3. Context Composition Pattern
interface ContextComposerProps {
  contexts: Array<React.ComponentType<{ children: ReactNode }>>;
  children: ReactNode;
}

const ContextComposer: React.FC<ContextComposerProps> = ({ contexts, children }) => {
  return contexts.reduceRight(
    (acc, Context) => <Context>{acc}</Context>,
    children
  );
};

// Usage
const App: React.FC = () => {
  return (
    <ContextComposer
      contexts={[ThemeProvider, AuthProvider, SettingsProvider, TodoProvider]}
    >
      <MainApp />
    </ContextComposer>
  );
};

// 4. Context with Local Storage Persistence
const usePersistedState = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(\`Error saving to localStorage: \${error}\`);
      }
      return newValue;
    });
  }, [key]);

  return [state, setValue] as const;
};

const PersistentThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = usePersistedState<'light' | 'dark'>('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const value = React.useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};`

  const contextPatternsCode = `// Context API Best Practices and Patterns

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ✅ GOOD: Split contexts by concern
// Don't put everything in one massive context
const UserContext = createContext<UserContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ❌ BAD: One massive context
const AppContext = createContext<{
  user: User;
  theme: Theme;
  notifications: Notification[];
  todos: Todo[];
  settings: Settings;
  // ... too many concerns
} | undefined>(undefined);

// ✅ GOOD: Provide default values and error handling
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ✅ GOOD: Memoize context values to prevent unnecessary re-renders
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Memoize the context value
  const value = React.useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ❌ BAD: Not memoizing context value causes unnecessary re-renders
const BadThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // This creates a new object on every render!
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ GOOD: Context with actions pattern
interface CounterState {
  count: number;
  step: number;
}

interface CounterActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setStep: (step: number) => void;
}

interface CounterContextType {
  state: CounterState;
  actions: CounterActions;
}

const CounterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CounterState>({ count: 0, step: 1 });

  const actions = React.useMemo<CounterActions>(() => ({
    increment: () => setState(prev => ({ ...prev, count: prev.count + prev.step })),
    decrement: () => setState(prev => ({ ...prev, count: prev.count - prev.step })),
    reset: () => setState(prev => ({ ...prev, count: 0 })),
    setStep: (step: number) => setState(prev => ({ ...prev, step }))
  }), []);

  const value = React.useMemo(() => ({
    state,
    actions
  }), [state, actions]);

  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
};

// ✅ GOOD: Context with selectors to prevent unnecessary re-renders
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
  settings: Settings;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

// Selector hooks for specific parts of state
const useUser = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useUser must be used within AppStateProvider');
  return context.user;
};

const useThemeOnly = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useThemeOnly must be used within AppStateProvider');
  return context.theme;
};

const useNotifications = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useNotifications must be used within AppStateProvider');
  return context.notifications;
};

// ✅ GOOD: Context factory pattern for reusable contexts
const createGenericContext = <T>() => {
  const context = createContext<T | undefined>(undefined);

  const useGenericContext = () => {
    const contextValue = useContext(context);
    if (!contextValue) {
      throw new Error('useGenericContext must be used within a Provider');
    }
    return contextValue;
  };

  return [useGenericContext, context.Provider] as const;
};

// Usage of generic context
interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const [useModal, ModalProvider] = createGenericContext<ModalContextType>();

// ✅ GOOD: Context with reducer for complex state logic
interface ShoppingCartState {
  items: CartItem[];
  total: number;
  discount: number;
  tax: number;
}

type ShoppingCartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: number } }
  | { type: 'CLEAR_CART' };

const shoppingCartReducer = (state: ShoppingCartState, action: ShoppingCartAction): ShoppingCartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.payload.discount
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        discount: 0
      };

    default:
      return state;
  }
};

// ✅ GOOD: Testing contexts
/*
// Test utilities for context
const renderWithContext = (ui: React.ReactElement, contextValue: any) => {
  return render(
    <TestContext.Provider value={contextValue}>
      {ui}
    </TestContext.Provider>
  );
};

// Test example
test('useTheme returns correct theme value', () => {
  const TestComponent = () => {
    const { theme } = useTheme();
    return <div>{theme}</div>;
  };

  const { getByText } = renderWithContext(
    <TestComponent />,
    { theme: 'dark', toggleTheme: jest.fn() }
  );

  expect(getByText('dark')).toBeInTheDocument();
});
*/

// ✅ GOOD: Context performance optimization with React.memo
const ExpensiveComponent = React.memo<{ data: any }>(({ data }) => {
  console.log('ExpensiveComponent rendered');
  return <div>{data.name}</div>;
});

// Only re-renders when user changes, not when theme changes
const UserProfile = () => {
  const user = useUser(); // Only subscribes to user changes
  return <ExpensiveComponent data={user} />;
};`

  const interviewQuestions = [
    {
      question: "When should you use Context API vs other state management solutions?",
      answer:
        "Use Context API for: theme, authentication, user preferences, and data that needs to be accessed by many components at different nesting levels. Avoid for: frequently changing data, complex state logic (use useReducer + Context), or when you need time-travel debugging (use Redux). Context is great for dependency injection patterns.",
      code: `// Good for Context - infrequent updates, widely needed
const ThemeContext = createContext();

// Consider alternatives for - frequent updates, complex logic
const [todos, setTodos] = useState([]); // Local state
// or Redux for complex app state`,
    },
    {
      question: "How do you prevent unnecessary re-renders with Context?",
      answer:
        "Memoize context values with useMemo, split contexts by concern, use React.memo for components, create selector hooks for specific state slices, and avoid passing objects/functions directly in JSX. Consider using multiple contexts instead of one large context.",
      code: `// ✅ Prevent re-renders
const value = useMemo(() => ({
  state,
  actions
}), [state, actions]);

// ✅ Split contexts
const UserContext = createContext();
const ThemeContext = createContext();

// ✅ Selector hooks
const useUserName = () => useContext(UserContext)?.name;`,
    },
    {
      question: "What are the best practices for Context API structure?",
      answer:
        "Create custom hooks for each context, provide error boundaries, split by domain/concern, memoize values and callbacks, use TypeScript for type safety, provide default values, and compose providers cleanly. Always throw errors when context is used outside provider.",
      code: `// Best practices structure
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};`,
    },
    {
      question: "How do you test components that use Context?",
      answer:
        "Create test utilities to wrap components with providers, mock context values, test both provider and consumer components separately, use renderHook for testing custom context hooks, and test error scenarios when context is missing.",
      code: `// Testing utility
const renderWithAuth = (ui, { user = null } = {}) => {
  return render(
    <AuthProvider value={{ user, login: jest.fn(), logout: jest.fn() }}>
      {ui}
    </AuthProvider>
  );
};

// Test usage
test('shows user name when logged in', () => {
  const { getByText } = renderWithAuth(<UserProfile />, { 
    user: { name: 'John' } 
  });
  expect(getByText('John')).toBeInTheDocument();
});`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Layers className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Context API</h2>
        <Badge variant="secondary">Global State</Badge>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Context</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Patterns</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Context Implementation</CardTitle>
              <CardDescription>Learn to create and use React Context for global state management</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={basicContextCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Pattern:</strong> Always create a custom hook (like useTheme) to consume context. This
                  provides better error handling and makes the API cleaner for consumers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Context Patterns</CardTitle>
              <CardDescription>
                Complex state management with useReducer, multiple contexts, and composition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={advancedContextCode} language="tsx" />

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">Advanced Patterns:</h4>
                <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>
                    • <strong>useReducer + Context:</strong> Complex state logic with predictable updates
                  </li>
                  <li>
                    • <strong>Multiple Contexts:</strong> Separate concerns and prevent unnecessary re-renders
                  </li>
                  <li>
                    • <strong>Context Composition:</strong> Clean provider nesting and reusability
                  </li>
                  <li>
                    • <strong>Persistence:</strong> Sync context state with localStorage
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Context Best Practices</CardTitle>
              <CardDescription>Performance optimization and maintainable patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={contextPatternsCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Best Practices</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Split contexts by concern</li>
                    <li>• Memoize context values</li>
                    <li>• Create custom hooks for each context</li>
                    <li>• Provide error boundaries</li>
                    <li>• Use TypeScript for type safety</li>
                    <li>• Test context providers and consumers</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Common Mistakes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• One massive context for everything</li>
                    <li>• Not memoizing context values</li>
                    <li>• Using context for frequently changing data</li>
                    <li>• Missing error handling</li>
                    <li>• Overusing context instead of props</li>
                    <li>• Not testing context logic</li>
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
