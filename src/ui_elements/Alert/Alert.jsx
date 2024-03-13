import React from "react";
import cn from "classnames";
import style from "./Alert.module.scss";

export default function Alert({ type = "started", text = "some info" }) {
  let title = "Запрос...";

  if (type === "progress") title = "Генерация...";
  if (type === "error") title = "Ошибка сервера. Попробуйте еще раз...";

  return (
    <div
      className={cn(style.container, {
        [style.started]: type === "started",
        [style.progress]: type === "progress",
        [style.error]: type === "error",
      })}
    >
      <p className={style.title}>{title}</p>
      <p className={style.text}>{text}</p>
    </div>
  );
}
