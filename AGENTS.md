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

### Overview

**Superglue is The Rails Way of building React applications.** Refreshingly familiar. No APIs. No client-side routing. Batteries included.

Based on the [official Superglue documentation](https://thoughtbot.github.io/superglue/2.0.alpha/), Superglue is built from the ground up for **Rails developers** who want to use the concepts they already know — turbo streams, controllers, server-side routing, views, form helpers, and more — to create seamless, interactive React applications.

### Core Features

#### 1. **Super Turbo Streams**

- Turbo Streams ported for Superglue and React
- Use `broadcast_append_to` and more to easily update your UI
- Real-time updates without page refreshes
- WebSocket integration with ActionCable

#### 2. **Unobtrusive Javascript (UJS)**

- Bringing back a classic to make developing SPA features easy and familiar
- `data-sg-visit` for page navigation
- `data-sg-remote` for AJAX requests
- Surgical updates without full page reloads

#### 3. **Fragments**

- Giving Rails partials identity and super powers on the frontend
- Targeted updates using fragment identifiers
- Client-side optimistic updates
- Efficient partial rendering

#### 4. **Deferment**

- Easily defer any part of your page
- Great for modals, tabs, and more
- Lazy loading of components
- Performance optimization

#### 5. **props_template**

- A very fast JSON builder inspired by Jbuilder
- Shapes backend state efficiently
- The secret sauce that gives UJS superpowers
- Server-side data serialization

#### 6. **form_props**

- A `form_with` FormBuilder that lets you use Rails forms with React
- Familiar Rails form helpers
- Seamless integration with React components
- Built-in validation and error handling

#### 7. **candy_wrapper**

- Lightweight wrapper components around popular React UI libraries
- Made to work with FormProps
- Pre-built integrations with common UI libraries

#### 8. **humid**

- Server Side Rendering using MiniRacer and V8 isolates
- Fast SSR capabilities
- V8-powered rendering

### How It Works

1. **Server-side rendering**: Rails controllers render `.json.props` files
2. **Props templates**: Data is serialized to JSON props using `props_template`
3. **React hydration**: Frontend React components receive props via `useContent()`
4. **Page mapping**: Automatic mapping between routes and React components
5. **Navigation**: `data-sg-visit` and `data-sg-remote` attributes for SPA-like navigation
6. **Real-time updates**: Super Turbo Streams for live updates
7. **Fragment updates**: Targeted DOM updates using fragment identifiers

### Key Files

- `app/views/application/superglue.html.erb` - Main layout with Superglue setup
- `app/frontend/application.jsx` - React app initialization
- `app/frontend/page_to_page_mapping.ts` - Route to component mapping
- `app/frontend/store.ts` - Redux store with Superglue integration

### Props Templates

- Located in `app/views/*/` directories
- `.json.props` files define data structure using `props_template`
- `.tsx` files are React components that consume the props
- Fast JSON building inspired by Jbuilder
- Server-side data serialization

### Advanced Superglue Features

#### **Building State**

- **Shaping state**: Use `props_template` to structure backend data
- **Rails Forms / React UI kits**: Seamless integration with `form_props`
- **Shared data**: Global state management across components
- **Fragments**: Give partials identity and superpowers

#### **Updating**

- **Super Turbo Streams**: Real-time updates with `broadcast_*` methods
- **Client-Side updates**: Optimistic updates with `useSetFragment()`
- **Digging**: Targeted data access with `props_at` parameter
- **Deferments**: Lazy loading for performance
- **Redux**: State management integration

#### **Navigating**

- **The return of Rails UJS**: Familiar unobtrusive JavaScript patterns
- **Advanced requests**: Custom request handling
- **navigateTo**: Programmatic navigation

#### **Performance**

- **Efficient rendering**: Optimized React hydration
- **Lazy loading**: Deferment for better performance
- **Caching**: Smart fragment caching
- **Minimal re-renders**: Targeted updates only

#### **Security**

- **CSRF protection**: Built-in Rails security
- **XSS prevention**: Safe data serialization
- **Authentication**: Seamless auth integration

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

### 5. Real-time Updates with TurboStream

- **Live Project Updates**: Real-time project list updates across all open tabs
- **Dynamic Project Details**: Project name and description update in real-time
- **WebSocket Integration**: ActionCable for real-time communication
- **Fragment-based Streaming**: Targeted updates using Superglue fragments

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

### Superglue Recipes

Based on the [official Superglue recipes](https://thoughtbot.github.io/superglue/2.0.alpha/), here are common implementation patterns:

#### **Modals**

- Deferment-based modal implementation
- Lazy loading of modal content
- Seamless integration with React components

#### **Server Side Rendering**

- Using `humid` for V8-powered SSR
- Fast rendering with MiniRacer
- V8 isolates for performance

#### **Pagination without Reloading**

- `data-sg-remote` for pagination links
- Seamless page transitions
- Maintained state across pages

#### **Infinite Scroll**

- Deferment for lazy loading
- Performance-optimized scrolling
- Smooth user experience

#### **Progress Bars**

- Built-in progress indicators
- Request lifecycle integration
- Visual feedback for users

#### **Turbo Nav**

- SPA-like navigation
- History management
- Back/forward button support

#### **Vite Integration**

- Modern build tooling
- Fast development server
- Optimized asset pipeline

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

### Superglue Hooks and Utilities

Based on the [official Superglue reference](https://thoughtbot.github.io/superglue/2.0.alpha/), here are the key hooks and utilities:

#### **Core Hooks**

- **`useContent()`**: Access page props and data
- **`useStreamSource()`**: WebSocket streaming for real-time updates
- **`useSetFragment()`**: Client-side optimistic updates
- **`useNavigate()`**: Programmatic navigation
- **`useRemote()`**: AJAX request handling

#### **Rails Utilities**

- **`form_props()`**: Rails form builder for React
- **`props_template`**: Fast JSON building
- **`broadcast_*` methods**: Real-time broadcasting
- **`stream_from_props()`**: WebSocket subscription setup

#### **Navigation**

- **`data-sg-visit`**: Page navigation attributes
- **`data-sg-remote`**: AJAX request attributes
- **`navigateTo()`**: Programmatic navigation function
- **UJS integration**: Unobtrusive JavaScript patterns

#### **Types**

- **`ChannelNameWithParams`**: ActionCable channel types
- **`SaveResponse`**: Page state response types
- **`FormData`**: Form structure types
- **`FragmentData`**: Fragment update types

#### **Actions**

- **`visit`**: Page navigation action
- **`remote`**: AJAX request action
- **`setFragment`**: Fragment update action
- **`stream`**: WebSocket streaming action

## TurboStream Implementation

### Overview

The application uses **Superglue's TurboStream integration** for real-time updates without page refreshes. This combines ActionCable WebSockets with Superglue's fragment-based streaming system.

### Key Components

#### 1. **ActionCable Configuration**

```ruby
# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      set_current_user || allow_anonymous_connection
    end

    private
      def set_current_user
        if session = Session.find_by(id: cookies.signed[:session_id])
          self.current_user = session.user
        end
      end

      def allow_anonymous_connection
        # Allow anonymous connections for public pages like project show
        self.current_user = nil
      end
  end
end
```

#### 2. **Model Setup**

```ruby
# app/models/project.rb
class Project < ApplicationRecord
  include Superglue::Broadcastable
  # ... other model code
end
```

#### 3. **Controller Broadcasting**

```ruby
# app/controllers/projects_controller.rb
def update
  @project.update!(project_params)

  # Broadcast to projects list
  @project.broadcast_save_later_to(
    "projects",
    target: "project_#{@project.id}",
    partial: "projects/project"
  )

  # Broadcast to project show page
  @project.broadcast_save_later_to(
    "project_#{@project.id}",
    target: "project_details_#{@project.id}",
    partial: "projects/project_details",
    model: @project
  )

  respond_to do |format|
    format.html { redirect_to @project }
    format.json { render layout: "stream" }
  end
end
```

#### 4. **Props Template with Fragments**

```ruby
# app/views/projects/show.json.props
json.project(partial: ["project_details", locals: { project: @project }, fragment: "project_details_#{@project.id}"]) do
end

# Set up streaming subscription for project details
json.streamFromProject stream_from_props("project_#{@project.id}")
```

#### 5. **Fragment Partial**

```ruby
# app/views/projects/_project_details.json.props
json.id project.id
json.name project.name
json.description project.description
json.slug project.slug
json.created_at project.created_at
json.updated_at project.updated_at
json.timestamp Time.current.to_i
json.tasks do
  json.array! project.tasks.ordered do |task|
    json.id task.id
    json.title task.title
    json.allotted_time task.allotted_time
    json.position task.position
    json.created_at task.created_at
    json.updated_at task.updated_at
  end
end
json.edit_path edit_project_path(project)
json.delete_path project_path(project)
json.back_path projects_path
```

#### 6. **React Component with Streaming**

```tsx
// app/views/projects/show.tsx
import { useContent, useStreamSource } from "@thoughtbot/superglue";
import { ChannelNameWithParams } from "@rails/actioncable";

interface ProjectShowContent {
  project: {
    id: number;
    name: string;
    description: string;
    // ... other project fields
  };
  streamFromProject: string | ChannelNameWithParams;
}

export default function ProjectsShow() {
  const { project, streamFromProject } = useContent<ProjectShowContent>();
  const { connected } = useStreamSource(streamFromProject);

  return (
    <AppLayout>
      <div data-sg-fragment={`project_details_${project.id}`}>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {project.name} {connected ? "🟢" : "🔴"}
        </h1>
        <p className="text-gray-600 text-lg mb-6">{project.description}</p>
      </div>
    </AppLayout>
  );
}
```

#### 7. **Update Response Template**

```ruby
# app/views/projects/update.json.props
broadcast_save_props(
  model: @project,
  target: "project_#{@project.id}",
  partial: "projects/project"
)

broadcast_save_props(
  model: @project,
  target: "project_details_#{@project.id}",
  partial: "projects/project_details"
)
```

### How It Works

1. **Initial Load**: The show page loads with project data via the main props template
2. **Fragment Setup**: The `data-sg-fragment` attribute identifies the element to update
3. **WebSocket Connection**: `useStreamSource()` establishes a WebSocket connection
4. **Broadcast Trigger**: When project is updated, controller broadcasts to specific channels
5. **Fragment Update**: Superglue automatically updates the DOM element with new data
6. **Real-time Effect**: Changes appear instantly without page refresh

### Key Patterns

#### **Fragment Syntax**

- Use `partial: ["partial_name", locals: { variable: @variable }, fragment: "fragment_id"]`
- Fragment ID must match `data-sg-fragment` attribute in React component

#### **Broadcasting**

- Use `broadcast_save_later_to()` for updates
- Use `broadcast_append_later_to()` for new items
- Include `model:` parameter for partial data

#### **Streaming Setup**

- Use `stream_from_props("channel_name")` in props template
- Use `useStreamSource()` hook in React component
- Channel name should match broadcast target

#### **ActionCable Authentication**

- Allow anonymous connections for public pages
- Use `allow_anonymous_connection` method
- Set `current_user = nil` for anonymous users

### Benefits

- **Real-time Updates**: Changes appear instantly across all open tabs
- **No Page Refresh**: Seamless user experience
- **Targeted Updates**: Only specific elements update, not entire page
- **Efficient**: WebSocket connections are lightweight and persistent
- **Scalable**: Works with multiple users and concurrent updates

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
