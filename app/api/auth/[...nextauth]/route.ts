// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/app/auth'; // Import the handlers object

export const { GET, POST } = handlers;