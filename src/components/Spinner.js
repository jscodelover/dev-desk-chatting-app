import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export default function Spinner() {
  return (
    <Dimmer active>
      <Loader size="huge">Preparing Chat....</Loader>
    </Dimmer>
  );
}
