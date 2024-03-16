import React from "react";
import style from "./Layout.module.scss";

export default function Layout({ children }) {
  return (
    <div id="genesis-container" className={style.layoutWrapper}>
      {children}
    </div>
  );
}
