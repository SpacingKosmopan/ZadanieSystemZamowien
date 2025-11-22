import { MainCalendarContext, ClientsContext } from "../App";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

/**
 * OrdersPage component
 * Dodawanie zamówień do Firestore / kalendarza
 */
export const OrdersPage = ({ isLoggedIn }) => {
  const { addEvent } = useContext(MainCalendarContext);
  const { clients } = useContext(ClientsContext);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <p className="text-red-600 font-bold">
        Zaloguj się, aby dodać nowe zamówienia
      </p>
    );
  }

  const schema = yup.object().shape({
    title: yup.string().required("Musisz podać tytuł zamówienia"),
    date: yup.string().required("Musisz podać datę zamówienia"),
    price: yup
      .number("Cena musi być liczbą")
      .required("Musisz podać cenę zamówienia")
      .min(0, "Cena nie może być ujemna"),
    description: yup.string().required("Musisz podać treść zamówienia"),
    client: yup
      .string()
      .required("Musisz podać klienta")
      .oneOf(
        clients.map((c) => `${c.name} ${c.surname}`),
        "Taki klient nie istnieje"
      ),
  });

  const confirmedNewSubmit = (data) => {
    const [year, month, day] = data.date.split("-").map(Number);
    addEvent(
      { year, month, day },
      {
        title: data.title,
        price: data.price,
        description: data.description,
        client: data.client,
      }
    );
    navigate("/calendar");
  };

  return (
    <NewOrderPage schema={schema} confirmedNewSubmit={confirmedNewSubmit} />
  );
};

const NewOrderPage = ({ schema, confirmedNewSubmit }) => {
  const { clients } = useContext(ClientsContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Stwórz nowe zamówienie
      </h1>
      <p className="text-sm italic text-gray-500 mb-4">
        Upewnij się, że stworzyłeś klienta
      </p>
      <form onSubmit={handleSubmit(confirmedNewSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Tytuł..."
          {...register("title")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>

        <input
          type="date"
          {...register("date")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.date?.message}</p>

        <input
          type="number"
          step={0.01}
          placeholder="Cena..."
          {...register("price")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.price?.message}</p>

        <textarea
          placeholder="Treść..."
          {...register("description")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">
          {errors.description?.message}
        </p>

        <select
          {...register("client")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Wybierz klienta</option>
          {clients.map((client) => (
            <option key={client.id} value={`${client.name} ${client.surname}`}>
              {client.name} {client.surname}
            </option>
          ))}
        </select>
        <p className="text-red-500 text-sm mt-1">{errors.client?.message}</p>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Dodaj zamówienie
        </button>
      </form>
    </div>
  );
};
