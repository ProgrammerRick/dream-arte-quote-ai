import {
  pgEnum,
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  date,
  timestamp,
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
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

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type Activity = typeof activities.$inferSelect;
