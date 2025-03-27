
# Famacle Application Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Key Components](#key-components)
5. [Authentication](#authentication)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Data Models](#data-models)
9. [Common Issues & Debugging](#common-issues--debugging)
10. [Deployment](#deployment)

## Application Overview

Famacle is a co-parenting management application designed to help separated parents coordinate their children's schedules, expenses, and communications. The application provides features such as:

- Calendar and scheduling for children's activities
- Expense tracking and sharing
- Secure messaging between co-parents
- User management with children and co-parent relationships
- Notifications for important updates

## Tech Stack

- **Frontend**: React 18.x with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Form Handling**: React Hook Form

## Project Structure

The project follows a feature-based structure with shared components and utilities:

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components from shadcn/ui
│   ├── auth/           # Authentication components
│   ├── calendar/       # Calendar and event components
│   ├── expenses/       # Expense management components
│   ├── communication/  # Messaging components
│   └── dashboard/      # Dashboard components
├── hooks/              # Custom React hooks
│   ├── expenses/       # Expense-related hooks
│   ├── useAuth.tsx     # Authentication hook
│   └── useCalendarEvents.tsx # Calendar events hook
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client configuration
├── lib/                # Utility functions and API clients
│   └── api/            # API modules for different features
├── pages/              # Application pages/routes
├── utils/              # Utility functions and types
└── App.tsx             # Main application component
```

## Key Components

### UI Components

The application uses shadcn/ui, a component library built on top of Tailwind CSS and Radix UI. These components are imported from `@/components/ui/` and include:

- `Button`: Standard button component with various styles
- `Card`: Card container with header, content, and footer sections
- `Dialog`: Modal dialog component
- `Dropdown`: Dropdown menu component
- `Input`: Text input component
- `Tabs`: Tab navigation component

### Feature Components

- **Calendar**: 
  - `MonthView`: Monthly calendar display
  - `WeekView`: Weekly calendar display
  - `AddEventCard`: Component for adding new events
  
- **Expenses**:
  - `ExpenseCard`: Display an individual expense
  - `ExpenseFilters`: Filter expenses by various criteria
  - `ExpenseForm`: Create or edit expenses
  
- **Authentication**:
  - `SignInForm`: User login form
  - `SignUpForm`: User registration form
  - `VerifyEmailForm`: Email verification form

## Authentication

Authentication is handled through Supabase's authentication service. The key components are:

### useAuth Hook

Located in `src/hooks/useAuth.tsx`, this hook provides:

- Authentication state (`user`, `isLoading`, `error`)
- Authentication methods (`signIn`, `signUp`, `signOut`)
- Session management

### Authentication Flow

1. **Sign Up**: Collects user information and creates an account using Supabase Auth
2. **Email Verification**: Sends a verification email (optional, can be disabled in Supabase)
3. **Sign In**: Authenticates users with email/password
4. **Session Management**: Handles token refresh automatically

## State Management

The application uses React Query (TanStack Query) for server state management and local React state for UI state.

### React Query

React Query is used for:

- Data fetching (expenses, events, messages)
- Mutations (create, update, delete operations)
- Caching and automatic refetching
- Optimistic updates

Key query hooks:

- `useExpenseQueries`: Fetch and filter expenses
- `useCalendarEvents`: Manage calendar events
- `useNotifications`: Fetch user notifications

### Real-time Updates

Supabase's real-time capabilities are used to subscribe to data changes:

- `useMessageSubscription`: Subscribes to new messages
- `useExpenseSubscription`: Subscribes to expense updates
- `useCalendarEvents`: Includes subscription to event changes

## API Integration

The application uses a service layer pattern to abstract API calls from components:

### API Modules

Located in `src/lib/api/`:

- `auth.ts`: Authentication operations
- `events.ts`: Calendar event operations
- `expenses.ts`: Expense management operations

Each module provides methods to interact with the Supabase backend, keeping the components database-agnostic.

## Data Models

The main data models are defined in `src/utils/types.ts`:

- `Parent`: Represents a parent user
- `Child`: Represents a child with parent relationships
- `Event`: Calendar event with details and reminders
- `Expense`: Shared expense with amount, category, and split information
- `Message`: Communication between co-parents
- `Notification`: System notifications for various events
- `UserProfile`: User profile information

## Common Issues & Debugging

### Authentication Issues

**Issue**: User not authenticated after page refresh
- **Check**: Ensure Supabase session persistence is working correctly
- **Solution**: Verify that `onAuthStateChange` is set up in the `useAuth` hook

**Issue**: Redirect loops in authenticated routes
- **Check**: Ensure the authentication check in route guards is working properly
- **Solution**: Add proper loading states while checking authentication

### Data Fetching Issues

**Issue**: Data not appearing or updating
- **Check**: Open browser console for React Query errors
- **Solution**: Verify query keys are consistent and check Supabase RLS policies

**Issue**: Incorrect or missing data
- **Check**: Ensure the component is passing the correct parameters to the query hooks
- **Solution**: Add console logs to trace data flow and identify where the issue occurs

### Real-time Updates Issues

**Issue**: Real-time updates not working
- **Check**: Verify Supabase channel subscriptions in the browser console
- **Solution**: Ensure the subscription is correctly set up with proper filter conditions

### Styling Issues

**Issue**: UI components not appearing as expected
- **Check**: Inspect element to verify Tailwind classes are applied correctly
- **Solution**: Check for conflicting class names or missing shadcn/ui component props

### Performance Issues

**Issue**: Slow page loads or interactions
- **Check**: Use React DevTools Profiler to identify slow components
- **Solution**: Optimize React Query configurations, add proper memoization to heavy components

## Debugging Tools

### Console Logging

Use strategic console logging to trace data flow:

```typescript
console.log('Component render:', { props, state });
console.log('Before API call:', { params });
console.log('API response:', data);
```

### React DevTools

Use React DevTools to:
- Inspect component props and state
- Profile component rendering performance
- Track component re-renders

### React Query DevTools

If enabled, React Query DevTools provide visibility into:
- Active queries and their status
- Query cache contents
- Query timing information

### Supabase Dashboard

Use the Supabase dashboard to:
- Check database tables and contents
- View and test RLS policies
- Monitor real-time events
- View authentication logs

## Deployment

The application can be deployed through various methods:

### Environment Configuration

Ensure the following environment variables are properly set:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase public API key

### Build Process

To build the application for production:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Preview the production build locally
npm run preview
```

### Deployment Platforms

The application can be deployed to:

- **Netlify**: Connect repository or upload build folder
- **Vercel**: Connect repository for automatic deployment
- **Firebase Hosting**: Deploy using the Firebase CLI
- **GitHub Pages**: Deploy static assets

### Post-Deployment Checks

After deployment, verify:

1. Authentication flows work correctly
2. API calls are successful
3. Real-time updates function as expected
4. All routes are accessible
5. Mobile responsiveness

## Common Edge Cases to Test

1. **Authentication Flow**:
   - Sign up with new email
   - Sign in with existing account
   - Password reset flow
   - Session persistence after refresh

2. **Data Operations**:
   - Creating, updating, and deleting events and expenses
   - Filtering data with various criteria
   - Handling empty states when no data exists

3. **Co-parent Interactions**:
   - Inviting new co-parents
   - Accepting/rejecting invitations
   - Communication between co-parents

4. **Real-time Features**:
   - Multiple users interacting simultaneously
   - Offline behavior and reconnection

5. **Form Validation**:
   - Input validation for all forms
   - Error handling for form submissions
   - Edge cases for date inputs and numerical values

## Supabase Database Schema

The application uses the following tables in Supabase:

1. **profiles**: User profiles with personal information
2. **children**: Children details
3. **parent_children**: Linking table between parents and children
4. **events**: Calendar events
5. **expenses**: Shared expenses
6. **messages**: Communication between co-parents
7. **conversations**: Grouping for messages
8. **notifications**: System notifications

### Row Level Security (RLS)

All tables should have appropriate RLS policies to ensure:

- Users can only access their own data
- Co-parents can access shared data
- Proper authorization for all operations

### Database Triggers

The application relies on several database triggers:

- Automatic profile creation when a user signs up
- Updated timestamps for modified records
- Notification generation for certain events

## Conclusion

This documentation provides a comprehensive overview of the Famacle application architecture, key components, and potential issues. When implementing updates or debugging, refer to the specific sections related to the feature you're working on and follow the recommended debugging approaches.

For further assistance, consult the specific component documentation or reach out to the development team.
