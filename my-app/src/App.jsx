import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { createContext, useState, useEffect } from "react";

import { MainPage } from "./pages/mainmenu";
import { OrdersPage } from "./pages/orders";
import { CalendarPage } from "./pages/calendar";
import { ClientsPage } from "./pages/clients";
import { CatPage } from "./pages/cat";
import { useCalendar } from "./pages/useCalendar";
import LoginForm from "./pages/LoginForm";

import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import LoginButton from "./pages/LoginButton";

export const MainCalendarContext = createContext();
export const ClientsContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const clientsCollectionRef = collection(db, "clients");

  const { calendar, addEvent, getDay, getMonth, removeEvent, updateEvent } =
    useCalendar(user);

  const isLoggedIn = !!user;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setClients([]);
      return;
    }

    const fetchClients = async () => {
      try {
        const data = await getDocs(clientsCollectionRef);
        const clientsData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsData);
      } catch (err) {
        console.error("Błąd pobierania klientów:", err);
      }
    };
    fetchClients();
  }, [isLoggedIn]);

  const addClient = async (newClient) => {
    if (!isLoggedIn) return alert("Zaloguj się, aby dodać klienta!");
    const docRef = await addDoc(clientsCollectionRef, newClient);
    setClients((prev) => [...prev, { id: docRef.id, ...newClient }]);
  };

  const updateClient = async (id, updatedData) => {
    if (!isLoggedIn) return;
    const clientDoc = doc(db, "clients", id);
    await updateDoc(clientDoc, updatedData);
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  };

  const removeClient = async (id) => {
    if (!isLoggedIn) return;
    const clientDoc = doc(db, "clients", id);
    await deleteDoc(clientDoc);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <MainCalendarContext.Provider
      value={{
        calendar,
        addEvent,
        getDay,
        getMonth,
        removeEvent,
        updateEvent,
      }}
    >
      <ClientsContext.Provider
        value={{ clients, addClient, updateClient, removeClient, isLoggedIn }}
      >
        <Router>
          <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold tracking-wide">
                <Link
                  to="/"
                  className="text-xl font-bold tracking-wide cursor-pointer hover:opacity-80 transition"
                >
                  🛒 System Zamówień
                </Link>
              </h1>

              {user && (
                <div className="flex items-center gap-4">
                  <div className="md:hidden">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="focus:outline-none"
                    >
                      {menuOpen ? "✖" : "☰"}
                    </button>
                  </div>

                  <div
                    className={`flex-col md:flex md:flex-row gap-2 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent z-50 transition-all duration-300 ${
                      menuOpen ? "flex" : "hidden"
                    }`}
                  >
                    <NavLink
                      title="Strona główna"
                      pathName="/"
                      setMenuOpen={setMenuOpen}
                    />
                    <NavLink
                      title="Zamówienia"
                      pathName="/orders"
                      setMenuOpen={setMenuOpen}
                    />
                    <NavLink
                      title="Klienci"
                      pathName="/clients"
                      setMenuOpen={setMenuOpen}
                    />
                    <NavLink
                      title="Kalendarz"
                      pathName="/calendar"
                      setMenuOpen={setMenuOpen}
                    />
                    <NavLink
                      title="Kociekawostka"
                      pathName="/cat"
                      setMenuOpen={setMenuOpen}
                    />
                  </div>
                </div>
              )}

              <LoginButton user={user} setUser={setUser} />
            </div>
          </nav>

          <main className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  !isLoggedIn ? (
                    <LoginForm user={user} setUser={setUser} />
                  ) : (
                    <p>Zalogowano!</p>
                  )
                }
              />
              <Route
                path="/orders"
                element={
                  isLoggedIn ? (
                    <OrdersPage isLoggedIn={isLoggedIn} />
                  ) : (
                    <EmptyPage />
                  )
                }
              />
              <Route
                path="/clients"
                element={
                  isLoggedIn ? (
                    <ClientsPage isLoggedIn={isLoggedIn} />
                  ) : (
                    <EmptyPage />
                  )
                }
              />
              <Route
                path="/calendar"
                element={
                  isLoggedIn ? (
                    <CalendarPage isLoggedIn={isLoggedIn} />
                  ) : (
                    <EmptyPage />
                  )
                }
              />
              <Route path="/cat" element={<CatPage />} />
            </Routes>
          </main>
        </Router>
      </ClientsContext.Provider>
    </MainCalendarContext.Provider>
  );
}

const NavLink = ({ title, pathName, setMenuOpen }) => {
  const location = useLocation();
  const isActive = pathName === location.pathname;
  const linkNormal =
    "relative px-3 py-2 rounded-full transition-all duration-300 text-white bg-blue-600";
  const linkHover = "hover:bg-blue-500/40 hover:text-blue-100";
  const linkActive = "bg-yellow-400/30 text-yellow-200";
  const linkActiveHover = "hover:bg-yellow-300/50 hover:text-yellow-100";

  return (
    <Link
      to={pathName}
      onClick={() => setMenuOpen && setMenuOpen(false)}
      className={`${linkNormal} ${isActive ? linkActive : linkHover} ${
        isActive ? linkActiveHover : ""
      }`}
    >
      {title}
    </Link>
  );
};

const EmptyPage = () => (
  <p className="text-red-600 font-bold">Zaloguj się, aby zobaczyć zawartość</p>
);

export default App;
