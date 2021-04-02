import { Container, createStyles, makeStyles, Theme } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import { Story } from "../components/story/story";

export default function Home() {
  const classes = useStyles();
  return (
    <div className={classes.outside}>
      <Container className={classes.inside}>
        <Head>
          <title>nice-blog</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Story />
      </Container>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outside: {
      backgroundColor: theme.palette.background.default,
      //backgroundImage: "url(test1.jpg)",
      background: `linear-gradient(180deg, transparent, ${
        theme.palette.type === "light"
          ? theme.palette.grey[200]
          : theme.palette.grey[900]
      } 350px)`,
    },
    inside: {
      backgroundColor: theme.palette.background.paper,
      paddingBottom: theme.spacing(1),
      //backdropFilter: "blur(10px) grayscale(1) brightness(0.5)",
      //background: `linear-gradient(180deg, transparent, ${theme.palette.background.paper} 150px)`,
    },
  })
);
