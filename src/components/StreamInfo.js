import React, { useEffect, useState } from "react";
import { Card, ButtonGroup, Badge } from "react-bootstrap";
import { CopyButton } from "./CopyButton";
import { DropButton } from "./DropButton";
import { CopyStreamInfo } from "./CopyStreamInfo";
import { useThumbnail } from "../hooks/useThumbnail";
import { apiUrl, rtmpUrl } from "../urls";
import { BsBoxArrowUpRight } from "react-icons/bs";

const StreamPopout = ({ stream, ...props }) => {
  const openWindow = () => {
    if (stream.live_stream)
      window.open(props.watchLink, "steve", "height=720,width=1280");
  };
  return (
    <>
      {stream.live_stream ? (
        <span className="popout-link" onClick={openWindow}>
          <BsBoxArrowUpRight className="popout-icon"></BsBoxArrowUpRight>
        </span>
      ) : (
        <></>
      )}
    </>
  );
};

const StreamInfo = ({ stream, ...props }) => {
  const { image, isLive } = useThumbnail(stream);
  const [watchLink, setWatchLink] = useState();
  const [rtmpLink, setRtmpLink] = useState();

  useEffect(() => {
    if (isLive) {
      setWatchLink(
        `https://${stream.live_stream.region}.${rtmpUrl}/?watch=${stream.name}`
      );
      setRtmpLink(
        `rtmp://${stream.live_stream.region}.${rtmpUrl}/live/${stream.name}`
      );
    }
  }, [stream]);

  return (
    <Card
      style={{ height: 200, flexDirection: "row", margin: "2% 0% 2% 0%" }}
      className="stream-info"
    >
      <Card.Img variant="left" src={image} style={{ height: "100%" }} />
      <Badge bg={isLive ? "success" : "secondary"}>
        {isLive
          ? `Live: ${stream.live_stream.region.toUpperCase()}`
          : "offline"}
      </Badge>
      <DropButton stream={stream}></DropButton>
      <StreamPopout stream={stream} watchLink={watchLink} />
      <Card.Body>
        <Card.Title>Stream Name: {stream.name}</Card.Title>
        <Card.Text>Stream Key: {stream.stream_key}</Card.Text>
        <span>
          Info:
          <ButtonGroup>
            <CopyStreamInfo stream={stream}>Drop Down</CopyStreamInfo>
          </ButtonGroup>
        </span>
        <br />
        <span className="playback-info">
          Playback:
          <ButtonGroup>
            <CopyButton stream={stream} isActive={isLive} text={watchLink}>
              Browser
            </CopyButton>
            <CopyButton stream={stream} isActive={isLive} text={rtmpLink}>
              RTMP
            </CopyButton>
          </ButtonGroup>
        </span>
      </Card.Body>
    </Card>
  );
};

export { StreamInfo };
