import createMemoryStore from "memorystore";
import session from "express-session";
import type {
  User,
  InsertUser,
  Dream,
  SleepQuality,
  InsertDream,
  InsertSleepQuality,
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createDream(dream: InsertDream & { userId: number; sentiment?: number | null; interpretation?: string | null }): Promise<Dream>;
  getDreamsByUserId(userId: number): Promise<Dream[]>;

  createSleepQuality(quality: InsertSleepQuality & { userId: number }): Promise<SleepQuality>;
  getSleepQualitiesByUserId(userId: number): Promise<SleepQuality[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dreams: Map<number, Dream>;
  private sleepQualities: Map<number, SleepQuality>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.dreams = new Map();
    this.sleepQualities = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDream(dream: InsertDream & { 
    userId: number; 
    sentiment?: number | null; 
    interpretation?: string | null 
  }): Promise<Dream> {
    const id = this.currentId++;
    const newDream = {
      ...dream,
      id,
      date: new Date(),
      sentiment: dream.sentiment ?? null,
      interpretation: dream.interpretation ?? null,
    };
    this.dreams.set(id, newDream);
    return newDream;
  }

  async getDreamsByUserId(userId: number): Promise<Dream[]> {
    return Array.from(this.dreams.values()).filter(
      (dream) => dream.userId === userId,
    );
  }

  async createSleepQuality(
    quality: InsertSleepQuality & { userId: number },
  ): Promise<SleepQuality> {
    const id = this.currentId++;
    const newQuality = {
      ...quality,
      id,
      date: new Date(),
      notes: quality.notes ?? null,
    };
    this.sleepQualities.set(id, newQuality);
    return newQuality;
  }

  async getSleepQualitiesByUserId(userId: number): Promise<SleepQuality[]> {
    return Array.from(this.sleepQualities.values()).filter(
      (quality) => quality.userId === userId,
    );
  }
}

export const storage = new MemStorage();