import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import SidebarLayout from '../components/SidebarLayout';
import Layout from '../components/Layout'
import Head from 'next/head';
import FullscreenToggle from '../components/FullscreenToggle';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <div className="app bg-gray-100">
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
      <FullscreenToggle />
    </div>
  );
}

export default MyApp;