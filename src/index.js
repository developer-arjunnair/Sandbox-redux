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

const Link = ({ onClick, children }) => (
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  >
    {`${children}   `}
  </a>
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

// class VisibleTododList extends React.Component {
//   componentDidMount() {
//     this.unsubscribe = store.subscribe(() => {
//       this.forceUpdate();
//     });
//   }
//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     const state = store.getState();
//     return (
//       <TodoList
//         todos={getVisibleTodos(state.todos, state.visibilityFilter)}
//         onTodoClick={id => {
//           store.dispatch({
//             type: "TOGGLE_TODO",
//             id
//           });
//         }}
//       />
//     );
//   }
// }

class FilterLink extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { props } = this;
    // const state = store.getState();
    return (
      <Link
        onClick={() => {
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter: props.filter
          });
        }}
      >
        {props.text}
      </Link>
    );
  }
}

/*
Presentational + container -> as trivial seperation
*/
let nextId = 0;

const mapDispatchToAddTodoProps = dispatch => {
  return {
    onAddTodoClick: (value, Id) => {
      dispatch({
        type: "ADD_TODO",
        text: value,
        Id
      });
    }
  };
};

const AddTodoCom = ({ onAddTodoClick }) => (
  <div>
    <input
      ref={node => {
        this.input = node;
      }}
    />
    <button
      onClick={() => {
        const { value } = this.input;
        if (!value) return;
        onAddTodoClick(value, nextId++);
        this.input.value = "";
      }}
    >
      Add Todo
    </button>
  </div>
);

const AddTodo = connect(
  null,
  mapDispatchToAddTodoProps
)(AddTodoCom);

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
