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

class ModulesProvider {
  private clientPromise: Promise<ReturnType<typeof createClient>> | null = null;
  private pool: pg.Pool | null = null;
  private logger: Logger | null = null;

  public getPool = (): pg.Pool => {
    if (!this.pool) {
      try {
        this.pool = new pg.Pool(getPostgresConfig());
      } catch (error) {
        this.getLogger().error({ error }, 'Failed to create PostgreSQL pool');
        throw error;
      }
    }
    return this.pool;
  };

  public getLogger = (): Logger => {
    if (!this.logger) {
      this.logger = pino(getPinoConfig());
    }
    return this.logger;
  };

  public getRedisClient = async (): Promise<ReturnType<typeof createClient>> => {
    if (!this.clientPromise) {
      this.clientPromise = createAndConnectRedis().catch(error => {
        // Reset promise so we can retry on next call
        this.clientPromise = null;
        this.getLogger().error({ error }, 'Failed to connect to Redis');
        throw error;
      });
    }
    return this.clientPromise;
  };

  public provideAdminService = (): AdminService => {
    return new AdminService(this.getPool(), this.getLogger());
  };

  public provideContactService = (): ContactService => {
    return new ContactService(this.getPool(), this.getLogger());
  };

  public provideMainService = (): MainService => {
    return new MainService(this.getPool(), this.getLogger());
  };

  public provideAdminController = (): AdminController => { 
    return new AdminController(this.provideAdminService(), this.getLogger());
  };

  public provideContactController = (): ContactController => { 
    return new ContactController(this.provideContactService(), this.getLogger());
  };

  public provideMainController = (): MainController => { 
    return new MainController(this.provideMainService(), this.getLogger());
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
      this.getLogger().error({ error }, 'Error during cleanup');
    }
  }
}

export const modulesProvider = new ModulesProvider(); // Singleton
