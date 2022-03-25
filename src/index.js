import "regenerator-runtime/runtime";
import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { useStreams } from "./hooks/useStreams";
import { StreamInfo } from "./components/StreamInfo";

// This component will re-render when the timer's replicant value changes
const App = () => {
  const { streams, isLoading } = useStreams();

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#2F3A4F",
      }}
    >
      <div style={{ width: "848px", padding: "2% 2% 2% 2%" }}>
        {streams.map((stream) => {
          return <StreamInfo stream={stream} key={stream.name}></StreamInfo>;
        })}
      </div>
    </div>
  );
};

const root = document.getElementById("app");
ReactDOM.render(<App></App>, root);
