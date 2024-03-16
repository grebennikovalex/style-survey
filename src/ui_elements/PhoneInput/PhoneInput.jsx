import React from "react";
import { InputMask } from "@react-input/mask";
import { Controller, useFormContext } from "react-hook-form";
import style from "./PhoneInput.module.scss";

const regexForPhone = /^(\+7|7|8)?[\s\-]?\([0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm;

export default function PhoneInput({ label, name, required = false }) {
  const { register, control } = useFormContext();

  return (
    <div className={style.wrapper}>
      <label className={style.label}>{label}</label>
      <Controller
        control={control}
        name={name}
        rules={{
          required,
          pattern: {
            value: regexForPhone,
            message: "Некорректный номер",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <InputMask
            placeholder="+7 "
            mask="+7 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            {...register(name, { required })}
            className={style.main}
            value={value}
            onChange={onChange}
          />
        )}
      />
    </div>
  );
}
