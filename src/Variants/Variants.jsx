import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar } from "swiper/modules";
import { getHeight } from "../getHeight";

export default function Variants({ urls }) {
  if (!urls) return;
  return (
    <Swiper
      modules={[FreeMode, Scrollbar]}
      scrollbar={{
        hide: false,
      }}
      spaceBetween={42}
      slidesPerView="auto"
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
