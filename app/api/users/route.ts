import { NextResponse } from 'next/server';
 import { Connection, Request, TYPES } from 'tedious';
 
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
 
     const users = await new Promise((resolve, reject) => {
       const rows: any[] = [];
       const request = new Request("SELECT id, username, first_name, last_name FROM users", (err) => { // Updated query
         if (err) {
           console.error('Query error:', err);
           reject(err);
         } else {
           console.log('Query executed successfully');
           resolve(rows);
         }
       });
 
       request.on('row', (columns) => {
         const row: { [key: string]: any } = {};
         columns.forEach((column: { metadata: { colName: string }; value: any }) => { // Added type annotation for 'column'
           row[column.metadata.colName] = column.value;
         });
         rows.push(row);
       });
 
       connection.execSql(request);
     });
 
     connection.close();
     return NextResponse.json(users);
 
   } catch (error) {
     console.error('Error fetching users:', error);
     return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
   }
 }