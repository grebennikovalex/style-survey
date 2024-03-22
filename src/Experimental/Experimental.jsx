import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import TextInput from "../ui_elements/TextInput/TextInput";
import style from "./Experimental.module.scss";
import Button from "../ui_elements/Button/Button";

export default function Experimental() {
  const [image, setImage] = useState(null);
  const form = useFormContext();
  const { getValues } = form;
  const generate = async () => {
    const prompt = getValues("ex_prompt");
    const data = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    data.body = JSON.stringify({ prompt, steps: 50 });

    const apiUrl = "http://localhost:8010/proxy/sdapi/v1/txt2img";
    const response = await fetch(apiUrl, data);
    const result = await response.json();
    setImage(result.images[0]);
  };
  return (
    <div className={style.container}>
      <TextInput name={"ex_prompt"} required label={"Experimental prompt"} />
      {image && <img src={`data:image/jpeg;charset=utf-8;base64,  ${image}`} />}
      <Button text={"generate experimental"} onClick={generate} />
    </div>
  );
}
