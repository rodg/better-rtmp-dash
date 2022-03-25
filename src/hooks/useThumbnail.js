import { useEffect, useState } from "react";
import useSWR from "swr";

import { imgFetcher } from "./utils";
import { rtmpUrl } from "../urls";

const useThumbnail = (stream) => {
  const [img, setImg] = useState();
  const isLive = !!stream.live_stream;

  const { data: image, error } = useSWR(
    isLive
      ? `https://${stream.live_stream.region}.${rtmpUrl}/thumbnails/${stream.name}.png`
      : null,
    imgFetcher
  );

  useEffect(() => {
    if (image) {
      const imageObjectURL = URL.createObjectURL(image);
      setImg(imageObjectURL);
    } else if (isLive) {
      setImg("./loading_320x240.png");
    } else {
      setImg("./dummy_320x240.png");
    }
  }, [stream, image]);
  return { image: img, isLive: isLive };
};

export { useThumbnail };
