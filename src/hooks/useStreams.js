import useSWR from "swr";
import { fetcher } from "./utils";

import { apiUrl, thonName } from "../urls";

const useStreams = () => {
  const {
    data: streams,
    error,
    mutate,
  } = useSWR(`https://${apiUrl}/marathons/${thonName}/streams`, fetcher);
  console.log(thonName)

  return { streams: streams ?? [], error: error, isLoading: !!streams, mutate };
};

export { useStreams };
