"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import { InterviewQuestions } from "@/components/interview-questions"
import { MousePointer, Lightbulb } from "lucide-react"

export function EventHandling() {
  const eventTypesCode = `// Event Handling with TypeScript - Complete Guide

import React, { useState } from 'react';

// 1. Mouse Events
const MouseEventExample: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked at:', event.clientX, event.clientY);
    event.preventDefault(); // Prevent default behavior
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('Double clicked!');
  };

  return (
    <div onMouseMove={handleMouseMove} onDoubleClick={handleDoubleClick}>
      <button onClick={handleClick}>Click me</button>
      <p>Mouse position: {position.x}, {position.y}</p>
    </div>
  );
};

// 2. Form Events
const FormEventExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, message: event.target.value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selected:', event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={handleTextareaChange}
        placeholder="Message"
      />
      <select onChange={handleSelectChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

// 3. Keyboard Events
const KeyboardEventExample: React.FC = () => {
  const [keys, setKeys] = useState<string[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', event.key);
    
    // Handle specific keys
    if (event.key === 'Enter') {
      console.log('Enter pressed!');
    }
    
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      console.log('Ctrl+S pressed!');
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setKeys(prev => [...prev, event.key]);
  };

  return (
    <div>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Type something..."
      />
      <p>Keys pressed: {keys.join(', ')}</p>
    </div>
  );
};`

  const eventPatternsCode = `// Advanced Event Handling Patterns

// 1. Event Delegation and Bubbling
const EventDelegationExample: React.FC = () => {
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    console.log('Clicked element:', target.tagName);
    
    // Stop propagation if needed
    if (target.classList.contains('stop-propagation')) {
      event.stopPropagation();
    }
  };

  return (
    <div onClick={handleContainerClick}>
      <button>Button 1</button>
      <button className="stop-propagation">Button 2 (stops propagation)</button>
      <p>Click anywhere in this container</p>
    </div>
  );
};

// 2. Custom Event Handlers with Parameters
const ParameterizedEvents: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Method 1: Arrow function in JSX (creates new function each render)
  const handleClick1 = (id: string) => {
    setSelectedId(id);
  };

  // Method 2: Curried function (better performance)
  const handleClick2 = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedId(id);
  };

  // Method 3: Using data attributes
  const handleClick3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.dataset.id;
    if (id) setSelectedId(id);
  };

  const items = ['item1', 'item2', 'item3'];

  return (
    <div>
      <h3>Method 1: Arrow function in JSX</h3>
      {items.map(item => (
        <button key={item} onClick={() => handleClick1(item)}>
          {item}
        </button>
      ))}

      <h3>Method 2: Curried function</h3>
      {items.map(item => (
        <button key={item} onClick={handleClick2(item)}>
          {item}
        </button>
      ))}

      <h3>Method 3: Data attributes</h3>
      {items.map(item => (
        <button key={item} data-id={item} onClick={handleClick3}>
          {item}
        </button>
      ))}

      <p>Selected: {selectedId}</p>
    </div>
  );
};

// 3. Debounced Events
const DebouncedInput: React.FC = () => {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Simple debounce implementation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type to see debouncing..."
      />
      <p>Current value: {value}</p>
      <p>Debounced value: {debouncedValue}</p>
    </div>
  );
};

// 4. Synthetic Events vs Native Events
const SyntheticEventExample: React.FC = () => {
  const handleSyntheticEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Synthetic event:', event);
    console.log('Native event:', event.nativeEvent);
    
    // Access synthetic event properties
    console.log('Current target:', event.currentTarget);
    console.log('Target:', event.target);
    console.log('Event type:', event.type);
    
    // Access native event
    console.log('Native timestamp:', event.nativeEvent.timeStamp);
  };

  return (
    <button onClick={handleSyntheticEvent}>
      Click to see synthetic vs native event
    </button>
  );
};`

  const performanceCode = `// Event Handling Performance Best Practices

// ❌ BAD: Creating new functions on every render
const BadExample: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* New function created on every render */}
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
      
      {/* New function with parameter created on every render */}
      <button onClick={() => console.log('clicked', count)}>
        Log Count
      </button>
    </div>
  );
};

// ✅ GOOD: Optimized event handlers
const GoodExample: React.FC = () => {
  const [count, setCount] = useState(0);

  // Stable function reference using useCallback
  const handleIncrement = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // For simple state updates, functional updates are preferred
  const handleDecrement = React.useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  // Memoized handler with dependencies
  const handleReset = React.useCallback(() => {
    console.log('Resetting from:', count);
    setCount(0);
  }, [count]);

  return (
    <div>
      <button onClick={handleIncrement}>
        Increment: {count}
      </button>
      <button onClick={handleDecrement}>
        Decrement
      </button>
      <button onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

// ✅ GOOD: Event delegation for lists
const ListWithEventDelegation: React.FC = () => {
  const [items, setItems] = useState(['item1', 'item2', 'item3']);

  // Single event handler for all items
  const handleItemClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target as HTMLElement;
    const itemId = target.dataset.id;
    
    if (itemId) {
      console.log('Clicked item:', itemId);
      // Handle item click
    }
  };

  return (
    <ul onClick={handleItemClick}>
      {items.map(item => (
        <li key={item} data-id={item}>
          {item}
        </li>
      ))}
    </ul>
  );
};

// ✅ GOOD: Custom hook for event handling
const useEventHandler = <T extends HTMLElement>(
  eventType: string,
  handler: (event: Event) => void,
  element?: T | null
) => {
  React.useEffect(() => {
    const targetElement = element || document;
    targetElement.addEventListener(eventType, handler);
    
    return () => {
      targetElement.removeEventListener(eventType, handler);
    };
  }, [eventType, handler, element]);
};

const CustomHookExample: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  
  const handleGlobalClick = React.useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);

  useEventHandler('click', handleGlobalClick);

  return (
    <div>
      <p>Global clicks: {clickCount}</p>
      <p>Click anywhere on the page</p>
    </div>
  );
};`

  const interviewQuestions = [
    {
      question: "What are Synthetic Events in React?",
      answer:
        "Synthetic Events are React's wrapper around native DOM events. They provide a consistent API across different browsers, automatic event pooling (in React <17), and additional features like event delegation. They have the same interface as native events but with cross-browser compatibility.",
      code: `const handleClick = (event: React.MouseEvent) => {
  console.log(event.type); // Synthetic event
  console.log(event.nativeEvent); // Native DOM event
  event.preventDefault(); // Works consistently across browsers
};`,
    },
    {
      question: "How do you pass parameters to event handlers?",
      answer:
        "There are several ways: 1) Arrow functions in JSX (creates new function each render), 2) Curried functions (better performance), 3) Data attributes, 4) Using bind. Choose based on performance needs and readability.",
      code: `// Method 1: Arrow function (simple but creates new function)
<button onClick={() => handleClick(id)}>Click</button>

// Method 2: Curried function (better performance)
const handleClick = (id: string) => (event: React.MouseEvent) => {
  console.log(id);
};

// Method 3: Data attributes
<button data-id={id} onClick={handleDataClick}>Click</button>`,
    },
    {
      question: "How do you optimize event handlers for performance?",
      answer:
        "Use useCallback to memoize handlers, avoid creating new functions in render, use event delegation for lists, and prefer functional state updates. For frequently firing events like scroll or resize, consider debouncing or throttling.",
      code: `// ✅ Optimized with useCallback
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

// ✅ Event delegation for lists
const handleListClick = (event: React.MouseEvent<HTMLUListElement>) => {
  const target = event.target as HTMLElement;
  const id = target.dataset.id;
  if (id) handleItemClick(id);
};`,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <MousePointer className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Event Handling</h2>
        <Badge variant="secondary">Interactive</Badge>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types">Event Types</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="interview">Interview Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Types with TypeScript</CardTitle>
              <CardDescription>Master different event types and their proper TypeScript definitions</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={eventTypesCode} language="tsx" />

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>TypeScript Tip:</strong> Always use the specific event type (React.MouseEvent,
                  React.ChangeEvent, etc.) instead of the generic Event type for better type safety and IntelliSense.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Event Patterns</CardTitle>
              <CardDescription>Learn advanced patterns for handling events effectively</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={eventPatternsCode} language="tsx" />

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">Event Handling Patterns:</h4>
                <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>
                    • <strong>Event Delegation:</strong> Handle multiple similar elements with one handler
                  </li>
                  <li>
                    • <strong>Parameterized Handlers:</strong> Pass data to event handlers efficiently
                  </li>
                  <li>
                    • <strong>Debouncing:</strong> Limit frequency of event handler execution
                  </li>
                  <li>
                    • <strong>Synthetic Events:</strong> React's cross-browser event wrapper
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>Best practices for optimizing event handler performance</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={performanceCode} language="tsx" />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Performance Tips</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use useCallback for stable references</li>
                    <li>• Prefer functional state updates</li>
                    <li>• Use event delegation for lists</li>
                    <li>• Debounce high-frequency events</li>
                    <li>• Avoid inline arrow functions in JSX</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Performance Pitfalls</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Creating new functions in render</li>
                    <li>• Not memoizing event handlers</li>
                    <li>• Individual handlers for list items</li>
                    <li>• Capturing stale closures</li>
                    <li>• Unnecessary re-renders from events</li>
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
