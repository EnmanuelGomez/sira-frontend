import Footer from "./components/Footer";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <main className="flex-1 mt-10 mb-24 px-4 md:px-8">{children}</main>
        </Providers>
        {/** <Footer /> */}
      </body>
    </html>
  );
}