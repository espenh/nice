import { Container } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import { Story } from "../components/story/story";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>nice-blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Story />
    </Container>
  );
}
