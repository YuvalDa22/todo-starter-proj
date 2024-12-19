const { useSelector, useDispatch } = ReactRedux
const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { loadTodos, removeTodoOptimistic } from "../store/actions/todo.actions.js"
//import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"


export function TodoIndex() {

    // const [todos, setTodos] = useState(null)
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)

    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    // const [searchParams, setSearchParams] = useSearchParams()

    // const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

    // const [filterBy, setFilterBy] = useState(defaultFilter)

    useEffect(() => {
        loadTodos()
            .catch( err => console.log('err:', err))
        // setSearchParams(filterBy)
        // todoService.query(filterBy)
        //     .then(todos => setTodos(todos))
        //     .catch(err => {
        //         console.eror('err:', err)
        //         showErrorMsg('Cannot load todos')
        //     })
    }, [filterBy])

    function onSetFilter(filterBy) {
        dispatch({type: SET_FILTER_BY, filterBy})
    }

    function onRemoveTodo(todoId) {
        removeTodoOptimistic(todoId)
            .then(() => showSuccessMsg('Todo removed'))
            .catch( err => showErrorMsg('Cannot remove todo'))
        // todoService.remove(todoId)
        //     .then(() => {
        //         setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId))
        //         showSuccessMsg(`Todo removed`)
        //     })
        //     .catch(err => {
        //         console.log('err:', err)
        //         showErrorMsg('Cannot remove todo ' + todoId)
        //     })
    }

  

    function onToggleTodo(todo) {
        // const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todo)
            .then(() => showSuccessMsg('Todo updated successfully'))
            .catch(err => showErrorMsg('Cannot update todo'))
        // todoService.save(todoToSave)
        //     .then((savedTodo) => {
        //         setTodos(prevTodos => prevTodos.map(currTodo => (currTodo._id !== todo._id) ? currTodo : { ...savedTodo }))
        //         showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
        //     })
        //     .catch(err => {
        //         console.log('err:', err)
        //         showErrorMsg('Cannot toggle todo ' + todoId)
        //     })
    }

    
    return (
        <section className="todo-index">
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <TodoFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            {!isLoading
                ? <TodoList
                    todos = {todos}
                    onRemoveTodo={onRemoveTodo}
                    onToggleTodo={onToggleTodo}
                />
                : <div>Loading...</div>
            }
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}