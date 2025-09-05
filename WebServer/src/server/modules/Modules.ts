import { getPinoConfig, getPostgresConfig } from '../config/Config';
import { createAndConnectRedis } from '../utils/Utils';
import { type createClient } from 'redis';
import { AdminController } from '../controllers/AdminController';
import { AdminService } from '../services/AdminService';
import { ContactService } from '../services/ContactService';
import { MainService } from '../services/MainService';
import { ContactController } from '../controllers/ContactController';
import { MainController } from '../controllers/MainController';
import pino, { Logger } from 'pino';
import pg from 'pg';

class ModulesClass {
  private clientPromise: Promise<ReturnType<typeof createClient>> | null = null;
  private pool: pg.Pool | null = null;
  private logger: Logger | null = null;

  public getPool = (): pg.Pool => {
    if (!this.pool) {
      try {
        this.pool = new pg.Pool(getPostgresConfig());
      } catch (error) {
        console.error('Failed to create PostgreSQL pool:', error);
        throw error;
      }
    }
    return this.pool;
  };

  public getLogger = () => {
    if (!this.logger) {
      return pino(getPinoConfig());
    } else {
      return this.logger;
    }
  };

  public getRedisClient = async (): Promise<ReturnType<typeof createClient>> => {
    if (!this.clientPromise) {
      this.clientPromise = createAndConnectRedis().catch(error => {
        // Reset promise so we can retry on next call
        this.clientPromise = null;
        console.error('Failed to connect to Redis:', error);
        throw error;
      });
    }
    return this.clientPromise;
  };

  public getAdminService = (): AdminService => {
    return new AdminService(this.getPool());
  };

  public getContactService = (): ContactService => {
    return new ContactService(this.getPool());
  };

  public getMainService = (): MainService => {
    return new MainService(this.getPool());
  };

  public getAdminController = (): AdminController => { 
    return new AdminController(this.getAdminService());
  };

  public getContactController = (): ContactController => { 
    return new ContactController(this.getContactService());
  };

  public getMainController = (): MainController => { 
    return new MainController(this.getMainService());
  };

  public async cleanup(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
      }
      if (this.clientPromise) {
        const client = await this.clientPromise;
        await client.quit();
        this.clientPromise = null;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export const modules = new ModulesClass(); // Singleton