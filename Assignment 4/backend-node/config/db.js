import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('Connecting to Cloud Supabase PostgreSQL Database...');
  
  // Directly configure with Supabase parameters to handle special characters reliably
  sequelize = new Sequelize('postgres', 'postgres.jbkiyhlsxjpyyrsmlrln', '@(Abhi)1969%', {
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 5432,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
} else {
  // Local Embedded SQLite Database (Default fallback)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './vit_results.sqlite',
    logging: false,
  });
}

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.DATABASE_URL) {
      console.log('Connected to Cloud Supabase PostgreSQL Database successfully.');
    } else {
      console.log('Connected to Local SQLite Database successfully (vit_results.sqlite).');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
