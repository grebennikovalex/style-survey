import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { getHeight } from "../getHeight";

export default function Variants({ urls }) {
  if (!urls) return;
  return (
    <Swiper
      modules={[Autoplay, FreeMode]}
      spaceBetween={42}
      slidesPerView="auto"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      {urls.map((url) => {
        return (
          <SwiperSlide key={url}>
            <a href={url} target="_blank" style={{ width: "100%" }}>
              <img src={url} style={{ width: "100%" }} onLoad={getHeight} />
            </a>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
