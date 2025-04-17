// app/api/users/add/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { Connection, Request, TYPES } from 'tedious';
import { v4 as uuidv4 } from 'uuid';

// Database connection configuration (move these to environment variables in production)
const config = {
    server: (process.env.SQL_SERVER_HOST) as string,
    authentication: {
      type: 'default' as 'default',
      options: {
        userName: process.env.SQL_SERVER_USER,
        password: process.env.SQL_SERVER_PASSWORD,
      },
    },
    options: {
      port: parseInt(process.env.SQL_SERVER_PORT || '1433', 10),
      database: process.env.SQL_SERVER_DATABASE,
      trustServerCertificate: true,
    },
  };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, first_name, last_name } = body;

    if (!username || !first_name || !last_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = new Connection(config);

    await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          console.error('Connection error:', err);
          reject(err);
        } else {
          console.log('Connected to SQL Server for user creation');
          resolve(null);
        }
      });

      connection.connect();
    });

    const id = uuidv4();
    const createdAt = new Date();

    const sql = `
      INSERT INTO users (id, created_at, last_modification, enabled, username, first_name, last_name)
      VALUES (@id, @createdAt, @lastModification, @enabled, @username, @first_name, @last_name)
    `;

    await new Promise((resolve, reject) => {
      const request = new Request(sql, (err) => {
        if (err) {
          console.error('Insert error:', err);
          reject(err);
        } else {
          console.log('User created successfully');
          resolve(null);
        }
      });

      request.addParameter('id', TYPES.Char, id);
      request.addParameter('createdAt', TYPES.DateTime, createdAt);
      request.addParameter('lastModification', TYPES.DateTime, createdAt); // Setting to creation time for now
      request.addParameter('enabled', TYPES.Bit, true); // Default to enabled
      request.addParameter('username', TYPES.VarChar, username);
      request.addParameter('first_name', TYPES.VarChar, first_name);
      request.addParameter('last_name', TYPES.VarChar, last_name);

      connection.execSql(request);
    });

    connection.close();
    return NextResponse.json({ message: 'User created successfully', userId: id }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}