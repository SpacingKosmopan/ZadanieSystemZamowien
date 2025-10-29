import { useState } from "react";

export function useCalendar() {
  const [calendar, setCalendar] = useState({});

  const addEvent = ({ year, month, day }, data) => {
    setCalendar((prev) => {
      const updated = { ...prev };
      if (!updated[year]) updated[year] = {};
      if (!updated[year][month]) updated[year][month] = {};
      updated[year][month][day] = data;
      return updated;
    });
  };

  const getEvent = ({ year, month, day }) => {
    return calendar?.[year]?.[month]?.[day] ?? null;
  };

  return { calendar, addEvent, getEvent };
}
