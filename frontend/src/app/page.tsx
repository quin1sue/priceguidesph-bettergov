import { HeroIndex } from "@/components/custom/index/hero";
import { Nav } from "@/components/custom/global/nav";
import { Footer } from "@/components/custom/global/footer";
import DataSource from "@/components/custom/index/datasources";

export default async function Home() {
  return (
    <> 
    {/* cyan bg */}
      <div className="absolute inset-0 z-10 h-[80%] w-full 
          bg-white 
          bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),
               linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
          bg-[size:6rem_4rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
        </div>
      <main className="relative w-full overflow-hidden">
  <Nav pos="fixed" />
        <HeroIndex />
        <DataSource />
        <Footer />
      </main>
    </>
  );
}
