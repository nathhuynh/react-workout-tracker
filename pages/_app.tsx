import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import SidebarLayout from '../components/SidebarLayout';
import Layout from '../components/Layout'
import Head from 'next/head';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
      <SidebarLayout>
        <Component {...pageProps} />
      </SidebarLayout>
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;