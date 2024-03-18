import React, { useState, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import style from "./Genesis.module.scss";
import Layout from "../Layout/Layout";
import Dropdown from "../ui_elements/Dropdown/Dropdown";
import TextInput from "../ui_elements/TextInput/TextInput";
import PhoneInput from "../ui_elements/PhoneInput/PhoneInput";
import { rooms, styleList, colors, floors, plants, indifferent, decorSelection, defaultValues } from "../config/constants";
import { fields } from "../config/fields";
import GenerateButton from "../GenerateButton/GenerateButton";
import { title } from "../assets/texts";

export default function Genesis() {
  const { room, interiorStyle, yesColor, noColor, floor, plant, firstName, phone, backgroundColor, decor } = fields;
  const [unwantedColors, setUnwantedColors] = useState(indifferent.concat(colors));

  const form = useForm({
    mode: "onBlur",
    defaultValues,
  });
  const { control, setValue } = form;

  const yesColorValue = useWatch({ control, name: "yesColor" });
  const noColorValue = useWatch({ control, name: "noColor" });

  useEffect(() => {
    if (noColorValue === "indifferent") return;
    setUnwantedColors(indifferent.concat(colors).filter((color) => yesColorValue !== color.value));
  }, [yesColorValue, setUnwantedColors]);

  useEffect(() => {
    let ind = colors.map((o) => o.value).indexOf(yesColorValue);
    if (ind + 1 > unwantedColors.length) ind = 0;
    setValue("noColor", unwantedColors[ind].value);
  }, [setValue, unwantedColors]);

  return (
    <Layout>
      <div className={style.infoContainer}>
        <p className={style.title}>{title}</p>
      </div>
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
        <div className={style.fieldsContainer}>
          <Dropdown name={backgroundColor.name} options={colors} label={backgroundColor.label} />
          <Dropdown name={decor.name} options={decorSelection} label={decor.label} />
        </div>

        <GenerateButton />
      </FormProvider>
    </Layout>
  );
}
