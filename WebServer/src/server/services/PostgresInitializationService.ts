import fs from 'node:fs';
import path from 'path';
import { getPgPool } from '../providers/ProvidesPgPool';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
};

/**
 * Check if a table exists in the database
 */
async function tableExists(client: any, tableName: string): Promise<boolean> {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      );
    `;
    const result = await client.query(query, [tableName]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    throw error;
  }
}

/**
 * Check if a table has data
 */
async function tableHasData(client: any, tableName: string, schema = 'personal_portfolio_schema'): Promise<boolean> {
  try {
    const query = `SELECT EXISTS (SELECT 1 FROM ${schema}.${tableName} LIMIT 1);`;
    const result = await client.query(query);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} has data:`, error);
    throw error;
  }
}

/**
 * Read and execute SQL file
 */
async function executeSqlFile(client: any, filePath: string, description: string): Promise<void> {
  try {
    const sqlContent = await fs.promises.readFile(filePath, 'utf8');

    if (!sqlContent.trim()) {
      console.warn(`Warning: SQL file ${filePath} is empty, skipping...`);
      return;
    }

    console.log(description);
    await client.query(sqlContent);
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Get SQL files from directory with validation
 */
async function getSqlFiles(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(dirPath);
    const sqlFiles = files
      .filter(file => path.extname(file).toLowerCase() === '.sql')
      .map(file => path.join(dirPath, file));

    if (sqlFiles.length === 0) {
      console.warn(`No SQL files found in ${dirPath}`);
    }

    return sqlFiles;
  } catch (error) {
    if ((error as DatabaseError).code === 'ENOENT') {
      console.warn(`Directory ${dirPath} does not exist, skipping...`);
      return [];
    }
    throw error;
  }
}

/**
 * Initialize database tables from SQL files
 */
async function initializeTables(): Promise<void> {
  const client = await getPgPool().connect();
  
  try {
    console.log('INIT PSQL TABLE: Starting table initialization...');
    const tableFiles = await getSqlFiles('./tables/');

    if (tableFiles.length === 0) {
      console.log('INIT PSQL TABLE: No table files to process');
      return;
    }

    // Process files sequentially to avoid connection issues
    for (const filePath of tableFiles) {
      const tableName = path.parse(filePath).name;

      console.log(`INIT PSQL TABLE: Checking if ${tableName} table exists...`);

      const exists = await tableExists(client, tableName);

      if (!exists) {
        await executeSqlFile(
          client, 
          filePath, 
          `INIT PSQL TABLE: Creating ${tableName} table...`
        );
        console.log(`INIT PSQL TABLE: ${tableName} table created successfully`);
      } else {
        console.log(`INIT PSQL TABLE: ${tableName} exists, skipping...`);
      }
    }
    
    console.log('INIT PSQL TABLE: Table initialization completed');
    
  } catch (error) {
    console.error('INIT PSQL TABLE: Error during table initialization:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Initialize seed data from SQL files
 */
async function initializeSeedData(): Promise<void> {
  const client = await pool.connect();
  
  try {
    console.log('INIT PSQL DATA: Starting seed data initialization...');
    const seedFiles = await getSqlFiles('./seed_data/');

    if (seedFiles.length === 0) {
      console.log('INIT PSQL DATA: No seed data files to process');
      return;
    }

    // Process files sequentially
    for (const filePath of seedFiles) {
      const tableName = path.parse(filePath).name;

      console.log(`INIT PSQL DATA: Checking if ${tableName} has data...`);

      const hasData = await tableHasData(client, tableName);

      if (!hasData) {
        await executeSqlFile(
          client,
          filePath,
          `INIT PSQL DATA: Inserting data into ${tableName}...`
        );
        console.log(`INIT PSQL DATA: Data inserted into ${tableName} successfully`);
      } else {
        console.log(`INIT PSQL DATA: Data exists in ${tableName}, skipping...`);
      }
    }
    
    console.log('INIT PSQL DATA: Seed data initialization completed');
    
  } catch (error) {
    console.error('INIT PSQL DATA: Error during seed data initialization:', error);
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
    console.log('DATABASE INIT: Starting database initialization...');

    await initializeTables();
    await initializeSeedData();

    console.log('DATABASE INIT: Database initialization completed successfully');

  } catch (error) {
    console.error('DATABASE INIT: Fatal error during database initialization:', error);
    throw error; // Re-throw so calling code can handle it
  }
}