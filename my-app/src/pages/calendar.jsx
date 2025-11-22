import { MainCalendarContext } from "../App";
import { useContext, useState, useEffect, use } from "react";

export const CalendarPage = () => {
  const { calendar, addEvent, getMonth, removeEvent } =
    useContext(MainCalendarContext);
  const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
  const [currentMonth, setCurrentMonth] = useState({ year: 2025, month: 11 });
  const [firstDay, setFirstDay] = useState(1);
  const [eventsInMonth, setEventsInMonth] = useState([]);
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

  const handleButton = () => {
    addEvent(
      { year: 2025, month: 11, day: 29 },
      { title: "Tort urodzinowy", price: 200, description: "Czekoladowy" }
    );
  };

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
              onClick={handleButton}
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
          />
        </div>
      </div>
    </>
  );
};

const RenderMonthGrid = (props) => {
  const { firstDay, month, daysInMonth, removeEvent, currentMonth } = props;

  const days = [];

  // Puste pola przed 1 dniem miesiąca
  for (let i = 0; i < firstDay - 1; i++) {
    days.push(<div key={"empty-" + i} className="border h-20 bg-white"></div>);
  }

  // Dni miesiąca
  for (let n_day = 1; n_day <= daysInMonth; n_day++) {
    const dayData = month.find((d) => d.day === n_day);
    const events = dayData?.events || [];

    days.push(
      <div
        key={n_day}
        className="border h-20 bg-white flex flex-col p-1 overflow-hidden"
      >
        <div className="font-semibold mb-1">{n_day}</div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {events.map((event, i) => (
            <div
              key={i}
              className="p-[2px] bg-blue-100 rounded text-[10px] shadow-sm"
            >
              <div className="font-semibold flex justify-between">
                {event.title}
                <button
                  onClick={() =>
                    removeEvent(
                      {
                        year: currentMonth.year,
                        month: currentMonth.month,
                        day: n_day,
                      },
                      event.title
                    )
                  }
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>

              {event.price && (
                <div className="text-green-700">{event.price} zł</div>
              )}
              {event.description && (
                <div className="text-gray-600">{event.description}</div>
              )}
              {event.client && (
                <div className="text-gray-500">Klient: {event.client}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <>{days}</>;
};
