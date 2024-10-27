import { Component } from 'react';
import Popup from 'reactjs-popup';
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";

class EditPopUp extends Component {
  state = { 
    task: this.props.todo.task || '', 
    description: this.props.todo.description || '', 
    dueDate: this.props.todo.due_date || '', 
    priority: this.props.todo.priority || '', 
    setErrorMsg: ''
  }

  changeTask = event => {
    this.setState({ task: event.target.value, setErrorMsg: '' });
  }

  changeDescription = event => {
    this.setState({ description: event.target.value });
  }

  changeDate = event => {
    this.setState({ dueDate: event.target.value });
  }

  changePriority = event => {
    this.setState({ priority: event.target.value, setErrorMsg: '' });
  }

  editTodo = async (onClose) => {
   const { task, description, dueDate, priority } = this.state; 
   const { id } = this.props.todo; 

   const updatedTodo = { task, description, dueDate, priority };

   try {
     const response = await fetch(`http://localhost:3000/update-task/${id}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(updatedTodo),
     });

     if (response.ok) {
       this.props.updateTodo(id, updatedTodo); 
       onClose(); 
     } else {
       const data = await response.json();
       console.error(data.error);
     }
   } catch (error) {
     console.error('Error updating todo:', error);
   }
 };


  render() {
    return (
      <Popup
        modal
        trigger={<FaEdit />}
      >
        {onClose => (  
          <div className='add-todo-container'>
            <ImCross className='cross-icon' onClick={onClose} />
            <h1 className='add'>Edit Your Task</h1>
            <label className='label'>*Task:</label>
            <input
              placeholder='Enter your task...'
              onChange={this.changeTask}
              type='text'
              className='input'
              value={this.state.task}
            />
            <label className='label'>Description:</label>
            <textarea
              value={this.state.description}
              onChange={this.changeDescription}
              placeholder='Enter your description...'
              className='textarea'
            />
            <label className='label'>Due Date:</label>
            <input
              onChange={this.changeDate}
              value={this.state.dueDate}
              placeholder='YYYY-MM-DD'
              type='text'
              className='input'
            />
            <label htmlFor="priority" className='label'>*Priority:</label>
            <select 
              onChange={this.changePriority} 
              value={this.state.priority} 
              className='input' 
              id="priority" 
              name="priority"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p className='error'>{this.state.setErrorMsg}</p>
            <button onClick={() => this.editTodo(onClose)} className='done-btn'>Save</button> 
          </div>
        )}
      </Popup>
    );
  }
}

export default EditPopUp;
