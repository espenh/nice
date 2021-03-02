import { party } from "nice-common";
import Head from "next/head";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>nice-blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      hey {party}
    </div>
  );
}
