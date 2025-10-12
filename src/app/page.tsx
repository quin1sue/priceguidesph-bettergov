import { HeroIndex } from "@/components/custom/index/hero";
import { Nav } from "@/components/custom/global/nav";
import { Footer } from "@/components/custom/global/footer";

export default async function Home() {
  return (
    <>
      <main className="relative w-full bg-white overflow-hidden">
        <Nav pos="fixed" />
        <HeroIndex />
        <Footer />
      </main>
    </>
  );
}
