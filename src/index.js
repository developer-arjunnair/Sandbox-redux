import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import "./styles.css";

/*
  Reducers - used to determine the next state
*/
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
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};
const todoApp = combineReducers({
  todos: addTodo,
  visibilityFilter
});

/*
  Helper function
 */
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
/*
  Presentational components
*/
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

const Link = ({ onFilterClick, text, active }) => (
  <p>
    {active ? (
      <span>{text}</span>
    ) : (
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          onFilterClick();
        }}
      >
        {text}
      </a>
    )}
  </p>
);

const Footer = () => {
  const filterParams = [
    { type: "SHOW_ALL", text: "All" },
    { type: "SHOW_ACTIVE", text: "Active" },
    { type: "SHOW_COMPLETED", text: "Completed" }
  ];
  return (
    <p>
      {filterParams.map(param => (
        <FilterLink key={param.type} text={param.text} filter={param.type} />
      ))}
    </p>
  );
};

/*
  Container components
*/
const mapStateToTodoListProps = state => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter)
});

const mapDispatchToTodoListProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch({
        type: "TOGGLE_TODO",
        id
      });
    }
  };
};

// This method is refactored with react-redux and
// is the alternative for the below commented method
const VisibleTododList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const mapStateToFilterLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
const mapDispatchToFilterLinkProps = (dispatch, ownProps) => {
  return {
    onFilterClick: () =>
      dispatch({
        type: "SET_VISIBILITY_FILTER",
        filter: ownProps.filter
      })
  };
};

const FilterLink = connect(
  mapStateToFilterLinkProps,
  mapDispatchToFilterLinkProps
)(Link);

/*
Presentational + container -> as trivial seperation
*/
let nextId = 0;

let AddTodo = ({ dispatch }) => {
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
          const { value } = input;
          if (!value) return;
          dispatch({
            type: "ADD_TODO",
            text: value,
            id: nextId++
          });
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

AddTodo = connect()(AddTodo);

const Todos = () => (
  <div>
    <AddTodo />
    <VisibleTododList />
    <Footer />
  </div>
);
// Created the store to hold the entire state/
// cannot be mutated
// Only change when an action is dispatched
const store = createStore(todoApp);

const App = () => (
  <div className="App">
    <Provider store={store}>
      <Todos />
    </Provider>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
