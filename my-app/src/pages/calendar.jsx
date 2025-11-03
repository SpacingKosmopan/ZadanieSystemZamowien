import { MainCalendarContext } from "../App";
import { useContext } from "react";

export const CalendarPage = () => {
  const { calendar, addEvent, getDay, getMonth } =
    useContext(MainCalendarContext);
  const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];

  const handleButton = () => {
    addEvent(
      { year: 2025, month: 10, day: 29 },
      { title: "Tort urodzinowy", price: 200 }
    );
  };

  return (
    <>
      <button onClick={handleButton}>DODAJ WYDARZENIE</button>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-7 text-center font-semibold text-gray-700 border-b pb-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {getMonth({ year: 2025, month: 10 }).map(({ day, events }) => (
            <div
              key={day}
              className="p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 transition flex flex-col items-center"
            >
              <span className="text-sm font-bold text-blue-700 mb-2">
                Dzień {day}
                {events.map((event, i) => (
                  <div
                    key={i}
                    className="w-full bg-blue-100 text-blue-800 rounded-lg px-2 py-1 mb-1 shadow-sm hover:bg-blue-200 transition"
                  >
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-blue-900">{event.price} zł</p>
                    <p>{event.description}</p>
                  </div>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
