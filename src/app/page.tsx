import { HeroIndex } from "@/components/custom/index/hero";
import { Nav } from "@/components/custom/global/nav";

export default async function Home() {
  return (
    <>
      <main className="relative w-full bg-white overflow-hidden">
        <Nav pos="fixed" />
        <HeroIndex />
      </main>
    </>
  );
}
