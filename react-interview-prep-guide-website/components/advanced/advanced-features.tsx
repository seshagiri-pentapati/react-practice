"use client"

import React, {
  Suspense,
  lazy,
  useState,
  useTransition,
  useDeferredValue,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react"
import { ErrorBoundary } from "react-error-boundary"
import { createPortal } from "react-dom"
import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { InterviewQuestions } from "@/components/interview-questions"

// 1. React 18 Concurrent Features

// useTransition Hook
const SearchWithTransition: React.FC = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value)

    // Mark expensive operation as non-urgent
    startTransition(() => {
      // Simulate expensive search operation
      const searchResults = Array.from({ length: 1000 }, (_, i) => `Result ${i + 1} for "${value}"`).filter((result) =>
        result.toLowerCase().includes(value.toLowerCase()),
      )

      setResults(searchResults.slice(0, 50))
    })
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className="w-full px-3 py-2 border rounded"
      />

      {isPending && <div className="text-blue-500">Searching...</div>}

      <div className="space-y-1">
        {results.map((result, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}

// useDeferredValue Hook
const DeferredSearchResults: React.FC = () => {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)

  // Expensive computation based on deferred value
  const results = React.useMemo(() => {
    if (!deferredQuery) return []

    return Array.from({ length: 1000 }, (_, i) => `Deferred result ${i + 1} for "${deferredQuery}"`)
      .filter((result) => result.toLowerCase().includes(deferredQuery.toLowerCase()))
      .slice(0, 20)
  }, [deferredQuery])

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search (deferred)..."
        className="w-full px-3 py-2 border rounded"
      />

      <div className="text-sm text-gray-600">
        Query: "{query}" | Deferred: "{deferredQuery}"
      </div>

      <div className="space-y-1">
        {results.map((result, index) => (
          <div key={index} className="p-2 bg-blue-50 rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}

// 2. Suspense and Lazy Loading

// Lazy loaded component
const LazyComponent = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className="p-4 bg-green-100 rounded">
              <h3 className="font-bold">Lazy Loaded Component</h3>
              <p>This component was loaded asynchronously!</p>
            </div>
          ),
        })
      }, 2000)
    }),
)

// Suspense with multiple boundaries
const SuspenseExample: React.FC = () => {
  const [showLazy, setShowLazy] = useState(false)

  return (
    <div className="space-y-4">
      <button onClick={() => setShowLazy(!showLazy)} className="px-4 py-2 bg-blue-500 text-white rounded">
        {showLazy ? "Hide" : "Show"} Lazy Component
      </button>

      {showLazy && (
        <Suspense fallback={<div className="p-4 bg-gray-100 rounded animate-pulse">Loading lazy component...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  )
}

// 3. Error Boundaries

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded">
    <h3 className="text-red-800 font-bold mb-2">Something went wrong:</h3>
    <pre className="text-red-600 text-sm mb-4">{error.message}</pre>
    <button onClick={resetErrorBoundary} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
      Try again
    </button>
  </div>
)

const BuggyComponent: React.FC<{ shouldError: boolean }> = ({ shouldError }) => {
  if (shouldError) {
    throw new Error("This is a simulated error!")
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <h3 className="text-green-800 font-bold">Component working correctly!</h3>
      <p className="text-green-600">No errors here.</p>
    </div>
  )
}

const ErrorBoundaryExample: React.FC = () => {
  const [shouldError, setShouldError] = useState(false)

  return (
    <div className="space-y-4">
      <button onClick={() => setShouldError(!shouldError)} className="px-4 py-2 bg-red-500 text-white rounded">
        {shouldError ? "Fix" : "Break"} Component
      </button>

      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setShouldError(false)} resetKeys={[shouldError]}>
        <BuggyComponent shouldError={shouldError} />
      </ErrorBoundary>
    </div>
  )
}

// 4. Portals

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

const PortalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-purple-500 text-white rounded">
        Open Portal Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Portal Modal</h3>
        <p className="mb-4">
          This modal is rendered using React Portal, so it appears outside the normal component tree but maintains
          React's event system and context.
        </p>
        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
          Close
        </button>
      </Modal>
    </div>
  )
}

// 5. Advanced Refs and Imperative APIs

interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  getCurrentTime: () => number
}

const VideoPlayer = forwardRef<VideoPlayerHandle, { src: string }>(({ src }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useImperativeHandle(ref, () => ({
    play: () => {
      videoRef.current?.play()
      setIsPlaying(true)
    },
    pause: () => {
      videoRef.current?.pause()
      setIsPlaying(false)
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time
      }
    },
    getCurrentTime: () => videoRef.current?.currentTime || 0,
  }))

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        src={src}
        className="w-full max-w-md"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="text-sm text-gray-600">Status: {isPlaying ? "Playing" : "Paused"}</div>
    </div>
  )
})

VideoPlayer.displayName = "VideoPlayer"

const ImperativeAPIExample: React.FC = () => {
  const videoRef = useRef<VideoPlayerHandle>(null)

  return (
    <div className="space-y-4">
      <VideoPlayer ref={videoRef} src="/placeholder-video.mp4" />

      <div className="flex gap-2">
        <button onClick={() => videoRef.current?.play()} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
          Play
        </button>
        <button onClick={() => videoRef.current?.pause()} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
          Pause
        </button>
        <button onClick={() => videoRef.current?.seek(10)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Seek to 10s
        </button>
        <button
          onClick={() => {
            const time = videoRef.current?.getCurrentTime()
            alert(`Current time: ${time?.toFixed(2)}s`)
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Get Time
        </button>
      </div>
    </div>
  )
}

// 6. Advanced Patterns - Code Splitting with Route-based splitting

const RouteBasedSplitting = () => {
  const [currentRoute, setCurrentRoute] = useState("home")

  const HomeComponent = lazy(() =>
    Promise.resolve({
      default: () => (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-blue-800 font-bold mb-2">Home Page</h3>
          <p className="text-blue-700">Welcome to the home page! This component was lazy loaded.</p>
        </div>
      ),
    }),
  )

  const AboutComponent = lazy(() =>
    Promise.resolve({
      default: () => (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-green-800 font-bold mb-2">About Page</h3>
          <p className="text-green-700">Learn more about us. This component was also lazy loaded.</p>
        </div>
      ),
    }),
  )

  const ContactComponent = lazy(() =>
    Promise.resolve({
      default: () => (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <h3 className="text-purple-800 font-bold mb-2">Contact Page</h3>
          <p className="text-purple-700">Get in touch with us. Another lazy loaded component.</p>
        </div>
      ),
    }),
  )

  const renderRoute = () => {
    switch (currentRoute) {
      case "home":
        return <HomeComponent />
      case "about":
        return <AboutComponent />
      case "contact":
        return <ContactComponent />
      default:
        return <div>404 - Page not found</div>
    }
  }

  return (
    <div className="space-y-4">
      <nav className="flex gap-2">
        {["home", "about", "contact"].map((route) => (
          <button
            key={route}
            onClick={() => setCurrentRoute(route)}
            className={`px-3 py-1 rounded capitalize ${
              currentRoute === route ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {route}
          </button>
        ))}
      </nav>

      <Suspense fallback={<div className="p-4 bg-gray-100 rounded">Loading route...</div>}>{renderRoute()}</Suspense>
    </div>
  )
}

// 7. Server Components Concepts (Conceptual examples)

const ServerComponentConcepts = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-bold text-blue-800 mb-2">Server Components</h4>
        <p className="text-blue-700 text-sm">
          Server Components run on the server and can directly access databases, file systems, and other server-only
          resources. They don't ship JavaScript to the client.
        </p>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <h4 className="font-bold text-green-800 mb-2">Client Components</h4>
        <p className="text-green-700 text-sm">
          Client Components run in the browser and can use hooks, event handlers, and browser-only APIs. They're marked
          with "use client" directive.
        </p>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-bold text-yellow-800 mb-2">Streaming</h4>
        <p className="text-yellow-700 text-sm">
          React 18 supports streaming HTML from server to client, allowing parts of the page to load progressively as
          data becomes available.
        </p>
      </div>
    </div>
  )
}

// 8. Advanced State Patterns with useId

const AccessibleForm: React.FC = () => {
  const nameId = React.useId()
  const emailId = React.useId()
  const descriptionId = React.useId()

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id={nameId}
          type="text"
          className="w-full px-3 py-2 border rounded"
          aria-describedby={`${nameId}-help`}
        />
        <div id={`${nameId}-help`} className="text-xs text-gray-600 mt-1">
          Enter your full name
        </div>
      </div>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          className="w-full px-3 py-2 border rounded"
          aria-describedby={`${emailId}-help`}
        />
        <div id={`${emailId}-help`} className="text-xs text-gray-600 mt-1">
          We'll never share your email
        </div>
      </div>

      <div>
        <label htmlFor={descriptionId} className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id={descriptionId}
          className="w-full px-3 py-2 border rounded"
          rows={3}
          aria-describedby={`${descriptionId}-help`}
        />
        <div id={`${descriptionId}-help`} className="text-xs text-gray-600 mt-1">
          Optional description (max 500 characters)
        </div>
      </div>
    </form>
  )
}

const interviewQuestions = [
  {
    question: "What are React 18's Concurrent Features and how do they improve user experience?",
    answer:
      "Concurrent Features include useTransition, useDeferredValue, and Suspense improvements. They allow React to interrupt rendering for urgent updates, keeping the UI responsive. useTransition marks updates as non-urgent, useDeferredValue defers expensive computations, and Suspense enables progressive loading. These features prevent blocking the main thread and improve perceived performance.",
  },
  {
    question: "When would you use useTransition vs useDeferredValue?",
    answer:
      "Use useTransition when you control the state update and want to mark it as non-urgent (e.g., search results, filtering). Use useDeferredValue when you receive a prop/value from parent and want to defer expensive computations based on that value. useTransition gives you isPending state, while useDeferredValue gives you the deferred value.",
  },
  {
    question: "How do Error Boundaries work and what are their limitations?",
    answer:
      "Error Boundaries catch JavaScript errors in component tree, log errors, and display fallback UI. They catch errors in render methods, lifecycle methods, and constructors of child components. Limitations: don't catch errors in event handlers, async code, SSR, or errors in the boundary itself. Use try-catch for event handlers and async operations.",
  },
  {
    question: "What are React Portals and when should you use them?",
    answer:
      "Portals render children into a DOM node outside the parent component's DOM hierarchy while maintaining React's event system and context. Use for modals, tooltips, dropdowns that need to escape parent containers with overflow:hidden or z-index stacking contexts. Events still bubble through React component tree, not DOM tree.",
  },
  {
    question: "What's the difference between Server Components and Client Components?",
    answer:
      "Server Components run on server, can access server-only resources (databases, file system), don't ship JavaScript to client, and can't use hooks or event handlers. Client Components run in browser, use hooks/event handlers, have access to browser APIs, and are marked with 'use client'. Server Components enable better performance and security by reducing client bundle size.",
  },
  {
    question: "How does React 18's Suspense differ from previous versions?",
    answer:
      "React 18 Suspense supports concurrent rendering, can be used with any async operation (not just lazy loading), supports streaming SSR, and works with Transitions. It can suspend and resume rendering without blocking the browser, enables progressive hydration, and integrates with data fetching libraries for better loading states.",
  },
]

export function AdvancedFeatures() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Advanced React Features</h2>
        <p className="text-muted-foreground mb-6">
          Explore cutting-edge React features including Concurrent Features, Suspense, Error Boundaries, Portals, and
          advanced patterns that enable high-performance, resilient applications.
        </p>
      </div>

      <Tabs defaultValue="concurrent" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="concurrent">Concurrent Features</TabsTrigger>
          <TabsTrigger value="suspense">Suspense & Loading</TabsTrigger>
          <TabsTrigger value="boundaries">Error Handling</TabsTrigger>
          <TabsTrigger value="questions">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="concurrent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>React 18 Concurrent Features</CardTitle>
              <CardDescription>
                Learn useTransition, useDeferredValue, and other concurrent features that keep your UI responsive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">useTransition Hook</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Mark state updates as non-urgent to keep the UI responsive during expensive operations.
                  </p>
                  <SearchWithTransition />
                  <CodeBlock
                    code={`const SearchWithTransition: React.FC = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Urgent update - keeps input responsive
    
    // Mark expensive operation as non-urgent
    startTransition(() => {
      // Expensive search operation
      const searchResults = performExpensiveSearch(value)
      setResults(searchResults)
    })
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Searching...</div>}
      <SearchResults results={results} />
    </div>
  )
}`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">useDeferredValue Hook</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Defer expensive computations based on a value, allowing urgent updates to take priority.
                  </p>
                  <DeferredSearchResults />
                  <CodeBlock
                    code={`const DeferredSearchResults: React.FC = () => {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  
  // Expensive computation based on deferred value
  const results = useMemo(() => {
    if (!deferredQuery) return []
    return performExpensiveSearch(deferredQuery)
  }, [deferredQuery])

  return (
    <div>
      <input
        value={query} // Always up-to-date
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <div>Query: "{query}" | Deferred: "{deferredQuery}"</div>
      <SearchResults results={results} />
    </div>
  )
}`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">useId Hook</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Generate unique IDs for accessibility attributes that work with SSR.
                  </p>
                  <AccessibleForm />
                  <CodeBlock
                    code={`const AccessibleForm: React.FC = () => {
  const nameId = useId()
  const emailId = useId()

  return (
    <form>
      <div>
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          type="text"
          aria-describedby={\`\${nameId}-help\`}
        />
        <div id={\`\${nameId}-help\`}>Enter your full name</div>
      </div>

      <div>
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          type="email"
          aria-describedby={\`\${emailId}-help\`}
        />
        <div id={\`\${emailId}-help\`}>We'll never share your email</div>
      </div>
    </form>
  )
}`}
                    language="typescript"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suspense and Lazy Loading</CardTitle>
              <CardDescription>
                Master Suspense for loading states, code splitting, and progressive rendering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Lazy Loading with Suspense</h4>
                  <SuspenseExample />
                  <CodeBlock
                    code={`// Lazy loaded component
const LazyComponent = lazy(() => 
  import('./LazyComponent') // Dynamic import
)

const SuspenseExample: React.FC = () => {
  const [showLazy, setShowLazy] = useState(false)

  return (
    <div>
      <button onClick={() => setShowLazy(!showLazy)}>
        {showLazy ? 'Hide' : 'Show'} Lazy Component
      </button>

      {showLazy && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  )
}`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Portals</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Render components outside the normal DOM hierarchy while maintaining React's event system.
                  </p>
                  <PortalExample />
                  <CodeBlock
                    code={`const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2">
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body // Render outside component tree
  )
}`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Server Components Concepts</h4>
                  <ServerComponentConcepts />
                  <CodeBlock
                    code={`// Server Component (runs on server)
async function ServerComponent() {
  // Can directly access server resources
  const data = await db.query('SELECT * FROM users')
  
  return (
    <div>
      <h1>Users</h1>
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// Client Component (runs in browser)
'use client'
function ClientComponent() {
  const [count, setCount] = useState(0) // Can use hooks
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`}
                    language="typescript"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boundaries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Boundaries and Advanced Patterns</CardTitle>
              <CardDescription>
                Handle errors gracefully and implement advanced patterns for robust applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Error Boundaries</h4>
                  <ErrorBoundaryExample />
                  <CodeBlock
                    code={`// Error Fallback Component
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="error-boundary">
    <h3>Something went wrong:</h3>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

// Usage with react-error-boundary
const App: React.FC = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
    onError={(error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo)
      // Send to error reporting service
    }}
  >
    <MyApplication />
  </ErrorBoundary>
)`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Imperative APIs with useImperativeHandle</h4>
                  <ImperativeAPIExample />
                  <CodeBlock
                    code={`interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  getCurrentTime: () => number
}

const VideoPlayer = forwardRef<VideoPlayerHandle, { src: string }>(
  ({ src }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      seek: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time
        }
      },
      getCurrentTime: () => videoRef.current?.currentTime || 0
    }))

    return <video ref={videoRef} src={src} />
  }
)

// Usage
const Parent: React.FC = () => {
  const videoRef = useRef<VideoPlayerHandle>(null)

  return (
    <div>
      <VideoPlayer ref={videoRef} src="/video.mp4" />
      <button onClick={() => videoRef.current?.play()}>Play</button>
    </div>
  )
}`}
                    language="typescript"
                  />
                </div>
              </div>
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
