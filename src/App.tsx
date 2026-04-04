import "./App.css";
import { useState } from "react";
import Greeting from "./components/Greeting";
import MessageInput from "./components/MessageInput";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <main className="flex">
        <Navbar
          handleSidebar={() => setSidebar((prev) => !prev)}
          isSidebar={sidebar}
          width={240}
        />
        {sidebar && <Sidebar />}
        <div className="flex flex-col h-screen w-full">
          <div className="flex flex-col gap-10 justify-center items-center h-full w-full">
            <Greeting />
            <MessageInput />
          </div>
          <div style={{ height: `${16 * 2 + 14}px` }} />
        </div>
      </main>
    </>
  );
}

export default App;
