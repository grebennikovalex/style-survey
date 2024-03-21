const token = import.meta.env.VITE_API_TOKEN;

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUButton = async (globalJobid, button) => {
  const dataButton = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  dataButton.body = JSON.stringify({ jobid: globalJobid, button });

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
          if (btnJobRresult.status == "completed" || attempt === 8) {
            if (btnJobRresult.attachments?.length) {
              return btnJobRresult.attachments[0].url;
            } else {
              console.error("completed jobid has no attachments");
              return "";
            }
            // retry = false;
          } else if (btnJobRresult.status == "started" || btnJobRresult.status == "progress") {
            // console.log(`attempt #${attempt} sleeping for 5 secs...`, btnJobRresult.status);
            await sleep(5 * 1000);
          } else {
            console.error(`Unexpected result.status`, btnJobRresult.status);
            retry = false;
            return false;
          }
          break;
        default:
          retry = false;
          break;
      }
    } while (retry);
  } else {
    console.error(`Unexpected result.status`, result.status);
  }
};
