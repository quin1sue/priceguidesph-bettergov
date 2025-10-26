import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Install App",
    description:
      "Price Guides by BetterGovPh is now available to install on mobile for all platforms including iOS and Android"
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex flex-col">
            {children}
        </main>
    );
}
