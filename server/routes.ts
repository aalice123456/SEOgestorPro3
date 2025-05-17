import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertClientSchema, 
  insertProjectSchema, 
  insertTaskSchema, 
  insertReportSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up authentication routes
  setupAuth(app);

  // Client Routes
  app.get("/api/clients", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const clients = await storage.getClientsByUserId(req.user.id);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if the user has access to this client
      if (client.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const parsedData = insertClientSchema.safeParse({ ...req.body, createdBy: req.user.id });
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid client data", errors: parsedData.error.errors });
      }
      
      const newClient = await storage.createClient(parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'created',
        entityType: 'client',
        entityId: newClient.id,
        details: `Created client: ${newClient.name}`,
      });
      
      res.status(201).json(newClient);
    } catch (error) {
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const clientId = parseInt(req.params.id);
      const existingClient = await storage.getClient(clientId);
      
      if (!existingClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if the user has access to this client
      if (existingClient.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const parsedData = insertClientSchema.partial().safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid client data", errors: parsedData.error.errors });
      }
      
      const updatedClient = await storage.updateClient(clientId, parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'updated',
        entityType: 'client',
        entityId: clientId,
        details: `Updated client: ${existingClient.name}`,
      });
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const clientId = parseInt(req.params.id);
      const existingClient = await storage.getClient(clientId);
      
      if (!existingClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if the user has access to this client
      if (existingClient.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const result = await storage.deleteClient(clientId);
      
      if (result) {
        // Log activity
        await storage.createActivityLog({
          userId: req.user.id,
          action: 'deleted',
          entityType: 'client',
          entityId: clientId,
          details: `Deleted client: ${existingClient.name}`,
        });
        
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete client" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Project Routes
  app.get("/api/projects", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const projects = await storage.getProjectsByUserId(req.user.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/clients/:clientId/projects", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const clientId = parseInt(req.params.clientId);
      const client = await storage.getClient(clientId);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if the user has access to this client
      if (client.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const projects = await storage.getProjectsByClientId(clientId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if the user has access to this project
      if (project.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const parsedData = insertProjectSchema.safeParse({ ...req.body, createdBy: req.user.id });
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid project data", errors: parsedData.error.errors });
      }
      
      // Check if the client exists and user has access
      const client = await storage.getClient(parsedData.data.clientId);
      if (!client || client.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Invalid client or permission denied" });
      }
      
      const newProject = await storage.createProject(parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'created',
        entityType: 'project',
        entityId: newProject.id,
        details: `Created project: ${newProject.name}`,
      });
      
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const projectId = parseInt(req.params.id);
      const existingProject = await storage.getProject(projectId);
      
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if the user has access to this project
      if (existingProject.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const parsedData = insertProjectSchema.partial().safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid project data", errors: parsedData.error.errors });
      }
      
      // If updating the client, check if user has access to that client
      if (parsedData.data.clientId) {
        const client = await storage.getClient(parsedData.data.clientId);
        if (!client || client.createdBy !== req.user.id) {
          return res.status(403).json({ message: "Invalid client or permission denied" });
        }
      }
      
      const updatedProject = await storage.updateProject(projectId, parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'updated',
        entityType: 'project',
        entityId: projectId,
        details: `Updated project: ${existingProject.name}`,
      });
      
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const projectId = parseInt(req.params.id);
      const existingProject = await storage.getProject(projectId);
      
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if the user has access to this project
      if (existingProject.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const result = await storage.deleteProject(projectId);
      
      if (result) {
        // Log activity
        await storage.createActivityLog({
          userId: req.user.id,
          action: 'deleted',
          entityType: 'project',
          entityId: projectId,
          details: `Deleted project: ${existingProject.name}`,
        });
        
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete project" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Task Routes
  app.get("/api/tasks", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const tasks = await storage.getTasksByUserId(req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/projects/:projectId/tasks", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if the user has access to this project
      if (project.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const tasks = await storage.getTasksByProjectId(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/upcoming", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const tasks = await storage.getUpcomingTasks(days);
      
      // Filter tasks for this user's projects
      const projects = await storage.getProjectsByUserId(req.user.id);
      const projectIds = new Set(projects.map(p => p.id));
      
      const userTasks = tasks.filter(task => projectIds.has(task.projectId));
      res.json(userTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const task = await storage.getTask(parseInt(req.params.id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if the user has access to this task
      if (task.createdBy !== req.user.id) {
        // Check if task belongs to a project the user created
        const project = await storage.getProject(task.projectId);
        if (!project || project.createdBy !== req.user.id) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const parsedData = insertTaskSchema.safeParse({ ...req.body, createdBy: req.user.id });
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid task data", errors: parsedData.error.errors });
      }
      
      // Check if the project exists and user has access
      const project = await storage.getProject(parsedData.data.projectId);
      if (!project || project.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Invalid project or permission denied" });
      }
      
      const newTask = await storage.createTask(parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'created',
        entityType: 'task',
        entityId: newTask.id,
        details: `Created task: ${newTask.title}`,
      });
      
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const taskId = parseInt(req.params.id);
      const existingTask = await storage.getTask(taskId);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if the user has access to this task or its project
      const project = await storage.getProject(existingTask.projectId);
      if (!project || project.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const parsedData = insertTaskSchema.partial().safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid task data", errors: parsedData.error.errors });
      }
      
      // If updating the project, check if user has access to that project
      if (parsedData.data.projectId) {
        const newProject = await storage.getProject(parsedData.data.projectId);
        if (!newProject || newProject.createdBy !== req.user.id) {
          return res.status(403).json({ message: "Invalid project or permission denied" });
        }
      }
      
      const updatedTask = await storage.updateTask(taskId, parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'updated',
        entityType: 'task',
        entityId: taskId,
        details: `Updated task: ${existingTask.title}`,
      });
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const taskId = parseInt(req.params.id);
      const existingTask = await storage.getTask(taskId);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if the user has access to this task or its project
      const project = await storage.getProject(existingTask.projectId);
      if (!project || project.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const result = await storage.deleteTask(taskId);
      
      if (result) {
        // Log activity
        await storage.createActivityLog({
          userId: req.user.id,
          action: 'deleted',
          entityType: 'task',
          entityId: taskId,
          details: `Deleted task: ${existingTask.title}`,
        });
        
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete task" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Report Routes
  app.get("/api/reports", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const reports = await storage.getReports();
      
      // Filter reports for this user's projects
      const projects = await storage.getProjectsByUserId(req.user.id);
      const projectIds = new Set(projects.map(p => p.id));
      
      const userReports = reports.filter(report => projectIds.has(report.projectId));
      res.json(userReports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const parsedData = insertReportSchema.safeParse({ ...req.body, createdBy: req.user.id });
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid report data", errors: parsedData.error.errors });
      }
      
      // Check if the project exists and user has access
      const project = await storage.getProject(parsedData.data.projectId);
      if (!project || project.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Invalid project or permission denied" });
      }
      
      const newReport = await storage.createReport(parsedData.data);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'created',
        entityType: 'report',
        entityId: newReport.id,
        details: `Generated report: ${newReport.title}`,
      });
      
      res.status(201).json(newReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const userId = req.user.id;
      
      // If there's no data yet, return default empty stats
      const projects = await storage.getProjectsByUserId(userId);
      if (projects.length === 0) {
        return res.json({
          stats: {
            activeProjects: 0,
            completedProjects: 0,
            pendingTasks: 0,
            activeClients: 0
          },
          taskProgress: {
            completed: 0,
            inProgress: 0,
            pending: 0,
            overdue: 0,
            total: 0,
            completedPercentage: 0,
            inProgressPercentage: 0,
            pendingPercentage: 0
          },
          recentActivities: [],
          recentClients: [],
          upcomingDeadlines: []
        });
      }
      
      // Get dashboard stats
      const activeProjects = await storage.getActiveProjectsCount(userId);
      const completedProjects = await storage.getCompletedProjectsCount(userId);
      const pendingTasks = await storage.getPendingTasksCount(userId);
      const activeClients = await storage.getActiveClientsCount(userId);
      const taskProgress = await storage.getTaskProgressStats(userId);
      
      // Get recent activities
      const recentActivities = await storage.getActivityLogsByUserId(userId, 5);
      
      // Get recent clients
      const allClients = await storage.getClientsByUserId(userId);
      const recentClients = allClients.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 4);
      
      // Get upcoming deadlines
      const upcomingTasks = await storage.getUpcomingTasks(7);
      const projectIds = new Set(projects.map(p => p.id));
      const userUpcomingTasks = upcomingTasks
        .filter(task => projectIds.has(task.projectId))
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        })
        .slice(0, 5);
      
      res.json({
        stats: {
          activeProjects,
          completedProjects,
          pendingTasks,
          activeClients
        },
        taskProgress,
        recentActivities,
        recentClients,
        upcomingDeadlines: userUpcomingTasks
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
