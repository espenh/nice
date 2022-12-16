import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import './styles.css';

function NiceBlogApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to nice-blog!</title>
      </Head>
      <main className="app">
        <Component {...pageProps}/>
      </main>
    </>
  );
};

export default NiceBlogApp;
