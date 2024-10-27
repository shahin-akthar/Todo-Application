import { Component } from 'react';
import Popup from 'reactjs-popup';
import './index.css';

import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

class AddTodo extends Component {
  state = { task: '', description: '', dueDate: '', priority: '', setErrorMsg: '' }

  changeTask = event => {
    this.setState({ task: event.target.value, setErrorMsg: '' });
  }

  changeDescription = event => {
    this.setState({ description: event.target.value });
  }

  changeDate = event => {
    this.setState({ dueDate: event.target.value });
  }

  changePriority = (event) => {
    this.setState({ priority: event.target.value, setErrorMsg: '' });
  }

  addTodo = async (close) => {  
    const { task, priority, description, dueDate } = this.state;
    const url = 'http://localhost:3000/create-tasks';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, description, dueDate, priority }),
    };

    if (task === '' || priority === '') {
      this.setState({ setErrorMsg: '*fields are required' });
      return;
    }

    this.setState({ setErrorMsg: '' });

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        this.props.addTodo({ id: data.id, task, description, dueDate, priority, isDone: 0 });
        this.setState({task: '', description: '', dueDate: '', priority: ''})
        console.log('Success');
        close();
      } else {
        this.setState({ setErrorMsg: data.error });
      }
    } catch (error) {
      this.setState({ setErrorMsg: 'Network error. Please try again.' });
      console.error('Error:', error);
    }
  }

  render() {
    return (
      <Popup
        modal
        trigger={
          <div className='btn-container'>
            <button className='add-todo-btn'>Add Todo <FaPlus className='plus-icon' /></button>
          </div>
        }
      >
        {close => (  
          <div className='add-todo-container'>
            <ImCross className='cross-icon' onClick={() => close()} />
            <h1 className='add'>Add Your Task</h1>
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
            <select onChange={this.changePriority} value={this.state.priority} className='input' id="priority" name="priority">
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p className='error'>{this.state.setErrorMsg}</p>
            <button onClick={() => this.addTodo(close)} className='done-btn'>Done</button> 
          </div>
        )}
      </Popup>
    );
  }
}

export default AddTodo;