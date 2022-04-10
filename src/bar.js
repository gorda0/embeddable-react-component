import ReactDOM from "react-dom";
import React from "react";


const Messages = () => (
  <div className="messages">
    <p>Barra</p>
  </div>
);

export const renderBar = () =>
  ReactDOM.render(<Messages />, document.querySelector("#content"));