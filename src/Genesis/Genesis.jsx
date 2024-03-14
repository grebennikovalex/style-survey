import React, { useState, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import style from "./Genesis.module.scss";
import Layout from "../Layout/Layout";
import Dropdown from "../ui_elements/Dropdown/Dropdown";
import TextInput from "../ui_elements/TextInput/TextInput";
import PhoneInput from "../ui_elements/PhoneInput/PhoneInput";
import { rooms, styleList, colors, floors, plants } from "../config/constants";
import { fields } from "../config/fields";
import GenContainer from "../GenContainer/GenContainer";

export default function Genesis() {
  const { room, interiorStyle, yesColor, noColor, floor, plant, firstName, phone } = fields;
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

  useEffect(() => {
    setUnwantedColors(colors.filter((color) => yesColorValue !== color.value));
  }, [yesColorValue, setUnwantedColors]);

  useEffect(() => {
    let ind = colors.map((o) => o.value).indexOf(yesColorValue);
    if (ind + 1 > unwantedColors.length) ind = 0;
    setValue("noColor", unwantedColors[ind].value);
  }, [getValues, unwantedColors]);

  return (
    <Layout>
      <FormProvider {...form}>
        <div className={style.fieldsContainer}>
          <TextInput name={firstName.name} required label={firstName.label} />
          <PhoneInput name={phone.name} required label={phone.label} />
        </div>
        <div className={style.fieldsContainer}>
          <Dropdown name={room.name} options={rooms} label={room.label} />
          <Dropdown name={interiorStyle.name} options={styleList} label={interiorStyle.label} />
        </div>
        <div className={style.fieldsContainer}>
          <Dropdown name={plant.name} options={plants} label={plant.label} />
          <Dropdown name={floor.name} options={floors} label={floor.label} />
        </div>
        <div className={style.fieldsContainer}>
          <Dropdown name={yesColor.name} options={colors} label={yesColor.label} />
          <Dropdown name={noColor.name} options={unwantedColors} label={noColor.label} />
        </div>

        <GenContainer />
      </FormProvider>
    </Layout>
  );
}
