// app/layout.tsx
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from './theme';
import TimeProvider from './components/Providers/TimeProvider';

export default async function RootLayout(props: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TimeProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <ThemeProvider theme={theme}>
                {props.children}
              </ThemeProvider>
            </AppRouterCacheProvider>
        </TimeProvider>
      </body>
    </html>
  );
}