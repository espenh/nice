import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>nice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        here
      </main>

      <footer>
      </footer>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
