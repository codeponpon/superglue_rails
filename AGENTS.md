# AGENTS.md - Project Context for AI Assistants

## Project Overview

This is a **Ruby on Rails 8.0** application using the **Superglue gem** for seamless server-side rendering with React frontend. The project appears to be a **freelance time tracking and project management application** with authentication, project management, and dashboard functionality.

## Technology Stack

### Backend

- **Ruby on Rails 8.0.2+** - Main framework
- **SQLite3** - Database (development/test)
- **Superglue 2.0.0.alpha.8** - Server-side rendering with React
- **Puma** - Web server
- **Solid Cache/Queue/Cable** - Rails 8 solid gems for caching, background jobs, and WebSockets
- **BCrypt** - Password hashing
- **Pagy** - Pagination
- **Vite Rails** - Asset pipeline

### Frontend

- **React 19.1.1** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS 4.1.13** - Styling
- **ApexCharts** - Data visualization
- **Lucide React** - Icons
- **Vite** - Build tool

## Project Structure

### Key Directories

```
app/
├── controllers/          # Rails controllers
├── models/              # ActiveRecord models
├── views/               # Superglue React components (.tsx)
├── frontend/            # Frontend assets and components
│   ├── components/      # Reusable React components
│   ├── slices/          # Redux slices
│   └── store.ts         # Redux store configuration
└── assets/              # Static assets

config/
├── routes.rb            # Rails routing
├── initializers/        # Rails configuration
└── environments/        # Environment-specific configs

db/
├── schema.rb            # Database schema
└── migrate/             # Database migrations
```

## Database Schema

### Models and Relationships

- **User** (`users` table)

  - `email_address` (unique, normalized)
  - `password_digest` (BCrypt hashed)
  - `has_many :sessions`
  - `has_secure_password`

- **Session** (`sessions` table)

  - `user_id` (foreign key)
  - `ip_address`, `user_agent`
  - `belongs_to :user`

- **Project** (`projects` table)

  - `name`, `description`, `slug`
  - `has_many :tasks`
  - `accepts_nested_attributes_for :tasks`
  - Search functionality with `Project.search(query)`

- **Task** (`tasks` table)
  - `project_id` (foreign key)
  - `title`, `description`, `alloted_time`
  - `belongs_to :project`

## Authentication System

### Session Management

- Custom session-based authentication (not Devise)
- Rate limiting on login attempts (10 attempts per 3 minutes)
- Session tracking with IP and User-Agent
- Password reset functionality via `PasswordsController`

### Controllers

- `SessionsController` - Login/logout
- `PasswordsController` - Password reset
- `ApplicationController` - Base controller with auth concerns

## Superglue Integration

### How It Works

1. **Server-side rendering**: Rails controllers render `.json.props` files
2. **Props templates**: Data is serialized to JSON props
3. **React hydration**: Frontend React components receive props via `useContent()`
4. **Page mapping**: Automatic mapping between routes and React components
5. **Navigation**: `data-sg-visit` and `data-sg-remote` attributes for SPA-like navigation

### Key Files

- `app/views/application/superglue.html.erb` - Main layout with Superglue setup
- `app/frontend/application.jsx` - React app initialization
- `app/frontend/page_to_page_mapping.ts` - Route to component mapping
- `app/frontend/store.ts` - Redux store with Superglue integration

### Props Templates

- Located in `app/views/*/` directories
- `.json.props` files define data structure
- `.tsx` files are React components that consume the props

## Frontend Architecture

### State Management

- **Redux Toolkit** with multiple slices:
  - `superglue` - Superglue navigation state
  - `fragments` - Fragment caching
  - `pages` - Page state
  - `flash` - Flash messages
  - `user` - User authentication state
  - `pomodoro` - Pomodoro timer functionality

### Component Structure

- **Layouts**: `AppLayout` for consistent page structure
- **UI Components**: Reusable components in `frontend/components/ui/`
- **Forms**: Custom form components with validation
- **Navigation**: Pagination, links with Superglue integration
- **Charts**: ApexCharts integration for data visualization

### Styling

- **Tailwind CSS 4.1.13** for utility-first styling
- **Tailwind Variants** for component variants
- **Tailwind Merge** for conditional classes

## Project Pages

### Projects Index (`/projects`)

- **Purpose**: List all projects with pagination
- **Features**: Search functionality, pagination, "New Project" button
- **Data**: Projects list, pagination metadata, new project path
- **Component**: `ProjectsIndex` in `app/views/projects/index.tsx`

### Project Show (`/projects/:id`)

- **Purpose**: Display individual project details and tasks
- **Features**: Project information, task listing, edit/delete actions, time tracking
- **Data**: Project details, tasks array, action paths
- **Component**: `ProjectsShow` in `app/views/projects/show.tsx`
- **Special**: Time formatting, task management, confirmation dialogs

### Project New (`/projects/new`)

- **Purpose**: Create new projects with tasks
- **Features**: Project form, dynamic task addition, nested attributes
- **Data**: Form structure, validation errors, task templates
- **Component**: `ProjectsNew` in `app/views/projects/new.tsx`
- **Special**: AJAX task addition via `add_task` endpoint

### Project Edit (`/projects/:id/edit`)

- **Purpose**: Edit existing projects and manage tasks
- **Features**: Pre-populated form, task management, add/remove tasks
- **Data**: Project data, existing tasks, form structure
- **Component**: `ProjectsEdit` in `app/views/projects/edit.tsx`
- **Special**: Task state management (mark for deletion vs. remove), dynamic reindexing

## Key Features

### 1. Project Management

- **CRUD Operations**: Full create, read, update, delete functionality for projects
- **Project Details**: Individual project view with task listing and time tracking
- **Project Editing**: Edit project details and manage tasks (add/remove/update)
- **Nested Tasks**: Create and manage tasks within projects
- **Project Search**: Search functionality across project names
- **Pagination**: Paginated project lists for better performance
- **Task Management**: Add/remove tasks dynamically with AJAX
- **Time Tracking**: Track allotted time per task and total project time

### 2. Dashboard

- Time tracking statistics
- Project time allocation
- Earnings over time charts
- Recent activity feed
- Daily hours tracking

### 3. Authentication

- Email/password login
- Session management
- Password reset functionality
- Rate limiting protection

### 4. Pomodoro Timer

- Redux slice for timer state
- SVG assets for timer UI
- Time tracking integration

## Development Workflow

### Running the Application

```bash
# Start the development server by execute the Procfile.dev
bin/dev

# Or separately:
bin/rails server
bin/vite
```

### Key Commands

- `bin/rails` - Rails CLI
- `bin/vite` - Vite development server
- `bin/setup` - Initial setup
- `bin/brakeman` - Security analysis
- `bin/rubocop` - Code linting

### File Naming Conventions

- **Controllers**: `snake_case` (e.g., `projects_controller.rb`)
- **Models**: `PascalCase` (e.g., `Project`)
- **React Components**: `PascalCase` (e.g., `ProjectsIndex`)
- **Props Templates**: `snake_case.json.props`
- **Routes**: RESTful conventions

## API Patterns

### Controller Actions

- **Standard RESTful actions**: index, new, create, show, edit, update, destroy
- **Props rendering**: Superglue integration with JSON props templates
- **Flash message handling**: Success/error notifications
- **Form validation**: Error handling with validation messages
- **AJAX endpoints**: Dynamic task addition via `add_task` action
- **Nested attributes**: Support for tasks within projects
- **Authentication**: Public access for project viewing, editing

### Props Template Structure

```ruby
# Example: app/views/projects/index.json.props
json.projects @projects do |project|
  json.id project.id
  json.name project.name
  json.description project.description
  json.url project_path(project)
end
json.newProjectPath new_project_path
json.pagination pagy_metadata(@pagy)

# Example: app/views/projects/show.json.props
json.project do
  json.id @project.id
  json.name @project.name
  json.description @project.description
  json.slug @project.slug
  json.created_at @project.created_at
  json.updated_at @project.updated_at
  json.tasks @project.tasks
  json.edit_path edit_project_path(@project)
  json.delete_path project_path(@project)
  json.back_path projects_path
end

# Example: app/views/projects/edit.json.props
json.edit_project_form do
  form_props(model: @project) do |f|
    f.hidden_field :id
    f.text_field :name
    f.text_area :description
    f.fields_for :tasks do |task_form|
      task_form.hidden_field :id
      task_form.text_field :title
      task_form.number_field :allotted_time
    end
    f.submit
  end
  json.errors @project.errors.to_hash(true)
end
json.tasks @project.tasks
json.project do
  json.id @project.id
  json.name @project.name
  json.description @project.description
  json.slug @project.slug
end
```

### React Component Pattern

```tsx
// Example: app/views/projects/index.tsx
export default function ProjectsIndex() {
  const { projects, newProjectPath, pagination } =
    useContent<ProjectsPageContent>();

  return <AppLayout>{/* Component JSX */}</AppLayout>;
}

// Example: app/views/projects/show.tsx
export default function ProjectsShow() {
  const { project } = useContent<ProjectShowContent>();
  const { tasks } = project;

  return <AppLayout>{/* Project details and task listing */}</AppLayout>;
}

// Example: app/views/projects/edit.tsx
export default function ProjectsEdit() {
  const { edit_project_form, project, tasks } =
    useContent<ProjectEditContent>();
  const { form, extras, inputs, errors } = edit_project_form;

  return <AppLayout>{/* Edit form with dynamic task management */}</AppLayout>;
}
```

## Common Patterns

### Navigation

- Use `data-sg-visit` for page navigation
- Use `data-sg-remote` for AJAX requests
- Links automatically work with Superglue

### Forms

- **Rails form helpers**: Superglue integration with `form_props`
- **Custom form components**: Reusable form components with validation
- **Nested attributes**: Support for tasks within projects
- **Dynamic task management**: Add/remove tasks with AJAX
- **Form validation**: Real-time validation with error display
- **Task state management**: Mark tasks for deletion vs. immediate removal

### State Management

- Use `useContent()` hook to access page props
- Redux slices for global state
- Superglue handles navigation state automatically

## Development Notes

### Superglue Specifics

- Always use `.tsx` extension for React components in views
- Props templates must match the data structure expected by React components
- Use `useContent<T>()` hook with proper TypeScript interfaces
- Page mapping is automatic via glob patterns

### Rails Conventions

- Follow Rails naming conventions
- Use strong parameters for form handling
- Implement proper error handling and flash messages
- Use Rails helpers for form generation

### Frontend Best Practices

- **TypeScript interfaces**: Comprehensive type definitions for all data structures
- **Reusable components**: Modular components in `frontend/components/`
- **Consistent styling**: Tailwind CSS utility classes
- **Proper Redux state management**: Organized slices and store configuration
- **Form state management**: Local state for dynamic form interactions
- **AJAX integration**: Proper error handling and loading states

### TypeScript Interfaces

The project uses comprehensive TypeScript interfaces for type safety:

```typescript
// Project-related interfaces
interface Project {
  id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

interface Task {
  id: number;
  title: string;
  allotted_time: number;
  created_at: string;
  updated_at: string;
}

// Form-related interfaces
interface FormData {
  action: string;
  method: string;
  authenticity_token: string;
}

interface TaskInput {
  id: number;
  title: InputData;
  allottedTime: InputData;
  taskId?: number;
  _destroy?: boolean;
  formIndex: number;
}
```

## Deployment

- **Kamal** for deployment configuration
- **Docker** support with Dockerfile
- **Thruster** for HTTP asset caching and compression
- Environment-specific configurations in `config/environments/`

This project demonstrates a modern Rails application with a React frontend, showcasing the power of Superglue for creating seamless server-side rendered applications with client-side interactivity.
