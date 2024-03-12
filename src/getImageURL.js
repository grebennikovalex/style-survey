const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export const getImageURL = async (prompt) => {
  const token = import.meta.env.VITE_API_TOKEN;
  const discord = import.meta.env.VITE_DISCORD_TOKEN;
  const server = import.meta.env.VITE_SERVER_ID;
  const channel = import.meta.env.VITE_CHANNEL_ID;

  console.log(token);

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

  console.log({ status, jobid, job_status: result.status });

  switch (response) {
    case 429: // Query is full
      await sleep(5 * 1000);
      break;
    case 200: // OK
    case 422: // Moderated
      break;
    default:
      console.error(`Unexpected status`, response.status);
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

      console.log(`attempt #${attempt}, response:`, { status: response.status, jobid: result.jobid, job_status: result.status });

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

                  console.log(`attempt #${attempt}, response:`, { status: btnJobResponse.status, jobid: btnJobRresult.jobid, job_status: btnJobRresult.status });

                  switch (btnJobResponse.status) {
                    case 200:
                      if (btnJobRresult.status == "completed") {
                        if (btnJobRresult.attachments?.length) {
                          return btnJobRresult.attachments[0].url;
                        } else {
                          console.error("completed jobid has no attachments");
                        }
                        retry = false;
                      } else if (btnJobRresult.status == "started" || btnJobRresult.status == "progress") {
                        console.log(`attempt #${attempt} sleeping for 5 secs...`, btnJobRresult.status);
                        await sleep(5 * 1000);
                      } else {
                        console.error(`Unexpected result.status`, btnJobRresult.status);
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
              console.error("completed jobid has no attachments");
            }
            retry = false;
          } else if (result.status == "started" || result.status == "progress") {
            console.log(`attempt #${attempt} sleeping for 5 secs...`, result.status);
            await sleep(5 * 1000);
          } else {
            console.error(`Unexpected result.status`, result.status);
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
