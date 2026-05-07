export type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrls?: string[];
  transcript: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
};

export type UserProgress = {
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
};

export type User = {
  id: string;
  email: string;
  enrolledCourses: string[];
  progress: UserProgress[];
};

export const mockCourses: Course[] = [
  {
    id: "react-101",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, hooks, and state management. Perfect for beginners looking to build interactive web applications.",
    modules: [
      {
        id: "module-1",
        title: "Getting Started",
        lessons: [
          {
            id: "lesson-1",
            title: "What is React?",
            content: `React is a JavaScript library for building user interfaces with reusable components. It uses a virtual DOM to efficiently update the UI. React makes it easy to create interactive, dynamic web applications with a declarative programming style.

Key concepts:
- Components are reusable pieces of UI
- State manages data that can change
- Props pass data between components
- JSX allows you to write HTML-like syntax in JavaScript

React has become the industry standard for building modern web applications because of its simplicity, flexibility, and strong ecosystem.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `Welcome to the first lesson of React Fundamentals. In this video, we'll explore what React is and why it's become so popular in web development.

React is a JavaScript library created by Facebook for building user interfaces. It focuses on component-based architecture, which means you build your UI by combining small, reusable pieces called components.

The main advantage of React is its virtual DOM. Instead of directly manipulating the real DOM, which can be slow, React maintains a virtual representation and only updates the parts that have changed. This makes React applications very performant.

React uses something called JSX, which lets you write code that looks like HTML inside JavaScript. This makes it very intuitive for developers.

In the next lessons, we'll dive deeper into components, hooks, and how to manage state effectively.`
          },
          {
            id: "lesson-2",
            title: "Components & JSX",
            content: `Components are the building blocks of React applications. There are two types of components: functional and class components. Modern React development uses functional components with hooks.

JSX is a syntax extension that lets you write HTML-like code in JavaScript. It gets compiled to JavaScript function calls.

Example of a functional component:
\`\`\`
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

Components can accept props (properties) as input and return JSX that describes how the UI should look.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `Now let's understand React components and JSX. A component is a JavaScript function that returns JSX.

JSX looks like HTML but it's actually JavaScript. When you write JSX, React transforms it into JavaScript function calls under the hood.

You can pass data to components through props. Props are like function parameters for components. This allows you to make your components reusable and flexible.

Components can be composed together to build complex UIs from simple, manageable pieces.`
          }
        ]
      },
      {
        id: "module-2",
        title: "Hooks & State",
        lessons: [
          {
            id: "lesson-3",
            title: "useState Hook",
            content: `The useState hook is the most important hook in React. It lets you add state to functional components.

\`\`\`
const [count, setCount] = useState(0);
\`\`\`

The useState function returns an array with two elements:
1. The current state value
2. A function to update that value

When you call the setter function, React will re-render the component with the new state.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `The useState hook is fundamental to React. It allows functional components to have state, which is data that can change over time.

When you call useState, you pass in the initial value. It returns the current value and a function to update it.

Every time you call the setter function, React marks the component for re-rendering, and the component function is called again with the new state value.

Understanding state is crucial for building interactive applications.`
          },
          {
            id: "lesson-4",
            title: "useEffect Hook",
            content: `The useEffect hook lets you perform side effects in functional components. Side effects include fetching data, subscribing to events, and updating the DOM.

\`\`\`
useEffect(() => {
  // This runs after the component renders
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]);
\`\`\`

The dependency array controls when the effect runs. If it's empty, the effect runs once after the initial render.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `useEffect is used for handling side effects in React. Side effects are things that interact with the world outside your component.

The effect function runs after the component renders. You can provide a cleanup function that runs before the effect runs again or when the component unmounts.

The dependency array is crucial. It tells React which values the effect depends on. If any dependency changes, the effect runs again.`
          }
        ]
      }
    ]
  },
  {
    id: "web-design",
    title: "Modern Web Design",
    description: "Master modern web design principles including layout, typography, color theory, and responsive design. Create beautiful, user-friendly websites.",
    modules: [
      {
        id: "module-1",
        title: "Design Principles",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to Design",
            content: `Web design is the art and science of creating beautiful, functional websites. Good design is not just about aesthetics—it's about creating experiences that are intuitive and enjoyable for users.

Key principles:
- Clarity: Users should immediately understand your website
- Consistency: Maintain a cohesive design throughout
- Color: Use color strategically to guide attention
- Typography: Choose readable fonts and appropriate sizing
- Whitespace: Use empty space to create visual hierarchy
- Responsive: Design for all screen sizes`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `Welcome to Modern Web Design. In this course, we'll explore the principles and practices that make websites beautiful and functional.

Design is about more than making things look pretty. It's about creating experiences that serve your users effectively.

Throughout this course, we'll cover layout design, color theory, typography, and responsive design patterns that work across all devices.`
          }
        ]
      }
    ]
  },
  {
    id: "javascript-advanced",
    title: "Advanced JavaScript",
    description: "Deepen your JavaScript skills with closures, async programming, prototypes, and functional programming concepts. Build more efficient and maintainable code.",
    modules: [
      {
        id: "module-1",
        title: "Core Concepts",
        lessons: [
          {
            id: "lesson-1",
            title: "Closures",
            content: `A closure is a function that has access to variables from its outer scope, even after the outer function has returned.

\`\`\`
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
\`\`\`

Closures are powerful for creating private variables and function factories.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `Closures are one of the most important concepts in JavaScript. A closure allows inner functions to access variables from their outer scope.

This is possible because functions in JavaScript have access to the scope in which they were defined, not just the scope in which they are called.

Closures are essential for understanding how JavaScript works and for writing efficient code.`
          }
        ]
      }
    ]
  },
  {
    id: "ux-principles",
    title: "UX Design Principles",
    description: "Learn how to create user-centered experiences. Understand user research, wireframing, prototyping, and usability testing.",
    modules: [
      {
        id: "module-1",
        title: "Foundations",
        lessons: [
          {
            id: "lesson-1",
            title: "User Research",
            content: `User research is the foundation of good UX design. It involves studying your users to understand their needs, behaviors, and pain points.

Methods include:
- User interviews
- Surveys and questionnaires
- Usability testing
- Analytics review
- Competitor analysis

Understanding your users deeply leads to better design decisions.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `User research is critical for creating products that people actually want to use. Before you start designing, you need to understand who your users are and what problems they're trying to solve.`
          }
        ]
      }
    ]
  },
  {
    id: "css-mastery",
    title: "CSS Mastery",
    description: "Become a CSS expert. Learn Flexbox, Grid, animations, and responsive design techniques to create stunning, performant stylesheets.",
    modules: [
      {
        id: "module-1",
        title: "Layout Systems",
        lessons: [
          {
            id: "lesson-1",
            title: "Flexbox",
            content: `Flexbox is a one-dimensional layout system that makes it easy to create flexible, responsive layouts.

Key properties:
- display: flex - enables flexbox
- flex-direction - sets the direction of items
- justify-content - aligns items on the main axis
- align-items - aligns items on the cross axis
- flex - controls how items grow and shrink

Flexbox is perfect for navigation bars, card layouts, and alignment tasks.`,
            videoUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
            transcript: `Flexbox revolutionized CSS layout. It provides a simple, powerful way to create flexible layouts without floats or positioning hacks.

With Flexbox, you can easily create responsive layouts that adapt to different screen sizes.`
          }
        ]
      }
    ]
  }
];

export const mockUser: User = {
  id: "user-1",
  email: "student@example.com",
  enrolledCourses: ["react-101", "web-design"],
  progress: [
    {
      courseId: "react-101",
      completedLessonIds: ["lesson-1"],
      lastLessonId: "lesson-2"
    },
    {
      courseId: "web-design",
      completedLessonIds: [],
      lastLessonId: "lesson-1"
    },
    {
      courseId: "javascript-advanced",
      completedLessonIds: [],
      lastLessonId: "lesson-1"
    },
    {
      courseId: "ux-principles",
      completedLessonIds: [],
      lastLessonId: "lesson-1"
    },
    {
      courseId: "css-mastery",
      completedLessonIds: [],
      lastLessonId: "lesson-1"
    }
  ]
};
