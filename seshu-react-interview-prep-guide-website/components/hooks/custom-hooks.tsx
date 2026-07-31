"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { Code, Lightbulb } from "lucide-react"

export function CustomHooks() {
  const basicCustomHooksCode = `// Custom Hooks - Reusable Logic Patterns

import { useState, useEffect, useCallback, useRef } from 'react';

// 1. useCounter - Simple state management hook
interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

const useCounter = (initialValue: number = 0, options: UseCounterOptions = {}) => {
  const { min, max, step = 1 } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => {
      const newValue = prev + step;
      return max !== undefined ? Math.min(newValue, max) : newValue;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount(prev => {
      const newValue = prev - step;
      return min !== undefined ? Math.max(newValue, min) : newValue;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(prev => {
      let newValue = value;
      if (min !== undefined) newValue = Math.max(newValue, min);
      if (max !== undefined) newValue = Math.min(newValue, max);
      return newValue;
    });
  }, [min, max]);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    canIncrement: max === undefined || count < max,
    canDecrement: min === undefined || count > min
  };
};

// Usage example
const CounterComponent: React.FC = () => {
  const { count, increment, decrement, reset, canIncrement, canDecrement } = useCounter(0, {
    min: 0,
    max: 10,
    step: 2
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment} disabled={!canIncrement}>+2</button>
      <button onClick={decrement} disabled={!canDecrement}>-2</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

// 2. useToggle - Boolean state management
const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
};

// Usage example
const ToggleComponent: React.FC = () => {
  const { value: isVisible, toggle, setTrue, setFalse } = useToggle(false);

  return (
    <div>
      <p>Visibility: {isVisible ? 'Visible' : 'Hidden'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Show</button>
      <button onClick={setFalse}>Hide</button>
    </div>
  );
};

// 3. useLocalStorage - Persistent state
const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":, error\`);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":, error\`);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(\`Error removing localStorage key "\${key}":, error\`);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue
  };
};

// Usage example
const LocalStorageComponent: React.FC = () => {
  const { value: name, setValue: setName } = useLocalStorage('username', '');
  const { value: preferences, setValue: setPreferences } = useLocalStorage('preferences', {
    theme: 'light',
    notifications: true
  });

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Stored name: {name}</p>
      
      <button onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}>
        Set Dark Theme
      </button>
      <p>Theme: {preferences.theme}</p>
    </div>
  );
};`

  const advancedCustomHooksCode = `// Advanced Custom Hooks

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// 1. useFetch - Data fetching hook
interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

const useFetch = <T>(url: string, options: UseFetchOptions = {}) => {
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const data: T = await response.json();
      
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [url, onSuccess, onError]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, immediate]);

  return {
    ...state,
    refetch
  };
};

// Usage example
interface Post {
  id: number;
  title: string;
  body: string;
}

const PostsComponent: React.FC = () => {
  const { data: posts, loading, error, refetch } = useFetch<Post[]>(
    'https://jsonplaceholder.typicode.com/posts',
    {
      onSuccess: (data) => console.log('Posts loaded:', data.length),
      onError: (error) => console.error('Failed to load posts:', error)
    }
  );

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Posts</button>
      <ul>
        {posts?.slice(0, 5).map(post => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 2. useDebounce - Debounced value hook
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage with search
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Simulate API call
      const mockResults = [
        \`Result for "\${debouncedSearchTerm}" - 1\`,
        \`Result for "\${debouncedSearchTerm}" - 2\`,
        \`Result for "\${debouncedSearchTerm}" - 3\`
      ];
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <p>Searching for: {debouncedSearchTerm}</p>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

// 3. useWindowSize - Window dimensions hook
interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// 4. useIntersectionObserver - Visibility detection hook
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return { isIntersecting, entry };
};

// Usage example
const LazyComponent: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(elementRef, {
    threshold: 0.5
  });

  return (
    <div>
      <div style={{ height: '100vh' }}>Scroll down...</div>
      <div ref={elementRef} style={{ height: '200px', backgroundColor: 'lightblue' }}>
        {isIntersecting ? 'I am visible!' : 'I am not visible'}
      </div>
      <div style={{ height: '100vh' }}>More content...</div>
    </div>
  );
};

// 5. useForm - Form management hook
interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

const useForm = <T extends Record<string, any>>(options: UseFormOptions<T>) => {
  const { initialValues, validate, onSubmit } = options;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return {};
    return validate(values);
  }, [validate, values]);

  useEffect(() => {
    const formErrors = validateForm();
    setErrors(formErrors);
  }, [validateForm]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    if (Object.keys(formErrors).length === 0 && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Usage example
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const form = useForm<FormData>({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof FormData, string>> = {};
      
      if (!values.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      
      if (!values.message.trim()) {
        errors.message = 'Message is required';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Form submitted successfully!');
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input
          type="text"
          value={form.values.name}
          onChange={(e) => form.setValue('name', e.target.value)}
          onBlur={() => form.setFieldTouched('name')}
          placeholder="Name"
        />
        {form.touched.name && form.errors.name && (
          <span style={{ color: 'red' }}>{form.errors.name}</span>
        )}
      </div>

      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.setValue('email', e.target.value)}
          onBlur={() => form.setFieldTouched('email')}
          placeholder="Email"
        />
        {form.touched.email && form.errors.email && (
          <span style={{ color: 'red' }}>{form.errors.email}</span>
        )}
      </div>

      <div>
        <textarea
          value={form.values.message}
          onChange={(e) => form.setValue('message', e.target.value)}
          onBlur={() => form.setFieldTouched('message')}
          placeholder="Message"
        />
        {form.touched.message && form.errors.message && (
          <span style={{ color: 'red' }}>{form.errors.message}</span>
        )}
      </div>

      <button type="submit" disabled={!form.isValid || form.isSubmitting}>
        {form.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      <button type="button" onClick={form.reset}>Reset</button>
    </form>
  );
};`

  const bestPracticesCode = `// Custom Hooks Best Practices and Patterns

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ✅ GOOD: Follow naming convention (use prefix)
const useApiData = (url: string) => {
  // Hook implementation
};

// ❌ BAD: Not following naming convention
const apiData = (url: string) => {
  // This is not a hook
};

// ✅ GOOD: Return object for multiple values
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset
  };
};

// ✅ GOOD: Return array for simple cases (like useState)
const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  
  return [value, toggle];
};

// ✅ GOOD: Use TypeScript generics for reusability
const useArray = <T>() => {
  const [array, setArray] = useState<T[]>([]);

  const push = useCallback((element: T) => {
    setArray(prev => [...prev, element]);
  }, []);

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  return {
    array,
    push,
    remove,
    clear,
    isEmpty: array.length === 0
  };
};

// ✅ GOOD: Handle cleanup properly
const useEventListener = <T extends HTMLElement = HTMLDivElement>(
  eventName: string,
  handler: (event: Event) => void,
  element?: React.RefObject<T>
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element?.current || window;
    if (!targetElement?.addEventListener) return;

    const eventListener = (event: Event) => savedHandler.current(event);
    targetElement.addEventListener(eventName, eventListener);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

// ✅ GOOD: Provide configuration options
interface UseTimerOptions {
  interval?: number;
  immediate?: boolean;
  onTick?: (count: number) => void;
}

const useTimer = (options: UseTimerOptions = {}) => {
  const { interval = 1000, immediate = false, onTick } = options;
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(immediate);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setCount(0);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          const newCount = prev + 1;
          onTick?.(newCount);
          return newCount;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, interval, onTick]);

  return {
    count,
    isRunning,
    start,
    stop,
    reset
  };
};

// ✅ GOOD: Compose hooks together
const useCounterWithLocalStorage = (key: string, initialValue: number = 0) => {
  const { value: storedValue, setValue: setStoredValue } = useLocalStorage(key, initialValue);
  const { count, increment, decrement, reset: resetCounter } = useCounter(storedValue);

  // Sync counter with localStorage
  useEffect(() => {
    setStoredValue(count);
  }, [count, setStoredValue]);

  const reset = useCallback(() => {
    resetCounter();
    setStoredValue(initialValue);
  }, [resetCounter, setStoredValue, initialValue]);

  return {
    count,
    increment,
    decrement,
    reset
  };
};

// ✅ GOOD: Error handling in custom hooks
const useSafeAsyncOperation = <T>(
  asyncOperation: () => Promise<T>
) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncOperation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [asyncOperation]);

  return {
    ...state,
    execute
  };
};

// ✅ GOOD: Testing custom hooks
// Note: This would typically be in a separate test file
/*
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should respect min/max bounds', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));
    
    // Test max bound
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.increment();
      }
    });
    
    expect(result.current.count).toBe(10);
  });
});
*/`

  const interviewQuestions = [
    {
      question: "What makes a good custom hook and how do you design one?",
      answer:
        "A good custom hook follows the 'use' naming convention, encapsulates reusable logic, handles cleanup properly, and provides a clean API. Design principles include: single responsibility, proper TypeScript typing, configuration options, error handling, and composability with other hooks.",
      code: `// Good custom hook design
const useApi = <T>(url: string, options?: RequestInit) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  }, [url, options]);

  return { ...state, refetch: fetchData };
};`,
    },
    {
      question: "How do you handle cleanup in custom hooks?",
      answer:
        "Use useEffect with cleanup functions, clear timers/intervals, cancel network requests with AbortController, remove event listeners, and clean up subscriptions. Always check if the component is still mounted before updating state.",
      code: `const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id); // Cleanup
  }, [delay]);
};`,
    },
    {
      question: "When should you create a custom hook vs using built-in hooks?",
      answer:
        "Create custom hooks when you have reusable stateful logic, complex state management patterns, or when you want to abstract away implementation details. Don't create custom hooks for simple one-off logic or when built-in hooks are sufficient.",
      code: `// Worth a custom hook - reusable logic
const useLocalStorage = (key: string, initialValue: any) => {
  // Complex logic for localStorage sync
};

// Not worth a custom hook - simple one-off
const MyComponent = () => {
  const [count, setCount] = useState(0); // Just use useState directly
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};`,
    },
    {
      question: "How do you test custom hooks?",
      answer:
        "Use @testing-library/react-hooks with renderHook and act utilities. Test the hook's return values, state changes, side effects, and cleanup. Mock dependencies and test error scenarios. Focus on the hook's public API, not implementation details.",
      code: `import { renderHook, act } from '@testing-library/react';

test('useCounter increments correctly', () => {
  const { result } = renderHook(() => useCounter(0));
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Code className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Custom Hooks</h2>
        <Badge variant="secondary">Reusable Logic</Badge>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Patterns</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Hooks</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Custom Hook Patterns</CardTitle>
              <CardDescription>Learn to create reusable logic with simple custom hooks</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={basicCustomHooksCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Principle:</strong> Custom hooks should encapsulate stateful logic that can be reused
                  across multiple components. They follow the same rules as built-in hooks and must start with "use".
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Custom Hooks</CardTitle>
              <CardDescription>
                Complex patterns for data fetching, form handling, and performance optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={advancedCustomHooksCode} language="tsx" />

              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h4 className="font-semibold mb-2">Advanced Patterns:</h4>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  <li>
                    • <strong>Data Fetching:</strong> Handle loading, error states, and cleanup
                  </li>
                  <li>
                    • <strong>Debouncing:</strong> Optimize performance for frequent updates
                  </li>
                  <li>
                    • <strong>Form Management:</strong> Validation, submission, and state handling
                  </li>
                  <li>
                    • <strong>DOM Interactions:</strong> Window size, intersection observer, etc.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Hook Best Practices</CardTitle>
              <CardDescription>Design principles and patterns for creating maintainable custom hooks</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={bestPracticesCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Best Practices</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use "use" prefix for naming</li>
                    <li>• Return objects for multiple values</li>
                    <li>• Handle cleanup properly</li>
                    <li>• Use TypeScript generics</li>
                    <li>• Provide configuration options</li>
                    <li>• Compose hooks together</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Common Mistakes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Not following naming convention</li>
                    <li>• Missing cleanup functions</li>
                    <li>• Overly complex hooks</li>
                    <li>• Poor error handling</li>
                    <li>• Not using TypeScript properly</li>
                    <li>• Creating hooks for simple logic</li>
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
