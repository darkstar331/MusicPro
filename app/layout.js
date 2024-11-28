import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import MusicPlayer from "./components/MusicPlayer";
import { MusicPlayerProvider } from "./context/MusicPlayerContext";
import SessionWrapper from "./components/SessionWrapper";

const roboto = Roboto({ subsets: ["latin"], weight: ['400', '700'] });

export const metadata = {
  title: "Stream",
  description: "Listen to your favourite tracks",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <MusicPlayerProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/logo.png" />
          </head>
          <body className={`${roboto.className} h-[100vh] overflow-y-hidden relative bg-[#191414]`}> {/* Changed background to match Shopify theme */}
            <Header />
            <main className="overflow-auto">{children}</main>
            <MusicPlayer />
          </body>
        </html>
      </MusicPlayerProvider>
    </SessionWrapper>
  );
}