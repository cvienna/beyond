import Greeting from "../components/Greeting";
import MessageInput from "../components/MessageInput";
import { useUiStore } from "@/store/ui";

const Home = () => {
  const { route } = useUiStore();

  if (route.page !== "home") return;

  return (
    <>
      <div className="flex flex-col gap-12 justify-center items-center h-full w-full">
        <Greeting />
        <MessageInput size="sm" />
      </div>
    </>
  );
};

export default Home;
