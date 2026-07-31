"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { Zap, Lightbulb } from "lucide-react"

export function BuiltInHooks() {
  const useStateCode = `// useState Hook - Complete Guide with TypeScript

import React, { useState } from 'react';

// 1. Basic useState with primitive types
const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
      
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

// 2. useState with objects and arrays
interface User {
  id: number;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  const [todos, setTodos] = useState<string[]>([]);

  // Update nested object properties
  const updateTheme = (theme: 'light' | 'dark') => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme
      }
    }));
  };

  // Array operations
  const addTodo = (todo: string) => {
    setTodos(prev => [...prev, todo]);
  };

  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Theme: {user.preferences.theme}</p>
      <button onClick={() => updateTheme('dark')}>Dark Mode</button>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 3. Lazy initial state
const ExpensiveComponent: React.FC = () => {
  // Only runs once on initial render
  const [data, setData] = useState(() => {
    console.log('Computing expensive initial state...');
    return Array.from({ length: 1000 }, (_, i) => i);
  });

  return <div>Data length: {data.length}</div>;
};

// 4. useState with custom types
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface ApiState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

const DataFetcher: React.FC = () => {
  const [apiState, setApiState] = useState<ApiState<string[]>>({
    data: null,
    status: 'idle',
    error: null
  });

  const fetchData = async () => {
    setApiState(prev => ({ ...prev, status: 'loading' }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = ['item1', 'item2', 'item3'];
      
      setApiState({
        data,
        status: 'success',
        error: null
      });
    } catch (error) {
      setApiState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={apiState.status === 'loading'}>
        {apiState.status === 'loading' ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {apiState.status === 'success' && (
        <ul>
          {apiState.data?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      
      {apiState.status === 'error' && (
        <p>Error: {apiState.error}</p>
      )}
    </div>
  );
};`

  const useEffectCode = `// useEffect Hook - Complete Guide with TypeScript

import React, { useState, useEffect, useRef } from 'react';

// 1. Basic useEffect patterns
const EffectExamples: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Effect runs after every render
  useEffect(() => {
    console.log('Component rendered');
  });

  // Effect runs only once (componentDidMount equivalent)
  useEffect(() => {
    console.log('Component mounted');
    document.title = 'My App';
  }, []); // Empty dependency array

  // Effect runs when count changes
  useEffect(() => {
    console.log(\`Count changed to: \${count}\`);
    localStorage.setItem('count', count.toString());
  }, [count]); // Dependency array with count

  // Effect with cleanup (componentWillUnmount equivalent)
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
      console.log('Timer cleaned up');
    };
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
    </div>
  );
};

// 2. Data fetching with useEffect
interface Post {
  id: number;
  title: string;
  body: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false; // Cleanup flag

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data: Post[] = await response.json();
        
        // Only update state if component is still mounted
        if (!isCancelled) {
          setPosts(data.slice(0, 5)); // Limit to 5 posts
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch');
          setLoading(false);
        }
      }
    };

    fetchPosts();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, []); // Empty dependency - fetch once on mount

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Posts</h3>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

// 3. useEffect with dependencies
const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Effect runs when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = [
        \`Result for "\${query}" - 1\`,
        \`Result for "\${query}" - 2\`,
        \`Result for "\${query}" - 3\`
      ];
      
      setResults(mockResults);
      setLoading(false);
    };

    // Debounce the search
    const timeoutId = setTimeout(searchData, 300);

    return () => clearTimeout(timeoutId);
  }, [query]); // Effect depends on query

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {loading && <p>Searching...</p>}
      
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

// 4. Advanced useEffect patterns
const AdvancedEffects: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Window resize effect
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Online/offline status effect
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      <p>Window width: {windowWidth}px</p>
      <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
};`

  const otherHooksCode = `// Other Essential Hooks - useContext, useReducer, useMemo, useCallback

import React, { useContext, useReducer, useMemo, useCallback, useState } from 'react';

// 1. useContext Hook
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemedComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ 
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '1rem'
    }}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

// 2. useReducer Hook
interface CounterState {
  count: number;
  step: number;
}

type CounterAction = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set_step'; payload: number };

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return { ...state, count: 0 };
    case 'set_step':
      return { ...state, step: action.payload };
    default:
      throw new Error(\`Unhandled action type\`);
  }
};

const CounterWithReducer: React.FC = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      
      <button onClick={() => dispatch({ type: 'increment' })}>
        +{state.step}
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -{state.step}
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
      
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ 
          type: 'set_step', 
          payload: parseInt(e.target.value) || 1 
        })}
      />
    </div>
  );
};

// 3. useMemo Hook
interface ExpensiveCalculationProps {
  items: number[];
  multiplier: number;
}

const ExpensiveCalculation: React.FC<ExpensiveCalculationProps> = ({ 
  items, 
  multiplier 
}) => {
  const [filter, setFilter] = useState('');

  // Expensive calculation - only recalculates when items or multiplier change
  const processedItems = useMemo(() => {
    console.log('Calculating processed items...');
    return items.map(item => ({
      original: item,
      processed: item * multiplier,
      squared: item * item
    }));
  }, [items, multiplier]);

  // Filtered items - recalculates when processedItems or filter change
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    if (!filter) return processedItems;
    
    const filterNum = parseInt(filter);
    return processedItems.filter(item => 
      item.original.toString().includes(filter) ||
      item.processed > filterNum
    );
  }, [processedItems, filter]);

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      
      <p>Showing {filteredItems.length} of {processedItems.length} items</p>
      
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>
            Original: {item.original}, 
            Processed: {item.processed}, 
            Squared: {item.squared}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 4. useCallback Hook
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Memoized callback - only recreated when todos change
  const addTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    
    const todo: TodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
  }, [newTodo]); // Depends on newTodo

  // Memoized callback - stable reference
  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // No dependencies - uses functional update

  const removeTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <ul>
        {todos.map(todo => (
          <TodoItemComponent
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />
        ))}
      </ul>
    </div>
  );
};

// Memoized component to prevent unnecessary re-renders
const TodoItemComponent = React.memo<{
  todo: TodoItem;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}>(({ todo, onToggle, onRemove }) => {
  console.log(\`Rendering todo: \${todo.text}\`);
  
  return (
    <li style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)}>
        {todo.completed ? 'Undo' : 'Complete'}
      </button>
      <button onClick={() => onRemove(todo.id)}>Remove</button>
    </li>
  );
});`

  const interviewQuestions = [
    {
      question: "What are the rules of hooks and why do they exist?",
      answer:
        "Hooks must be called at the top level of React functions, not inside loops, conditions, or nested functions. This ensures hooks are called in the same order every time, allowing React to correctly preserve state between re-renders. The rules enable React's internal hook indexing system to work properly.",
      code: `// ❌ Wrong - conditional hook
if (condition) {
  const [state, setState] = useState(0); // Breaks rules
}

// ✅ Correct - hook at top level
const [state, setState] = useState(0);
if (condition) {
  // Use state here
}`,
    },
    {
      question: "When should you use useCallback vs useMemo?",
      answer:
        "Use useCallback to memoize functions (prevents recreation on every render), and useMemo to memoize expensive calculations or complex objects. useCallback is essentially useMemo for functions. Both help prevent unnecessary re-renders of child components.",
      code: `// useCallback - memoize functions
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// useMemo - memoize values/objects
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);`,
    },
    {
      question: "How do you handle cleanup in useEffect?",
      answer:
        "Return a cleanup function from useEffect to handle cleanup operations like clearing timers, canceling network requests, or removing event listeners. The cleanup function runs before the component unmounts and before the effect runs again.",
      code: `useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup function
  return () => {
    clearInterval(timer);
  };
}, []);`,
    },
    {
      question: "What's the difference between useState and useReducer?",
      answer:
        "useState is simpler for basic state, while useReducer is better for complex state logic with multiple sub-values or when the next state depends on the previous one. useReducer also helps with testing and provides more predictable state transitions.",
      code: `// useState - simple state
const [count, setCount] = useState(0);

// useReducer - complex state logic
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'increment', payload: 5 });`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Built-in Hooks</h2>
        <Badge variant="secondary">Core Hooks</Badge>
      </div>

      <Tabs defaultValue="useState" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="useState">useState</TabsTrigger>
          <TabsTrigger value="useEffect">useEffect</TabsTrigger>
          <TabsTrigger value="other">Other Hooks</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="useState" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>useState Hook</CardTitle>
              <CardDescription>Master state management in functional components with TypeScript</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={useStateCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Best Practice:</strong> Use functional updates when the new state depends on the previous
                  state. This prevents issues with stale closures and ensures correct state updates in concurrent
                  rendering.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="useEffect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>useEffect Hook</CardTitle>
              <CardDescription>Handle side effects, data fetching, and component lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={useEffectCode} language="tsx" />

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <h4 className="font-semibold mb-2">useEffect Patterns:</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>No dependencies:</strong> Runs after every render
                  </li>
                  <li>
                    • <strong>Empty array []:</strong> Runs once after mount
                  </li>
                  <li>
                    • <strong>With dependencies:</strong> Runs when dependencies change
                  </li>
                  <li>
                    • <strong>Cleanup function:</strong> Runs before unmount or next effect
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>useContext, useReducer, useMemo, useCallback</CardTitle>
              <CardDescription>Advanced hooks for context, complex state, and performance optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={otherHooksCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Performance Hooks</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>useMemo:</strong> Memoize expensive calculations
                    </li>
                    <li>
                      • <strong>useCallback:</strong> Memoize function references
                    </li>
                    <li>• Use when child components re-render unnecessarily</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">State Management</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>useContext:</strong> Access context values
                    </li>
                    <li>
                      • <strong>useReducer:</strong> Complex state logic
                    </li>
                    <li>• Better for state with multiple sub-values</li>
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
