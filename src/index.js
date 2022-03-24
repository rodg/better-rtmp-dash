import "regenerator-runtime/runtime";
import "./index.scss";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import useSWR from "swr";
import {
  Button,
  Card,
  Dropdown,
  ButtonGroup,
  DropdownButton,
  Form,
  Popover,
  OverlayTrigger,
  Row,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";
import { BsBoxArrowUpRight } from "react-icons/bs";

const apiUrl = process.env.API;
const rtmpUrl = process.env.RTMP;

if (!apiUrl || !rtmpUrl) {
  throw new Error("API or RTMP URL is missing!");
}

const fetcher = (url) =>
  fetch(url, {
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => res.json());

const imgFetcher = (url) =>
  fetch(url, { mode: "cors" }).then((res) => res.blob());

const useStreams = () => {
  const {
    data: streams,
    error,
    mutate,
  } = useSWR(`https://${apiUrl}/streams`, fetcher);

  return { streams: streams ?? [], error: error, isLoading: !!streams, mutate };
};

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

const CopyButton = ({ stream, ...props }) => {
  const [variant, setVariant] = useState("primary");
  const [text, setText] = useState();
  return (
    <Button
      style={{ ...props.style }}
      variant={variant}
      onClick={() => {
        if (props.isActive) navigator.clipboard.writeText(props.text);
        setVariant("success");
        setText("Copied");
        setTimeout(() => {
          setVariant("primary");
          setText(null);
        }, 3000);
      }}
    >
      {text ?? props.children}
    </Button>
  );
};

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
      <CopyButton stream={stream} text={getInfo("us")}>
        US
      </CopyButton>
      <CopyButton stream={stream} text={getInfo("eu")}>
        EU
      </CopyButton>
      <CopyButton stream={stream} text={getInfo("sg")}>
        SG
      </CopyButton>
    </ButtonGroup>
  );
};

const DropButton = ({ stream, ...props }) => {
  const { mutate } = useStreams();
  const [changeKey, setChangeKey] = useState(true);
  const [showPop, setShowPop] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(
      `https://${apiUrl}/drop/${stream.name}?change_key=${changeKey}`,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      }
    ).then((res) => {
      res.json().then(() => {
        mutate();
      });
    });
    setShowPop(false);
  };
  const popover = (
    <Popover id="popover-basic" style={{}}>
      <Popover.Body>
        <Form.Check
          type="checkbox"
          label={`Change stream \nkey`}
          defaultChecked={changeKey}
          onChange={(e) => {
            console.log(e.target.checked);
            setChangeKey(e.target.checked);
          }}
        ></Form.Check>
        <Button type="submit" className="drop-pop" onClick={handleSubmit}>
          Confirm
        </Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <Form
      onSubmit={handleSubmit}
      style={{ flexDirection: "row", paddingTop: "1em" }}
    >
      <Row>
        <Col></Col>
        <Col>
          <OverlayTrigger
            trigger={["click"]}
            placement="top"
            overlay={popover}
            show={showPop}
            onToggle={() => {
              setShowPop(!showPop);
              if (!showPop) setChangeKey(true);
            }}
          >
            <Button variant="danger" className="drop-btn">
              Drop Stream
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Form>
  );
};

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

  console.log(stream);
  return (
    <Card
      style={{ height: 200, flexDirection: "row", margin: "2% 0% 2% 0%" }}
      className="stream-info"
      flex
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
          return <StreamInfo stream={stream}></StreamInfo>;
        })}
      </div>
    </div>
  );
};

const root = document.getElementById("app");
ReactDOM.render(
  <>
    <script
      src="https://unpkg.com/react/umd/react.production.min.js"
      crossOrigin="true"
    ></script>

    <script
      src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
      crossOrigin="true"
    ></script>

    <script
      src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
      crossOrigin="true"
    ></script>
    <App></App>
  </>,
  root
);
