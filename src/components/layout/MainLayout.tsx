import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";
import { WebsiteContentProvider } from "@/hooks/useWebsiteContent";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <WebsiteContentProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </WebsiteContentProvider>
  );
}
