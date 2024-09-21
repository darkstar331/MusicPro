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
          <body className={`${roboto.className} h-[100vh] overflow-y-hidden relative bg-slate-950`}>
            <div className="absolute bottom-0 -z-10 left-[-0%] top-[-10%] sm:top-[-5%] md:top-[-3%] lg:top-[-2%] h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px] 2xl:h-[700px] 2xl:w-[700px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-0 right-[-0%] top-[-10%] sm:top-[-5%] md:top-[-1%] lg:top-[-2%] h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px] 2xl:h-[700px] 2xl:w-[700px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
            <Header />
            <SearchBar />
            <main>{children}</main>
            <MusicPlayer />
          </body>
        </html>
      </MusicPlayerProvider>
    </SessionWrapper>
  );
}
