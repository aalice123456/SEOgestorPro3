import { 
  users, clients, projects, tasks, reports, activityLogs,
  type User, type InsertUser, 
  type Client, type InsertClient,
  type Project, type InsertProject,
  type Task, type InsertTask,
  type Report, type InsertReport,
  type ActivityLog, type InsertActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, lt, gt, gte, lte, isNull } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Client methods
  getClient(id: number): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  getClientsByUserId(userId: number): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  getProjectsByClientId(clientId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getTasks(): Promise<Task[]>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  getTasksByProjectId(projectId: number): Promise<Task[]>;
  getTasksByStatus(status: string): Promise<Task[]>;
  getTasksByDueDate(date: Date): Promise<Task[]>;
  getUpcomingTasks(days: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Report methods
  getReport(id: number): Promise<Report | undefined>;
  getReports(): Promise<Report[]>;
  getReportsByProjectId(projectId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<InsertReport>): Promise<Report | undefined>;
  deleteReport(id: number): Promise<boolean>;

  // Activity log methods
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  getActivityLogsByUserId(userId: number, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Dashboard stats methods
  getActiveProjectsCount(userId: number): Promise<number>;
  getCompletedProjectsCount(userId: number): Promise<number>;
  getPendingTasksCount(userId: number): Promise<number>;
  getActiveClientsCount(userId: number): Promise<number>;
  getProjectStats(userId: number): Promise<any>;
  getTaskProgressStats(userId: number): Promise<any>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: db.driver, 
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClientsByUserId(userId: number): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.createdBy, userId))
      .orderBy(desc(clients.createdAt));
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db
      .insert(clients)
      .values(client)
      .returning();
    return newClient;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set(clientData)
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    const [deletedClient] = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning({ id: clients.id });
    return !!deletedClient;
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.createdBy, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectsByClientId(clientId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(projectData)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });
    return !!deletedProject;
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(
        eq(tasks.createdBy, userId)
      )
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksByProjectId(projectId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.status, status as any))
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksByDueDate(date: Date): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(
        and(
          gte(tasks.dueDate, new Date(date.setHours(0, 0, 0, 0))),
          lt(tasks.dueDate, new Date(date.setHours(23, 59, 59, 999)))
        )
      )
      .orderBy(tasks.dueDate);
  }

  async getUpcomingTasks(days: number): Promise<Task[]> {
    const today = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    return await db
      .select()
      .from(tasks)
      .where(
        and(
          gte(tasks.dueDate, today),
          lte(tasks.dueDate, future),
          eq(tasks.status, 'pending')
        )
      )
      .orderBy(tasks.dueDate);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    return !!deletedTask;
  }

  // Report methods
  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReportsByProjectId(projectId: number): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.projectId, projectId))
      .orderBy(desc(reports.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db
      .insert(reports)
      .values(report)
      .returning();
    return newReport;
  }

  async updateReport(id: number, reportData: Partial<InsertReport>): Promise<Report | undefined> {
    const [updatedReport] = await db
      .update(reports)
      .set(reportData)
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteReport(id: number): Promise<boolean> {
    const [deletedReport] = await db
      .delete(reports)
      .where(eq(reports.id, id))
      .returning({ id: reports.id });
    return !!deletedReport;
  }

  // Activity log methods
  async getActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async getActivityLogsByUserId(userId: number, limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  // Dashboard stats methods
  async getActiveProjectsCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: db.sql`count(*)` })
      .from(projects)
      .where(
        and(
          eq(projects.status, 'in_progress'),
          eq(projects.createdBy, userId)
        )
      );
    return Number(result[0].count);
  }

  async getCompletedProjectsCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: db.sql`count(*)` })
      .from(projects)
      .where(
        and(
          eq(projects.status, 'completed'),
          eq(projects.createdBy, userId)
        )
      );
    return Number(result[0].count);
  }

  async getPendingTasksCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: db.sql`count(*)` })
      .from(tasks)
      .where(
        and(
          eq(tasks.status, 'pending'),
          eq(tasks.createdBy, userId)
        )
      );
    return Number(result[0].count);
  }

  async getActiveClientsCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: db.sql`count(distinct ${clients.id})` })
      .from(clients)
      .innerJoin(projects, eq(clients.id, projects.clientId))
      .where(
        and(
          eq(projects.status, 'in_progress'),
          eq(clients.createdBy, userId)
        )
      );
    return Number(result[0].count);
  }

  async getProjectStats(userId: number): Promise<any> {
    // Simplified for now - in a production app you'd calculate monthly trends
    const activeProjects = await this.getActiveProjectsCount(userId);
    const completedProjects = await this.getCompletedProjectsCount(userId);
    
    return {
      activeProjects,
      completedProjects,
      total: activeProjects + completedProjects
    };
  }

  async getTaskProgressStats(userId: number): Promise<any> {
    const completedTasks = await db
      .select({ count: db.sql`count(*)` })
      .from(tasks)
      .where(
        and(
          eq(tasks.status, 'completed'),
          eq(tasks.createdBy, userId)
        )
      );
    
    const inProgressTasks = await db
      .select({ count: db.sql`count(*)` })
      .from(tasks)
      .where(
        and(
          eq(tasks.status, 'in_progress'),
          eq(tasks.createdBy, userId)
        )
      );
    
    const pendingTasks = await db
      .select({ count: db.sql`count(*)` })
      .from(tasks)
      .where(
        and(
          eq(tasks.status, 'pending'),
          eq(tasks.createdBy, userId)
        )
      );

    const today = new Date();
    const overdueTasks = await db
      .select({ count: db.sql`count(*)` })
      .from(tasks)
      .where(
        and(
          lt(tasks.dueDate, today),
          eq(tasks.status, 'pending'),
          eq(tasks.createdBy, userId)
        )
      );
    
    const completed = Number(completedTasks[0].count);
    const inProgress = Number(inProgressTasks[0].count);
    const pending = Number(pendingTasks[0].count);
    const overdue = Number(overdueTasks[0].count);
    const total = completed + inProgress + pending;
    
    return {
      completed,
      inProgress,
      pending,
      overdue,
      total,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      inProgressPercentage: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0,
      overduePercentage: total > 0 ? Math.round((overdue / total) * 100) : 0
    };
  }
}

export const storage = new DatabaseStorage();
