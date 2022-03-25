import useSWR from "swr";
import { fetcher } from "./utils";

import { apiUrl } from "../urls";

const useStreams = () => {
  const {
    data: streams,
    error,
    mutate,
  } = useSWR(`https://${apiUrl}/streams`, fetcher);

  return { streams: streams ?? [], error: error, isLoading: !!streams, mutate };
};

export { useStreams };
