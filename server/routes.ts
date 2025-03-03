import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { analyzeDream, analyzeSleepPattern } from "./openai";
import { insertDreamSchema, insertSleepQualitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/dreams", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertDreamSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const analysis = await analyzeDream(parsed.data.content);
    const dream = await storage.createDream({
      userId: req.user!.id,
      content: parsed.data.content,
      ...analysis,
    });

    res.status(201).json(dream);
  });

  app.get("/api/dreams", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const dreams = await storage.getDreamsByUserId(req.user!.id);
    res.json(dreams);
  });

  app.post("/api/sleep", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertSleepQualitySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const sleepQuality = await storage.createSleepQuality({
      userId: req.user!.id,
      ...parsed.data,
    });

    res.status(201).json(sleepQuality);
  });

  app.get("/api/sleep", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const sleepQualities = await storage.getSleepQualitiesByUserId(req.user!.id);
    res.json(sleepQualities);
  });

  app.get("/api/sleep/analysis", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const sleepQualities = await storage.getSleepQualitiesByUserId(req.user!.id);
    const analysis = await analyzeSleepPattern(
      sleepQualities.map((sq) => ({
        date: sq.date,
        hoursSlept: sq.hoursSlept,
        quality: sq.quality,
      })),
    );

    res.json({ analysis });
  });

  const httpServer = createServer(app);
  return httpServer;
}
