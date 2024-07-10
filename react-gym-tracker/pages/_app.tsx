import { AppProps } from 'next/app';
import '../styles/globals.css';
import SidebarLayout from '../components/SidebarLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SidebarLayout>
      <Component {...pageProps} />
    </SidebarLayout>
  );
}

export default MyApp;