import React, { Component } from 'react';
import './App.css';
import {Checkbox, Input, Button, Spin} from 'antd';
import * as _ from 'lodash';
import * as axios from 'axios';

const base_url = "http://3.17.142.117:4000"

class App extends Component {

  constructor(){
    super();
    this.state = {
      tasks: [],
      newTask : null,
      searchQuery : "",
      current_id: 7,
      showLoader: true
    }
    
    this.showLoader();
    this.loadTasks();

  }

  loadTasks = () => {
    axios.get('http://3.17.142.117:4000/tasks')
    .then( response => {
      this.setState({tasks: response.data });
      this.hideLoader();
      console.log(response);  
    })
    .catch(error => {
      this.hideLoader();
    });

    console.log(this.state);
  }

  showLoader = () => {
    this.setState({showLoader : true});
  }

  hideLoader = () => {
    this.setState({showLoader : false});
  }

  onChangeNewTask = (event) => {
    this.setState({newTask: event.currentTarget.value});
  }

  toggleCheck = (id) => {
    let {tasks} = this.state;
    
    let index = _.findIndex(tasks, {id: id});
    if(index !== -1){

      this.showLoader();
      const new_status = tasks[index].status === 0 ? 1 : 0;
      axios.patch(`http://3.17.142.117:4000/tasks/${id}`, {status : new_status})
      .then(response => {

        tasks[index].status = new_status;
        this.setState({tasks: tasks});
        this.hideLoader();
      })
      .catch(error => {
        this.hideLoader();
      });
    }


    
  }

  addTask = () => {
    let {tasks, newTask, current_id} = this.state;
    
    this.showLoader();
    
    if(newTask && newTask !== '') {
      axios.post('http://3.17.142.117:4000/tasks', {name: newTask})
      .then(response => {
        tasks.push(response.data);
        this.setState({tasks: tasks, newTask: null});
        this.hideLoader();
      })
      .catch(error => {
        this.hideLoader();
      })
    }
    
  }

  deleteTask = (id) => {
    let {tasks} = this.state;
    
    let index = _.findIndex(tasks, {id: id});
    
    if(index !== -1){
      this.showLoader();

      axios.delete(`http://3.17.142.117:4000/tasks/${id}`)
      .then(response => {
        
        tasks.splice(index, 1);
        this.setState({tasks: tasks});
        this.hideLoader();

      }).catch(error => {

        this.hideLoader();

      });
    }

  }
  
  renderTasks = (tasks) => {
    return tasks.map((task,index) => {
      return (
      <div className="task-container">
        <Checkbox
          style={{  marginLeft: 8, fontSize : 20}}
          checked={task.status === 1}
          onChange={(event) => {this.toggleCheck(task.id, event)} }>
            {task.name}
        </Checkbox>
        <Button onClick={() => {this.deleteTask(task.id)} } type="danger" icon="delete" size='small' />
      </div> )
    })
  }

  search = (event) => {
    this.setState({searchQuery: event.currentTarget.value});
  }
  
  searchInTasks = (tasks, searchQuery) => {
    return _.filter(tasks, function(task) { 
        if(task.name) 
          return task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
        return false;
        } );
  }

  render() {
    const {tasks, searchQuery, newTask, showLoader} = this.state;
    const filteredTasks = this.searchInTasks(tasks, searchQuery);
    const active = _.filter(filteredTasks, {status: 0});
    const completed = _.filter(filteredTasks, {status: 1});
    return (
      <div>
        {showLoader && <div className="spinner-contailer"><Spin size="large" /></div> }

        <div class="page-wraper">
          
          <Input.Search 
          placeholder="Search"
          onChange={this.search}
          style={{ margin: "20px", width: "250px"}}>

          </Input.Search>
          <div class="task-lists-container" >
              <div class="task-list">
                <h2>Active</h2>
                {this.renderTasks(active)}
              </div>
              
              <div class="task-list completed-tasks">
                <h2>Completed</h2>
                {this.renderTasks(completed)}
              </div>
          </div>
        
          <Button.Group>
              <Input style={{ width: 250 }} placeholder="Add a task" allowClear value={this.state.newTask} onPressEnter={this.addTask} onChange={this.onChangeNewTask} />
              <Button disabled={!newTask || newTask == ''} onClick={this.addTask} >Add</Button>
          </Button.Group>

        </div>
        
      </div>
    );
  }
}

export default App;

const init_tasks = [
  {
      "id": 2,
      "name": "buy milk",
      "status": 1,
      "createdAt": "2019-03-05T18:30:53.000Z",
      "updatedAt": "2019-03-05T19:02:31.000Z"
  },
  {
      "id": 3,
      "name": "read a book",
      "status": 1,
      "createdAt": "2019-03-05T18:30:55.000Z",
      "updatedAt": "2019-03-05T19:06:15.000Z"
  },
  {
      "id": 4,
      "name": "Call R",
      "status": 1,
      "createdAt": "2019-03-05T18:31:07.000Z",
      "updatedAt": "2019-03-05T19:06:33.000Z"
  },
  {
      "id": 5,
      "name": "Order Pizza",
      "status": 0,
      "createdAt": "2019-03-05T18:33:11.000Z",
      "updatedAt": "2019-03-05T19:07:23.000Z"
  },
  {
      "id": 6,
      "name": "meditate",
      "status": 0,
      "createdAt": "2019-03-05T18:33:19.000Z",
      "updatedAt": "2019-03-05T18:33:19.000Z"
  }
];
