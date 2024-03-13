import React, { useState, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Layout from "./Layout/Layout";
import Dropdown from "./ui_elements/Dropdown/Dropdown";
import { rooms, styles, colors, floors, plants } from "./config/constants";
import { room, style, yesColor, noColor, floor, plant } from "./config/fields";
import Genesis from "./Genesis/Genesis";

export default function StyleSurvey() {
  const [unwantedColors, setUnwantedColors] = useState(colors);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      yesColor: "white",
      noColor: "beige",
    },
  });
  const { control, setValue, getValues } = form;

  const yesColorValue = useWatch({ control, name: "yesColor" });
  const noColorValue = useWatch({ control, name: "noColor" });

  useEffect(() => {
    setUnwantedColors(colors.filter((color) => yesColorValue !== color.value));
  }, [yesColorValue, setUnwantedColors]);

  useEffect(() => {
    setValue("noColor", unwantedColors[0].value);
  }, [getValues, unwantedColors]);

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

        <Genesis />
      </FormProvider>
    </Layout>
  );
}
