import { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html>
      <body>
    <div>
      <header>
        <h1>Bienvenido a SIRA</h1>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </div>
      </body>
    </html>
  );
}

export default MyApp;