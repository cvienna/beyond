import Greeting from "../components/Greeting";
import MessageInput from "../components/MessageInput";

const Home = () => {
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center h-full w-full">
        <Greeting />
        <MessageInput size="md" />
      </div>
      <div style={{ height: `${16 * 2 + 14}px` }} />
    </>
  );
};

export default Home;
