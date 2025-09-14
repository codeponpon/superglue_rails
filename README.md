# Superglue Rails - Time Tracking & Project Management App

A modern Ruby on Rails 8.0 application with React frontend using the Superglue gem for seamless server-side rendering. This is a freelance time tracking and project management application with authentication, project management, and dashboard functionality.

## 🚀 Technology Stack

### Backend

- **Ruby on Rails 8.0.2+** - Main framework
- **SQLite3** - Database (development/test)
- **Superglue 2.0.0.alpha.8** - Server-side rendering with React
- **Puma** - Web server
- **Solid Cache/Queue/Cable** - Rails 8 solid gems for caching, background jobs, and WebSockets
- **BCrypt** - Password hashing
- **Pagy** - Pagination
- **FriendlyId** - URL-friendly slugs

### Frontend

- **React 19.1.1** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS 4.1.13** - Styling
- **ApexCharts** - Data visualization
- **Lucide React** - Icons
- **Vite** - Build tool

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Ruby 3.4.5** (see `.ruby-version`)
- **Node.js** (latest LTS version recommended)
- **Yarn** or **npm** package manager
- **Git**

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd superglue_rails
```

### 2. Install Dependencies

#### Ruby Dependencies

```bash
bundle install
```

#### Node.js Dependencies

```bash
yarn install
# or
npm install
```

### 3. Database Setup

```bash
# Create and migrate the database
bin/rails db:create
bin/rails db:migrate

# Optional: Seed the database with sample data
bin/rails db:seed
```

### 4. Start the Development Server

```bash
# Start both Rails server and Vite dev server
bin/dev

# Or start them separately:
# Terminal 1: Rails server
bin/rails server

# Terminal 2: Vite dev server
bin/vite
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

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

## 🎯 Key Features

### 1. Project Management

- **CRUD Operations**: Full create, read, update, delete functionality for projects
- **Project Details**: Individual project view with task listing and time tracking
- **Project Editing**: Edit project details and manage tasks (add/remove/update)
- **Nested Tasks**: Create and manage tasks within projects
- **Project Search**: Search functionality across project names
- **Pagination**: Paginated project lists for better performance

### 2. Authentication

- Email/password login
- Session management
- Password reset functionality
- Rate limiting protection

### 3. Dashboard

- Time tracking statistics
- Project time allocation
- Earnings over time charts
- Recent activity feed
- Daily hours tracking

### 4. Pomodoro Timer

- Redux slice for timer state
- SVG assets for timer UI
- Time tracking integration

## 🧪 Testing

### Run Tests

```bash
# Run all tests
bin/rails test

# Run specific test files
bin/rails test test/models/user_test.rb

# Run system tests
bin/rails test:system
```

### Code Quality

```bash
# Run RuboCop for Ruby code style
bin/rubocop

# Run Brakeman for security analysis
bin/brakeman
```

## 🔧 Development

### Available Scripts

```bash
# Development
bin/dev                 # Start both Rails and Vite servers
bin/rails server       # Start only Rails server
bin/vite               # Start only Vite dev server

# Database
bin/rails db:create    # Create database
bin/rails db:migrate   # Run migrations
bin/rails db:seed      # Seed database
bin/rails db:reset     # Reset database

# Code Quality
bin/rubocop            # Ruby linting
bin/brakeman           # Security analysis

# Setup
bin/setup              # Initial project setup
```

### Superglue Integration

This project uses Superglue for seamless server-side rendering with React:

1. **Server-side rendering**: Rails controllers render `.json.props` files
2. **Props templates**: Data is serialized to JSON props
3. **React hydration**: Frontend React components receive props via `useContent()`
4. **Page mapping**: Automatic mapping between routes and React components
5. **Navigation**: `data-sg-visit` and `data-sg-remote` attributes for SPA-like navigation

### Adding New Features

1. **Backend**: Create controllers, models, and props templates
2. **Frontend**: Create React components in `app/views/`
3. **Routing**: Add routes in `config/routes.rb`
4. **State**: Add Redux slices if needed in `app/frontend/slices/`

## 🚀 Deployment

This project is configured for deployment with Kamal:

```bash
# Deploy to production
bin/kamal deploy

# Check deployment status
bin/kamal app logs
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m 'Add some amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Style Guidelines

- Follow Ruby style guide with RuboCop
- Use TypeScript for all frontend code
- Write tests for new features
- Update documentation as needed
- Follow Rails conventions

## 📚 Documentation

- [Rails Guides](https://guides.rubyonrails.org/)
- [Superglue Documentation](https://github.com/thoughtbot/superglue)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `config/puma.rb` or kill the process using port 3000
2. **Database issues**: Run `bin/rails db:reset` to reset the database
3. **Node modules issues**: Delete `node_modules` and run `yarn install` again
4. **Bundle issues**: Run `bundle install` to install missing gems

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the logs in `log/development.log`
- Ensure all dependencies are properly installed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚧 POC Roadmap - Rails 8 + Superglue + Hotwire + Stimulus

This project serves as a **Proof of Concept** to demonstrate the integration of Rails 8 with Superglue, Hotwire, and Stimulus. The following features are planned to showcase the hybrid approach:

### ✅ Completed Features

- [x] **Rails 8.0.2+** - Modern Rails with solid gems
- [x] **Superglue Integration** - Server-side rendering with React
- [x] **Basic Project Management** - CRUD operations for projects and tasks
- [x] **Authentication System** - Session-based auth with rate limiting
- [x] **React Frontend** - TypeScript + Redux Toolkit + Tailwind CSS
- [x] **Database Schema** - SQLite with proper relationships

### 🔄 In Progress

- [ ] **Hotwire Setup** - Install and configure Turbo + Stimulus packages

### 📋 Remaining POC Features

#### 1. **Hotwire Integration**

- [ ] Install `@hotwired/turbo-rails` and `@hotwired/stimulus` packages
- [ ] Configure Turbo in application.js with proper imports
- [ ] Set up Turbo Drive for SPA-like navigation

#### 2. **Stimulus Controllers**

- [ ] **Form Validation Controller** - Real-time validation with instant feedback
- [ ] **Live Search Controller** - Search projects/tasks without page refresh
- [ ] **Modal Dialog Controller** - Dynamic modals for confirmations and forms
- [ ] **Real-time Updates Controller** - Live data updates using Turbo Streams
- [ ] **Drag & Drop Controller** - Reorder tasks and projects
- [ ] **Keyboard Shortcuts Controller** - Power user keyboard navigation

#### 3. **Turbo Streams Implementation**

- [ ] **Live Project Updates** - Real-time project list updates
- [ ] **Dynamic Task Management** - Add/remove tasks without page refresh
- [ ] **Notification System** - Flash messages via Turbo Streams
- [ ] **Live Search Results** - Update search results in real-time
- [ ] **Form Submissions** - Handle form submissions with Turbo Streams

#### 4. **Turbo Frames**

- [ ] **Project Cards as Frames** - Independent project card updates
- [ ] **Task Lists as Frames** - Partial task list updates
- [ ] **Form Submissions in Frames** - Submit forms within specific page sections
- [ ] **Pagination with Frames** - Navigate pages without full reload

#### 5. **Hybrid Integration (Stimulus + Superglue)**

- [ ] **Data Flow Between Technologies** - Pass data between React and Stimulus
- [ ] **Event Handling** - Cross-technology event communication
- [ ] **State Management** - Sync Redux store with Stimulus controllers
- [ ] **Component Lifecycle** - Manage React/Stimulus component lifecycle

#### 6. **Real-time Features**

- [ ] **Live Project Search** - Instant search with debouncing
- [ ] **Auto-save Functionality** - Save forms automatically
- [ ] **Real-time Form Validation** - Validate fields as user types
- [ ] **Instant Feedback** - Immediate user feedback for all actions

#### 7. **Progressive Enhancement**

- [ ] **No-JS Fallbacks** - Ensure all features work without JavaScript
- [ ] **Graceful Degradation** - Fallback behaviors for older browsers
- [ ] **Accessibility** - Full keyboard navigation and screen reader support
- [ ] **Performance** - Optimize for slow connections

#### 8. **POC Documentation**

- [ ] **Integration Guide** - When to use React vs Stimulus vs Turbo
- [ ] **Code Examples** - Comprehensive examples for each pattern
- [ ] **Performance Comparisons** - Bundle size, loading times, memory usage
- [ ] **Best Practices** - Recommended patterns and anti-patterns

#### 9. **Testing & Quality**

- [ ] **Stimulus Controller Tests** - Unit tests for all Stimulus controllers
- [ ] **Turbo Stream Tests** - Integration tests for real-time updates
- [ ] **Hybrid Component Tests** - System tests for React + Stimulus integration
- [ ] **Performance Tests** - Load testing and performance benchmarks

### 🎯 POC Goals

The main objectives of this POC are to demonstrate:

1. **Seamless Integration** - How Rails 8, Superglue, Hotwire, and Stimulus work together
2. **Performance Benefits** - When to use each technology for optimal performance
3. **Developer Experience** - How the hybrid approach improves development workflow
4. **User Experience** - How the combination provides better UX than single-technology solutions
5. **Maintainability** - How to structure code for long-term maintainability

### 🚀 Getting Started with POC Development

To contribute to the POC development:

1. **Pick a feature** from the remaining POC features list
2. **Create a branch** for your feature: `git checkout -b poc/feature-name`
3. **Follow the patterns** established in existing code
4. **Add tests** for your implementation
5. **Update documentation** with examples
6. **Submit a PR** with detailed description

### 📊 Progress Tracking

- **Overall Progress**: 40% Complete
- **Core Features**: 100% Complete
- **Hotwire Integration**: 0% Complete
- **Stimulus Controllers**: 0% Complete
- **Turbo Streams**: 0% Complete
- **Documentation**: 20% Complete

## 🙏 Acknowledgments

- [Rails](https://rubyonrails.org/) - The web framework
- [Superglue](https://github.com/thoughtbot/superglue) - Server-side rendering with React
- [Hotwire](https://hotwired.dev/) - HTML over the wire
- [Stimulus](https://stimulus.hotwired.dev/) - Modest JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://react.dev/) - UI library
