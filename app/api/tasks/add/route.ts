import { NextResponse, NextRequest } from 'next/server';
import { Connection, Request, TYPES } from 'tedious';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

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

// Task validation schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  open_at: z.string().nullable(),
  due_at: z.string().nullable(),
  closed_at: z.string().nullable(),
  open_by: z.string().min(1, 'Opened by is required'),
  closed_by: z.string().nullable(),
});

interface QueryResult {
  id: {
    value: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const connection = new Connection(config);

    await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          console.error('Connection error:', err);
          reject(err);
        } else {
          console.log('Connected to SQL Server');
          resolve(null);
        }
      });
      connection.connect();
    });

    const id = uuidv4();

    const result = await new Promise<QueryResult>((resolve, reject) => {
      const request = new Request(
        `INSERT INTO tasks (id, title, description, open_at, due_at, closed_at, open_by, closed_by)
         VALUES (@id, @title, @description, @open_at, @due_at, @closed_at, @open_by, @closed_by);
         SELECT SCOPE_IDENTITY() AS id;`,
        (err, rowCount, rows) => {
          if (err) {
            console.error('Query error:', err);
            reject(err);
          } else {
            console.log('Task created successfully');
            resolve({ id: rows?.[0]?.[0] || { value: '' } });
          }
        }
      );

      request.addParameter('id', TYPES.Char, id);
      request.addParameter('title', TYPES.NVarChar, validatedData.title);
      request.addParameter('description', TYPES.NVarChar, validatedData.description);
      request.addParameter('open_at', TYPES.DateTime, validatedData.open_at);
      request.addParameter('due_at', TYPES.DateTime, validatedData.due_at);
      request.addParameter('closed_at', TYPES.DateTime, validatedData.closed_at);
      request.addParameter('open_by', TYPES.UniqueIdentifier, validatedData.open_by);
      request.addParameter('closed_by', TYPES.UniqueIdentifier, validatedData.closed_by);

      connection.execSql(request);
    });

    connection.close();

    return NextResponse.json({
      message: 'Task created successfully',
      taskId: result.id.value
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    return NextResponse.json({
      error: 'Failed to create task',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}