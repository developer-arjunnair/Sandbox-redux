import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import "./styles.css";

//  Reducere - used to determine the next state
// Supplied as argument to the store to determine the necessary actions
// Reducers can be combined with combineReducers() -> redux
const addTodo = (state = [], action) => {
  console.log("inisde the addTodo action", state, action);
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    default:
      console.log("returning state", state);
      return state;
  }
};

const todoApp = combineReducers({
  todos: addTodo
});

// Created the store to hold the entire state/
// cannot be mutated
// Only change when an action is dispatched
const store = createStore(todoApp);

let nextId = 0;
class Todos extends React.Component {
  render() {
    console.log("props", this.props);
    return (
      <div>
        <button
          onClick={() => {
            // Dispatch will invoke the action to be called
            // And will invoke the corresponding reducer(s)
            store.dispatch({
              type: "ADD_TODO",
              text: "Test",
              id: nextId++
            });
          }}
        >
          Add Todo
        </button>
        <ul>
          {this.props.todos &&
            this.props.todos.map(todo => <li key={todo.id}> {todo.text} </li>)}
        </ul>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Todos todos={store.getState().todos} />
    </div>
  );
}

const rootElement = document.getElementById("root");
const render = () => {
  ReactDOM.render(<App />, rootElement);
};
store.subscribe(render);
render();
