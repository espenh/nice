import Head from "next/head";
import React from "react";
import { Story } from "../components/story/story";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>nice-blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Story />
    </div>
  );
}
