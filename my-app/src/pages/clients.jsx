import { useState } from "react";
import { NewClientPage } from "./newClient";
import { ClientsContext } from "../App";
import { useContext } from "react";

export const ClientsPage = ({ isLoggedIn, loading }) => {
  const [createClient, setCreateClient] = useState(false);
  const { clients, addClient, updateClient, removeClient } =
    useContext(ClientsContext);

  if (!isLoggedIn)
    return (
      <p className="text-red-600 font-bold">
        Zaloguj się, aby zobaczyć klientów
      </p>
    );
  if (loading) return <p>Ładowanie danych klientów...</p>;

  const deleteClient = (client) => {
    if (
      window.confirm(
        `Czy jesteś pewien, że chcesz usunąć ${client.name} ${client.surname}?`
      )
    ) {
      removeClient(client.id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => setCreateClient(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Dodaj nowego klienta
      </button>

      {createClient ? (
        <NewClientPage
          clients={clients}
          addClient={addClient}
          updateClient={updateClient}
          setCreateClient={setCreateClient}
        />
      ) : clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-bold text-gray-800 flex justify-between items-center">
                <span>
                  {client.name} {client.surname}
                </span>
                <button
                  onClick={() => deleteClient(client)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-sm"
                >
                  ❌
                </button>
              </h2>
              <p className="text-gray-600">
                <span className="font-semibold">Telefon:</span> {client.phone}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> {client.email}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Adres:</span> {client.adress}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Brak klientów</p>
      )}
    </div>
  );
};
