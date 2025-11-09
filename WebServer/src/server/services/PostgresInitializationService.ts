import fs from 'node:fs';
import path from 'path';
import { modulesProvider } from '../modules/ModulesProvider';
import { environment } from '../environments/Environment';

const logger = modulesProvider.getLogger();

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
};

/**
 * Check if a table exists in the database
 */
async function tableExists(client: any, tableName: string, schema: string = environment.PSQL_SCHEMA): Promise<boolean> {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = $1 AND table_name = $2
      );
    `;
    const result = await client.query(query, [schema, tableName]);
    return result.rows[0].exists;
  } catch (error) {
    logger.error({ table: tableName, error }, `Error checking if table ${tableName} exists`);
    throw error;
  }
}

/**
 * Check if a table has data
 */
async function tableHasData(client: any, tableName: string, schema: string = environment.PSQL_SCHEMA): Promise<boolean> {
  try {
    const query = `SELECT EXISTS (SELECT 1 FROM ${schema}.${tableName} LIMIT 1);`;
    const result = await client.query(query);
    return result.rows[0].exists;
  } catch (error) {
    logger.error({ table: tableName, error }, `Error checking if table ${tableName} has data`);
    throw error;
  }
}

/**
 * Read and execute SQL file
 */
async function executeSqlFile(client: any, filePath: string, description: string): Promise<void> {
  try {
    let sqlContent = await fs.promises.readFile(filePath, 'utf8');

    if (!sqlContent.trim()) {
      logger.warn({ file: filePath }, `Warning: SQL file ${filePath} is empty, skipping...`);
      return;
    }

    // Replace {{SCHEMA}} placeholder with environment variable
    sqlContent = sqlContent.replace(/\{\{SCHEMA\}\}/g, environment.PSQL_SCHEMA);

    logger.info({ file: filePath }, description);
    await client.query(sqlContent);
  } catch (error) {
    logger.error({ file: filePath, error }, `Error executing SQL file ${filePath}`);
    throw error;
  }
}

/**
 * Get SQL files from directory with validation (recursive)
 */
async function getSqlFiles(dirPath: string): Promise<string[]> {
  try {
    const sqlFiles: string[] = [];
    
    async function scanDirectory(currentPath: string): Promise<void> {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.sql') {
          sqlFiles.push(fullPath);
        }
      }
    }
    
    await scanDirectory(dirPath);

    if (sqlFiles.length === 0) {
      logger.warn({ directory: dirPath }, `No SQL files found in ${dirPath}`);
    }

    return sqlFiles;
  } catch (error) {
    if ((error as DatabaseError).code === 'ENOENT') {
      logger.warn({ directory: dirPath }, `Directory ${dirPath} does not exist, skipping...`);
      return [];
    }
    throw error;
  }
}

/**
 * Initialize database tables from SQL files
 */
async function initializeTables(): Promise<void> {
  const client = await modulesProvider.getPool().connect();
  
  try {
    logger.info({ action: 'InitTables' }, 'INIT PSQL TABLE: Starting table initialization...');
    const tableFiles = await getSqlFiles('./tables/');

    if (tableFiles.length === 0) {
      logger.info({ action: 'InitTables' }, 'INIT PSQL TABLE: No table files to process');
      return;
    }

    // Process files sequentially to avoid connection issues
    for (const filePath of tableFiles) {
      const tableName = path.parse(filePath).name;

      logger.info({ action: 'InitTables', table: tableName }, `INIT PSQL TABLE: Checking if ${tableName} table exists...`);

      const exists = await tableExists(client, tableName);

      if (!exists) {
        await executeSqlFile(
          client, 
          filePath, 
          `INIT PSQL TABLE: Creating ${tableName} table...`
        );
        logger.info({ action: 'InitTables', table: tableName }, `INIT PSQL TABLE: ${tableName} table created successfully`);
      } else {
        logger.info({ action: 'InitTables', table: tableName }, `INIT PSQL TABLE: ${tableName} exists, skipping...`);
      }
    }
    
    logger.info({ action: 'InitTables' }, 'INIT PSQL TABLE: Table initialization completed');
    
  } catch (error) {
    logger.error({ action: 'InitTables', error }, 'INIT PSQL TABLE: Error during table initialization');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Initialize seed data from SQL files
 */
async function initializeSeedData(): Promise<void> {
  const client = await modulesProvider.getPool().connect();
  
  try {
    logger.info({ action: 'InitSeedData' }, 'INIT PSQL DATA: Starting seed data initialization...');
    const seedFiles = await getSqlFiles('./seed_data/');

    if (seedFiles.length === 0) {
      logger.info({ action: 'InitSeedData' }, 'INIT PSQL DATA: No seed data files to process');
      return;
    }

    // Process files sequentially
    for (const filePath of seedFiles) {
      const tableName = path.parse(filePath).name;

      logger.info({ action: 'InitSeedData', table: tableName }, `INIT PSQL DATA: Checking if ${tableName} has data...`);

      const hasData = await tableHasData(client, tableName);

      if (!hasData) {
        await executeSqlFile(
          client,
          filePath,
          `INIT PSQL DATA: Inserting data into ${tableName}...`
        );
        logger.info({ action: 'InitSeedData', table: tableName }, `INIT PSQL DATA: Data inserted into ${tableName} successfully`);
      } else {
        logger.info({ action: 'InitSeedData', table: tableName }, `INIT PSQL DATA: Data exists in ${tableName}, skipping...`);
      }
    }
    
    logger.info({ action: 'InitSeedData' }, 'INIT PSQL DATA: Seed data initialization completed');
    
  } catch (error) {
    logger.error({ action: 'InitSeedData', error }, 'INIT PSQL DATA: Error during seed data initialization');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Initialize both tables and seed data
 */
export async function initializeDatabase(): Promise<void> {
  try {
    logger.info({ action: 'DatabaseInit' }, 'DATABASE INIT: Starting database initialization...');

    await initializeTables();
    await initializeSeedData();

    logger.info({ action: 'DatabaseInit' }, 'DATABASE INIT: Database initialization completed successfully');

  } catch (error) {
    logger.error({ action: 'DatabaseInit', error }, 'DATABASE INIT: Fatal error during database initialization');
    throw error; // Re-throw so calling code can handle it
  }
}