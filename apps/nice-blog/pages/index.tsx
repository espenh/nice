import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Head from "next/head";
import React from "react";
import { Story } from "../components/story/story";

export default function Home() {
  return (
    <>
      <Head>
        <title>nice-blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          background: (theme) =>
            `linear-gradient(180deg, transparent, ${
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[900]
            } 350px)`,
        }}
      >
        <Container
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            paddingBottom: (theme) => theme.spacing(1),
          }}
        >
          <Story />
        </Container>
      </Box>
    </>
  );
}
