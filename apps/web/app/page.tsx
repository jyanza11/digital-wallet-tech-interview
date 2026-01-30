import { Greetings } from "@/components/greetings";
import { MainMenu } from "@/components/main-menu";

export default function Home() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-6">
        <Greetings />
        <MainMenu />
      </div>
    </section>
  );
}
