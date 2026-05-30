import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import Quiz from "./models/Quiz.js";
import User from "./models/User.js";

// Load env variables
dotenv.config();

const seedCourses = [
  {
    id: "react-core",
    title: "React.js Core Essentials & Advanced Patterns",
    instructor: "Sarah Jenkins, Principal Engineer",
    category: "Web Development",
    description: "Master React 18, functional components, custom hooks, context management, performance optimization, and premium design patterns. Build highly responsive single-page applications.",
    duration: "10 hours",
    rating: 4.9,
    reviewsCount: 12450,
    difficulty: "Intermediate",
    skills: ["React", "JavaScript", "State Management", "Performance Optimization"],
    skillMatch: 98,
    recommendationReason: "Based on your interest in web design and 98% skill match in JavaScript fundamentals.",
    syllabus: [
      { id: "rc-1", title: "Introduction to React 18 and Vite Setup", duration: "45 mins" },
      { id: "rc-2", title: "Functional Components and Advanced JSX", duration: "60 mins" },
      { id: "rc-3", title: "Deep Dive into useState and useEffect Hooks", duration: "90 mins" },
      { id: "rc-4", title: "Custom Hooks: Writing Clean, Reusable Logic", duration: "75 mins" },
      { id: "rc-5", title: "Global State Management with Context API", duration: "90 mins" },
      { id: "rc-6", title: "Performance Tuning: useMemo, useCallback, and Memoization", duration: "80 mins" }
    ],
    quizId: "q-react"
  },
  {
    id: "css-mastery",
    title: "Advanced CSS Layouts, Grid, Flexbox, & Animations",
    instructor: "David Miller, Design Systems Lead",
    category: "Design",
    description: "Go beyond basic CSS. Explore CSS Grid, Flexbox, layout systems, custom variables, responsive typography, glassmorphism, fluid micro-animations, and building professional custom style guides.",
    duration: "8 hours",
    rating: 4.8,
    reviewsCount: 8400,
    difficulty: "Advanced",
    skills: ["CSS Grid", "Flexbox", "UI Design", "Transitions & Animations"],
    skillMatch: 95,
    recommendationReason: "Recommended because you are building interactive web frontends and want smooth micro-interactions.",
    syllabus: [
      { id: "cm-1", title: "Flexbox Foundations & Alignment Mechanics", duration: "50 mins" },
      { id: "cm-2", title: "Grid Architecture: Designing Responsive Stepper Grids", duration: "90 mins" },
      { id: "cm-3", title: "CSS Custom Properties & Premium Theme Switching", duration: "60 mins" },
      { id: "cm-4", title: "Fluid Typography & Responsive Breakpoints", duration: "75 mins" },
      { id: "cm-5", title: "Bezier Curves and Micro-Animation Timings", duration: "80 mins" }
    ],
    quizId: "q-css"
  },
  {
    id: "js-next",
    title: "Modern JavaScript (ES6+ to ESNext) Deep Dive",
    instructor: "Kyle Simpson, Author of JS Core",
    category: "Web Development",
    description: "Understand the core mechanics of JS. Asynchronous execution, event loops, closures, prototype chain, promise structures, async/await, generators, and state machines.",
    duration: "12 hours",
    rating: 4.9,
    reviewsCount: 19800,
    difficulty: "Beginner",
    skills: ["JavaScript", "ESNext", "Asynchronous JS", "FP Concepts"],
    skillMatch: 85,
    recommendationReason: "Essential fundamental course for full-stack developers to master async operations.",
    syllabus: [
      { id: "js-1", title: "Scope, Closures, and Execution Contexts", duration: "60 mins" },
      { id: "js-2", title: "Prototypes and Object-Oriented JS Patterns", duration: "80 mins" },
      { id: "js-3", title: "Asynchronous Mastery: Promises, Observables, & Async/Await", duration: "110 mins" },
      { id: "js-4", title: "Functional Programming Elements in JS", duration: "70 mins" }
    ],
    quizId: "q-js"
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Systems: Figma to Production Code",
    instructor: "Elena Rostova, Product Designer",
    category: "Design",
    description: "Learn how to build scalable design systems, design layouts in Figma, create cohesive color systems, design user-centric interfaces, and bridge the gap to high-fidelity code.",
    duration: "9 hours",
    rating: 4.7,
    reviewsCount: 6500,
    difficulty: "Beginner",
    skills: ["UI/UX Design", "Figma", "Design Systems", "Prototyping"],
    skillMatch: 92,
    recommendationReason: "Recommended based on your creative dashboard visual goals.",
    syllabus: [
      { id: "uu-1", title: "Foundations of Color Psychology & Visual Hierarchy", duration: "45 mins" },
      { id: "uu-2", title: "Grid Alignment & Layout Foundations", duration: "60 mins" },
      { id: "uu-3", title: "Building Consistent Token Systems in Figma", duration: "90 mins" },
      { id: "uu-4", title: "UX Audits and Cognitive Load Optimization", duration: "75 mins" }
    ],
    quizId: "q-uiux"
  },
  {
    id: "data-vis",
    title: "Interactive Data Visualization & Dashboard Design",
    instructor: "Dr. Marcus Chen, Analytics Consultant",
    category: "Data Science",
    description: "Learn how to present complex metrics in gorgeous, easy-to-read graphical interfaces. Cover Recharts, D3 basics, accessibility in charts, and building responsive data widgets.",
    duration: "7 hours",
    rating: 4.8,
    reviewsCount: 3100,
    difficulty: "Advanced",
    skills: ["Data Visualization", "Recharts", "JSON Wrangling", "Dashboard Analytics"],
    skillMatch: 75,
    recommendationReason: "Unlocks advanced capabilities for building executive analytics panels.",
    syllabus: [
      { id: "dv-1", title: "Core Principles of Data Presentation", duration: "40 mins" },
      { id: "dv-2", title: "Integrating SVG Charts in React Components", duration: "80 mins" },
      { id: "dv-3", title: "Recharts Custom Tooltips & Interactive Legends", duration: "70 mins" },
      { id: "dv-4", title: "Optimizing Chart Renderers for Real-time Streaming", duration: "60 mins" }
    ],
    quizId: "q-datavis"
  },
  {
    id: "seo-marketing",
    title: "SEO Optimization & Search Engine Algorithms",
    instructor: "Alex Rivera, Growth Architect",
    category: "Marketing",
    description: "Drive thousands of organic users to your app. Master Technical SEO, web performance, semantic HTML tags, Google Search Console, keyword analysis, and core web vitals.",
    duration: "6 hours",
    rating: 4.6,
    reviewsCount: 2200,
    difficulty: "Intermediate",
    skills: ["SEO", "Performance", "Semantic HTML", "Analytics"],
    skillMatch: 60,
    recommendationReason: "Trending topic for developers who want to launch their own SaaS.",
    syllabus: [
      { id: "seo-1", title: "SEO Crawling, Indexing, and Search Engine Algorithms", duration: "45 mins" },
      { id: "seo-2", title: "Optimizing Core Web Vitals for Performance Scores", duration: "80 mins" },
      { id: "seo-3", title: "Rich Snippets, Structured Data Schema, and Sitemaps", duration: "90 mins" }
    ],
    quizId: "q-seo"
  }
];

const seedQuizzes = [
  {
    id: "q-react",
    courseId: "react-core",
    courseTitle: "React.js Core Essentials & Advanced Patterns",
    durationSeconds: 600,
    questions: [
      {
        id: 1,
        question: "Which of the following hooks is primarily used to memoize complex callback definitions across parent renders?",
        options: ["useMemo", "useCallback", "useRef", "useReducer"],
        correctAnswer: 1,
        explanation: "useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed, preventing unnecessary renders of child components."
      },
      {
        id: 2,
        question: "In React 18, what new API enables batching state updates automatically across timeouts and promises?",
        options: ["createRoot", "useTransition", "Automatic Batching", "SuspenseList"],
        correctAnswer: 2,
        explanation: "React 18 introduces Automatic Batching, which groups state updates inside promises, setTimeout, and fetch callbacks together, resulting in fewer renders."
      },
      {
        id: 3,
        question: "When creating a custom hook in React, what naming convention is strictly enforced by standard lint rules?",
        options: ["Must start with 'get'", "Must start with 'use'", "Must be capitalized", "Must end with 'Hook'"],
        correctAnswer: 1,
        explanation: "Custom hooks must start with the keyword 'use' (e.g., 'useAuth') so that ESLint's rules of hooks can inspect them for violations."
      },
      {
        id: 4,
        question: "Which Hook is designed to handle side effects such as data fetching, subscriptions, or manual DOM updates in functional components?",
        options: ["useLayoutEffect", "useMemo", "useEffect", "useImperativeHandle"],
        correctAnswer: 2,
        explanation: "useEffect is the standard Hook for executing side effects. It runs asynchronously after the render paint, making it non-blocking."
      },
      {
        id: 5,
        question: "What is the correct syntax to declare a state variable representing a count counter using React state hooks?",
        options: ["const [count, setCount] = useState(0);", "const count = useState(0);", "let [count, updateCount] = React.useHooks(0);", "const {count, setCount} = useState(0);"],
        correctAnswer: 0,
        explanation: "useState returns a pair: the current state value and a function to update it. The standard array destructuring form is const [state, setState] = useState(initialValue)."
      },
      {
        id: 6,
        question: "What does the term 'rendering' specifically mean in the context of React's lifecycle?",
        options: ["Drawing pixels directly on the client's screen.", "React calling your component functions to fetch virtual elements representing the UI.", "Injecting parsed stylesheets and scripts into document head.", "Pre-compiling production JSX files into compressed bundles."],
        correctAnswer: 1,
        explanation: "Rendering is React calling your component functions to gather their virtual elements (React Elements). It does not write to the screen directly until the commit phase."
      },
      {
        id: 7,
        question: "Which of the following describes the two primary 'Rules of Hooks' mandated by React designers?",
        options: [
          "Call them only inside loops, and call them only from regular helper functions.",
          "Call them only at the top level of your component, and call them only from React function components or custom hooks.",
          "Declare hooks inside conditional blocks, and only use primitive types as state parameters.",
          "Hooks must always be declared at the bottom of the file, and must contain async call wrappers."
        ],
        correctAnswer: 1,
        explanation: "React relies on the order in which Hooks are called. To guarantee this, hooks must not be placed inside loops, conditions, or nested functions, and must only be executed within React functions."
      },
      {
        id: 8,
        question: "Which hook should be utilized if you want to store a mutable reference value that persists across renders but does NOT trigger a re-render when modified?",
        options: ["useState", "useMemo", "useRef", "useCallback"],
        correctAnswer: 2,
        explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument. Changing .current does not trigger a re-render of the component."
      },
      {
        id: 9,
        question: "Which built-in React hook is used to subscribe to and read global data contexts without wrapping components in consumers?",
        options: ["useProvider", "useContext", "useConsumer", "useGlobalState"],
        correctAnswer: 1,
        explanation: "useContext accepts a context object and returns the current context value for that context, enabling clean context consumption inside functional components."
      },
      {
        id: 10,
        question: "What is React's Virtual DOM?",
        options: [
          "A virtual reality browser plugin.",
          "A direct replication of the physical web server DOM.",
          "An in-memory lightweight representation of the real DOM synced via reconciliation algorithms.",
          "A background thread that compiles React code into HTML5."
        ],
        correctAnswer: 2,
        explanation: "The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the 'real' DOM by a library like ReactDOM via reconciliation."
      }
    ]
  },
  {
    id: "q-css",
    courseId: "css-mastery",
    courseTitle: "Advanced CSS Layouts, Grid, Flexbox, & Animations",
    durationSeconds: 600,
    questions: [
      {
        id: 1,
        question: "What CSS Grid property allows grid elements to automatically flow into columns without defining a specific count?",
        options: ["grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))", "grid-auto-flow: dense", "grid-columns: flex", "grid-template-rows: auto-fill"],
        correctAnswer: 0,
        explanation: "The repeat(auto-fit, minmax(...)) format dynamic-sizes and wraps columns automatically based on viewport constraints without static breakpoints."
      },
      {
        id: 2,
        question: "Which of the following cubic-bezier transition curves represents a premium 'spring-back' elastic ease-out effect?",
        options: ["cubic-bezier(0.25, 0.1, 0.25, 1)", "cubic-bezier(0, 0, 1, 1)", "cubic-bezier(0.68, -0.6, 0.32, 1.6)", "cubic-bezier(0.4, 0, 0.2, 1)"],
        correctAnswer: 2,
        explanation: "A cubic-bezier where values exceed 1 or are less than 0 (e.g. -0.6 and 1.6) creates an elastic overshoot/rebound transition, ideal for premium UI animations."
      },
      {
        id: 3,
        question: "Which display value should be configured to activate Grid container layout structures on an element?",
        options: ["display: flex-grid;", "display: grid;", "display: block-grid;", "display: table-grid;"],
        correctAnswer: 1,
        explanation: "Declaring display: grid; converts the element into a grid container, transforming its direct children into grid items."
      },
      {
        id: 4,
        question: "What is the conceptual difference between the justify-content and align-items properties in CSS Flexbox?",
        options: [
          "justify-content handles margins, while align-items handles padding elements.",
          "justify-content aligns flex items along the main axis, while align-items aligns items along the cross axis.",
          "justify-content is for vertical alignment only, while align-items handles horizontal alignment.",
          "There is no difference; they are duplicate properties."
        ],
        correctAnswer: 1,
        explanation: "In a flex container, justify-content defines how space is distributed along the main axis, whereas align-items defines alignment along the cross axis."
      },
      {
        id: 5,
        question: "What CSS naming format is used to declare standard custom variables (CSS Custom Properties)?",
        options: ["$variable-name", "@variable-name", "--variable-name", "var(variable-name)"],
        correctAnswer: 2,
        explanation: "CSS Custom Properties must be prefixed with double hyphens (e.g. --color-primary) and are accessed using the var() function."
      },
      {
        id: 6,
        question: "What is the primary effect of configuring the box-sizing property to 'border-box' on an element?",
        options: [
          "It forces the element to remain circular.",
          "It excludes padding and borders from total width calculations.",
          "It includes the element's padding and borders within its specified total width and height.",
          "It disables all borders on child block elements."
        ],
        correctAnswer: 2,
        explanation: "With box-sizing: border-box;, padding and borders are absorbed into the width and height, preventing layout expansions when adding margins or borders."
      },
      {
        id: 7,
        question: "Which selector format targets a sibling paragraph element that directly follows a heading element?",
        options: ["h1 p", "h1 > p", "h1 + p", "h1 ~ p"],
        correctAnswer: 2,
        explanation: "The adjacent sibling combinator (+) matches the second element only if it immediately follows the first element, sharing the same parent."
      },
      {
        id: 8,
        question: "What CSS backdrop filter layout pattern is combined with a translucent background to create a premium 'glassmorphism' aesthetic?",
        options: [
          "filter: blur(10px) brightness(1.2)",
          "backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.15);",
          "background-filter: opacity(0.8)",
          "mix-blend-mode: overlay; opacity: 0.3;"
        ],
        correctAnswer: 1,
        explanation: "Glassmorphism is characterized by a blurred backing effect. This is accomplished in CSS by applying backdrop-filter: blur() onto a translucent, low-opacity background."
      },
      {
        id: 9,
        question: "What property determines the visual stacking order of overlapping elements along the z-axis?",
        options: ["z-index", "layer-order", "depth", "stack-level"],
        correctAnswer: 0,
        explanation: "z-index specifies the stack order of positioned elements. Elements with larger z-index values overlap elements with smaller values."
      },
      {
        id: 10,
        question: "What does the flex-grow property specify for a flex child item?",
        options: [
          "The maximum size an element can grow in pixels.",
          "The proportional ability for a flex item to grow and absorb available free space inside the container.",
          "The speed of flex scaling transitions.",
          "Whether an element wraps to the next line row."
        ],
        correctAnswer: 1,
        explanation: "flex-grow defines the flex grow factor, which determines how much of the positive free space inside the flex container will be distributed to that flex item."
      }
    ]
  },
  {
    id: "q-js",
    courseId: "js-next",
    courseTitle: "Modern JavaScript (ES6+ to ESNext) Deep Dive",
    durationSeconds: 600,
    questions: [
      {
        id: 1,
        question: "What is the primary difference between a Javascript Promise.all() and Promise.allSettled()?",
        options: [
          "Promise.all() completes only if all reject.",
          "Promise.all() rejects immediately if any promise fails, while Promise.allSettled() waits for all to resolve or reject.",
          "Promise.allSettled() is asynchronous but Promise.all() is synchronous.",
          "There is no difference."
        ],
        correctAnswer: 1,
        explanation: "Promise.allSettled() returns a promise that resolves after all of the given promises have either fulfilled or rejected, unlike Promise.all() which short-circuits on rejection."
      },
      {
        id: 2,
        question: "Which of the following keywords were introduced in ES6 to enable block-scoped variable declarations?",
        options: ["var and let", "let and const", "const and var", "define and let"],
        correctAnswer: 1,
        explanation: "let and const are block-scoped declarations, whereas var is function-scoped and hoisted to the top of its containing scope."
      },
      {
        id: 3,
        question: "What does the strict equality operator (===) compare in JavaScript?",
        options: [
          "Value comparison only, with automatic type coercion.",
          "Both value and data type comparison, without coercion.",
          "Reference memory locations for primitives.",
          "String representations of objects."
        ],
        correctAnswer: 1,
        explanation: "The strict equality operator (===) checks for both equality of value and identity of type. It does not perform automatic type coercion."
      },
      {
        id: 4,
        question: "What is a closure in JavaScript?",
        options: [
          "A method that closes the browser tab.",
          "A function that retains access to its outer lexical scope variables even after the outer function has finished executing.",
          "A design pattern that hides database configuration keys.",
          "An event listener that halts event bubbling."
        ],
        correctAnswer: 1,
        explanation: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JS, closures are created every time a function is created."
      },
      {
        id: 5,
        question: "How do you handle errors inside an asynchronous function block when writing code using async/await syntax?",
        options: [
          "Append a .catch() callback at the end of every expression.",
          "Wrap statements in a try...catch block.",
          "Errors are automatically ignored in async blocks.",
          "Use a global window.onerror listener."
        ],
        correctAnswer: 1,
        explanation: "Async/await functions allow writing asynchronous code in a synchronous style, meaning standard try...catch statements can be used to handle promise rejections."
      },
      {
        id: 6,
        question: "Which of the following array methods returns a new filtered array containing only the elements that satisfy a specific conditional test?",
        options: ["map()", "forEach()", "filter()", "reduce()"],
        correctAnswer: 2,
        explanation: "filter() calls a provided callback function once for each element in an array, and constructs a new array of all the values that returned true."
      },
      {
        id: 7,
        question: "What does the execution keyword 'this' typically refer to inside a standard JavaScript function?",
        options: [
          "The script tag executing the active page.",
          "The object that invoked or is executing the active function.",
          "The global window object exclusively.",
          "The parent class constructor definition."
        ],
        correctAnswer: 1,
        explanation: "In most cases, the value of 'this' is determined by how a function is called (dynamic binding). It refers to the object that the function is a method of, or is bound to."
      },
      {
        id: 8,
        question: "What ES6 feature allows unpackaging array values or object properties directly into distinct variables?",
        options: ["Spread Operator", "Destructuring Assignment", "Arrow Syntax", "Template Literals"],
        correctAnswer: 1,
        explanation: "Destructuring assignment uses syntax mirroring array/object literals to extract data from arrays or objects easily."
      },
      {
        id: 9,
        question: "What is the evaluate type returned by running the expression 'typeof null' in standard JavaScript environments?",
        options: ['"null"', '"undefined"', '"object"', '"value"'],
        correctAnswer: 2,
        explanation: "In JavaScript, typeof null is historical bug that returns 'object'. It has been kept for backward compatibility reasons."
      },
      {
        id: 10,
        question: "Which native global method is used to parse a standardized JSON string value back into a standard JavaScript object/array structure?",
        options: ["JSON.stringify()", "JSON.parse()", "Object.fromJSON()", "JSON.decode()"],
        correctAnswer: 1,
        explanation: "JSON.parse() parses a JSON string, constructing the JavaScript value or object described by the string."
      }
    ]
  },
  {
    id: "q-uiux",
    courseId: "ui-ux-design",
    courseTitle: "UI/UX Design Systems: Figma to Production Code",
    durationSeconds: 600,
    questions: [
      { id: 1, question: "In design systems, what term describes a named, reusable design decision (such as a color or spacing value) stored as a variable?", options: ["Design Token", "Style Guide", "Component Variant", "Asset Library"], correctAnswer: 0, explanation: "Design tokens are the single source of truth for design decisions. They store named values (colors, spacing, typography) that are consumed across platforms." },
      { id: 2, question: "Which Figma feature allows a component to have multiple configurations (e.g., size=small/large, state=default/hover) without duplicating frames?", options: ["Auto Layout", "Component Variants", "Prototyping Links", "Shared Libraries"], correctAnswer: 1, explanation: "Component Variants in Figma let you bundle related components into one master component group with switchable properties, reducing duplication." },
      { id: 3, question: "What does 'visual hierarchy' primarily determine in a UI design?", options: ["The order of CSS selectors in a stylesheet", "The sequence in which a user's eye is drawn across the interface", "The layering order of HTML elements in the DOM", "The priority of media queries in responsive layouts"], correctAnswer: 1, explanation: "Visual hierarchy guides the user's attention through deliberate use of size, contrast, color, and spacing, making the most important elements stand out first." },
      { id: 4, question: "In UX design, what is 'cognitive load' and why is reducing it important?", options: ["The number of API requests a UI makes; more requests mean more load.", "The total mental effort a user must exert to understand and use an interface; reducing it improves usability.", "The amount of data stored in the browser cache during a session.", "The time it takes for JavaScript to parse and execute on the main thread."], correctAnswer: 1, explanation: "Cognitive load is the mental effort required to process information. Lower cognitive load leads to faster decision-making and fewer user errors." },
      { id: 5, question: "Which color model is most commonly used when designing for screens and digital interfaces?", options: ["CMYK", "Pantone", "RGB", "HSL only"], correctAnswer: 2, explanation: "RGB (Red, Green, Blue) is the standard additive color model for screens. Digital displays emit light using these three channels." },
      { id: 6, question: "What is the primary purpose of Figma's 'Auto Layout' feature?", options: ["To export assets in multiple resolutions automatically", "To create frames that dynamically resize and reposition child elements based on content", "To synchronize designs with a live coding environment", "To generate CSS code from selected frames"], correctAnswer: 1, explanation: "Auto Layout creates frames that automatically adapt their size and spacing as content changes, similar to CSS Flexbox behavior." },
      { id: 7, question: "In the 8-point grid system used in design, what is the standard base unit for spacing?", options: ["4px", "8px", "16px", "12px"], correctAnswer: 1, explanation: "The 8-point grid system uses multiples of 8px (8, 16, 24, 32...) for spacing and sizing, creating consistent visual rhythm across all screen sizes." },
      { id: 8, question: "What distinguishes a 'wireframe' from a 'high-fidelity prototype' in the UX design process?", options: ["Wireframes use real content; prototypes use placeholder text.", "Wireframes are low-detail structural layouts; high-fidelity prototypes include visual design, color, and interaction.", "Wireframes are coded in HTML; prototypes are built in Figma.", "There is no meaningful difference between them."], correctAnswer: 1, explanation: "Wireframes are skeletal blueprints focusing on layout and structure. High-fidelity prototypes closely resemble the final product with full visual design and interactions." },
      { id: 9, question: "Which accessibility guideline standard defines the minimum contrast ratio for normal text against its background?", options: ["ISO 9241", "WCAG 2.1 AA (4.5:1 ratio)", "Section 508", "ADA Title III"], correctAnswer: 1, explanation: "WCAG 2.1 Level AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text to ensure readability for users with low vision." },
      { id: 10, question: "What is the role of a 'style guide' in a design system?", options: ["A document specifying backend API schema and endpoint contracts.", "A reference document that defines the visual language: colors, typography, iconography, and component usage rules.", "A version control system for design files.", "A testing checklist for QA engineers validating UI components."], correctAnswer: 1, explanation: "A style guide documents the visual standards of a product — colors, fonts, spacing, and component rules — ensuring consistency across all team members and platforms." }
    ]
  },
  {
    id: "q-datavis",
    courseId: "data-vis",
    courseTitle: "Interactive Data Visualization & Dashboard Design",
    durationSeconds: 600,
    questions: [
      { id: 1, question: "Which chart type is most appropriate for showing how a part relates to the whole of a dataset?", options: ["Line Chart", "Scatter Plot", "Pie / Donut Chart", "Box Plot"], correctAnswer: 2, explanation: "Pie and donut charts are designed to show proportional relationships between parts of a whole, where all segments sum to 100%." },
      { id: 2, question: "In Recharts (a React charting library), which component is responsible for wrapping all other chart elements and defining the chart's dimensions?", options: ["<BarChart>", "<ResponsiveContainer>", "<ChartWrapper>", "<DataProvider>"], correctAnswer: 1, explanation: "<ResponsiveContainer> in Recharts wraps chart components and makes them fluid, automatically adapting to parent container dimensions." },
      { id: 3, question: "What does 'data-ink ratio' mean in the context of Edward Tufte's principles of data visualization?", options: ["The number of API calls needed to fetch chart data.", "The proportion of ink (or pixels) used to represent actual data versus decorative or redundant elements.", "The ratio of SVG elements to HTML elements in a chart.", "The color density of a heatmap visualization."], correctAnswer: 1, explanation: "Tufte's data-ink ratio principle states that non-data ink (gridlines, borders, decorations) should be minimized so that the actual data stands out clearly." },
      { id: 4, question: "Which SVG element is the fundamental building block for drawing custom chart lines and shapes in D3.js?", options: ["<rect>", "<path>", "<polygon>", "<ellipse>"], correctAnswer: 1, explanation: "The <path> element is the most powerful SVG element. D3 uses path generators to create line charts, area charts, and complex shapes using path 'd' attribute commands." },
      { id: 5, question: "What is the purpose of a 'tooltip' in an interactive data visualization?", options: ["To provide a download button for exporting chart data as CSV.", "To display detailed data values when a user hovers over or clicks on a specific data point.", "To add an animated loading indicator while data is fetching.", "To filter the dataset displayed based on a date range."], correctAnswer: 1, explanation: "Tooltips are contextual pop-ups that reveal precise data values for specific data points on hover or click, without cluttering the main visualization." },
      { id: 6, question: "When visualizing time-series data, which chart type is most effective for showing trends over a continuous time period?", options: ["Bar Chart", "Radar Chart", "Line Chart", "Pie Chart"], correctAnswer: 2, explanation: "Line charts connect data points along a time axis, making trends, growth rates, and patterns over continuous time periods immediately visible." },
      { id: 7, question: "What is the primary advantage of using a logarithmic scale on a chart axis?", options: ["It makes all values appear equal.", "It helps visualize data spanning multiple orders of magnitude, where both small and large values need to be compared.", "It automatically normalizes data to a 0-100 range.", "It removes outliers from the dataset before rendering."], correctAnswer: 1, explanation: "A logarithmic scale compresses large ranges, allowing meaningful comparison of data points that span many orders of magnitude (e.g., from 1 to 1,000,000)." },
      { id: 8, question: "In dashboard design, what is the 'above the fold' principle?", options: ["All charts must be folded/collapsed by default and expanded on click.", "The most critical KPIs and charts should be visible without scrolling when the dashboard first loads.", "Charts should use folded card components with hidden legends.", "Dashboard data should be paginated into multiple folds for performance."], correctAnswer: 1, explanation: "'Above the fold' means placing the most important information within the initially visible viewport so users see key metrics immediately without needing to scroll." },
      { id: 9, question: "Which React hook is most commonly used to trigger a data refetch when a chart's filter or date range changes?", options: ["useRef", "useMemo", "useEffect", "useReducer"], correctAnswer: 2, explanation: "useEffect with a dependency array containing the filter values will automatically re-run the fetch logic whenever those values change, keeping the chart in sync." },
      { id: 10, question: "What does 'chart junk' refer to in data visualization design?", options: ["Invalid or corrupted data points that cause rendering errors.", "Visual elements that add complexity without conveying useful data, such as excessive gridlines, 3D effects, and decorative graphics.", "Outdated chart libraries that are no longer maintained.", "Charts that load slowly due to unoptimized data queries."], correctAnswer: 1, explanation: "Chart junk (coined by Edward Tufte) refers to unnecessary visual elements — decorations, excessive gridlines, 3D effects — that obscure the data rather than clarifying it." }
    ]
  },
  {
    id: "q-seo",
    courseId: "seo-marketing",
    courseTitle: "SEO Optimization & Search Engine Algorithms",
    durationSeconds: 600,
    questions: [
      { id: 1, question: "What does 'crawling' mean in the context of how search engines like Google process the web?", options: ["Compressing web pages for faster delivery via CDN.", "Automatically discovering and downloading web pages by following links across the internet.", "Ranking web pages based on their relevance to a search query.", "Rendering JavaScript on the server before indexing."], correctAnswer: 1, explanation: "Crawling is the process where search engine bots (like Googlebot) systematically browse the web by following links to discover new and updated pages." },
      { id: 2, question: "Which HTTP meta tag instructs search engine crawlers not to index a specific page?", options: ["<meta name='robots' content='nofollow'>", "<meta name='robots' content='noindex'>", "<meta name='googlebot' content='nocrawl'>", "<meta http-equiv='X-Robots' content='none'>"], correctAnswer: 1, explanation: "<meta name='robots' content='noindex'> tells search engine crawlers not to include this specific page in their search index." },
      { id: 3, question: "What are Core Web Vitals, and which three metrics do they currently measure?", options: ["Google's set of performance metrics measuring LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift).", "PageSpeed Insights scores measuring Time to First Byte, DNS resolution, and SSL handshake time.", "Lighthouse audit scores measuring Performance, Accessibility, and Best Practices.", "Server-side metrics measuring CPU usage, memory footprint, and database query time."], correctAnswer: 0, explanation: "Core Web Vitals are Google's real-world, user-centric metrics: LCP measures loading performance, FID measures interactivity, and CLS measures visual stability." },
      { id: 4, question: "In SEO, what is the purpose of a 'canonical tag' (<link rel='canonical'>)?", options: ["To speed up page loading by pre-loading critical resources.", "To tell search engines which is the preferred (master) version of a page when duplicate or similar content exists at multiple URLs.", "To create a breadcrumb navigation trail for search result rich snippets.", "To declare the language and region of a page for international SEO."], correctAnswer: 1, explanation: "A canonical tag consolidates ranking signals by pointing search engines to the definitive version of a page, preventing duplicate content penalties." },
      { id: 5, question: "What is structured data (Schema.org markup) primarily used for in technical SEO?", options: ["To compress JSON API responses sent between server and client.", "To provide search engines with explicit, machine-readable information about page content, enabling rich results in SERPs.", "To define the database schema for storing SEO audit logs.", "To speed up JavaScript execution by pre-parsing script dependencies."], correctAnswer: 1, explanation: "Schema.org structured data (often via JSON-LD) tells search engines exactly what your content represents (e.g., a Product, Recipe, Event), enabling rich results like star ratings and FAQs." },
      { id: 6, question: "What does 'keyword cannibalization' mean in SEO?", options: ["When two competitors rank for the same keyword on the same SERP page.", "When multiple pages on the same website compete with each other for the same keyword, diluting ranking signals.", "When a keyword becomes too popular and loses its search traffic value.", "When a website uses the same keyword too many times on a single page (keyword stuffing)."], correctAnswer: 1, explanation: "Keyword cannibalization occurs when multiple pages on your own site target the same keyword, splitting authority and confusing search engines about which page to rank." },
      { id: 7, question: "Which Google Search Console report helps you identify which queries users type to find your site and the pages that appear for those queries?", options: ["Coverage Report", "Performance Report (Search Results)", "Core Web Vitals Report", "Links Report"], correctAnswer: 1, explanation: "The Performance Report in Google Search Console shows impressions, clicks, CTR, and average position for the search queries driving traffic to your pages." },
      { id: 8, question: "What is the key difference between 'on-page SEO' and 'off-page SEO'?", options: ["On-page SEO refers to paid ads; off-page SEO refers to organic strategies.", "On-page SEO involves optimizing elements within your own website (content, meta tags, HTML); off-page SEO involves external signals like backlinks and social mentions.", "On-page SEO is for desktop; off-page SEO is for mobile optimization.", "On-page SEO is measured by Google Analytics; off-page SEO is measured by Search Console."], correctAnswer: 1, explanation: "On-page SEO is everything you control on your own site (content, title tags, internal links). Off-page SEO refers to external authority signals, primarily backlinks from other domains." },
      { id: 9, question: "What is 'LCP' (Largest Contentful Paint) and what is Google's recommended threshold for a 'good' score?", options: ["The time for the largest image or text block to render; good = under 2.5 seconds.", "The delay before the first user interaction is processed; good = under 100ms.", "The total shift of page layout after initial load; good = under 0.1.", "The time to first byte from the server; good = under 600ms."], correctAnswer: 0, explanation: "LCP measures how long it takes for the largest visible content element to render in the viewport. Google considers under 2.5 seconds as 'Good' for LCP." },
      { id: 10, question: "Why is HTTPS (SSL/TLS) important for SEO beyond just security?", options: ["HTTPS has no impact on SEO; only content quality matters.", "Google uses HTTPS as a confirmed ranking signal, and browsers mark HTTP sites as 'Not Secure', which increases bounce rates and hurts user trust signals.", "HTTPS only matters for e-commerce pages that handle payment data.", "HTTPS speeds up page load times by compressing all HTTP responses."], correctAnswer: 1, explanation: "Google confirmed HTTPS as a ranking signal in 2014. Additionally, browsers display 'Not Secure' warnings on HTTP pages, degrading user trust and increasing bounce rates which negatively affect rankings." }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SkillX";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await Course.deleteMany();
    await Quiz.deleteMany();
    console.log("Cleared Course and Quiz catalogs.");

    // Insert seeds
    await Course.insertMany(seedCourses);
    await Quiz.insertMany(seedQuizzes);
    console.log("Database seeded successfully with courses and quizzes!");

    process.exit(0);
  } catch (error) {
    console.error("Seeder failure:", error);
    process.exit(1);
  }
};

seedDatabase();
