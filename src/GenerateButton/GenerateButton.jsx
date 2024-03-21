import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Button from "../ui_elements/Button/Button";
import { createPrompt } from "../createPrompt";
import Alert from "../ui_elements/Alert/Alert";
import { infotext } from "../assets/texts";
import style from "./GenerateButton.module.scss";
import { getHeight } from "../getHeight";
import { getButton } from "../getButton";
import Variants from "../Variants/Variants";

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const token = import.meta.env.VITE_API_TOKEN;
const discord = import.meta.env.VITE_DISCORD_TOKEN;
const server = import.meta.env.VITE_SERVER_ID;
const channel = import.meta.env.VITE_CHANNEL_ID;

const Host = import.meta.env.VITE_HOST;
const Username = import.meta.env.VITE_USERNAME;
const Password = import.meta.env.VITE_PASSWORD;

const testurls = [
  "https://cdn.discordapp.com/attachments/1215254077462814750/1220374833507074110/kotulevich_design_Apartment_in_modern_minimalist_style_dining_r_40c0bb47-fc01-4efd-9903-a66d085113ae.png?ex=660eb5a1&is=65fc40a1&hm=950b422a680895573580526360b871ad49f507b21b1925b9ca600fb3808661eb&",
  "https://cdn.discordapp.com/attachments/1215254077462814750/1220374904453468180/kotulevich_design_Apartment_in_modern_minimalist_style_dining_r_67e7ed0f-195d-4caa-9043-422883fda9c4.png?ex=660eb5b2&is=65fc40b2&hm=79c72eaa77c8d91c1f51e33e2161dc891f299ca61ef461c778040d68a59bc1a5&",
  "https://cdn.discordapp.com/attachments/1215254077462814750/1220374952088309800/kotulevich_design_Apartment_in_modern_minimalist_style_dining_r_f2dde910-aa8f-4be2-a9aa-768b89f89992.png?ex=660eb5be&is=65fc40be&hm=e74032f70d0c60faf5d76216bbef9d320329291c2001f1ecd0422f9d94d87850&",
  "https://cdn.discordapp.com/attachments/1215254077462814750/1220375004902985748/kotulevich_design_Apartment_in_modern_minimalist_style_dining_r_4006a9e3-7fb4-4671-9d7e-3546737c9c2e.png?ex=660eb5ca&is=65fc40ca&hm=bf8b4e7eabe1c0ef131fa4af149c67238fed314a1e319577374c9bfe859788c9&",
];

export default function GenerateButton() {
  const [images, setImages] = useState(testurls);
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState("started");
  const [alertText, setAlertText] = useState("");

  const form = useFormContext();

  const {
    getValues,
    formState: { isValid },
  } = form;

  const generate = async () => {
    setImages([]);
    setAlertType("started");
    setLoading(true);

    const values = getValues();
    const prompt = createPrompt(values);

    const data = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    data.body = JSON.stringify({ prompt, discord, server, channel });

    const apiUrl = "https://api.useapi.net/v2/jobs/imagine";
    const response = await fetch(apiUrl, data);
    const result = await response.json();
    const { jobid } = result;
    const { status } = response;

    // console.log({ status, jobid, job_status: result.status });

    switch (response.status) {
      case 429: // Query is full
        await sleep(5 * 1000);
        setAlertType("started");
        setAlertText(`Запрос в очереди. Статус: ${response.status}`);
        break;
      case 200: // OK
        break;
      case 422: // Moderated
        setAlertType("error");
        setAlertText(`Модерация запроса. Статус: ${response.status} ${result.errorDetails}`);
        setLoading(false);
        break;
      default:
        setAlertType("error");
        setAlertText(response.status);
        setLoading(false);
        // console.error(`Unexpected status`, response.status);
        break;
    }

    if (status == 200) {
      let attempt = 0;
      let retry = true;
      do {
        attempt++;

        const apiUrl = `https://api.useapi.net/v2/jobs/?jobid=${jobid}`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        // console.log(`attempt #${attempt}, response:`, { status: response.status, jobid: result.jobid, job_status: result.status });
        switch (response.status) {
          case 200:
            if (result.status == "completed") {
              setAlertType("progress");
              let images = [];
              for (let i = 1; i < 5; i++) {
                setAlertText(`Успешно! Создаем вариант #${i}`);
                const image = await getButton(jobid, `U${i}`);
                images.push(image);
              }
              setImages(images);
              send(images);
              retry = false;
              setLoading(false);
              const scrollEl = document.querySelector("#genesis_generate_button");
              scrollEl?.scrollIntoView({
                block: "start",
                behavior: "smooth",
              });
            } else if (result.status == "started" || result.status == "progress") {
              setAlertType(result.status);
              setAlertText(`проверка состояния #${attempt} - ${result.status}`);
              // console.log(`attempt #${attempt} sleeping for 5 secs...`, result.status);
              await sleep(5 * 1000);
            } else {
              setAlertType("error");
              setAlertText(`проверка состояния #${attempt} - ${result.status}`);
              // console.error(`Unexpected result.status`, result.status);
              retry = false;
              setLoading(false);
            }
            break;
          default:
            retry = false;
            break;
        }
      } while (retry);
    }
  };

  const send = async (images) => {
    if (!images && !images.length) {
      console.error("Mail: there're no images...");
      return false;
    }
    const values = getValues();
    const prompt = createPrompt(values);

    const imgsBunch = images.map((image) => {
      return image ? `<img style="margin-top: 10px;" src=${image} />` : "";
    });

    const emailSent = await Email.send({
      Host,
      Username,
      Password,
      To: "tatiana.kotulevich@yandex.ru, alexander.v.grebennikov@gmail.com",
      From: "genesis-service@yandex.ru",
      Subject: "Генезис",
      Body: `<html>
            <h3>Имя того, кто пошалил на сайте: <strong>${values.name}</strong></h3>
            <h3>И его телефон: <strong>${values.phone}</strong></h3><br />
            <h2>Текст запроса</h2>
            <strong>${prompt}</strong><br/>
            ${imgsBunch}
            </br>
            </html>`,
    });

    if (emailSent == "OK") {
      console.info("Email sent");
    } else {
      console.info("Email failed");
    }
  };

  useEffect(() => {
    getHeight();
  }, [loading, alertType, alertText, getHeight]);

  return (
    <>
      <Button
        disabled={loading || !isValid}
        loading={loading}
        type="primary"
        text={"СГЕНЕРИРОВАТЬ"}
        onClick={generate}
        id="genesis_generate_button"
      />
      <Variants urls={images} />
      {loading && <Alert type={alertType} text={alertText} />}

      {!loading && !images.length && (
        <div className={style.infoContainer}>
          <p className={style.infoParagraph}>{infotext}</p>
        </div>
      )}
    </>
  );
}
