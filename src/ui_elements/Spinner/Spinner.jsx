import React from "react";
import style from "./Spinner.module.scss";

export default function Spinner({ size }) {
  return <span className={style.spinner} style={{ width: `${size}px`, height: `${size}px` }}></span>;
}
