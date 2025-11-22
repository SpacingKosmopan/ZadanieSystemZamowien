import { MainCalendarContext } from "../App";
import { useContext, useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { ClientsContext } from "../App";

export const CalendarPage = () => {
  const { calendar, addEvent, getMonth, removeEvent, updateEvent } =
    useContext(MainCalendarContext);
  const { clients } = useContext(ClientsContext);
  const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
  const [currentMonth, setCurrentMonth] = useState({ year: 2025, month: 11 });
  const [firstDay, setFirstDay] = useState(1);
  const [eventsInMonth, setEventsInMonth] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const daysInMonths = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  useEffect(() => {
    getFirstDay();
  }, [currentMonth]);

  useEffect(() => {
    setEventsInMonth(getMonth(currentMonth));
  }, [calendar, currentMonth]);

  const [editData, setEditData] = useState({
    title: "",
    price: "",
    description: "",
    client: "",
    status: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      setEditData({
        title: selectedEvent.title || "",
        price: selectedEvent.price || "",
        description: selectedEvent.description || "",
        client: selectedEvent.client || "",
        status: selectedEvent.status || "do zrealizowania",
      });
      setIsEditing(false);
    }
  }, [selectedEvent]);

  const changeMonth = (direction) => {
    switch (direction) {
      case "next":
        if (currentMonth.month === 12) {
          setCurrentMonth({ year: currentMonth.year + 1, month: 1 });
        } else {
          setCurrentMonth({
            year: currentMonth.year,
            month: currentMonth.month + 1,
          });
        }
        break;
      case "prev":
        if (currentMonth.month === 1) {
          setCurrentMonth({ year: currentMonth.year - 1, month: 12 });
        } else {
          setCurrentMonth({
            year: currentMonth.year,
            month: currentMonth.month - 1,
          });
        }
        break;
      default:
        break;
    }
  };

  const getFirstDay = () => {
    const day = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();
    setFirstDay(day);
  };

  //console.log(calendar);

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-800">
            {currentMonth.month}/{currentMonth.year}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changeMonth("prev")}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 shadow-sm"
            >
              {"<"} Poprzedni miesiąc
            </button>
            <button
              onClick={() => navigate(`/orders`)}
              className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow"
            >
              DODAJ WYDARZENIE
            </button>
            <button
              onClick={() => changeMonth("next")}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 shadow-sm"
            >
              Następny miesiąc {">"}
            </button>
          </div>
        </div>

        {/* Renderowanie miesiąca */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="font-semibold py-1 text-sm bg-gray-200 border"
            >
              {day}
            </div>
          ))}
          <RenderMonthGrid
            firstDay={firstDay}
            month={eventsInMonth}
            daysInMonth={daysInMonths[currentMonth.month]}
            removeEvent={removeEvent}
            currentMonth={currentMonth}
            setSelectedEvent={setSelectedEvent}
          />
        </div>
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Tło */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          ></div>

          {/* Okno */}
          <div className="relative bg-white p-6 rounded-xl shadow-xl max-w-md w-full z-10">
            {!isEditing ? (
              <>
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50">
                  <div className="relative bg-white p-6 rounded-xl shadow-xl max-w-5xl w-full flex flex-col gap-6">
                    <div className="flex gap-6">
                      {/* Lewa kolumna: dane zamówienia */}
                      <div className="flex-1 flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">
                          {selectedEvent.title}
                        </h2>
                        {selectedEvent.price != null && (
                          <p className="font-semibold text-green-700">
                            Cena: {selectedEvent.price} zł
                          </p>
                        )}
                        {selectedEvent.description && (
                          <p>{selectedEvent.description}</p>
                        )}
                        {selectedEvent.client && (
                          <button
                            onClick={() =>
                              navigate(
                                `/clients?selected=${selectedEvent.client.id}`
                              )
                            }
                            className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
                          >
                            🔍 {selectedEvent.client}
                          </button>
                        )}
                        {selectedEvent.status && (
                          <p className="font-medium">
                            Status:{" "}
                            <span
                              className={
                                selectedEvent.status === "Zrealizowane"
                                  ? "text-gray-700"
                                  : selectedEvent.status ===
                                    "W trakcie realizacji"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }
                            >
                              {selectedEvent.status}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Przyciski na dole */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            `Czy na pewno chcesz usunąć wydarzenie: ${selectedEvent.title}?`
                          );
                          if (confirmDelete) {
                            removeEvent(
                              {
                                year: selectedEvent.year,
                                month: selectedEvent.month,
                                day: selectedEvent.day,
                              },
                              selectedEvent.title
                            );
                            setSelectedEvent(null);
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        ❌ Usuń
                      </button>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                      >
                        Zamknij
                      </button>
                    </div>
                  </div>
                </div>

                {/* Przyciski */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition"
                  >
                    ✏️ Edytuj
                  </button>
                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        `Czy na pewno chcesz usunąć wydarzenie: ${selectedEvent.title}?`
                      );
                      if (confirmDelete) {
                        removeEvent(
                          {
                            year: selectedEvent.year,
                            month: selectedEvent.month,
                            day: selectedEvent.day,
                          },
                          selectedEvent.title
                        );
                        setSelectedEvent(null);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-1 rounded bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition"
                  >
                    ❌ Usuń
                  </button>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                >
                  Zamknij
                </button>
              </>
            ) : (
              <>
                {isEditing && selectedEvent && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50">
                    <div className="relative bg-white p-6 rounded-xl shadow-xl max-w-5xl w-full flex flex-col gap-6">
                      <div className="flex gap-6">
                        {/* Lewa kolumna: pola edycji */}
                        <div className="flex-1 flex flex-col gap-4">
                          <input
                            type="text"
                            placeholder="Tytuł"
                            value={editData.title || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                title: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                          <input
                            type="number"
                            placeholder="Cena"
                            value={editData.price || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: Number(e.target.value),
                              })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                          <textarea
                            placeholder="Opis"
                            value={editData.description || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                description: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                          <select
                            value={editData.client || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                client: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded w-full"
                          >
                            <option value="">-- Wybierz klienta --</option>
                            {clients
                              .sort((a, b) =>
                                a.surname.localeCompare(b.surname)
                              )
                              .map((client, i) => (
                                <option
                                  key={i}
                                  value={`${client.name} ${client.surname}`}
                                >
                                  {client.name} {client.surname}
                                </option>
                              ))}
                          </select>
                          <select
                            value={editData.status || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded w-full"
                          >
                            <option value="Do realizacji">Do realizacji</option>
                            <option value="W trakcie realizacji">
                              W trakcie realizacji
                            </option>
                            <option value="Zrealizowane">Zrealizowane</option>
                          </select>
                        </div>
                      </div>

                      {/* Przyciski na dole */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            updateEvent(
                              {
                                year: selectedEvent.year,
                                month: selectedEvent.month,
                                day: selectedEvent.day,
                              },
                              selectedEvent.title,
                              editData
                            );

                            setSelectedEvent({ ...selectedEvent, ...editData });
                            setIsEditing(false);
                          }}
                          className="flex-1 px-3 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300 transition"
                        >
                          💾 Zapisz
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                        >
                          ↩ Anuluj
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const RenderMonthGrid = (props) => {
  const {
    firstDay,
    month,
    daysInMonth,
    removeEvent,
    currentMonth,
    setSelectedEvent,
  } = props;

  const days = [];

  // Puste pola przed 1 dniem
  for (let i = 0; i < firstDay - 1; i++) {
    days.push(<div key={"empty-" + i} className="border h-20 bg-white"></div>);
  }

  // Dni miesiąca
  for (let n_day = 1; n_day <= daysInMonth; n_day++) {
    const dayData = month.find((d) => d.day === n_day);
    const events = dayData?.events || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday =
      n_day === today.getDate() &&
      currentMonth.month - 1 === today.getMonth() &&
      currentMonth.year === today.getFullYear();

    days.push(
      <div
        key={n_day}
        className={`border h-20 flex flex-col p-[2px] overflow-hidden text-[11px] ${
          isToday ? "bg-lime-100" : "bg-white"
        }`}
      >
        {/* Numer dnia */}
        <div className="font-semibold mb-1 text-[12px]">{n_day}</div>

        {/* Wydarzenia */}
        <div className="flex-1 overflow-y-auto space-y-[2px]">
          {events.map((event, i) => {
            const eventDate = new Date(
              currentMonth.year,
              currentMonth.month - 1,
              n_day
            );
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let bgColor = "bg-blue-100";
            let textColor = "";

            if (event.status === "Zrealizowane")
              (bgColor = "bg-gray-400"), (textColor = "text-white");
            else if (event.status === "W trakcie realizacji")
              bgColor = "bg-yellow-300";

            if (eventDate < yesterday && event.status !== "Zrealizowane") {
              bgColor = "bg-red-400";
              textColor = "text-white";
            }

            if (
              eventDate.getFullYear() === today.getFullYear() &&
              eventDate.getMonth() === today.getMonth() &&
              eventDate.getDate() === today.getDate()
            ) {
              bgColor = "bg-lime-400";
              textColor = "text-white";
            }

            return (
              <div
                key={i}
                onClick={() =>
                  setSelectedEvent({
                    ...event,
                    year: currentMonth.year,
                    month: currentMonth.month,
                    day: n_day,
                  })
                }
                className={`p-[2px] rounded text-[10px] shadow-sm cursor-pointer hover:opacity-90 transition ${bgColor} ${textColor}`}
              >
                {event.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <>{days}</>;
};
