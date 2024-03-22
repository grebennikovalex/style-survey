import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import style from "./Genesis.module.scss";
import Layout from "../Layout/Layout";
import Dropdown from "../ui_elements/Dropdown/Dropdown";
import { rooms, styleList, colors, floors, plants, indifferent, defaultValues } from "../config/constants";
import { fields } from "../config/fields";
import GenerateButton from "../GenerateButton/GenerateButton";
import { title } from "../assets/texts";
import Experimental from "../Experimental/Experimental";

export default function Genesis() {
  const { room, interiorStyle, yesColor, noColor, floor, plant, firstName, phone, backgroundColor, decor } = fields;

  const form = useForm({
    mode: "onBlur",
    defaultValues,
  });

  return (
    <Layout>
      <div className={style.infoContainer}>
        <p className={style.title}>{title}</p>
      </div>
      <FormProvider {...form}>
        <div className={style.fieldsContainer}>
          <Dropdown name={interiorStyle.name} options={styleList} label={interiorStyle.label} />
        </div>
        <div className={style.sectionContainer}>
          <p className={style.section}>Дополнительные опции</p>
        </div>
        <div className={style.fieldsContainer}>
          <Dropdown name={room.name} options={rooms} label={room.label} />
          <Dropdown name={plant.name} options={plants} label={plant.label} />
        </div>
        <div className={style.fieldsContainer}>
          <Dropdown name={backgroundColor.name} options={colors} label={backgroundColor.label} />
          <Dropdown name={floor.name} options={floors} label={floor.label} />
        </div>
        <div className={style.fieldsContainer}>
          <Dropdown name={yesColor.name} options={colors} label={yesColor.label} />
          <Dropdown name={noColor.name} options={indifferent.concat(colors)} label={noColor.label} />
        </div>
        <div className={style.sectionContainer}>
          <p className={style.section}>Контактная информация</p>
        </div>

        <GenerateButton />
        <Experimental />
      </FormProvider>
    </Layout>
  );
}
