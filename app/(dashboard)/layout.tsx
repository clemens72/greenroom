import * as React from 'react';
import TopBar from '../components/TopBar';

export default async function RootLayout(props: { children: React.ReactNode }) {

  return (
    <>
        <TopBar />
        {props.children}
    </>
  );
}