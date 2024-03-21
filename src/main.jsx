import React from "react";
import ReactDOM from "react-dom/client";
import Genesis from "./Genesis/Genesis.jsx";
import "./styles/global.scss";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "swiper/scss/scrollbar";
import "swiper/scss/autoplay";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Genesis />
  </React.StrictMode>
);
