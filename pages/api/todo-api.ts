import axios from "axios";

export interface Todo {
    _id?: string
    todo?: string
    done?: boolean
}

const apiClient = axios.create({
    baseURL: 'http://localhost:4012',
    headers: {
        "Content-type": "application/json",
    }
})

const getAll = async () => {
    const response = await apiClient.get<Todo[]>('/todos')
    return response.data
}

const create = async ({todo}: Todo) => {
    const response = await apiClient.post<any>("/todos/create", { todo })
    return response.data
}

const update = async ({_id, done}: Todo) => {
    const response = await apiClient.patch(`/todos/${_id}`, { done })
    return response.data
}

const remove = async ({_id}: Todo) => {
    const response = await apiClient.delete(`/todos/${_id}`)
    return response.data
}


const TodoApi = {
    getAll,
    create,
    update,
    remove
}

export default TodoApi

