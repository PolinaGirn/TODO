import logo from './logo.svg';
import './App.css';
import React from "react";
import UserList from "./components/User";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import axios from "axios";

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'users': []
        }
    }



    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/users/').then(response => {
            this.setState(
            {
                'users':response.data
            }
        )
    }).catch(error => console.log(error))
//        const users = [
//            {
//                'username':'fedor007',
//                'first_name':'Фёдор',
//                'last_name':'Достаевский',
//                'email':'fedor@gmail.com',
//            },
//            {
//                'username':'alex777',
//                'first_name':'Александр',
//                'last_name':'Грин',
//                'email':'alex@gmail.com',
//            }
//        ]
    }


    render() {
        return (
            <div>
                <Menu menu={this.state.menu}/>
                <UserList users={this.state.users}/>
                <Footer footer={this.state.footer}/>
            </div>
        )
    }
}

export default App;
