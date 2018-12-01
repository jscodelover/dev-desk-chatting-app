import React from "react";
import { Card, Button } from "semantic-ui-react";

const style = {
  position: "absolute",
  top: "5%",
  left: "25%",
  zIndex: "300",
  backgroundColor: "#ff8181"
};

export default function ErrorCard() {
  const cardStatus = false;
  return (
    cardStatus && (
      <Card color="red" style={{ ...style }}>
        <Card.Content>
          <Card.Header>
            <span color="red">Error !!</span>
          </Card.Header>
          <Card.Description>Description</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button basic color="black">
            Ok
          </Button>
        </Card.Content>
      </Card>
    )
  );
}
