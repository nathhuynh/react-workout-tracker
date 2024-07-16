import { AppProps } from 'next/app';
import '../styles/globals.css';
import SidebarLayout from '../components/SidebarLayout';
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <><Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head><SidebarLayout>
        <Component {...pageProps} />
      </SidebarLayout></>
  );
}

export default MyApp;