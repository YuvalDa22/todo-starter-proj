
import { todoService } from "../../services/todo.service.js";
import { SET_TODOS, REMOVE_TODO, ADD_TODO, UPDATE_TODO, SET_IS_LOADING, UNDO_TODOS} from "../reducers/todo.reducer.js";
import { store } from "../store.js"


export function loadTodos() {
  const filterBy = store.getState().todoModule.filterBy;
  store.dispatch({ type: SET_IS_LOADING, isLoading: true });
  return todoService
    .query(filterBy)
    .then((todos) => {
      store.dispatch({ type: SET_TODOS, todos });
    })
    .catch((err) => {
      console.log("todo action -> Cannot load todos", err);
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    });
}


export function removeTodo(todoId) {
  return todoService
    .remove(todoId)
    .then(() => {
      store.dispatch({ type: REMOVE_TODO, todoId });
    })
    .catch((err) => {
      console.log("todo action -> can not remove car", err);
      throw err;
    });
}

export function removeTodoOptimistic(todoId) {
  store.dispatch({ type: REMOVE_TODO, todoId });
  return todoService.remove(todoId).catch((err) => {
    store.dispatch({ type: UNDO_TODOS });
    console.log("todo action -> can not remove car (optimistic)", err);
    throw err;
  });
}

export function saveTodo(todo) {
  const type = todo._id ? UPDATE_TODO : ADD_TODO
  return todoService.save(todo)
    .then((savedTodo) => {
      store.dispatch({ type, todo: savedTodo });
      return savedTodo;
    })
    .catch((err) => {
      console.log("todo action -> can not save/update todo", err);
      throw err;
    });
}
