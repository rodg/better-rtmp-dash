import React, { useState } from "react";
import { Button } from "react-bootstrap";

const CopyButton = ({ stream, isActive, ...props }) => {
  const [variant, setVariant] = useState("primary");
  const [text, setText] = useState();
  return (
    <Button
      style={{ ...props.style }}
      variant={isActive ? variant : "secondary"}
      disabled={!isActive}
      onClick={() => {
        if (isActive) {
          navigator.clipboard.writeText(props.text);
          setVariant("success");
          setText("Copied");
          setTimeout(() => {
            setVariant("primary");
            setText(null);
          }, 3000);
        }
      }}
    >
      {text ?? props.children}
    </Button>
  );
};

export { CopyButton };
