import { useState } from "react";

/**
 * This hook allows user to create callendar and manage events
 * @returns {{
 * calendar: object,
 * addEvent: Function,
 * getDay: Function,
 * getMonth: Function
 * }} Calendar management
 */
export function useCalendar() {
  const [calendar, setCalendar] = useState({});

  /**
   * This function allows user to create new event in calendar.
   * @param {{ year:number, month:number, day:number }} DateObject - When event is happening
   * @param {{ title: string, price: number, description: string }} data - Event details (title, price, description)
   * @returns {void}
   */
  const addEvent = ({ year, month, day }, data) => {
    if (day < 1 || month < 1 || month > 12 || month > 12) {
      console.warn("Tried to create Event in non existing day!");
      return;
    }
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
        console.warn(
          "Tried to create two events the same day with the same title!"
        );
      return updated;
    });
  };

  /**
   *
   * @param {{ year:number, month:number, day:number }} DateObject - When event is happening
   * @returns {Array|null} Array of events in day
   */
  const getDay = ({ year, month, day }) => {
    return calendar?.[year]?.[month]?.[day] ?? null;
  };

  /**
   *
   * @param {{ year:number, month:number }} DateObject - When event is happening
   * @returns {{ day: number, events: Array }[]} Array of days -> each day has array of events
   */
  const getMonth = ({ year, month }) => {
    const monthData = calendar?.[year]?.[month];
    if (!monthData) return [];
    return Object.entries(monthData).map(([day, events]) => ({
      day: Number(day),
      events,
    }));
  };
  // {console.log(month[0]?.events.map((e) => e.title))}

  return { calendar, addEvent, getDay, getMonth };
}
