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

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  leader: z.string().min(1, 'Leader is required'),
  location: z.string().min(1, 'Location is required'),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  note: z.string(),
  description: z.string().min(1, 'Description is required'),
  booking_contact: z.string().min(1, 'Booking contact is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

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
        `INSERT INTO events (id, name, price, leader, location, start_time, end_time, 
                           note, description, booking_contact)
         VALUES (@id, @name, @price, @leader, @location, @start_time, @end_time, 
                 @note, @description, @booking_contact)`,
        (err) => {
          if (err) {
            console.error('Query error:', err);
            reject(err);
          } else {
            console.log('Event created successfully');
            resolve(null);
          }
        }
      );

      request.addParameter('id', TYPES.UniqueIdentifier, id);
      request.addParameter('name', TYPES.NVarChar, validatedData.name);
      request.addParameter('price', TYPES.Int, validatedData.price);
      request.addParameter('leader', TYPES.NVarChar, validatedData.leader);
      request.addParameter('location', TYPES.NVarChar, validatedData.location);
      request.addParameter('start_time', TYPES.DateTime, validatedData.start_time);
      request.addParameter('end_time', TYPES.DateTime, validatedData.end_time);
      request.addParameter('note', TYPES.NVarChar, validatedData.note);
      request.addParameter('description', TYPES.NVarChar, validatedData.description);
      request.addParameter('booking_contact', TYPES.NVarChar, validatedData.booking_contact);

      connection.execSql(request);
    });

    connection.close();

    return NextResponse.json({
      message: 'Event created successfully',
      eventId: id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    return NextResponse.json({
      error: 'Failed to create event',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}