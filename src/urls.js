const apiUrl = process.env.API;
const rtmpUrl = process.env.RTMP;

if (!apiUrl || !rtmpUrl) {
  throw new Error("API or RTMP URL is missing!");
}

export { apiUrl, rtmpUrl };
