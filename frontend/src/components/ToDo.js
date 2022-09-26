import React from 'react'


const ToDoListItem = ({item, deleteToDo}) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.text}</td>
            <td>{item.creation_date}</td>
            <td>{item.project}</td>
            <td>{item.creator}</td>
            <td><button onClick={(id) => deleteToDo(item.id)} type='button'>Delete</button></td>
        </tr>
    )
}

const ToDoList = ({items, deleteToDo}) => {
    //console.log(users)
    return (
        <table className="table">
            <tr>
                <th>Id</th>
                <th>Text</th>
                <th>Create</th>
                <th>Project</th>
                <th>Creator</th>
            </tr>
            {items.map((item) => <ToDoListItem item={item} deleteToDo={deleteToDo} />)}
        </table>
    )
}

export default ToDoList