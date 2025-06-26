import Footer from "./components/Footer";

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html>
        <body className="flex flex-col min-h-screen">
        <main className="flex-1 mt-10 mb-24 px-4 md:px-8">{children}</main>
        {/**<Footer />**/}
      </body>
      </html>
    );
  }
  