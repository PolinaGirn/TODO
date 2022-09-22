import React from 'react'


class ProjectForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = {name: '', link_repo: '', users: []}
    }

    handleChange(event){
        this.setState({
                    [event.target.name]: event.target.value
                }
            );
    }
    handleUserChange(event){
        if(!event.target.selectedOptions){
            this.setState({'users':[]})
            return;
        }
        let users = []
        for(let i = 0; i < event.target.selectOptions.length; i++){
            users.push(event.target.selectedOptions.item(i).value)
        }
        this.setState({'users':users})
    }
    handleSubmit(event) {
      this.props.create_project(this.state.name, this.state.link_repo, this.state.users)
      event.preventDefault()
    }

    render() {
      return (
        <form onSubmit={(event)=> this.handleSubmit(event)}>
            <div className="form-group">
                <label for="name">name</label>
                <input type="text" className="form-control" name="name" value={this.state.name} onChange={(event)=>this.handleChange(event)} />
            </div>

            <div className="form-group">
                <label for="link_repo">link repo</label>
                <input type="text" className="form-control" name="link_repo" value={this.state.link_repo} onChange={(event)=>this.handleChange(event)} />
            </div>

            <div className="form-group">
                <select name="users" multiple onChange={(event)=> this.handleUserChange(event)}>
                    {this.props.map((item)=> <option value={item.id}>{item.username}</option>)}

                </select>
            </div>



          <input type="submit" className="btn btn-primary" value="Save" />
        </form>
      );
    }
  }

  export default ProjectForm