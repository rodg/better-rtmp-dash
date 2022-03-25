import React, { useState } from "react";
import {
  Button,
  Form,
  Popover,
  OverlayTrigger,
  Row,
  Col,
} from "react-bootstrap";
import { apiUrl } from "../urls";
import { useStreams } from "../hooks/useStreams";

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

export { DropButton };
