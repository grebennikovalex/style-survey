import React from "react";
import cn from "classnames";
import style from "./Button.module.scss";

export default function Button({ type = 'primary', disabled = false }) {
    return <button disabled className={cn(style.button, {
        [style.disabled]: disabled,
        [style.secondary]: type === 'secondary'
    })}>СГЕНЕРИРОВАТЬ</button>;
}
