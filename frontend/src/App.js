import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import axios from 'axios'
import './bootstrap/css/bootstrap.min.css'
import './bootstrap/css/sticky-footer-navbar.css'
import Footer from './components/Footer.js'
import Navbar from './components/Menu.js'
import UserList from './components/User.js'
import {ProjectList, ProjectDetail} from './components/Project.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/Auth.js'
import ProjectForm from './components/ProjectForm.js'
import ToDoForm from './components/ToDoForm.js'


const DOMAIN = 'http://127.0.0.1:8000/api/'
const get_url = (url) => `${DOMAIN}${url}`


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navbarItems: [
                {name: 'Users', href: '/'},
                {name: 'Projects', href: 'projects'},
                {name: 'TODOs', href: 'todos'},
            ],
            users: [],
            projects: [],
            project: {},
            todos: [],
            auth: {username: '', is_login: false}
        }
    }

    create_todo(text, project){
        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        const data = {text:text, project:project}

        axios.post(`${DOMAIN}todos/`,data, {headers}).then(response => {
            this.load_data()
        }).catch(error => {
            console.log(error)
            this.setState({todos:[]})})
    }

    create_project(name, link_repo, users){
        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        const data = {name:name, link_repo:link_repo, users:users}

        axios.post(`${DOMAIN}projects/`,data, {headers}).then(response => {
            this.load_data()
        }).catch(error => {
            console.log(error)
            this.setState({projects:[]})})
    }

    deleteToDo(id){
        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.delete(`${DOMAIN}todos/${id}`, {headers}).then(response => {
            this.load_data()
        }).catch(error => {
            console.log(error)
            this.setState({todos:[]})})
    }

    deleteProject(id){
        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.delete(`${DOMAIN}projects/${id}`, {headers}).then(response => {
            this.load_data()
        }).catch(error => {
            console.log(error)
            this.setState({projects:[]})})
    }

    login(username, password) {
        axios.post(get_url('token/'), {username: username, password: password})
            .then(response => {
                const result = response.data
                const access = result.access
                const refresh = result.refresh
                localStorage.setItem('login', username)
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)
                this.setState({'auth': {username: username, is_login: true}})
                this.load_data()
            }).catch(error => {
            if (error.response.status === 401) {
                alert('Неверный логин или пароль')
            } else {
                console.log(error)
            }
        })
    }


    logout() {
        localStorage.setItem('login', '')
        localStorage.setItem('access', '')
        localStorage.setItem('refresh', '')
        this.setState({'auth': {username: '', is_login: false}})
    }

    load_data() {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url('users/'), {headers})
            .then(response => {
                //console.log(response.data)
                this.setState({users: response.data})
            }).catch(error => console.log(error)
        )

        axios.get(get_url('projects/'), {headers})
            .then(response => {
                //console.log(response.data)
                this.setState({projects: response.data})
            }).catch(error =>
            console.log(error)
        )

        axios.get(get_url('todos/'), {headers})
            .then(response => {
                //console.log(response.data)
                this.setState({todos: response.data})
            }).catch(error =>
            console.log(error)
        )
    }

    componentDidMount() {

        // Получаем значения из localStorage
        const username = localStorage.getItem('login')
        if ((username !== "") & (username != null)) {
            this.setState({'auth': {username: username, is_login: true}}, () => this.load_data())
        }
    }


    render() {
        return (
            <BrowserRouter>
                <header>
                    <Navbar navbarItems={this.state.navbarItems} auth={this.state.auth} logout={() => this.logout()}/>
                </header>
                <main role="main" class="flex-shrink-0">
                    <div className="container">
                        <Routes>
                            <Route path="login" element={<LoginForm login={(username, password) =>
                                        this.login(username, password)} />} />

                            <Route path="/" element={<UserList users={this.state.users} />} />

                            <Route path="/projects" element={<ProjectList items={this.state.projects}
                                        deleteProject={(id) => this.deleteProject(id)}/>} />

                            <Route path="/project/:id" element={<ProjectDetail getProject={(id) => this.getProject(id)}
                                        item={this.state.project} />} />

                            <Route path="/projects/create" element={<ProjectForm users={this.state.users}
                                        create_project={(name, link_repo, users) =>
                                        this.create_project(name, link_repo, users)}/>} />

                            <Route path="/todos/create" element={<ToDoForm project={this.state.project}
                                        create_todo={(text, project) =>
                                        this.create_todo(text, project)}/>} />

                            <Route path="/todos" element={<ToDoList items={this.state.todos}
                                        deleteToDo={(id) => this.deleteToDo(id)}/>} />
                       </Routes>
                    </div>
                </main>

                <Footer/>
            </BrowserRouter>


        )
    }

    getProject(id) {

        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url(`/api/projects/${id}`), {headers})
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => console.log(error))
    }
}


export default App;