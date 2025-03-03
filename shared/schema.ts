import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  sentiment: integer("sentiment"),
  interpretation: text("interpretation"),
});

export const sleepQualities = pgTable("sleep_qualities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  hoursSlept: integer("hours_slept").notNull(),
  quality: integer("quality").notNull(), // 1-5 scale
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDreamSchema = createInsertSchema(dreams).pick({
  content: true,
});

export const insertSleepQualitySchema = createInsertSchema(sleepQualities)
  .pick({
    hoursSlept: true,
    quality: true,
    notes: true,
  })
  .extend({
    hoursSlept: z.number().min(0).max(24),
    quality: z.number().min(1).max(5),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Dream = typeof dreams.$inferSelect;
export type InsertDream = z.infer<typeof insertDreamSchema>;
export type SleepQuality = typeof sleepQualities.$inferSelect;
export type InsertSleepQuality = z.infer<typeof insertSleepQualitySchema>;
