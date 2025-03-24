import { Pool } from 'pg';
import { environment } from '../environments/environment.prod';
import fs from 'node:fs';

export const pool = new Pool({
  user: environment.PSQL_DB_USER,
  host: 'localhost',
  database: environment.PSQL_DB_NAME,
  password: environment.PSQL_DB_PASSWORD,
  port: parseInt(environment.PSQL_DB_PORT || '5432'),
});

async function initialize_table(table_name: string) {
  const client = await pool.connect();
  try
  {
    console.log(`INIT TABLE: Checking if ${table_name} table exists...`);
    var res = await client.query('SELECT * FROM information_schema.tables');
    var found = await res.rows.find((each) => each.table_name === table_name);
    if (found === undefined)
    {
      const table_init = fs.readFileSync(`./tables/${table_name}.sql`, 'utf8');
      if (table_init) {
        console.log(`INIT TABLE: Creating ${table_name} table...`);
        await client.query(table_init);
        console.log(`INIT TABLE: ${table_name} table created...`);
      }
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
  const client = await pool.connect();
  try
  {
    console.log(`INIT DATA: Checking if ${table_name} has data...`);
    var res = await client.query(`SELECT COUNT(*) FROM personal_portfolio_schema.${table_name}`);
    if (parseInt(res.rows[0].count) === 0)
    {
      const data = fs.readFileSync(`./init_data_scripts/${table_name}.sql`, 'utf8');
      console.log(`INIT DATA: Inserting data into ${table_name}...`);
      await client.query(data);
      console.log(`INIT DATA: Data inserted into ${table_name}...`);
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
  const tables = ['about', 'experience',  'projects', 'collaborator', 'skills', 'project_collaborators', 'project_skills', 'users', 'contact'];
  const data = ['about', 'experience', 'projects', 'collaborator', 'skills', 'project_collaborators', 'project_skills', 'users'];

  for (const table of tables) {
    await initialize_table(table);
  };

  for (const datum of data){
    await initialize_data(datum);
  };
};
