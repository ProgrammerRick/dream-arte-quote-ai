import {
  pgEnum,
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  date,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const clientStatusEnum = pgEnum("client_status", ["active", "inactive"]);

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "completed",
  "delayed",
  "paused",
]);

export const projectPriorityEnum = pgEnum("project_priority", [
  "low",
  "medium",
  "high",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "paid",
  "pending",
  "overdue",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "client_created",
  "project_created",
  "project_status_changed",
  "payment_received",
  "payment_overdue",
  "goal_updated",
  "quote_created",
  "quote_sent",
  "quote_approved",
  "contract_created",
  "contract_signed",
  "expense_added",
  "task_completed",
  "event_created",
]);

export const documentTypeEnum = pgEnum("document_type", ["cpf", "cnpj"]);

export const sslStatusEnum = pgEnum("ssl_status", ["active", "expired", "none"]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "draft",
  "sent",
  "approved",
  "rejected",
  "expired",
]);

export const contractStatusEnum = pgEnum("contract_status", [
  "draft",
  "sent",
  "signed",
  "expired",
]);

export const taskStatusEnum = pgEnum("task_status", ["todo", "doing", "review", "done"]);

export const eventTypeEnum = pgEnum("event_type", ["meeting", "reminder", "deadline", "task"]);

export const fileOwnerTypeEnum = pgEnum("file_owner_type", [
  "client",
  "project",
  "quote",
  "contract",
  "resource",
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  status: clientStatusEnum("status").notNull().default("active"),
  avatarColor: text("avatar_color").notNull().default("#8B5CF6"),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  documentType: documentTypeEnum("document_type"),
  documentNumber: text("document_number"),
  whatsapp: text("whatsapp"),
  zipCode: text("zip_code"),
  street: text("street"),
  addressNumber: text("address_number"),
  complement: text("complement"),
  district: text("district"),
  city: text("city"),
  state: text("state"),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").notNull().default("active"),
  priority: projectPriorityEnum("priority").notNull().default("medium"),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull().default("0"),
  progress: integer("progress").notNull().default(0),
  startDate: date("start_date"),
  dueDate: date("due_date"),
  completedAt: date("completed_at"),
  responsible: text("responsible"),
  domain: text("domain"),
  hostingProvider: text("hosting_provider"),
  sslStatus: sslStatusEnum("ssl_status").notNull().default("none"),
  sslExpiresAt: date("ssl_expires_at"),
  dnsProvider: text("dns_provider"),
  wordpressInstalled: boolean("wordpress_installed").notNull().default(false),
  pluginsNote: text("plugins_note"),
  ftpHost: text("ftp_host"),
  ftpUser: text("ftp_user"),
  ftpPort: text("ftp_port"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectChecklistItems = pgTable("project_checklist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectComments = pgTable("project_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  author: text("author").notNull().default("Equipe"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  method: text("method"),
  dueDate: date("due_date").notNull(),
  paidAt: date("paid_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  period: text("period").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: activityTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  entityId: uuid("entity_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clientHistory = pgTable("client_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerType: fileOwnerTypeEnum("owner_type").notNull(),
  ownerId: uuid("owner_id").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Orçamentos (Quotes)
// ---------------------------------------------------------------------------

export type QuoteItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: text("number").notNull().unique(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  status: quoteStatusEnum("status").notNull().default("draft"),
  items: jsonb("items").$type<QuoteItem[]>().notNull().default([]),
  discountType: text("discount_type").notNull().default("percent"),
  discountValue: numeric("discount_value", { precision: 12, scale: 2 }).notNull().default("0"),
  installments: integer("installments").notNull().default(1),
  paymentMethod: text("payment_method"),
  validUntil: date("valid_until"),
  notes: text("notes"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

export const quoteHistory = pgTable("quote_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Contratos
// ---------------------------------------------------------------------------

export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: text("number").notNull().unique(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: contractStatusEnum("status").notNull().default("draft"),
  validUntil: date("valid_until"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  signatureName: text("signature_name"),
  signatureDataUrl: text("signature_data_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Financeiro — Saídas (Expenses)
// ---------------------------------------------------------------------------

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  description: text("description").notNull(),
  category: text("category").notNull().default("Geral"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  method: text("method"),
  dueDate: date("due_date").notNull(),
  paidAt: date("paid_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Agenda — Tarefas (Kanban) e Eventos
// ---------------------------------------------------------------------------

export type ChecklistEntry = { text: string; done: boolean };

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: projectPriorityEnum("priority").notNull().default("medium"),
  responsible: text("responsible"),
  dueDate: date("due_date"),
  checklist: jsonb("checklist").$type<ChecklistEntry[]>().notNull().default([]),
  timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
  timerStartedAt: timestamp("timer_started_at", { withTimezone: true }),
  position: integer("position").notNull().default(0),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: eventTypeEnum("type").notNull().default("meeting"),
  date: date("date").notNull(),
  time: text("time"),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type ClientHistoryEntry = typeof clientHistory.$inferSelect;
export type FileRecord = typeof files.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type QuoteHistoryEntry = typeof quoteHistory.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ProjectChecklistItem = typeof projectChecklistItems.$inferSelect;
export type ProjectComment = typeof projectComments.$inferSelect;
export type CalendarEvent = typeof events.$inferSelect;
export type NewCalendarEvent = typeof events.$inferInsert;
