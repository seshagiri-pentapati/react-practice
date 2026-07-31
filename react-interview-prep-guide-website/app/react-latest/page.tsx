'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CodeBlock } from '@/components/code-block'

export default function ReactLatestPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const ExpandableSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isExpanded = expandedSections.includes(id)
    return (
      <div className="border rounded-lg mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold"
        >
          <span>{title}</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isExpanded && <div className="p-4 border-t">{children}</div>}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">React 2025-2026 Updates</h1>
        <p className="text-slate-600 text-lg">Latest React features and changes from December 2024 to May 2026</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">New Features</TabsTrigger>
          <TabsTrigger value="breaking">Breaking Changes</TabsTrigger>
          <TabsTrigger value="typescript">TypeScript</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>React 19 - December 2024</CardTitle>
              <CardDescription>Major release with significant new features and breaking changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700">
                React 19 introduced the most significant set of new features in years, including Actions, the use API, and full Server Components support. This version moved React from an experimental phase for many modern patterns to production-ready implementations.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm font-semibold text-blue-900">Key Statistics:</p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• 19+ new hooks and APIs</li>
                  <li>• Full React Server Components support</li>
                  <li>• Automatic form handling with Actions</li>
                  <li>• Improved Developer Experience</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>React 19.1 - March 28, 2025</CardTitle>
              <CardDescription>Owner Stacks and Enhanced Suspense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700">
                Introduced Owner Stacks, a development-only feature that helps identify which components are responsible for rendering a particular component. Enhanced Suspense support for use everywhere including client, server, and during hydration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>React 19.2 - October 1, 2025</CardTitle>
              <CardDescription>Activity API, useEffectEvent, and cacheSignal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700">
                Added the Activity API for managing component visibility and internal state, introduced useEffectEvent hook for separating events from effects, and cacheSignal for Server Components lifecycle management.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>React 19.1.7 - May 6, 2026</CardTitle>
              <CardDescription>Type Hardening and Performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700">
                Latest stable release with type hardening for React Server Components and significant performance improvements for server-side rendering and component initialization.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <ExpandableSection id="actions" title="1. Actions - Async Operations in Render">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Actions allow you to pass async functions to startTransition for form submissions and updates with automatic pending state, error handling, and optimistic updates.
              </p>
              <CodeBlock language="typescript" code={`// Server Action
'use server'
export async function updateUser(formData: FormData) {
  const name = formData.get('name');
  // Update database
  return { success: true };
}

// Client Component
'use client'
import { useState } from 'react';
import { updateUser } from './actions';

export function UserForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await updateUser(formData);
      if (!result.success) {
        setError('Failed to update user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" type="text" required />
      <button type="submit" disabled={pending}>
        {pending ? 'Updating...' : 'Update'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="useActionState" title="2. useActionState Hook">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                New hook that manages the state of a form action, providing pending state, form data, and method information for building progressive enhancement.
              </p>
              <CodeBlock language="typescript" code={`import { useActionState } from 'react';
import { updateUserAction } from './actions';

export function UserFormWithState() {
  const [state, formAction, isPending] = useActionState(
    updateUserAction,
    { message: '' }
  );

  return (
    <form action={formAction}>
      <input
        type="text"
        name="name"
        defaultValue={state.name || ''}
        required
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state.message && (
        <p className={state.success ? 'success' : 'error'}>
          {state.message}
        </p>
      )}
    </form>
  );
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="useOptimistic" title="3. useOptimistic Hook">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Optimistically update UI during async operations, immediately showing the expected result while the server processes the request in the background.
              </p>
              <CodeBlock language="typescript" code={`'use client'
import { useOptimistic, useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos);

  async function handleToggleTodo(id: string) {
    // Immediately show optimistic update
    addOptimisticTodo(
      optimisticTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    // Update server in background
    try {
      const response = await fetch('/api/todos/' + id, {
        method: 'PATCH',
        body: JSON.stringify({ completed: true })
      });
      const updated = await response.json();
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updated.id ? updated : todo
        )
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
      // UI reverts to previous state due to error
    }
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggleTodo(todo.id)}
          />
          <span style={{
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="use" title="4. use() API - Reading Resources">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                New API for reading resources in render, allowing conditional usage of promises and context. Works with both client and server components.
              </p>
              <CodeBlock language="typescript" code={`import { use, Suspense } from 'react';

// Promise usage
async function fetchUser(id: string) {
  const response = await fetch('/api/users/' + id);
  return response.json();
}

function UserProfile({ userId }: { userId: string }) {
  // Can conditionally call use() - unlike hooks
  const user = use(
    userId ? fetchUser(userId) : Promise.resolve(null)
  );

  if (!user) return <p>No user selected</p>;
  return <p>User: {user.name}</p>;
}

export function App() {
  const [userId, setUserId] = useOptimistic<string | null>(null);

  return (
    <div>
      <input
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
      />
      <Suspense fallback={<p>Loading user...</p>}>
        <UserProfile userId={userId || ''} />
      </Suspense>
    </div>
  );
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="refProp" title="5. Ref as Prop - forwardRef No Longer Needed">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Refs can now be passed directly as props without forwardRef, simplifying component APIs and reducing boilerplate. React automatically handles forwarding.
              </p>
              <CodeBlock language="typescript" code={`// Before React 19
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, { value: string }>(
  ({ value }, ref) => <input ref={ref} defaultValue={value} />
);

// After React 19 - Much simpler!
interface InputProps {
  ref?: React.Ref<HTMLInputElement>;
  value: string;
}

function Input({ ref, value }: InputProps) {
  return <input ref={ref} defaultValue={value} />;
}

// Usage is the same
export function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Input ref={inputRef} value="test" />
      <button onClick={() => inputRef.current?.focus()}>
        Focus Input
      </button>
    </div>
  );
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="activity" title="6. Activity API - Managing Component Visibility">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                New component API (React 19.2) for hiding and restoring UI and component internal state, useful for animations and conditional rendering with state preservation.
              </p>
              <CodeBlock language="typescript" code={`import { useState } from 'react';

interface ActivityComponentProps {
  hidden?: boolean;
  children: React.ReactNode;
}

function ActivityExample() {
  const [hidden, setHidden] = useState(false);

  return (
    <div>
      <button onClick={() => setHidden(!hidden)}>
        {hidden ? 'Show' : 'Hide'} Component
      </button>

      {/* Activity component preserves state while hidden */}
      <ActivityComponent hidden={hidden}>
        <Counter />
      </ActivityComponent>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// The Activity wrapper maintains Counter's state even when hidden`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="useEffectEvent" title="7. useEffectEvent - Event vs Effect Separation">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                New hook (React 19.2) for extracting non-reactive logic from effects, solving problems with dependencies while keeping effect logic clean.
              </p>
              <CodeBlock language="typescript" code={`import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');

  // This callback is not reactive - doesn't change if ref changes
  const onConnected = useEffectEvent(() => {
    console.log('Connected to room:', roomId);
    // Can safely use roomId here without adding to dependencies
  });

  useEffect(() => {
    // onConnected is stable, so it doesn't trigger effect re-run
    const connection = createConnection(roomId);
    connection.on('connected', onConnected);

    connection.connect();
    return () => connection.disconnect();
  }, [roomId, onConnected]); // onConnected is always stable

  return <input value={message} onChange={(e) => setMessage(e.target.value)} />;
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="cacheSignal" title="8. cacheSignal - RSC Cache Lifetime Management">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                New API for Server Components (React 19.2) that signals when the cache lifetime is over, allowing cleanup of resources.
              </p>
              <CodeBlock language="typescript" code={`// Server Component
import { cacheSignal } from 'react';

export async function DataFetcher() {
  const signal = cacheSignal();

  const data = await fetch('https://api.example.com/data', {
    signal: signal as any // abort signal when cache expires
  });

  // This will abort when the render cache is invalidated
  const json = await data.json();

  return (
    <div>
      {/* Display data */}
    </div>
  );
}`} />
            </div>
          </ExpandableSection>
        </TabsContent>

        <TabsContent value="breaking" className="space-y-6 mt-6">
          <ExpandableSection id="removed-apis" title="Removed APIs - No Longer Available">
            <div className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>propTypes</strong> - Use TypeScript instead</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>defaultProps</strong> - Use ES6 default parameters</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>string refs</strong> - Use ref callbacks instead</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>Legacy Context</strong> - contextTypes and getChildContext removed</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>ReactDOM.render & hydrate</strong> - Use createRoot and hydrateRoot</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>findDOMNode</strong> - Use DOM refs instead</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>react-test-renderer</strong> - Use React Testing Library instead</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span><strong>UMD builds</strong> - Use ESM-based CDNs like esm.sh</span>
                </li>
              </ul>
            </div>
          </ExpandableSection>

          <ExpandableSection id="breaking-jsx" title="JSX Transform Changes">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                The new JSX transform is now required. This enables features like refs as props and JSX speed improvements.
              </p>
              <CodeBlock language="json" code={`// React 19 requires babel.config.js or tsconfig.json to include:
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="breaking-errors" title="Error Handling Changes">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Errors in render are no longer re-thrown. Instead, they are reported via onUncaughtError and onCaughtError callbacks.
              </p>
              <CodeBlock language="typescript" code={`import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    // Report to error tracking service
  },
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error);
    // Caught by Error Boundary
  }
});

root.render(<App />);`} />
            </div>
          </ExpandableSection>

          <ExpandableSection id="breaking-strictmode" title="StrictMode Behavior Changes">
            <div className="space-y-4">
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>useMemo and useCallback now reuse results from first render</li>
                <li>Ref callback functions are double-invoked on initial mount</li>
                <li>componentWillUnmount is always triggered</li>
                <li>useState and useReducer initializer functions are double-invoked</li>
              </ul>
            </div>
          </ExpandableSection>
        </TabsContent>

        <TabsContent value="typescript" className="space-y-6 mt-6">
          <ExpandableSection id="ts-removed" title="Removed TypeScript Types">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-red-600">Removed</p>
                  <ul className="space-y-1 mt-2">
                    <li>ReactChild</li>
                    <li>ReactFragment</li>
                    <li>ReactNodeArray</li>
                    <li>ReactText</li>
                    <li>VoidFunctionComponent</li>
                    <li>VFC</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-green-600">Replacement</p>
                  <ul className="space-y-1 mt-2">
                    <li>ReactElement | number | string</li>
                    <li>Iterable&lt;ReactNode&gt;</li>
                    <li>ReadonlyArray&lt;ReactNode&gt;</li>
                    <li>number | string</li>
                    <li>FunctionComponent</li>
                    <li>FC</li>
                  </ul>
                </div>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection id="ts-changes" title="TypeScript Behavior Changes">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-semibold text-sm text-orange-900">useRef now requires initial argument</p>
                  <CodeBlock language="typescript" code={`// Before
const ref = useRef();

// After - Required
const ref = useRef<HTMLInputElement>(null);`} />
                </div>

                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-semibold text-sm text-orange-900">JSX namespace moved to React package</p>
                  <CodeBlock language="typescript" code={`// Before
declare global {
  namespace JSX { }
}

// After
import { JSX } from 'react';`} />
                </div>

                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-semibold text-sm text-orange-900">Refs are mutable by default</p>
                  <CodeBlock language="typescript" code={`// Before - Sometimes immutable
const ref = useRef() as Readonly<MutableRefObject<T>>;

// After - Always mutable
const ref = useRef<T>(null);`} />
                </div>

                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-semibold text-sm text-orange-900">Better useReducer typings</p>
                  <CodeBlock language="typescript" code={`// Before
useReducer<React.Reducer<State, Action>>(reducer)

// After - Much cleaner
useReducer(reducer)
// or
useReducer<State, Action>(reducer)`} />
                </div>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection id="ts-codemod" title="TypeScript Migration Tool">
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Use the official React codemod to automatically update your TypeScript code:
              </p>
              <CodeBlock language="bash" code={`npx types-react-codemod@latest preset-19 ./path-to-your-react-ts-files`} />
            </div>
          </ExpandableSection>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Migration Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ol className="space-y-2 list-decimal list-inside">
            <li>Start by upgrading to React 18.3 (adds deprecation warnings)</li>
            <li>Address all deprecation warnings in development mode</li>
            <li>Use TypeScript codemod for automatic migrations</li>
            <li>Update your code to use new React 19 features</li>
            <li>Remove old patterns like forwardRef and propTypes</li>
            <li>Test thoroughly - leverage StrictMode during development</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
