import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import "./styles.css";
// import { Provider, connect } from "react-redux";

//  Reducere - used to determine the next state
// Supplied as argument to the store to determine the necessary actions
// Reducers can be combined with combineReducers() -> redux
const addTodo = (state = [], action) => {
  // console.log("inisde the addTodo action", state, action);
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
    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    default:
      // console.log("returning state", state);
      return state;
  }
};

const toggleTodo = (state = [], action) => {
  // console.log("toggleTodo", action.type, action.id);
  if (action.type === "TOGGLE_TODO") {
    // console.log(" the action type is toggle todo");
    // console.log(state);
    return state.map(todo =>
      todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
    );
  }
  return state;
};

const visibilityFilter = (state = [], action) => {
  console.log("visibilityFilter", action.type, action.filter);
  switch (action.type) {
    case "SET_VISIBLITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};
const todoApp = combineReducers({
  todos: addTodo,
  visibilityFilter
});

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_COMPLETED":
      return todos.filter(todo => todo.completed);
    case "SHOW_ACTIVE":
      return todos.filter(todo => !todo.completed);
    case "SHOW_ALL":
    default:
      return todos;
  }
};
let nextId = 0;
class Todos extends React.Component {
  render() {
    const visibleTodos = getVisibleTodos(
      this.props.todos,
      this.props.visibilityFilter
    );
    console.log("inside the render", this.props, visibleTodos);
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
          {visibleTodos &&
            visibleTodos.map(todo => (
              <li
                onClick={e => {
                  e.preventDefault();
                  store.dispatch({
                    type: "TOGGLE_TODO",
                    id: todo.id
                  });
                }}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none"
                }}
                key={todo.id}
              >
                {todo.text}
              </li>
            ))}
        </ul>
        <p>
          <FilterLinks filter="SHOW_ALL">All</FilterLinks>
          {"  "}
          <FilterLinks filter="SHOW_ACTIVE">Active</FilterLinks>
          {"  "}
          <FilterLinks filter="SHOW_COMPLETED">Completed</FilterLinks>
          {"  "}
        </p>
      </div>
    );
  }
}

// const TodoConnector = connect()(Todos);

const FilterLinks = ({ filter, children }) => {
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: "SET_VISIBLITY_FILTER",
          filter
        });
      }}
    >
      {children}
    </a>
  );
};

// Created the store to hold the entire state/
// cannot be mutated
// Only change when an action is dispatched
const store = createStore(todoApp);

function App() {
  return (
    // <Provider store={store}>
    <div className="App">
      <Todos {...store.getState()} />
    </div>
    // </Provider>
  );
}

const rootElement = document.getElementById("root");
const render = () => {
  ReactDOM.render(<App />, rootElement);
};
store.subscribe(render);
render();
