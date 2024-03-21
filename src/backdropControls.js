export const showBackdrop = () => {
  window.parent.postMessage(
    {
      type: "show-backdrop",
      payload: {
        display: "block",
      },
    },
    "*"
  );
};

export const hideBackdrop = () => {
  window.parent.postMessage(
    {
      type: "show-backdrop",
      payload: {
        display: "none",
      },
    },
    "*"
  );
};
