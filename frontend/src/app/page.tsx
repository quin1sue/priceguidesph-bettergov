import { HeroIndex } from "@/components/custom/index/hero";
import { Nav } from "@/components/custom/global/nav";
import { Footer } from "@/components/custom/global/footer";
import DataSource from "@/components/custom/index/datasources";

export default async function Home() {
  return (
    <> 
    {/* cyan bg */}
<div className="absolute inset-0 z-10 h-[80%] w-full
  bg-[repeating-linear-gradient(0deg,#C9EBFF 0 80px,transparent 80px 81px),
       repeating-linear-gradient(90deg,#C9EBFF 0 80px,transparent 80px 81px)]">
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
