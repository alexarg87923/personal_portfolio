import { Pool } from 'pg';
import { environment } from '../environments/environment.prod';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

export const pool = new Pool({
  user: environment.PSQL_DB_USER,
  host: 'localhost',
  database: environment.PSQL_DB_NAME,
  password: environment.PSQL_DB_PASSWORD,
  port: parseInt(environment.PSQL_DB_PORT || '5432'),
});

async function initialize_table(table_name: string) {
  console.log(`INIT TABLE: ${resolve(dirname(fileURLToPath(import.meta.url)), '../browser')}`);
  const client = await pool.connect();
  try
  {
    console.log(`INIT TABLE: Checking if ${table_name} table exists...`);
    var res = await client.query('SELECT * FROM information_schema.tables');
    var found = res.rows.find((each) => each.table_name === table_name);
    if (found === undefined)
    {
      fs.readFile(`./tables/${table_name}.sql`, 'utf8', (e: any, data: string) => {
        if (e) {
          console.log(`INIT TABLE: Error creating ${table_name}: ` + e.message);
          return;
        };
        console.log(`INIT TABLE: Creating ${table_name} table...`);
        client.query(data);
        console.log(`INIT TABLE: ${table_name} table created...`);
      });
    } else {
      console.log(`INIT TABLE: ${table_name} exists, skipping...`)
    };
  }
  catch(e: any)
  {
    console.log(`INIT TABLE: Error creating ${table_name}: ` + e.message);
  }
  finally
  {
    client.release();
  };
};

async function initialize_data(table_name: string) {
  console.log(`INIT DATA: ${__dirname}`);
  const client = await pool.connect();
  try
  {
    console.log(`INIT DATA: Checking if ${table_name} has data...`);
    var res = await client.query(`SELECT COUNT(*) FROM ${table_name}`);
    if ( parseInt(res.rows[0].count) === 0)
    {
      fs.readFile(`./init_data_scripts/${table_name}.sql`, 'utf8', (e: any, data: string) => {
        if (e) {
          console.log(`INIT DATA: Error inserting data into ${table_name}: ` + e.message);
          return;
        };
        console.log(`INIT DATA: Inserting data into ${table_name}...`);
        client.query(data);
        console.log(`INIT DATA: Data inserted into ${table_name}...`);
      });
    } else {
      console.log(`INIT DATA: Data exists in ${table_name}...`)
    };
  }
  catch(e: any)
  {
    console.log(`INIT DATA: Error inserting data into ${table_name}: ` + e.message);
  }
  finally
  {
    client.release();
  };
};


export async function initialize_database() {
  const tables = ['about', 'experience',  'projects', 'collaborator', 'skills', 'contact', 'project_collaborators', 'project_skills', 'users'];
  const data = ['about', 'experience', 'projects', 'collaborator', 'skills', 'project_collaborators', 'project_skills'];

  for (const table of tables) {
    await initialize_table(table);
  };

  for (const datum of data){
      await initialize_data(datum);
  };
};
