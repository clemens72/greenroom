import { NextResponse } from 'next/server';
import { Connection, Request } from 'tedious';

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

export async function GET() {
  try {
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

    const events = await new Promise((resolve, reject) => {
      const rows: any[] = [];
      const request = new Request(
        `SELECT id, name, price, leader, location, start_time, end_time, 
                note, description, booking_contact 
         FROM events 
         ORDER BY start_time ASC`,
        (err) => {
          if (err) {
            console.error('Query error:', err);
            reject(err);
          } else {
            console.log('Query executed successfully');
            resolve(rows);
          }
        }
      );

      request.on('row', (columns) => {
        const row: { [key: string]: any } = {};
        columns.forEach((column: { metadata: { colName: string }; value: any }) => {
          row[column.metadata.colName] = column.value;
        });
        rows.push(row);
      });

      connection.execSql(request);
    });

    connection.close();
    return NextResponse.json(events);

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}