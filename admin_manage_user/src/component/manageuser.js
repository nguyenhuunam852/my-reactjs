import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faPlus, faThList } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'

export default class ManageUser extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      pagination: 1,
      sumofpages: 0,
      userItem: [],
      add: false,
      add_active_user: {
        gmail: "",
        password: "",
      },
      confirm_password: ""
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeConfirmPassword(event) {
    this.setState({ confirm_password: event.target.value });
  }
  handleChangeEmail(event) {
    const newUser = { ...this.state.add_active_user, gmail: event.target.value };
    this.setState({ add_active_user: newUser });
  }
  handleChangePassword(event) {
    const newUser = { ...this.state.add_active_user, password: event.target.value };
    this.setState({ add_active_user: newUser });
  }
  handleSubmit(event) {
    if (this.state.add_active_user.password != this.state.confirm_password) {
      alert("Confirm Password Fail");
      const newUser = { ...this.state.add_active_user, password: "" };
      this.setState({ add_active_user: newUser, confirm_password: "" });
    }
    else {
      var csrftoken = this.getCookie('csrftoken');
      axios
        .post("/admin/adduser", {
          user: this.state.add_active_user,
        }, {
          headers: {
            'X-CSRFTOKEN': csrftoken
          }
        }
        ).then(res => {
          if (res.data.signal === "success") {
            alert('Your Task is Done')
            this.refreshList();
          }
          if (res.data.signal === "password") {
            alert('Password Problem')
            this.refreshList();
          }
          if (res.data.signal === "duplicate") {
            alert('Your email is exist')
            this.refreshList();
          }
        }).catch(err => console.log(err));
    }
    event.preventDefault();
  }
  componentDidMount() {
    this.refreshList();
  }
  getAllUrlParams = (url) => {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
      queryString = queryString.split('#')[0];

      var arr = queryString.split('&');

      for (var i = 0; i < arr.length; i++) {
        var a = arr[i].split('=');
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
        if (paramName.match(/\[(\d+)?\]$/)) {
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
          if (paramName.match(/\[\d+\]$/)) {
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            obj[key].push(paramValue);
          }
        } else {
          if (!obj[paramName]) {
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            obj[paramName].push(paramValue);
          }
        }
      }
    }
    return obj;
  }

  refreshList = () => {
    axios
      .get("/admin/get_usersinfor?page=" + this.state.pagination)
      .then(res => this.setState({ userItem: res.data.items, sumofpages: res.data.sumofpages, confirm_password: "", add_active_user: { gmail: "", password: "" } }))
      .catch(err => console.log(err));
  };
  getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  post_deadactive = (id) => {
    var csrftoken = this.getCookie('csrftoken');
    axios
      .post("/admin/deadactive", {
        id: id,
      }, {
        headers: {
          'X-CSRFTOKEN': csrftoken
        }
      }
      ).then(res => {
        if (res.data.signal === "success") {
          alert('Your Task is Done')
          this.refreshList();
        }
        else {
          alert('Something Went Wrong :((')
          this.refreshList();

        }
      }).catch(err => console.log(err));
  }

  post_active = (id) => {
    var csrftoken = this.getCookie('csrftoken');
    axios
      .post("/admin/active", {
        id: id,
      }, {
        headers: {
          'X-CSRFTOKEN': csrftoken
        }
      }
      ).then(res => {
        if (res.data.signal === "success") {
          alert('Your Task is Done')
          this.refreshList();
        }
      
        else {
          alert('Something Went Wrong :((')
          this.refreshList();

        }
      }).catch(err => console.log(err));
  }

  renderItems = () => {
    return this.state.userItem.map(item => (
      <tr>
        <td>{item.email}</td>
        <td>
          {item.date_joined}
        </td>
        <td>
          {
            item.is_staff == true ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (<FontAwesomeIcon icon={faTimes} />)
          }
        </td>
        <td>
          {
            item.is_active == true ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (<FontAwesomeIcon icon={faTimes} />)
          }
        </td>
        <td>
          {item.is_active ? (
            <a style={{ color: "blue" }} onClick={() => this.post_deadactive(item.id)}> <FontAwesomeIcon icon={faTimes} /></a>
          ) : (
              <a style={{ color: "red" }} onClick={() => this.post_active(item.id)}> <FontAwesomeIcon icon={faTimes} /></a>
            )}
        </td>
      </tr>
    )
    )
  };
  active_add = () => {

  }
  changepage=(i)=>{
    this.setState({pagination:i},()=>{
      this.refreshList();
     }
    )
  }
  render() {
    return (
      <div style={{ width: "100%" }}>
        <br />
        {
          this.state.add == false ?
            (
          <div>
           <div class="row justify-content-md-center">   
             <div id="buttonleft">
              <Button color="success" onClick={() => { this.setState({add:true}) }}><FontAwesomeIcon icon={faPlus} /> </Button>
              </div> 
           </div>
           <br />
           <br />
         
          <div class="row justify-content-md-center">     
           <div id="tableForm">
            <table className="tables">
              <tr>
                <th>Email</th>
                <th>create_at</th>
                <th>is_staff</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
              {this.renderItems()}
            </table>
          {
          this.state.sumofpages!=0 ?(
              <Pagination items={[]} current={this.state.pagination} sumofpages={this.state.sumofpages} changepagefunc={this.changepage}/>
          ):null
          }   

         </div>
        </div>
      </div>
    )
      : (
      <div>
      <div class="row justify-content-md-center">   

        <div id="buttonleft">
          <Button color="danger" onClick={() => { this.setState({ add: false }) }}><FontAwesomeIcon icon={faPlus} /> </Button>
        </div>
      </div>
      <br />
      <br />
      <div class="row justify-content-md-center">   

        <form onSubmit={this.handleSubmit}>
          <label>
            Gmail:
                    </label>
          <br />
          <input type="text" value={this.state.add_active_user.gmail} onChange={this.handleChangeEmail} />
          <br />
          <label>
            Password:
          </label>
          <br />
          <input type="password" value={this.state.add_active_user.password} onChange={this.handleChangePassword} />
          <br />
          <label>
            Confirm:
          </label>
          <br />
          <input type="password" value={this.state.confirm_password} onChange={this.handleChangeConfirmPassword} />
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
      </div>
    )
  }
       
      </div>
    )
  }
}