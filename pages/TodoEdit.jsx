import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { loadTodo, saveTodo } from "../store/actions/todo.actions.js";
import { SET_TODO } from "../store/reducers/todo.reducer.js";

const { useEffect } = React;
const { useNavigate, useParams } = ReactRouterDOM;
const { useSelector, useDispatch } = ReactRedux;

export function TodoEdit() {
  const todo = useSelector((storeState) => storeState.todoModule.todo);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (params.todoId) {
      loadTodo(params.todoId).catch((err) =>
        console.log("Couldn't load todo", err)
      );
    }
  }, [params.todoId]);

  function handleChange({ target }) {
    const field = target.name;
    let value = target.value;

    switch (target.type) {
      case "number":
      case "range":
        value = +value || "";
        break;

      case "checkbox":
        value = target.checked;
        break;

      default:
        break;
    }

    dispatch({
      type: SET_TODO,
      todo: { ...todo, [field]: value },
    });
  }


  function onSaveTodo(ev) {
    ev.preventDefault();
    saveTodo(todo)
      .then(() => {
        showSuccessMsg("Todo saved");
        navigate("/todo");
      })
      .catch((err) => {
        console.log(err);
        showErrorMsg("Could not update todo", err);
      });
  }

  const { txt, importance, isDone } = todo || {};

  return (
    <section className="todo-edit">
      <form onSubmit={onSaveTodo}>
        <label htmlFor="txt">Text:</label>
        <input
          onChange={handleChange}
          value={txt}
          type="text"
          name="txt"
          id="txt"
        />

        <label htmlFor="importance">Importance:</label>
        <input
          onChange={handleChange}
          value={importance}
          type="number"
          name="importance"
          id="importance"
        />

        <label htmlFor="isDone">isDone:</label>
        <input
          onChange={handleChange}
          value={isDone}
          type="checkbox"
          name="isDone"
          id="isDone"
        />

        <button>Save</button>
      </form>
    </section>
  );
}
