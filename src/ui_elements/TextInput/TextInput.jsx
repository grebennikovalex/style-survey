import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import style from "./TextInput.module.scss";

export default function TextInput({ label, name, required = false }) {
  const { register, control } = useFormContext();

  return (
    <div className={style.wrapper}>
      <label className={style.label}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => <input {...register(name, { required })} className={style.main} value={value} onChange={onChange} />}
      />
    </div>
  );
}
