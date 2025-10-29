import { useCalendar } from "./useCalendar";

export const CalendarPage = () => {
  const { calendar, addEvent, getDay, getMonth } = useCalendar();
  const daysOfWeek = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
  console.log(calendar);

  const handleButton = () => {
    addEvent(
      { year: 2025, month: 10, day: 29 },
      { title: "Tort urodzinowy", price: 200 }
    );
  };

  return (
    <>
      <button onClick={handleButton}>DODAJ WYDARZENIE</button>
      {getDay({ year: 2025, month: 10, day: 29 })?.map((element, i) => (
        <div
          key={i}
          className="border p-4 text-center transition hover:bg-blue-100 bg-gray-50 rounded-lg"
        >
          <p className="font-semibold">{element.title}</p>
          <p className="text-sm text-gray-600">{element.price} zł</p>
        </div>
      ))}
    </>
  );
};
