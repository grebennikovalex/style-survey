import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import style from "./Dropdown.module.scss";

export default function Dropdown({ options, label, name }) {
  const { register, control } = useFormContext();

  return (
    <div className={style.wrapper}>
      <label className={style.label}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <select {...register(name)} className={style.main} value={value} onChange={onChange}>
            {options.map(({ value, label }) => {
              return (
                <option value={value} key={value}>
                  {label}
                </option>
              );
            })}
          </select>
        )}
      />
    </div>
  );
}
