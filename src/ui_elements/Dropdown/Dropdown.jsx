import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import style from "./Dropdown.module.scss";

export default function Dropdown({ options, label, name }) {
  const { register } = useFormContext();
  const [value, setValue] = useState(options[0].value);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={style.wrapper}>
      <label className={style.label}>{label}</label>
      <select {...register(name)} className={style.main} value={value} onChange={handleChange}>
        {options.map(({ value, label }) => {
          return (
            <option value={value} key={value}>
              {label}
            </option>
          );
        })}
      </select>
      {/* <p>{options.find((option) => option.value === value).label}</p> */}
    </div>
  );
}
