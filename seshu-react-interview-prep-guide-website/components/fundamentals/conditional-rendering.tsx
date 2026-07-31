"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { GitBranch, Lightbulb } from "lucide-react"

export function ConditionalRendering() {
  const basicPatternsCode = `// Conditional Rendering Patterns in React with TypeScript

import React, { useState } from 'react';

// 1. Conditional Rendering with Logical AND (&&)
interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

const UserProfile: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <div>
      {user && (
        <div>
          <h2>Welcome, {user.name}!</h2>
          {user.isAdmin && <p>You have admin privileges</p>}
        </div>
      )}
      {!user && <p>Please log in</p>}
    </div>
  );
};

// 2. Ternary Operator for If-Else
const LoginStatus: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn ? (
        <button>Logout</button>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
};

// 3. Multiple Conditions with Ternary
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const DataComponent: React.FC = () => {
  const [state, setState] = useState<LoadingState>('idle');
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {state === 'loading' ? (
        <p>Loading...</p>
      ) : state === 'error' ? (
        <p>Error: {error}</p>
      ) : state === 'success' ? (
        <p>Data: {data}</p>
      ) : (
        <button onClick={() => setState('loading')}>Load Data</button>
      )}
    </div>
  );
};

// 4. Switch-like Pattern with Object Mapping
const StatusComponent: React.FC<{ status: LoadingState }> = ({ status }) => {
  const statusComponents = {
    idle: <button>Start</button>,
    loading: <div>Loading...</div>,
    success: <div>✅ Success!</div>,
    error: <div>❌ Error occurred</div>
  } as const;

  return (
    <div>
      <h3>Current Status: {status}</h3>
      {statusComponents[status]}
    </div>
  );
};

// 5. Conditional Rendering with Early Return
const ConditionalComponent: React.FC<{ 
  isVisible: boolean; 
  hasPermission: boolean; 
}> = ({ isVisible, hasPermission }) => {
  // Early return for better readability
  if (!isVisible) {
    return null;
  }

  if (!hasPermission) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h2>Protected Content</h2>
      <p>You have access to this content</p>
    </div>
  );
};`

  const advancedPatternsCode = `// Advanced Conditional Rendering Patterns

// 1. Conditional Rendering with Custom Hooks
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate auth check
  React.useEffect(() => {
    setTimeout(() => {
      setUser({ id: 1, name: 'John', isAdmin: true });
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading, isAuthenticated: !!user };
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page</div>;
  }

  return <>{children}</>;
};

// 2. Conditional Rendering with Render Props
interface ConditionalProps {
  condition: boolean;
  children: (condition: boolean) => React.ReactNode;
  fallback?: React.ReactNode;
}

const Conditional: React.FC<ConditionalProps> = ({ 
  condition, 
  children, 
  fallback = null 
}) => {
  return condition ? <>{children(condition)}</> : <>{fallback}</>;
};

// Usage
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Conditional 
      condition={isLoggedIn}
      fallback={<div>Please log in</div>}
    >
      {(condition) => (
        <div>
          <h1>Welcome back!</h1>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      )}
    </Conditional>
  );
};

// 3. List Conditional Rendering
interface Item {
  id: number;
  name: string;
  isActive: boolean;
  category: 'work' | 'personal' | 'urgent';
}

const ItemList: React.FC<{ items: Item[]; filter?: string }> = ({ 
  items, 
  filter 
}) => {
  const filteredItems = items.filter(item => {
    if (!filter) return true;
    return item.category === filter;
  });

  return (
    <div>
      {filteredItems.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {filteredItems.map(item => (
            <li key={item.id} className={item.isActive ? 'active' : 'inactive'}>
              {item.name}
              {item.category === 'urgent' && <span> 🚨</span>}
              {item.isActive && <span> ✅</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 4. Conditional Styling and Classes
const Button: React.FC<{
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}> = ({ variant, size, disabled, loading, children }) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };

  const className = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'btn-disabled',
    loading && 'btn-loading'
  ].filter(Boolean).join(' ');

  return (
    <button className={className} disabled={disabled || loading}>
      {loading ? 'Loading...' : children}
    </button>
  );
};

// 5. Complex Conditional Logic with useMemo
const Dashboard: React.FC<{ user: User; permissions: string[] }> = ({ 
  user, 
  permissions 
}) => {
  const canViewAnalytics = permissions.includes('analytics');
  const canManageUsers = permissions.includes('user-management');
  const canViewReports = permissions.includes('reports');

  const dashboardSections = useMemo(() => {
    const sections = [];

    if (canViewAnalytics) {
      sections.push({ id: 'analytics', component: <AnalyticsSection /> });
    }

    if (canManageUsers) {
      sections.push({ id: 'users', component: <UserManagementSection /> });
    }

    if (canViewReports) {
      sections.push({ id: 'reports', component: <ReportsSection /> });
    }

    return sections;
  }, [canViewAnalytics, canManageUsers, canViewReports]);

  return (
    <div>
      <h1>Dashboard - {user.name}</h1>
      {dashboardSections.length === 0 ? (
        <p>No sections available for your permission level</p>
      ) : (
        <div className="dashboard-grid">
          {dashboardSections.map(section => (
            <div key={section.id} className="dashboard-section">
              {section.component}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};`

  const bestPracticesCode = `// Conditional Rendering Best Practices and Anti-Patterns

// ✅ GOOD: Safe conditional rendering with proper null checks
const SafeComponent: React.FC<{ user?: User }> = ({ user }) => {
  return (
    <div>
      {user?.name && <h1>Welcome, {user.name}!</h1>}
      {user?.isAdmin && <AdminPanel />}
    </div>
  );
};

// ❌ BAD: Unsafe conditional rendering
const UnsafeComponent: React.FC<{ user?: User }> = ({ user }) => {
  return (
    <div>
      {/* This will render "0" if user.name is empty string */}
      {user.name.length && <h1>Welcome, {user.name}!</h1>}
      
      {/* This will throw error if user is undefined */}
      {user.isAdmin && <AdminPanel />}
    </div>
  );
};

// ✅ GOOD: Explicit boolean conversion
const ExplicitBoolean: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <div>
      {/* Explicitly convert to boolean */}
      {Boolean(items.length) && <ItemList items={items} />}
      
      {/* Or use comparison */}
      {items.length > 0 && <ItemList items={items} />}
      
      {/* Or use ternary for clarity */}
      {items.length ? <ItemList items={items} /> : <EmptyState />}
    </div>
  );
};

// ✅ GOOD: Extract complex conditions
const ComplexConditions: React.FC<{ user: User; feature: string }> = ({ 
  user, 
  feature 
}) => {
  const hasFeatureAccess = user.isAdmin || user.permissions.includes(feature);
  const isFeatureEnabled = process.env.NODE_ENV === 'production' || user.isAdmin;
  const shouldShowFeature = hasFeatureAccess && isFeatureEnabled;

  return (
    <div>
      {shouldShowFeature && <FeatureComponent feature={feature} />}
    </div>
  );
};

// ✅ GOOD: Use enums for better type safety
enum ViewState {
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
  EMPTY = 'empty'
}

const DataView: React.FC<{ state: ViewState; data?: any[]; error?: string }> = ({ 
  state, 
  data, 
  error 
}) => {
  switch (state) {
    case ViewState.LOADING:
      return <LoadingSpinner />;
    
    case ViewState.ERROR:
      return <ErrorMessage message={error} />;
    
    case ViewState.EMPTY:
      return <EmptyState />;
    
    case ViewState.SUCCESS:
      return <DataTable data={data} />;
    
    default:
      // TypeScript will catch if we miss a case
      const exhaustiveCheck: never = state;
      return null;
  }
};

// ✅ GOOD: Conditional rendering with performance optimization
const OptimizedList: React.FC<{ items: Item[]; showAll: boolean }> = ({ 
  items, 
  showAll 
}) => {
  const visibleItems = useMemo(() => {
    return showAll ? items : items.slice(0, 10);
  }, [items, showAll]);

  const hasMoreItems = items.length > 10;

  return (
    <div>
      {visibleItems.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
      
      {!showAll && hasMoreItems && (
        <button onClick={() => setShowAll(true)}>
          Show {items.length - 10} more items
        </button>
      )}
    </div>
  );
};

// ✅ GOOD: Conditional rendering with error boundaries
const SafeConditionalRender: React.FC<{ 
  condition: boolean; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ condition, children, fallback = null }) => {
  if (!condition) return <>{fallback}</>;

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      {children}
    </ErrorBoundary>
  );
};`

  const interviewQuestions = [
    {
      question: "What are the different ways to conditionally render components in React?",
      answer:
        "Main methods include: 1) Logical AND (&&) for simple conditions, 2) Ternary operator for if-else, 3) Early return in components, 4) Switch-like patterns with object mapping, 5) Conditional rendering with custom hooks. Choose based on complexity and readability.",
      code: `// Logical AND
{user && <UserProfile user={user} />}

// Ternary operator
{isLoggedIn ? <Dashboard /> : <LoginForm />}

// Early return
if (!user) return <div>Please log in</div>;

// Object mapping
const components = { loading: <Spinner />, error: <Error /> };
return components[status];`,
    },
    {
      question: "What are common pitfalls with conditional rendering?",
      answer:
        "Common issues include: 1) Rendering '0' or 'false' instead of nothing, 2) Not handling null/undefined safely, 3) Complex inline conditions reducing readability, 4) Performance issues with expensive computations in conditions, 5) Not using proper TypeScript types for conditional logic.",
      code: `// ❌ Bad - renders '0'
{items.length && <ItemList />}

// ✅ Good - explicit boolean
{items.length > 0 && <ItemList />}

// ❌ Bad - unsafe
{user.name && <div>{user.name}</div>}

// ✅ Good - safe
{user?.name && <div>{user.name}</div>}`,
    },
    {
      question: "How do you handle complex conditional rendering logic?",
      answer:
        "For complex conditions: 1) Extract logic into variables or custom hooks, 2) Use switch statements or object mapping, 3) Create reusable conditional components, 4) Use enums for better type safety, 5) Consider useMemo for expensive conditional computations.",
      code: `// Extract complex logic
const shouldShowFeature = user.isAdmin && 
  feature.enabled && 
  user.permissions.includes('feature');

// Use enums
enum Status { LOADING, SUCCESS, ERROR }

// Custom conditional component
<Conditional condition={shouldShow} fallback={<Loading />}>
  <FeatureComponent />
</Conditional>`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <GitBranch className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Conditional Rendering</h2>
        <Badge variant="secondary">Logic Control</Badge>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Patterns</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Patterns</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Conditional Rendering Patterns</CardTitle>
              <CardDescription>Learn the fundamental patterns for conditional rendering in React</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={basicPatternsCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Best Practice:</strong> Use logical AND (&&) for simple show/hide, ternary operator for
                  if-else scenarios, and early returns for complex guard conditions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Conditional Patterns</CardTitle>
              <CardDescription>Master complex conditional rendering scenarios and reusable patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={advancedPatternsCode} language="tsx" />

              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h4 className="font-semibold mb-2">Advanced Techniques:</h4>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  <li>
                    • <strong>Custom Hooks:</strong> Encapsulate conditional logic
                  </li>
                  <li>
                    • <strong>Render Props:</strong> Flexible conditional components
                  </li>
                  <li>
                    • <strong>Object Mapping:</strong> Switch-like conditional rendering
                  </li>
                  <li>
                    • <strong>Performance:</strong> useMemo for expensive conditions
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices & Anti-Patterns</CardTitle>
              <CardDescription>Learn what to do and what to avoid in conditional rendering</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={bestPracticesCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Best Practices</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use explicit boolean conversion</li>
                    <li>• Handle null/undefined safely</li>
                    <li>• Extract complex conditions</li>
                    <li>• Use TypeScript enums for states</li>
                    <li>• Optimize with useMemo when needed</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Common Pitfalls</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Rendering falsy values (0, '')</li>
                    <li>• Unsafe property access</li>
                    <li>• Complex inline conditions</li>
                    <li>• Missing TypeScript types</li>
                    <li>• Performance issues in conditions</li>
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
