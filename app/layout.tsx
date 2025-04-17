import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from './theme';
import TimeProvider from './components/Providers/TimeProvider';
import { AuthProvider } from '@/app/auth/AuthContext';

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TimeProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <AuthProvider>
                {props.children}
              </AuthProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </TimeProvider>
      </body>
    </html>
  );
}