import { Pool } from 'pg';
import { environment } from '../environments/environment.prod';

const fs = require('node:fs');

export const pool = new Pool({
  user: environment.DB_USER,
  host: environment.DB_HOST,
  database: environment.DB_NAME,
  password: environment.DB_PASSWORD,
  port: parseInt(environment.DB_PORT || '5432'),
});

async function initialize_table(table_name: string) {
  const client = await pool.connect();
  try
  {
    console.log(`Checking if ${table_name} table exists...`);
    var res = await client.query('SELECT * FROM information_schema.tables');
    var found = res.rows.find((each) => each.table_name === table_name);
    if (found === undefined)
    {
      await fs.readFile(`./server/databases/tables/${table_name}.sql`, 'utf8', (e: any, data: string) => {
        if (e) {
          console.log(`Error creating ${table_name}: ` + e.message);
          return;
        }
        console.log(`Creating ${table_name} table...`);
        client.query(data);
        console.log(`${table_name} table created...`);
      })
    } else {
      console.log(`${table_name} exists, skipping...`)
    }
  }
  catch(e: any)
  {
    console.log(`Error creating ${table_name}: ` + e.message);
  }
  finally
  {
    client.release();
  }
}

async function initialize_data(table_name: string){
  const client = await pool.connect();
  try
  {
    console.log(`Checking if ${table_name} has data...`);
    var res = await client.query(`SELECT COUNT(*) FROM ${table_name}`);
    if ( parseInt(res.rows[0].count) === 0)
    {
      await fs.readFile(`./server/databases/init_data_scripts/${table_name}.sql`, 'utf8', (e: any, data: string) => {
        if (e) {
          console.log(`Error inserting data into ${table_name}: ` + e.message);
          return;
        }
        console.log(`Inserting data into ${table_name}...`);
        client.query(data);
        console.log(`Data inserted into ${table_name}...`);
      })
    } else {
      console.log(`Data exists in ${table_name}...`)
    }
  }
  catch(e: any)
  {
    console.log(`Error inserting data into ${table_name}: ` + e.message);
  }
  finally
  {
    client.release();
  }
}


export async function initialize_database(){
  const tables = ['about', 'experience',  'projects', 'collaborator', 'skills', 'contact', 'project_collaborators', 'project_skills'];
  const data = ['about', 'experience', 'projects', 'collaborator', 'skills', 'project_collaborators', 'project_skills'];

  for (const table of tables) {
    await initialize_table(table);
  }
  for (const datum of data){
      await initialize_data(datum);
  }
}
