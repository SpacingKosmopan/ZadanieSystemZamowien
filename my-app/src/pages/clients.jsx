import { useState } from "react";
import { NewClientPage } from "./newClient";
import { ClientsContext } from "../App";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";

export const ClientsPage = () => {
  const [createClient, setCreateClient] = useState(false);
  const { clients, setClients } = useContext(ClientsContext);

  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("selected");

  const highlightedClient = selectedId
    ? clients.find((c) => String(c.id) === String(selectedId))
    : null;

  const deleteClient = (client) => {
    const confirmDelete = window.confirm(
      "Czy jesteś pewien, że chchesz usunąć " +
        client.name +
        " " +
        client.surname +
        "?"
    );
    if (confirmDelete)
      setClients((prev) => prev.filter((_client) => _client !== client));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => setCreateClient(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Dodaj nowego klienta
      </button>

      {highlightedClient && (
        <div className="p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow">
          <h2 className="text-xl font-bold">
            Wybrany klient: {highlightedClient.name} {highlightedClient.surname}
          </h2>
          <p className="text-gray-700">Telefon: {highlightedClient.phone}</p>
          <p className="text-gray-700">Email: {highlightedClient.email}</p>
          <p className="text-gray-700">Adres: {highlightedClient.adress}</p>
        </div>
      )}

      {createClient ? (
        <NewClientPage
          clients={clients}
          setClients={setClients}
          setCreateClient={setCreateClient}
        />
      ) : clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-bold text-gray-800 flex justify-between items-center">
                <span>
                  {client.name} {client.surname}
                </span>
                <button
                  onClick={() => deleteClient(client)}
                  className="px-2 py-1 bg-orange-200 text-white rounded hover:bg-green-700 text-sm"
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
