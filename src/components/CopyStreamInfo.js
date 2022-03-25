import { useState } from "react";
import { CopyButton } from "./CopyButton.js";
import { ButtonGroup } from "react-bootstrap";
import { rtmpUrl } from "../urls";

const CopyStreamInfo = ({ stream, ...props }) => {
  const [variant, setVariant] = useState("primary");
  const [text, setText] = useState("Stream Info");

  const getInfo = (region) => {
    return `Stream url: \`rtmp://${region}.${rtmpUrl}/live/\` \nStream key: \`${stream.name}?streamkey=${stream.stream_key}\``;
  };
  return (
    <ButtonGroup
      variant={variant}
      title={text}
      as={ButtonGroup}
      style={{ ...props.style }}
    >
      <CopyButton stream={stream} text={getInfo("us")} isActive>
        US
      </CopyButton>
      <CopyButton stream={stream} text={getInfo("eu")} isActive>
        EU
      </CopyButton>
      <CopyButton stream={stream} text={getInfo("sg")} isActive>
        SG
      </CopyButton>
    </ButtonGroup>
  );
};

export { CopyStreamInfo };
