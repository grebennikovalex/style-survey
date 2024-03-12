import React, { useState } from "react";
import style from "./Dropdown.module.scss";

export default function Dropdown({ options }) {
  const [value, setValue] = useState(options[0].value);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <select className={style.main} value={value} onChange={handleChange}>
        {options.map(({ value, label }) => {
          return (
            <option value={value} key={value}>
              {label}
            </option>
          );
        })}
      </select>
      {/* <p>{options.find((option) => option.value === value).label}</p> */}
    </>
  );
}
