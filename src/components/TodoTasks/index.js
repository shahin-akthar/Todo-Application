import { Component } from 'react';
import AddTodo from '../AddTodo';
import Todo from '../Todo';
import './index.css';

class TodoTasks extends Component {
  state = { todosList: [] };

  componentDidMount() {
    this.getTodos();
  }

  getTodos = async () => {  
    const url = 'http://localhost:3000/get-tasks';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const updateList = data.map((eachTask) => ({
          id: eachTask.id,
          task: eachTask.task,
          description: eachTask.description,
          dueDate: eachTask.due_date,
          priority: eachTask.priority,
          isDone: eachTask.is_done,
        }));

        updateList.sort((a, b) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
        });

        console.log(updateList);
        this.setState({ todosList: updateList });
      } else {
        console.log('Error fetching tasks');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  updateTodo = (id, updatedTodo) => {
    this.setState((prevState) => ({
      todosList: prevState.todosList.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      ),
    }));
  };

  handleDelete = (id) => {
    this.setState(prevState => ({
      todosList: prevState.todosList.filter(todo => todo.id !== id)
    }));
  };

  addTodo = (newTodo) => {
    this.setState(prevState => ({
      todosList: [...prevState.todosList, newTodo]
    }));
  };
  

  render() {
    const { todosList } = this.state;
    return (
      <div className='bg-container'>
        <h1 className='heading'>ToDo List</h1>
        <p className='text'>Keep It Together with Todos!</p>
        <AddTodo addTodo={this.addTodo}/>
        <h1 className='to-do'>Your tasks to do!</h1>
        <ul className='todos-ul'>
          {todosList.length === 0 ? (
            <p className='no-tasks'>Your task list is empty! Time to plan something amazing.</p>
          ) : (
            todosList.map((each) => (
              <Todo 
                key={each.id} 
                todo={each} 
                updateTodo={this.updateTodo} 
                onDelete={this.handleDelete} 
              />
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default TodoTasks;