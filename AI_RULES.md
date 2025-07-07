# AI Rules for Majlis e Dawatul Haq Task Management System

This document outlines the technical stack and guidelines for developing this application.

## Tech Stack Overview

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
*   **Vite:** A fast build tool that provides a lightning-fast development experience.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **React Router:** For declarative routing within the application.
*   **TanStack Query (React Query):** For data fetching, caching, synchronization, and server state management.
*   **React Hook Form & Zod:** For efficient form management and schema-based validation.
*   **Lucide React:** For a comprehensive set of customizable SVG icons.
*   **Recharts:** A composable charting library built on React components.
*   **Sonner:** A modern toast library for displaying notifications.

## Library Usage Guidelines

*   **UI Components:** Always prioritize using components from `shadcn/ui`. If a specific component is not available or doesn't meet requirements, create a new component following the existing styling conventions.
*   **Styling:** All styling must be done using **Tailwind CSS** classes. Avoid inline styles or separate CSS files unless absolutely necessary for global styles (e.g., `index.css`).
*   **Icons:** Use icons from the `lucide-react` library.
*   **Routing:** Use `react-router-dom` for all navigation and route management. Keep main routes in `src/App.tsx`.
*   **Data Management:** For server state and data fetching, use `@tanstack/react-query`.
*   **Forms & Validation:** Implement forms using `react-hook-form` and validate inputs using `zod` schemas.
*   **Notifications:** Use `sonner` for displaying general toasts (via the `<Sonner />` component in `App.tsx`) and the `useToast` hook from `src/hooks/use-toast.ts` for programmatic toasts within components.
*   **Charts:** Utilize `recharts` for all data visualization and charting needs.
*   **Date Handling:** Use `react-day-picker` for date selection and `date-fns` for date manipulation and formatting.
*   **Utility Functions:** For combining Tailwind CSS classes, use `clsx` and `tailwind-merge` via the `cn` utility function (`src/lib/utils.ts`).
*   **New Components/Hooks:** Always create new files for new components or hooks (e.g., `src/components/MyNewComponent.tsx`, `src/hooks/useMyNewHook.ts`). Do not add new components to existing files.
*   **File Structure:**
    *   Pages: `src/pages/`
    *   Components: `src/components/`
    *   Hooks: `src/hooks/`
    *   Utilities: `src/lib/` or `src/utils/`
*   **Responsiveness:** All designs must be responsive and mobile-first.
*   **Language:** The application primarily uses Urdu for user-facing text. Ensure all new UI elements and messages are translated appropriately.