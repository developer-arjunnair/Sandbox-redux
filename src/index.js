import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import "./styles.css";

//  Reducere - used to determine the next state
// Supplied as argument to the store to determine the necessary actions
// Reducers can be combined with combineReducers() -> redux
const addTodo = (state = {}, aciton) => {
  switch (aciton.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: aciton.id,
          text: aciton.text,
          completed: false
        }
      ];
    default:
      return [];
  }
};

const Todos = () => {
  return <div> this is in the todo</div>;
};
// Created the store to hold the entire state/
// cannot be mutated
// Only change when an action is dispatched
const store = createStore(addTodo);

function App() {
  return (
    <div className="App">
      <Todos />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
