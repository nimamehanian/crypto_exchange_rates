import type { AppProps as AP } from 'next/app';
import GlobalStyles from '@styles/global';

const App = ({ Component, pageProps }: AP): JSX.Element => (
  <div>
    <GlobalStyles />
    <Component {...pageProps} />
  </div>
);

export default App;
