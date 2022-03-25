const fetcher = (url) =>
  fetch(url, {
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => res.json());

const imgFetcher = (url) =>
  fetch(url, { mode: "cors" }).then((res) => res.blob());

export { fetcher, imgFetcher };
