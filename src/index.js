import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import "./styles.css";

//  Reducere - used to determine the next state
// Supplied as argument to the store to determine the necessary actions
// Reducers can be combined with combineReducers() -> redux
const addTodo = (state = [], action) => {
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
      return state;
  }
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

// Helper function
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

const Todo = ({ text, completed, id, onClick }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? "line-through" : "none"
    }}
  >
    {text}
  </li>
);

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos &&
      todos.map(todo => (
        <Todo
          {...todo}
          onClick={e => {
            e.preventDefault();
            onTodoClick(todo.id);
          }}
        />
      ))}
  </ul>
);

const AddTodo = ({ onAddTodoClick }) => {
  let input;
  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddTodoClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

const Footer = ({ onFilterClick }) => {
  const filterParams = [
    { type: "SHOW_ALL", text: "All" },
    { type: "SHOW_ACTIVE", text: "Active" },
    { type: "SHOW_COMPLETED", text: "Completed" }
  ];
  return (
    <p>
      {filterParams.map(param => (
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onFilterClick(param.type);
          }}
        >
          {`${param.text}   `}
        </a>
      ))}
    </p>
  );
};

const Todos = ({ todos, visibilityFilter }) => (
  <div>
    <AddTodo
      onAddTodoClick={text => {
        if (!text) return;
        // Dispatch will invoke the action to be called
        // And will invoke the corresponding reducer(s)
        store.dispatch({
          type: "ADD_TODO",
          text,
          id: nextId++
        });
      }}
    />

    <TodoList
      todos={getVisibleTodos(todos, visibilityFilter)}
      onTodoClick={id => {
        store.dispatch({
          type: "TOGGLE_TODO",
          id
        });
      }}
    />

    <Footer
      onFilterClick={filter =>
        store.dispatch({
          type: "SET_VISIBLITY_FILTER",
          filter
        })
      }
    />
  </div>
);
// Created the store to hold the entire state/
// cannot be mutated
// Only change when an action is dispatched
const store = createStore(todoApp);

function App() {
  return (
    <div className="App">
      <Todos {...store.getState()} />
    </div>
  );
}

const rootElement = document.getElementById("root");
const render = () => {
  ReactDOM.render(<App />, rootElement);
};
store.subscribe(render);
render();
