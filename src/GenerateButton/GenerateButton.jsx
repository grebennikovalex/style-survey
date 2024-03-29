import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Button from "../ui_elements/Button/Button";
import { createPrompt } from "../createPrompt";
import Alert from "../ui_elements/Alert/Alert";
import { infotext } from "../assets/texts";
import style from "./GenerateButton.module.scss";
import SendButton from "../SendButton/SendButton";

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const token = import.meta.env.VITE_API_TOKEN;
const discord = import.meta.env.VITE_DISCORD_TOKEN;
const server = import.meta.env.VITE_SERVER_ID;
const channel = import.meta.env.VITE_CHANNEL_ID;

export default function GenerateButton() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alertType, setAlertType] = useState("started");
  const [alertText, setAlertText] = useState("");

  const [showSendButton, setShowSendButton] = useState(false);

  const form = useFormContext();

  const {
    getValues,
    formState: { isValid },
  } = form;

  const generate = async () => {
    setAlertType("started");
    setLoading(true);
    setUrl(null);

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
              const dataButton = {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              };

              dataButton.body = JSON.stringify({ jobid, button: "U1" });

              if (result.attachments?.length) {
                const apiUrl = "https://api.useapi.net/v2/jobs/button";
                const response = await fetch(apiUrl, dataButton);
                const result = await response.json();

                const { jobid } = result;
                const { status } = response;

                if (status == 200) {
                  let attempt = 0;
                  let retry = true;
                  do {
                    attempt++;

                    const apiUrl = `https://api.useapi.net/v2/jobs/?jobid=${jobid}`;
                    const btnJobResponse = await fetch(apiUrl, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    const btnJobRresult = await btnJobResponse.json();

                    // console.log(`attempt #${attempt}, response:`, { status: btnJobResponse.status, jobid: btnJobRresult.jobid, job_status: btnJobRresult.status });

                    switch (btnJobResponse.status) {
                      case 200:
                        if (btnJobRresult.status == "completed") {
                          if (btnJobRresult.attachments?.length) {
                            setLoading(false);
                            setUrl(btnJobRresult.attachments[0].url);
                            setShowSendButton(true);
                          } else {
                            setAlertType("error");
                            setAlertText("Результат генерации не найден...");
                            // console.error("completed jobid has no attachments");
                          }
                          retry = false;
                        } else if (btnJobRresult.status == "started" || btnJobRresult.status == "progress") {
                          setAlertType(btnJobRresult.status);
                          setAlertText(`проверка состояния #${attempt} - ${btnJobRresult.status}`);
                          //   console.log(`attempt #${attempt} sleeping for 5 secs...`, btnJobRresult.status);
                          await sleep(5 * 1000);
                        } else {
                          setAlertType("error");
                          setAlertText(btnJobRresult.status);
                          // console.error(`Unexpected result.status`, btnJobRresult.status);
                          retry = false;
                        }
                        break;
                      default:
                        retry = false;
                        break;
                    }
                  } while (retry);
                }
              } else {
                setAlertType("error");
                setAlertText("Результат генерации не найден...");
                // console.error("completed jobid has no attachments");
              }
              retry = false;
            } else if (result.status == "started" || result.status == "progress") {
              setAlertType(result.status);
              setAlertText(`проверка состояния #${attempt} - ${result.status}`);
              //   console.log(`attempt #${attempt} sleeping for 5 secs...`, result.status);
              await sleep(5 * 1000);
            } else {
              setAlertType("error");
              setAlertText(`проверка состояния #${attempt} - ${result.status}`);
              //   console.error(`Unexpected result.status`, result.status);
              retry = false;
            }
            break;
          default:
            retry = false;
            break;
        }
      } while (retry);
    }
  };

  const getHeight = () => {
    const elRect = document.getElementById("genesis-container").offsetHeight;
    window.parent.postMessage(
      {
        type: "resize-iframe",
        payload: {
          height: elRect + 20,
        },
      },
      "*"
    );
  };

  useEffect(() => {
    getHeight();
  }, [loading, alertType, alertText, getHeight]);

  return (
    <>
      {showSendButton ? (
        <SendButton url={url} />
      ) : (
        <Button
          disabled={loading || !isValid}
          loading={loading}
          type="primary"
          text={"СГЕНЕРИРОВАТЬ"}
          // onClick={() => {
          //   const values = getValues();
          //   console.log(createPrompt(values));
          // }}
          onClick={generate}
        />
      )}
      {loading && <Alert type={alertType} text={alertText} />}
      {url && (
        <a href={url} target="_blank" style={{ width: "100%" }}>
          <img src={url} style={{ width: "100%" }} onLoad={getHeight} />
        </a>
      )}
      {!loading && !url && (
        <div className={style.infoContainer}>
          <p className={style.infoParagraph}>{infotext}</p>
        </div>
      )}
    </>
  );
}
