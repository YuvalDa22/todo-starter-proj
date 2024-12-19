import { loadTodo } from "../store/actions/todo.actions.js";

const { useEffect } = React;
const { useParams, useNavigate, Link } = ReactRouterDOM;
const { useSelector } = ReactRedux;

export function TodoDetails() {
  const todo = useSelector((storeState) => storeState.todoModule.todo);
  console.log(todo);
  const navigate = useNavigate();
  const params = useParams();
  console.log(params);
  const isLoading = useSelector(
    (storeState) => storeState.todoModule.isLoading
  );

  useEffect(() => {
    if (params.todoId) {
        console.log("try to load todo"),
        loadTodo(params.todoId)
        .catch((err) => console.log("Couldn't load todo", err)
        //onBack()
        );
    }
  }, [params.todoId]);

  function onBack() {
    navigate("/todo");
  }

  const { txt, importance, isDone, nextTodoId, prevTodoId } = todo || {};
  return (
    <section className="todo-details">
      {!isLoading ? (
        <div>
          <h4 className={isDone ? "done" : ""}>Todo name:{ txt}</h4>
          <h4>Todo Status:{ isDone ? "Done!" : "Still hasn't done"}</h4>
          <h4>Todo importance:{ importance}</h4>
          <button onClick={onBack}>Back to list</button>
          <h4>
            <Link to={`/todo/${nextTodoId}`}>Next Todo</Link> |
            <Link to={`/todo/${prevTodoId}`}>Previous Todo</Link>
          </h4>
        </div>
      ) : (
        <div> Loading...</div>
      )}
    </section>
  );
}
