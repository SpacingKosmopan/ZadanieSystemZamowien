import { useState } from "react";
import { NewClientPage } from "./newClient";
import { ClientsContext } from "../App";
import { useContext } from "react";

export const ClientsPage = (props) => {
  const [createClient, setCreateClient] = useState(false);
  const { clients, setClients } = useContext(ClientsContext);

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
              <h2 className="text-lg font-bold text-gray-800">
                {client.name} {client.surname}
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
