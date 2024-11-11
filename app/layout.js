import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
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
           <Header/>
            <div className="container mx-auto p-6">
              <SearchBar />
              <main className="mt-10 overflow-auto">{children}</main>
            </div>
            <MusicPlayer />
          </body>
        </html>
      </MusicPlayerProvider>
    </SessionWrapper>
  );
}
