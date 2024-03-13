import React, { useState, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Layout from "./Layout/Layout";
import Button from "./ui_elements/Button/Button";
import Dropdown from "./ui_elements/Dropdown/Dropdown";
import { rooms, styles, colors, floors, plants } from "./config/constants";
import { room, style, yesColor, noColor, floor, plant } from "./config/fields";
import { getImageURL } from "./getImageURL";

export default function StyleSurvey() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [unwantedColors, setUnwantedColors] = useState(colors);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      yesColor: "white",
    },
  });
  const { getValues, control } = form;

  const excludedColor = useWatch({ control, name: "yesColor" });

  const createPrompt = async () => {
    setLoading(true);
    setUrl(null);

    const values = getValues();

    let noPlants = "";
    let plants = values.plant;

    if (values.plant === "no") {
      noPlants = "plants";
      plants = "";
    }

    if (values.plant === "indifferent") {
      plants = "";
    }

    const prompt = `${values.room} in ${values.style} style, ${values.yesColor} walls, ${values.floor} floor, ${plants} --no ${values.noColor} color, ${noPlants}`;

    const result = await getImageURL(prompt);

    if (result) {
      setLoading(false);
      setUrl(result);
    }
  };

  useEffect(() => {
    setUnwantedColors(colors.filter((color) => excludedColor !== color.value));
  }, [excludedColor, setUnwantedColors]);

  return (
    <Layout>
      <p style={{ textAlign: "center" }}>А здесь, я думаю, нужно какое-то развернутое описание этого сервиса</p>

      <FormProvider {...form}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <Dropdown name={room.name} options={rooms} label={room.label} />
          <Dropdown name={style.name} options={styles} label={style.label} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <Dropdown name={plant.name} options={plants} label={plant.label} />
          <Dropdown name={floor.name} options={floors} label={floor.label} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <Dropdown name={yesColor.name} options={colors} label={yesColor.label} />
          <Dropdown name={noColor.name} options={unwantedColors} label={noColor.label} />
        </div>
      </FormProvider>

      <Button disabled={loading} loading={loading} type="primary" text={"СГЕНЕРИРОВАТЬ"} onClick={createPrompt} />
      {url && (
        <a href={url} target="_blank">
          <img src={url} />
        </a>
      )}
    </Layout>
  );
}
