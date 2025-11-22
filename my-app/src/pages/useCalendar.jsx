import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/**
 * This hook allows user to create calendar and manage events in Firebase
 * only if the user is logged in
 * @param {object|null} user - Firebase user object
 * @returns {{
 * calendar: object,
 * addEvent: Function,
 * getDay: Function,
 * getMonth: Function,
 * removeEvent: Function,
 * updateEvent: Function,
 * isLoggedIn: boolean
 * }} Calendar management
 */
export function useCalendar(user) {
  const [calendar, setCalendar] = useState({});
  const isLoggedIn = !!user;
  const calendarCollection = collection(db, "calendar");

  useEffect(() => {
    if (!isLoggedIn) {
      setCalendar({});
      return;
    }

    const fetchCalendar = async () => {
      const snapshot = await getDocs(calendarCollection);
      const data = {};
      snapshot.forEach((docSnap) => {
        data[docSnap.id] = docSnap.data();
      });
      setCalendar(data);
    };
    fetchCalendar();
  }, [isLoggedIn]);

  const addEvent = async ({ year, month, day }, data) => {
    if (!isLoggedIn) return alert("Zaloguj się, aby zarządzać kalendarzem!");
    const docId = `${year}-${month}-${day}`;
    const dayEvents = calendar[docId]?.events || [];
    const exists = dayEvents.some((event) => event.title === data.title);
    if (!exists) {
      const updatedEvents = [
        ...dayEvents,
        { ...data, status: data.status || "do zrealizowania" },
      ];
      await setDoc(doc(db, "calendar", docId), { events: updatedEvents });
      setCalendar((prev) => ({ ...prev, [docId]: { events: updatedEvents } }));
    }
  };

  const removeEvent = async ({ year, month, day }, title) => {
    if (!isLoggedIn) return alert("Zaloguj się, aby zarządzać kalendarzem!");
    const removeConfirm = window.confirm(
      "Czy na pewno chcesz usunąć to wydarzenie?"
    );
    if (!removeConfirm) return;

    const docId = `${year}-${month}-${day}`;
    const dayEvents = calendar[docId]?.events || [];
    const filteredEvents = dayEvents.filter((event) => event.title !== title);

    if (filteredEvents.length === 0) {
      await deleteDoc(doc(db, "calendar", docId));
      setCalendar((prev) => {
        const updated = { ...prev };
        delete updated[docId];
        return updated;
      });
    } else {
      await updateDoc(doc(db, "calendar", docId), { events: filteredEvents });
      setCalendar((prev) => ({ ...prev, [docId]: { events: filteredEvents } }));
    }
  };

  const updateEvent = async ({ year, month, day }, oldTitle, newData) => {
    if (!isLoggedIn) return alert("Zaloguj się, aby zarządzać kalendarzem!");
    const docId = `${year}-${month}-${day}`;
    const dayEvents = calendar[docId]?.events || [];
    const eventIndex = dayEvents.findIndex((e) => e.title === oldTitle);
    if (eventIndex === -1) return;

    const updatedEvents = [...dayEvents];
    updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], ...newData };
    await updateDoc(doc(db, "calendar", docId), { events: updatedEvents });
    setCalendar((prev) => ({ ...prev, [docId]: { events: updatedEvents } }));
  };

  const getDay = ({ year, month, day }) =>
    isLoggedIn ? calendar[`${year}-${month}-${day}`]?.events ?? null : null;

  const getMonth = ({ year, month }) =>
    isLoggedIn
      ? Object.entries(calendar)
          .filter(([docId]) => docId.startsWith(`${year}-${month}-`))
          .map(([docId, value]) => ({
            day: Number(docId.split("-")[2]),
            events: value.events,
          }))
      : [];

  return {
    calendar,
    addEvent,
    removeEvent,
    updateEvent,
    getDay,
    getMonth,
    isLoggedIn,
  };
}
