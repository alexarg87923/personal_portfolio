import { getPostgresConfig, createPinoLogger } from '../config/Config';
import { createAndConnectRedis } from '../utils/Utils';
import { type createClient } from 'redis';
import { AdminController } from '../controllers/AdminController';
import { AdminService } from '../services/AdminService';
import { ContactService } from '../services/ContactService';
import { MainService } from '../services/MainService';
import { ContactController } from '../controllers/ContactController';
import { MainController } from '../controllers/MainController';
import { Logger } from 'pino';
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
      this.logger = createPinoLogger();
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

  public AdminServiceProvider = (): AdminService => {
    return new AdminService(this.getPool(), this.getLogger());
  };

  public ContactServiceProvider = (): ContactService => {
    return new ContactService(this.getPool(), this.getLogger());
  };

  public MainServiceProvider = (): MainService => {
    return new MainService(this.getPool(), this.getLogger());
  };

  public AdminControllerProvider = (): AdminController => { 
    return new AdminController(this.AdminServiceProvider(), this.getLogger());
  };

  public ContactControllerProvider = (): ContactController => { 
    return new ContactController(this.ContactServiceProvider(), this.getLogger());
  };

  public MainControllerProvider = (): MainController => { 
    return new MainController(this.MainServiceProvider(), this.getLogger());
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
