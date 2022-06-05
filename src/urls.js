const apiUrl = process.env.API;
const rtmpUrl = process.env.RTMP;
const thonName = process.env.THON

if (!apiUrl || !rtmpUrl) {
  throw new Error("API or RTMP URL is missing!");
}

export { apiUrl, rtmpUrl, thonName };
