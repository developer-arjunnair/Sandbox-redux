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

export default addTodo;
