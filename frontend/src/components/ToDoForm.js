import React from 'react'


class ToDoForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = {text:'', project:''}
    }

    handleChange(event){
        this.setState({
                    [event.target.name]: event.target.value
                }
            );
    }
    handleProjectChange(event){
        if(!event.target.selectedOptions){
            this.setState({'project':[]})
            return;
        }
        let project = []
        for(let i = 0; i < event.target.selectOptions.length; i++){
            project.push(event.target.selectedOptions.item(i).value)
        }
        this.setState({'project':project})
    }
    handleSubmit(event) {
      this.props.create_todo(this.state.text, this.state.project)
      event.preventDefault()
    }

    render() {
      return (
        <form onSubmit={(event)=> this.handleSubmit(event)}>
            <div className="form-group">
                <label for="text">text</label>
                <input type="text" className="form-control" name="text" value={this.state.text} onChange={(event)=>this.handleChange(event)} />
            </div>

            <div className="form-group">
                <select name="project" onChange={(event)=> this.handleProjectChange(event)}>
                    {this.props.projects.map((item) => <option value={item.id}>{item.name}</option>)}
                </select>
            </div>

          <input type="submit" className="btn btn-primary" value="Save" />
        </form>
      );
    }
  }

  export default ToDoForm