import "@/styles/globals.css";
import type { AppProps } from "next/app";
import HeaderDefault from "@/components/Gnb/Header_default";
import HeaderDefaultBk from "@/components/Gnb/Header_default_bk";
import HeaderDashboard from "@/components/Gnb/Header_dashboard";
import HeaderMyPage from "@/components/Gnb/Header_mypage";
import HeaderBebridge from "@/components/Gnb/Header_bebridge";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderDefault />
      <HeaderDefaultBk />
      <HeaderDashboard />
      <HeaderMyPage />
      <HeaderBebridge />
    </>
  );
}
