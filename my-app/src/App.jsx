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
import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log(location.pathname);
  });

  return (
    <>
      <Router>
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">
              🛒 System Zamówień
            </h1>

            <div className="flex gap-6">
              <NavLink title="Strona główna" pathName="/" />
              <NavLink title="Zamówienia" pathName="/orders" />
              <NavLink title="Klienci" pathName="/clients" />
              <NavLink title="Kalendarz" pathName="/calendar" />
            </div>
          </div>
        </nav>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
      </Router>
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
