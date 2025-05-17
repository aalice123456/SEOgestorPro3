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
```

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seogestorpro.git
   cd seogestorpro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5000`

## Deployment

### Deploying to Netlify

1. Create a new site on Netlify:
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Connect your Git repository

2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `client/dist`

3. Add environment variables:
   - Navigate to Site settings > Environment variables
   - Add all required environment variables (DATABASE_URL, SESSION_SECRET, etc.)

4. Configure Netlify functions:
   - Create a `netlify.toml` file in the root directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "client/dist"
     functions = "functions"

   [functions]
     directory = "server"
     node_bundler = "esbuild"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

5. Deploy your site:
   - Push your changes to your Git repository
   - Netlify will automatically deploy your site

### Deploying to Vercel

1. Create a new project on Vercel:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project"
   - Import your Git repository

2. Configure project settings:
   - Build command: `npm run build`
   - Output directory: `client/dist`
   - Install command: `npm install`

3. Add environment variables:
   - Navigate to Settings > Environment Variables
   - Add all required environment variables

4. Configure Vercel functions:
   - Create a `vercel.json` file in the root directory:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "client/index.html", "use": "@vercel/static" },
       { "src": "server/index.ts", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "server/index.ts" },
       { "src": "/(.*)", "dest": "client/index.html" }
     ]
   }
   ```

5. Deploy your project:
   - Push your changes to your Git repository
   - Vercel will automatically deploy your project

### Database Configuration for Production

When deploying to production, you'll need a PostgreSQL database. You can use:

1. [Neon Database](https://neon.tech) - Serverless PostgreSQL with free tier
2. [Supabase](https://supabase.com) - Open source Firebase alternative with PostgreSQL
3. [Railway](https://railway.app) - Easy deployment platform with PostgreSQL

Make sure to update your DATABASE_URL environment variable with the production database connection string.
