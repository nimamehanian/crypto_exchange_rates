import React, { FC } from 'react';
import Head from 'next/head';
import RateConverter from '@components/rateConverter/rateConverter';

const Home: FC = () => (
  <div>
    <Head>
      <title>Crypto Exchange Rates</title>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </Head>

    <RateConverter />
  </div>
);

export default Home;
