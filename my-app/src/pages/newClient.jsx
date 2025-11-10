import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const NewClientPage = ({ clients, setClients, setCreateClient }) => {
  const schema = yup.object().shape({
    name: yup.string().required("Musisz podać imię"),
    surname: yup.string().required("Musisz podać nazwisko"),
    phone: yup
      .string()
      .required("Musisz podać numer telefonu")
      .min(9, "Numer telefonu powinien mieć co najmniej 9 cyfr"),
    email: yup
      .string()
      .email("Email musi być prawidłowy")
      .required("Musisz podać email"),
    adress: yup.string().required("Musisz podać adres"),
  });

  const confirmedNewSubmit = (data) => {
    setCreateClient(false);
    setClients((prev) => [...prev, data]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Stwórz nowego klienta
      </h1>
      <form onSubmit={handleSubmit(confirmedNewSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Imię..."
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Nazwisko..."
            {...register("surname")}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">{errors.surname?.message}</p>
        </div>
        <input
          type="text"
          placeholder="Telefon..."
          {...register("phone")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
        <input
          type="email"
          placeholder="Email..."
          {...register("email")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        <input
          type="text"
          placeholder="Adres..."
          {...register("adress")}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mt-1">{errors.adress?.message}</p>
        <input
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          value="Dodaj klienta"
        />
      </form>
    </div>
  );
};
