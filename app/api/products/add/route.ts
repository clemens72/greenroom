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

// Product validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gross_price: z.number().min(0, 'Gross price must be non-negative'),
  note: z.string(),
  description: z.string().min(1, 'Description is required'),
  booking_contact: z.string().min(1, 'Booking contact is required'),
  leader: z.string().min(1, 'Leader is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

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
        `INSERT INTO products (id, name, gross_price, note, description, booking_contact, leader)
         VALUES (@id, @name, @gross_price, @note, @description, @booking_contact, @leader)`,
        (err) => {
          if (err) {
            console.error('Query error:', err);
            reject(err);
          } else {
            console.log('Product created successfully');
            resolve(null);
          }
        }
      );

      request.addParameter('id', TYPES.UniqueIdentifier, id);
      request.addParameter('name', TYPES.NVarChar, validatedData.name);
      request.addParameter('gross_price', TYPES.Int, validatedData.gross_price);
      request.addParameter('note', TYPES.NVarChar, validatedData.note);
      request.addParameter('description', TYPES.NVarChar, validatedData.description);
      request.addParameter('booking_contact', TYPES.NVarChar, validatedData.booking_contact);
      request.addParameter('leader', TYPES.NVarChar, validatedData.leader);

      connection.execSql(request);
    });

    connection.close();

    return NextResponse.json({
      message: 'Product created successfully',
      productId: id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    return NextResponse.json({
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}