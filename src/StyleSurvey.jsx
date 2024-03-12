import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Layout from "./Layout/Layout";
import Button from "./ui_elements/Button/Button";
import Dropdown from "./ui_elements/Dropdown/Dropdown";
import { rooms, styles } from "./config/constants";
import { room, style } from "./config/fields";
import { getImageURL } from "./getImageURL";

export default function StyleSurvey() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const form = useForm({
    mode: "onBlur",
  });
  const { getValues } = form;

  const createPrompt = async () => {
    setLoading(true);
    setUrl(null);
    const values = getValues();
    const prompt = `${values.room} in ${values.style} style`;
    const result = await getImageURL(prompt);
    if (result) {
      setLoading(false);
      setUrl(result);
    }
    return prompt;
  };

  return (
    <Layout>
      <p style={{ textAlign: "center" }}>Привет, смотри... Я развернул проект на Реакте и уже пишу</p>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
        <FormProvider {...form}>
          <Dropdown name={room.name} options={rooms} label={room.label} />
          <Dropdown name={style.name} options={styles} label={style.label} />
        </FormProvider>
      </div>

      <Button disabled={loading} loading={loading} type="primary" text={"СГЕНЕРИРОВАТЬ"} onClick={createPrompt} />
      {url && <img src={url} />}
    </Layout>
  );
}
