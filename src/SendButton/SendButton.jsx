import React, { useState } from "react";
import Button from "../ui_elements/Button/Button";
import { useFormContext } from "react-hook-form";

const Host = import.meta.env.VITE_HOST;
const Username = import.meta.env.VITE_USERNAME;
const Password = import.meta.env.VITE_PASSWORD;

export default function SendButton({ url }) {
  const form = useFormContext();
  const { getValues } = form;

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    const values = getValues();
    const prompt = createPrompt(values);

    const emailSent = await Email.send({
      Host,
      Username,
      Password,
      //   To: "tatiana.kotulevich@yandex.ru",
      To: "a-greb@yandex.ru",
      From: "a-greb@yandex.ru",
      Subject: "Генезис",
      Body: `<html>
            <h2>Имя того, кто пошалил на сайте: <strong>${values.name}</strong></h2>
            <h2>И его телефон: <strong>${values.phone}</strong></h2><br />
            <h2>Текст запроса</h2>
            <strong>${prompt}</strong><br/>
            <img style="margin-top: 10px;" src=${url} />
            </br>
            </html>`,
    });

    if (emailSent == "OK") {
      setSent(true);
      setLoading(false);
    }
  };
  return <Button disabled={sent} loading={loading} type="primary" text={sent ? "ОТПРАВЛЕНО" : "ОТПРАВИТЬ РЕЗУЛЬТАТ"} onClick={send} />;
}
