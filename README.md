# SeoGestorPro - SEO Project Management Application

SeoGestorPro is a comprehensive web application designed for SEO professionals to efficiently manage their clients, projects, tasks, and reports. This application provides a centralized platform with intuitive tools to organize and track progress on multiple SEO projects.

## Features

- **User Management**
  - Secure user registration and authentication
  - Role-based access control

- **Client Management**
  - Complete CRUD operations for client information
  - Track client details including contact persons, websites, etc.

- **Project Management**
  - Create and manage SEO projects with detailed information
  - Associate projects with clients
  - Track project status, timeline, and attachments

- **Task Management**
  - Create, assign, and monitor SEO tasks
  - Set priorities, due dates, and track completion status
  - Filter and search tasks with various criteria

- **Reporting**
  - Generate comprehensive SEO reports for clients
  - Custom report templates and options
  - Download reports for sharing with clients

- **Dashboard**
  - Visual overview of active projects, tasks, and deadlines
  - Performance metrics and progress tracking
  - Activity logs to monitor recent actions

## Tech Stack

### Frontend:
- React
- TypeScript
- TailwindCSS
- Shadcn UI
- React Query
- Recharts for data visualization

### Backend:
- Express.js
- PostgreSQL with Drizzle ORM
- Session-based authentication

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL database
- npm or yarn

### Environment Variables
The application requires the following environment variables:

```env
# Database Connection
DATABASE_URL=postgres://username:password@hostname:port/database

# Session Secret (for authentication)
SESSION_SECRET=your_session_secret_here
