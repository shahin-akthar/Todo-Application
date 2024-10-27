import { useState } from 'react';
import { MdDelete } from "react-icons/md";
import EditPopUp from '../EditPopUp'; 
import './index.css';

const Todo = (props) => {
  const { todo, updateTodo, onDelete } = props;
  const [isChecked, setIsChecked] = useState(todo.isDone === 1);
  console.log(todo.id);

  const checkedBox = async () => {
    const updatedStatus = isChecked ? 0 : 1;
    setIsChecked(updatedStatus);

    const payload = { is_done: updatedStatus };
 
    try {
      const response = await fetch(`http://localhost:3000/update-task/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update task status:', errorData);
        setIsChecked(!updatedStatus);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setIsChecked(!updatedStatus); 
    }
  };

  const deleteTodo = async () => {
   try {
     const response = await fetch(`http://localhost:3000/delete-task/${todo.id}`, {
       method: 'DELETE',
     });

     if (response.ok) {
       onDelete(todo.id);
     } else {
       const errorData = await response.json();
       console.error('Failed to delete task:', errorData);
     }
   } catch (error) {
     console.error('Error deleting task:', error);
   }
 };

  return (
    <li className="todos-list">
      <div className='heading-section'>
        <h1 className='todo-head'>{todo.task}</h1>
        <p className='priority' style={{ color: todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'green' }}>{todo.priority}</p>
      </div>
      {todo.description && <p className='description'>Detail: {todo.description}</p>}
      {todo.dueDate && <p className='description'>By: {todo.dueDate}</p>}
      <div className='edit-section'>
        <div>
          <input 
            type='checkbox' 
            id={`checkbox-${todo.id}`} 
            checked={isChecked} 
            onChange={checkedBox} 
          />
          <label htmlFor={`checkbox-${todo.id}`}>Completed</label>
        </div>
        <div className='div-section'>
         <EditPopUp todo={todo} updateTodo={updateTodo} /> 
         <MdDelete onClick={deleteTodo}/>
        </div>
      </div>
    </li>
  );
};

export default Todo;