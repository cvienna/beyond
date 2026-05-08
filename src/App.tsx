import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { useUiStore } from "./store/ui";
import Settings from "./pages/Settings";

function App() {
  const { route, sidebar } = useUiStore();

  return (
    <>
      <main className="flex">
        {sidebar && <Sidebar />}
        <Navbar width={256} />
        <div className="flex flex-1 flex-col h-screen overflow-y-auto">
          {route.page === "home" && <Home />}
          {route.page === "chat" && <Chat />}
          {route.page === "settings" && <Settings />}
        </div>
      </main>
    </>
  );
}

export default App;
