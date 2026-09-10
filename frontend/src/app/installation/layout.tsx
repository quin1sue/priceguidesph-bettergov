import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Install App",
    description:
      "Install PriceGuides by BetterGovPh on a supported mobile device for quicker access to Philippine public data.",
    alternates: { canonical: "/installation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex flex-col">
            {children}
        </main>
    );
}
