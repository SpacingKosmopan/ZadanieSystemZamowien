import { MainCalendarContext } from "../App";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

export const OrdersPage = (props) => {
  const { calendar, addEvent, getDay, getMonth } =
    useContext(MainCalendarContext);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    title: yup.string().required("Musisz podać tytuł zamówienia"),
    date: yup.string().required("Musisz podać datę zamówienia"),
    price: yup
      .number("Cena musi być liczbą")
      .required("Musisz podać cenę zamówienia")
      .min(0, "Cena nie może być ujemna"),
    description: yup.string().required("Musisz podać treść zamówienia"),
  });

  const confirmedNewSubmit = (data) => {
    const [year, month, day] = data.date.split("-").map(Number);
    addEvent(
      { year: year, month: month, day: day },
      {
        title: data.title,
        price: data.price,
        description: data.description,
      }
    );
    navigate("/calendar");
  };

  return (
    <div>
      {props?.editDay ? (
        <EditOrderPage
          schema={schema}
          //confirmedSubmit={confirmedSubmit}
          editDay={props.editDay}
        />
      ) : (
        <NewOrderPage schema={schema} confirmedNewSubmit={confirmedNewSubmit} />
      )}
    </div>
  );
};

const NewOrderPage = ({ schema, confirmedNewSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <div>
      <h1>Stwórz nowe zamówienie</h1>
      <div>
        <form onSubmit={handleSubmit(confirmedNewSubmit)}>
          <input type="text" placeholder="Tytuł..." {...register("title")} />
          <p>{errors.title?.message}</p>
          <input type="date" placeholder="Data..." {...register("date")} />
          <p>{errors.date?.message}</p>
          <input
            type="number"
            step={0.01}
            placeholder="Cena..."
            {...register("price")}
          />
          <p>{errors.price?.message}</p>
          <textarea placeholder="Treść..." {...register("description")} />
          <p>{errors.description?.message}</p>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

const EditOrderPage = () => {};
