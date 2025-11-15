import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { MainPage } from "./pages/mainmenu";
import { OrdersPage } from "./pages/orders";
import { CalendarPage } from "./pages/calendar";
import { ClientsPage } from "./pages/clients";
import { createContext, useState, useEffect } from "react";
import { useCalendar } from "./pages/useCalendar";
import { CatPage } from "./pages/cat";

export const MainCalendarContext = createContext();
export const ClientsContext = createContext();

function App() {
  const { calendar, addEvent, getDay, getMonth, removeEvent } = useCalendar();
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem("clients");
    return savedClients ? JSON.parse(savedClients) : [];
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  return (
    <>
      <MainCalendarContext.Provider
        value={{ calendar, addEvent, getDay, getMonth, removeEvent }}
      >
        <ClientsContext.Provider value={{ clients, setClients }}>
          <Router>
            <nav className="bg-blue-600 text-white shadow-md">
              <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-wide">
                  🛒 System Zamówień
                </h1>

                <div className="md:hidden">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="focus:outline-none"
                  >
                    {menuOpen ? "✖" : "☰"}
                  </button>
                </div>

                <div
                  className={`flex-col md:flex md:flex-row gap-2 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent transition-all duration-300 ${
                    menuOpen ? "flex" : "hidden"
                  }`}
                >
                  <NavLink title="Strona główna" pathName="/" />
                  <NavLink title="Zamówienia" pathName="/orders" />
                  <NavLink title="Klienci" pathName="/clients" />
                  <NavLink title="Kalendarz" pathName="/calendar" />
                  <NavLink title="Kociekawostka" pathName="/cat" />
                </div>
              </div>
            </nav>
            <main className="p-6">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/cat" element={<CatPage />} />
              </Routes>
            </main>
          </Router>
        </ClientsContext.Provider>
      </MainCalendarContext.Provider>
    </>
  );
}

const NavLink = (props) => {
  const linkNormal =
    "relative px-3 py-2 rounded-full transition-all duration-300 text-white bg-blue-600";
  const linkHover = "hover:bg-blue-500/40 hover:text-blue-100";
  const linkActive = "bg-yellow-400/30 text-yellow-200";
  const linkActiveHover = "hover:bg-yellow-300/50 hover:text-yellow-100";

  const location = useLocation();
  const isActive = props.pathName === location.pathname;

  return (
    <Link
      to={props.pathName}
      className={`${linkNormal} ${isActive ? linkActive : linkHover} ${
        isActive ? linkActiveHover : ""
      }`}
    >
      {props.title}
    </Link>
  );
};

export default App;
