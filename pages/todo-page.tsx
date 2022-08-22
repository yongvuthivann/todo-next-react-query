import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import TodoApi, { Todo } from './api/todo-api'
import { MdCancel } from 'react-icons/md'

interface props {
    _id?: string;
    todo: Todo
    done?: boolean
}

function TodoPage() {
    const [newTodo, setNewTodo] = useState<string>("")

    const { isLoading: isLoadingTodos, data: todos } = useQuery<Todo[], Error>(
        'todos', async () => {
            return await TodoApi.getAll()
        },
    );

    const queryClient = useQueryClient()
    const addMutation = useMutation(TodoApi.create, {
        onSuccess: () => {
            queryClient.invalidateQueries("todos")
        }
    })

    const updateMutation = useMutation(({ todo, done }: props) => TodoApi.update({_id: todo._id, done}), {
        onSuccess: (data, todo) => {
            queryClient.setQueriesData(["todos", { id: todo._id }], data)
            queryClient.invalidateQueries("todos")
        }
    })

    const deleteMutation = useMutation(({_id, todo}: props) => TodoApi.remove({_id: todo._id}), {
        onSuccess: (data, todo) => {
            queryClient.setQueriesData(["todos", {id: todo._id}], data)
            queryClient.invalidateQueries("todos")
        }
    })

    if (isLoadingTodos) {
        return <h2>Loading....</h2>
    }

  return (
    <div className='min-h-screen flex items-center justify-center mx-auto flex-col bg-gray-100'>
        <div className='bg-white p-10'>
            <h1 className='text-center font-bold uppercase text-xl mb-8'>Todo Tasks</h1>
            {todos?.map((todo, index) => (
                
                <div className={`flex justify-between items-center`}  key={index}>
                    <div className='flex space-x-3 mb-1' >
                        <input
                            type={`checkbox`}
                            checked={todo.done}
                            onChange={() => updateMutation.mutate({
                                todo,
                                done: !todo.done
                            })}
                        />

                        <span className="flex">{todo.todo}</span>
                    </div>
                    <button className={`text-red-500 text-xl`} onClick={() => deleteMutation.mutate(
                        {
                        todo,
                        }
                    )}><MdCancel/></button>
                </div>
                           
            ))}
            <form onSubmit={(e) => {
                e.preventDefault()
            }} className='mt-3'>
                <input
                    className='border-2 p-2 mr-2 rounded-md text-md font-extralight focus:ring-1 focus:ring-sky-400 outline-none focus:border-sky-400'
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    type="text"
                    placeholder='Add your todo...'/>
                    <button className='border-2 border-sky-400 p-2 rounded-md bg-sky-400 text-white' onClick={() => {
                        addMutation.mutate({
                            todo: newTodo
                        })
                        setNewTodo("")
                    }}>Add Todo</button>
            </form>
        </div>
    </div>
  )
}

export default TodoPage