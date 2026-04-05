import "./App.css";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { Pages } from "./types";

function App() {
  const [page, setPage] = useState<{
    name: Pages | null;
    id: string | null;
  }>({ name: null, id: null });
  const [sidebar, setSidebar] = useState(true);

  useEffect(() => {
    // TODO - Load last page visited from storage
    setPage({ name: "home", id: null });
  }, []);

  const renderPage = () => {
    switch (page.name) {
      case "home":
        return <Home />;
      case "chat":
        if (page.id) {
          return <Chat id={page.id} />;
        } else {
          setPage({ name: "home", id: null });
          return <Home />;
        }
      default:
        setPage({ name: "home", id: null });
        return <Home />;
    }
  };

  if (!page.name) return;

  return (
    <>
      <main className="flex">
        {sidebar && <Sidebar page={page.name} handlePage={(p) => setPage(p)} />}
        <Navbar
          handleSidebar={() => setSidebar((prev) => !prev)}
          isSidebar={sidebar}
          page={page.name}
          handlePage={(p) => setPage(p)}
          width={256}
        />
        <div className="flex flex-1 flex-col h-screen overflow-y-auto">
          {renderPage()}
        </div>
      </main>
    </>
  );
}

export default App;
