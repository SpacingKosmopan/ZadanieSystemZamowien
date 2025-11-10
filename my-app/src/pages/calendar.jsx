import { get, set } from "react-hook-form";
import { MainCalendarContext } from "../App";
import { useContext, useState, useEffect, use } from "react";

export const CalendarPage = () => {
  const { calendar, addEvent, getDay, getMonth } =
    useContext(MainCalendarContext);
  const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
  const [currentMonth, setCurrentMonth] = useState({ year: 2025, month: 11 });
  const [firstDay, setFirstDay] = useState(0);
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
  }, [calendar]);

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
    }
  };

  const getFirstDay = () => {
    const day = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();
    setFirstDay(day);
  };

  //console.log(calendar);

  return (
    <>
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
      <div>
        <table>
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <RenderMonth
              firstDay={firstDay}
              month={eventsInMonth}
              daysInMonth={daysInMonths[currentMonth.month]}
            />
          </tbody>
        </table>
      </div>
    </>
  );
};

const RenderMonth = (props) => {
  const firstDay = props.firstDay;
  const month = props.month;
  const daysInMonth = props.daysInMonth;
  const monthToRender = [];
  {
    /* Puste komórki */
  }
  for (let i = 0; i < firstDay - 1; i++) {
    monthToRender.push(
      <td key={"empty-" + i}>
        <div></div>
      </td>
    );
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayData = month.find((d) => d.day === day);
    monthToRender.push(
      <td key={day}>
        <div>
          {/* Numer dnia */}
          <div>{day}</div>

          {/* Wydarzenia */}
          <div>
            {dayData?.events.map((event, index) => (
              <div key={index}>
                <p>{event.title}</p>
                {event.price && <p>{event.price} zł</p>}
                {event.description && <p>{event.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </td>
    );
  }
  return (
    <>
      {monthToRender.map((day, i) =>
        i % 7 === 0 ? <tr key={i}>{monthToRender.slice(i, i + 7)}</tr> : null
      )}
    </>
  );
};
