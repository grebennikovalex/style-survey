export const getHeight = () => {
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
