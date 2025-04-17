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

// Organization validation schema
const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  year: z.number().min(1800, 'Year must be 1800 or later').max(new Date().getFullYear(), 'Year cannot be in the future'),
  type: z.string().min(1, 'Type is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = organizationSchema.parse(body);

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

    await new Promise((resolve, reject) => {
      const request = new Request(
        `INSERT INTO organizations (id, name, address, year, type)
         VALUES (@id, @name, @address, @year, @type)`,
        (err) => {
          if (err) {
            console.error('Query error:', err);
            reject(err);
          } else {
            console.log('Organization created successfully');
            resolve(null);
          }
        }
      );

      request.addParameter('id', TYPES.UniqueIdentifier, id);
      request.addParameter('name', TYPES.NVarChar, validatedData.name);
      request.addParameter('address', TYPES.NVarChar, validatedData.address);
      request.addParameter('year', TYPES.Int, validatedData.year);
      request.addParameter('type', TYPES.NVarChar, validatedData.type);

      connection.execSql(request);
    });

    connection.close();

    return NextResponse.json({
      message: 'Organization created successfully',
      organizationId: id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating organization:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    return NextResponse.json({
      error: 'Failed to create organization',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}