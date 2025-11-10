export const MainPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Witaj w panelu zarządzania
      </h1>
      <p className="text-gray-600 text-center max-w-md">
        Tutaj możesz przeglądać klientów, zarządzać zamówieniami oraz planować
        wydarzenia w kalendarzu.
      </p>
    </div>
  );
};
