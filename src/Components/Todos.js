import React from "react";
import { connect } from "react-redux";
const Todos = props => {
  console.log(props.dispatch());
  return <div> this is in the todo</div>;
};
export default connect()(Todos);
