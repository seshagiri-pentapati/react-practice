"use client"

import React from "react"
import { useState, useCallback, createContext, useContext, forwardRef, useImperativeHandle } from "react"
import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { InterviewQuestions } from "@/components/interview-questions"

// Component Composition Patterns

// 1. Higher-Order Components (HOCs)
interface WithLoadingProps {
  isLoading: boolean
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...restProps } = props

    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>
    }

    return <WrappedComponent {...(restProps as P)} />
  }
}

// Usage of HOC
const UserList: React.FC<{ users: User[] }> = ({ users }) => (
  <div>
    {users.map((user) => (
      <div key={user.id}>{user.name}</div>
    ))}
  </div>
)

const UserListWithLoading = withLoading(UserList)

// 2. Render Props Pattern
interface MouseTrackerProps {
  children: (mousePosition: { x: number; y: number }) => React.ReactNode
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  return (
    <div onMouseMove={handleMouseMove} className="h-64 border">
      {children(mousePosition)}
    </div>
  )
}

// Usage of Render Props
const MouseDisplay: React.FC = () => (
  <MouseTracker>
    {({ x, y }) => (
      <div>
        Mouse position: ({x}, {y})
      </div>
    )}
  </MouseTracker>
)

// 3. Compound Components Pattern
interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs")
  }
  return context
}

interface TabsProps {
  defaultTab: string
  children: React.ReactNode
}

const TabsCompound: React.FC<TabsProps> & {
  List: React.FC<{ children: React.ReactNode }>
  Tab: React.FC<{ value: string; children: React.ReactNode }>
  Panels: React.FC<{ children: React.ReactNode }>
  Panel: React.FC<{ value: string; children: React.ReactNode }>
} = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  )
}

TabsCompound.List = ({ children }) => <div className="tabs-list flex border-b">{children}</div>

TabsCompound.Tab = ({ value, children }) => {
  const { activeTab, setActiveTab } = useTabsContext()

  return (
    <button
      className={`tab-button px-4 py-2 ${activeTab === value ? "active border-b-2 border-blue-500" : ""}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

TabsCompound.Panels = ({ children }) => <div className="tabs-panels">{children}</div>

TabsCompound.Panel = ({ value, children }) => {
  const { activeTab } = useTabsContext()

  if (activeTab !== value) return null

  return <div className="tab-panel p-4">{children}</div>
}

// Usage of Compound Components
const TabsExample: React.FC = () => (
  <TabsCompound defaultTab="tab1">
    <TabsCompound.List>
      <TabsCompound.Tab value="tab1">Tab 1</TabsCompound.Tab>
      <TabsCompound.Tab value="tab2">Tab 2</TabsCompound.Tab>
      <TabsCompound.Tab value="tab3">Tab 3</TabsCompound.Tab>
    </TabsCompound.List>
    <TabsCompound.Panels>
      <TabsCompound.Panel value="tab1">Content for Tab 1</TabsCompound.Panel>
      <TabsCompound.Panel value="tab2">Content for Tab 2</TabsCompound.Panel>
      <TabsCompound.Panel value="tab3">Content for Tab 3</TabsCompound.Panel>
    </TabsCompound.Panels>
  </TabsCompound>
)

// 4. Controlled vs Uncontrolled Components
interface ControlledInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const ControlledInput: React.FC<ControlledInputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="border px-3 py-2 rounded"
  />
)

interface UncontrolledInputProps {
  defaultValue?: string
  onSubmit?: (value: string) => void
  placeholder?: string
}

const UncontrolledInput: React.FC<UncontrolledInputProps> = ({ defaultValue, onSubmit, placeholder }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const value = formData.get("input") as string
    onSubmit?.(value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="input"
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="border px-3 py-2 rounded"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  )
}

// 5. Polymorphic Components
type PolymorphicProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<T>

function PolymorphicComponent<T extends React.ElementType = "div">({ as, children, ...props }: PolymorphicProps<T>) {
  const Component = as || "div"

  return (
    <Component {...props} className={`polymorphic-base ${props.className || ""}`}>
      {children}
    </Component>
  )
}

// Usage of Polymorphic Component
const PolymorphicExample: React.FC = () => (
  <div>
    <PolymorphicComponent>Default div</PolymorphicComponent>
    <PolymorphicComponent as="button" onClick={() => alert("Clicked!")}>
      Button variant
    </PolymorphicComponent>
    <PolymorphicComponent as="a" href="#" target="_blank">
      Link variant
    </PolymorphicComponent>
  </div>
)

// 6. Generic Components with TypeScript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
}

function GenericList<T>({ items, renderItem, keyExtractor, emptyMessage = "No items" }: ListProps<T>) {
  if (items.length === 0) {
    return <div className="empty-state text-gray-500">{emptyMessage}</div>
  }

  return (
    <div className="generic-list">
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

// Usage of Generic Component
interface User {
  id: string
  name: string
  email: string
}

const UserListGeneric: React.FC = () => {
  const users: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ]

  return (
    <GenericList
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
      emptyMessage="No users found"
    />
  )
}

// 7. Container/Presentational Pattern
// Container Component (Logic)
const UserListContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      const userData = await response.json()
      setUsers(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (err) {
      setError("Failed to delete user")
    }
  }, [])

  return (
    <UserListPresentation
      users={users}
      loading={loading}
      error={error}
      onRefresh={fetchUsers}
      onDeleteUser={deleteUser}
    />
  )
}

// Presentational Component (UI)
interface UserListPresentationProps {
  users: User[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onDeleteUser: (userId: string) => void
}

const UserListPresentation: React.FC<UserListPresentationProps> = ({
  users,
  loading,
  error,
  onRefresh,
  onDeleteUser,
}) => {
  if (loading) return <div>Loading users...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Users</h2>
        <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded">
          Refresh
        </button>
      </div>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-3 border rounded">
            <div>
              <h3>{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button onClick={() => onDeleteUser(user.id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// 8. Provider Pattern
interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

// Usage of Provider Pattern
const ThemedComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Toggle Theme
      </button>
    </div>
  )
}

// 9. Observer Pattern with Custom Hooks
class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    }
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data))
    }
  }
}

const globalEventEmitter = new EventEmitter()

const useEventListener = (event: string, callback: Function) => {
  const callbackRef = useCallback(callback, [callback])

  React.useEffect(() => {
    globalEventEmitter.on(event, callbackRef)
    return () => globalEventEmitter.off(event, callbackRef)
  }, [event, callbackRef])
}

const useEventEmitter = () => {
  const emit = useCallback((event: string, data?: any) => {
    globalEventEmitter.emit(event, data)
  }, [])

  return { emit }
}

// Usage of Observer Pattern
const NotificationSender: React.FC = () => {
  const { emit } = useEventEmitter()

  return (
    <button
      onClick={() => emit("notification", { message: "Hello from sender!", type: "info" })}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Send Notification
    </button>
  )
}

const NotificationReceiver: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([])

  useEventListener("notification", (data: any) => {
    setNotifications((prev) => [...prev, { ...data, id: Date.now() }])
  })

  return (
    <div>
      <h3>Notifications:</h3>
      {notifications.map((notification) => (
        <div key={notification.id} className="p-2 mb-2 bg-blue-100 rounded">
          {notification.message}
        </div>
      ))}
    </div>
  )
}

// 10. Forward Ref Pattern
interface CustomInputProps {
  label: string
  error?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
})

CustomInput.displayName = "CustomInput"

// Usage with useImperativeHandle
interface FormHandle {
  focus: () => void
  reset: () => void
  getValue: () => string
}

const CustomForm = forwardRef<FormHandle, { onSubmit: (value: string) => void }>(({ onSubmit }, ref) => {
  const [value, setValue] = useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    reset: () => setValue(""),
    getValue: () => value,
  }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
      }}
    >
      <CustomInput ref={inputRef} label="Custom Input" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  )
})

CustomForm.displayName = "CustomForm"

const interviewQuestions = [
  {
    question: "What are the differences between HOCs, Render Props, and Hooks for sharing logic?",
    answer:
      "HOCs wrap components and can modify props, but can cause wrapper hell and prop naming conflicts. Render Props use function-as-children pattern, providing more flexibility but can lead to callback hell. Hooks are the modern approach, offering clean composition, better TypeScript support, and easier testing. Hooks are generally preferred for new code.",
  },
  {
    question: "When would you use compound components over regular props?",
    answer:
      "Use compound components when: 1) You have a complex component with multiple related sub-components, 2) You want to provide a flexible API that allows users to compose the UI, 3) The sub-components need to share state but shouldn't be tightly coupled, 4) You want to enforce certain structural relationships (like Tabs and TabPanels).",
  },
  {
    question: "What's the difference between controlled and uncontrolled components?",
    answer:
      "Controlled components have their state managed by React (via useState), making them predictable and easier to validate. Uncontrolled components manage their own state internally and use refs for access. Use controlled for forms with validation/dynamic behavior, uncontrolled for simple forms or when integrating with non-React libraries.",
  },
  {
    question: "How do you implement polymorphic components in TypeScript?",
    answer:
      "Use generic types with React.ElementType to create components that can render as different HTML elements while maintaining type safety. Define props that extend React.ComponentPropsWithoutRef<T> and use the 'as' prop to specify the element type. This provides flexibility while preserving TypeScript intellisense and type checking.",
  },
  {
    question: "What are the benefits of the Container/Presentational pattern?",
    answer:
      "Benefits include: 1) Separation of concerns (logic vs UI), 2) Better testability (test logic and UI separately), 3) Reusability (presentational components can be reused), 4) Easier maintenance and debugging, 5) Better performance optimization opportunities. However, with hooks, this pattern is less necessary as logic can be extracted into custom hooks.",
  },
]

export function ComponentPatterns() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Component Patterns & Design Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Master advanced React component patterns and design patterns that enable flexible, reusable, and maintainable
          component architectures.
        </p>
      </div>

      <Tabs defaultValue="composition" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="composition">Composition Patterns</TabsTrigger>
          <TabsTrigger value="design">Design Patterns</TabsTrigger>
          <TabsTrigger value="typescript">TypeScript Patterns</TabsTrigger>
          <TabsTrigger value="questions">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="composition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Composition Patterns</CardTitle>
              <CardDescription>
                Learn HOCs, Render Props, Compound Components, and other composition techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Higher-Order Components (HOCs)</h4>
                  <CodeBlock
                    code={`// Higher-Order Components Pattern
interface WithLoadingProps {
  isLoading: boolean
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...restProps } = props
    
    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>
    }
    
    return <WrappedComponent {...(restProps as P)} />
  }
}

// Usage
const UserList: React.FC<{ users: User[] }> = ({ users }) => (
  <div>
    {users.map(user => (
      <div key={user.id}>{user.name}</div>
    ))}
  </div>
)

const UserListWithLoading = withLoading(UserList)`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Render Props Pattern</h4>
                  <CodeBlock
                    code={`// Render Props Pattern
interface MouseTrackerProps {
  children: (mousePosition: { x: number; y: number }) => React.ReactNode
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }, [])

  return (
    <div onMouseMove={handleMouseMove} className="h-64 border">
      {children(mousePosition)}
    </div>
  )
}

// Usage
const MouseDisplay: React.FC = () => (
  <MouseTracker>
    {({ x, y }) => (
      <div>Mouse position: ({x}, {y})</div>
    )}
  </MouseTracker>
)`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Compound Components</h4>
                  <CodeBlock
                    code={`// Compound Components Pattern
const TabsContext = createContext<TabsContextType | undefined>(undefined)

const Tabs: React.FC<TabsProps> & {
  List: React.FC<{ children: React.ReactNode }>
  Tab: React.FC<{ value: string; children: React.ReactNode }>
  Panels: React.FC<{ children: React.ReactNode }>
  Panel: React.FC<{ value: string; children: React.ReactNode }>
} = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  )
}

// Usage
<Tabs defaultTab="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
    <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
  </Tabs.Panels>
</Tabs>`}
                    language="typescript"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Patterns</CardTitle>
              <CardDescription>Essential design patterns for React applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Container/Presentational Pattern</h4>
                  <CodeBlock
                    code={`// Container Component (Logic)
const UserListContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const userData = await response.json()
      setUsers(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <UserListPresentation
      users={users}
      loading={loading}
      error={error}
      onRefresh={fetchUsers}
    />
  )
}

// Presentational Component (UI)
const UserListPresentation: React.FC<UserListPresentationProps> = ({
  users, loading, error, onRefresh
}) => {
  if (loading) return <div>Loading users...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={onRefresh}>Refresh</button>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Provider Pattern</h4>
                  <CodeBlock
                    code={`// Provider Pattern
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={\`theme-\${theme}\`}>{children}</div>
    </ThemeContext.Provider>
  )
}

// Usage
const ThemedComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Observer Pattern</h4>
                  <CodeBlock
                    code={`// Observer Pattern with Custom Hooks
class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
}

const globalEventEmitter = new EventEmitter()

const useEventListener = (event: string, callback: Function) => {
  const callbackRef = useCallback(callback, [callback])

  React.useEffect(() => {
    globalEventEmitter.on(event, callbackRef)
    return () => globalEventEmitter.off(event, callbackRef)
  }, [event, callbackRef])
}

const useEventEmitter = () => {
  const emit = useCallback((event: string, data?: any) => {
    globalEventEmitter.emit(event, data)
  }, [])

  return { emit }
}`}
                    language="typescript"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typescript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>TypeScript-Specific Patterns</CardTitle>
              <CardDescription>Advanced TypeScript patterns for React components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Generic Components</h4>
                  <CodeBlock
                    code={`// Generic Components
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
}

function GenericList<T>({ 
  items, 
  renderItem, 
  keyExtractor, 
  emptyMessage = "No items" 
}: ListProps<T>) {
  if (items.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>
  }

  return (
    <div className="generic-list">
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

// Usage with type inference
const users: User[] = [...]
<GenericList
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <div>{user.name}</div>}
/>`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Polymorphic Components</h4>
                  <CodeBlock
                    code={`// Polymorphic Components
type PolymorphicProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<T>

function PolymorphicComponent<T extends React.ElementType = 'div'>({
  as,
  children,
  ...props
}: PolymorphicProps<T>) {
  const Component = as || 'div'
  
  return (
    <Component {...props} className={\`base-styles \${props.className || ''}\`}>
      {children}
    </Component>
  )
}

// Usage with full type safety
<PolymorphicComponent>Default div</PolymorphicComponent>
<PolymorphicComponent as="button" onClick={() => alert('Clicked!')}>
  Button variant
</PolymorphicComponent>
<PolymorphicComponent as="a" href="#" target="_blank">
  Link variant
</PolymorphicComponent>`}
                    language="typescript"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Forward Ref with TypeScript</h4>
                  <CodeBlock
                    code={`// Forward Ref Pattern
interface CustomInputProps {
  label: string
  error?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          ref={ref}
          className={\`w-full px-3 py-2 border rounded \${
            error ? 'border-red-500' : 'border-gray-300'
          }\`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'

// Usage with useImperativeHandle
interface FormHandle {
  focus: () => void
  reset: () => void
  getValue: () => string
}

const CustomForm = forwardRef<FormHandle, { onSubmit: (value: string) => void }>(
  ({ onSubmit }, ref) => {
    const [value, setValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      reset: () => setValue(''),
      getValue: () => value
    }))

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(value) }}>
        <CustomInput
          ref={inputRef}
          label="Custom Input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    )
  }
)`}
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
