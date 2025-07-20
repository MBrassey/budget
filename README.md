# Budget Terminal

A terminal-style budget management application built with Next.js and TypeScript.

## Features

### Core Functionality
- Monthly income tracking
- Expense management with categories, colors, and drag-and-drop reordering
- Goal tracking with progress visualization and completion system
- Real-time financial calculations (monthly free income, quarterly/annual projections)
- Local storage persistence for data
- Import/export functionality for budget data (JSON format)

### Interface
- Terminal/hacker aesthetic with green-on-black color scheme
- JetBrains Mono monospace font throughout
- Real-time clock display with user IP detection
- Custom background image upload capability
- Responsive design for mobile and desktop
- Drag-and-drop reordering for expenses and goals
- Modal dialogs for editing items

### Data Management
- Automatic position tracking for custom ordering
- Completed goals archive system
- Data validation and error handling
- Background image caching with localStorage
- Graceful fallback for missing dependencies

## Libraries

### Core Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### UI Components
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless component primitives (minimal set):
  - Badge, Button, Card, Dialog, Input, Label, Tabs, Textarea
- **Lucide React 0.454.0** - Icon library
- **class-variance-authority** - Component styling variants
- **tailwind-merge** - Conditional class merging
- **tailwindcss-animate** - Animation utilities

### Additional Features
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **date-fns** - Date manipulation

Note: Project has been optimized to include only essential dependencies and components actually used by the application.

## Architecture

```
app/
├── globals.css          # Global styles and terminal theme
├── layout.tsx           # Root layout with metadata
└── page.tsx             # Main application component

components/ui/           # Essential UI components (8 total)
├── badge.tsx           # Category badges
├── button.tsx          # Interactive buttons
├── card.tsx            # Content containers
├── dialog.tsx          # Modal dialogs
├── input.tsx           # Form inputs
├── label.tsx           # Form labels
├── tabs.tsx            # Tab navigation
└── textarea.tsx        # Text areas

hooks/
├── use-mobile.tsx      # Mobile detection
└── use-toast.ts        # Toast notifications

lib/
└── utils.ts            # Utility functions

public/
├── favicon.ico         # Generated terminal favicon
├── favicon.svg         # Vector terminal favicon
└── bg_image.jpg        # Default background image

scripts/
├── generate-favicon.js # Dynamic favicon generation
└── cache-bust-favicon.js # Cache busting utility
```

## Data Structure

### Expense Object
```typescript
interface Expense {
  id: string
  label: string
  amount: number
  color: string          // Terminal color from predefined palette
  category: string
  position: number       // For drag-and-drop ordering
}
```

### Goal Object
```typescript
interface Goal {
  id: string
  label: string
  targetAmount: number
  currentAmount: number
  color: string
  description: string
  position: number
  completedDate?: string // ISO string when goal completed
}
```

### Budget Data
```typescript
interface BudgetData {
  monthlyIncome: number
  expenses: Expense[]
  goals: Goal[]
  completedGoals: Goal[] // Archive of completed goals
}
```

## Terminal Color Palette

The application uses a predefined set of terminal colors:
- `#00FF00` (Bright Green) - Primary accent
- `#00FFFF` (Cyan) - Secondary accent  
- `#FFFF00` (Yellow) - Warnings/highlights
- `#FF00FF` (Magenta) - Alternative accent
- `#FF6600` (Orange) - Status indicators
- Additional colors for variety in expenses/goals

## Build Commands

```bash
npm run dev     # Development server (auto-generates new favicon)
npm run build   # Production build (auto-generates new favicon)
npm run start   # Production server
npm run lint    # ESLint check
npm run favicon # Generate new favicon manually
```

## Dynamic Favicon System

The application generates a unique favicon on each build with:

### Build-Time Variations
- **Random cursor positioning** - Cursor appears in different terminal locations
- **Color variations** - Accent colors randomly selected from terminal palette
- **Border intensity** - Green glow opacity varies per build
- **Grid opacity** - Subtle terminal grid pattern changes
- **Dollar sign rotation** - Slight rotation based on build date

### Automatic Generation
- **prebuild/predev hooks** - New favicon created before each build/dev session
- **Consistent daily builds** - Same-day builds share some characteristics
- **Terminal aesthetic maintained** - Always preserves core terminal styling
- **Multiple formats** - Generates both SVG (animated) and ICO (static) versions

## Browser Features

- Dynamic favicon with terminal window and animated cursor
- Build-specific visual variations while maintaining brand consistency
- Responsive design adapts to mobile touch interactions
- Local storage automatically saves all user data
- File upload for data import and background images
- Real-time calculations update as data changes 