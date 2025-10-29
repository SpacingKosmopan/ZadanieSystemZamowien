import { useState } from "react";

export function useCalendar() {
  const [calendar, setCalendar] = useState({});

  const addEvent = ({ year, month, day }, data) => {
    setCalendar((prev) => {
      const updated = { ...prev };
      if (!updated[year]) updated[year] = {};
      if (!updated[year][month]) updated[year][month] = {};
      if (!updated[year][month][day]) updated[year][month][day] = [];
      const exists = updated[year][month][day].some(
        (event) => event.title === data.title
      );
      if (!exists) updated[year][month][day].push(data);
      else
        console.log(
          "Warning: tried to create two events the same day with the same title!"
        );
      return updated;
    });
  };

  const getDay = ({ year, month, day }) => {
    return calendar?.[year]?.[month]?.[day] ?? null;
  };

  const getMonth = ({ year, month }) => {
    return calendar?.[year]?.[month] ?? null;
  };

  return { calendar, addEvent, getDay, getMonth };
}
