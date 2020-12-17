import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'
import Pagination from './pagination.js'


export default class ManageIgnoreWord extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      pagination: 1,
      sumofpages: 0,
      wordItem: []
    };

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
      .get("/account/getignoreinfor?page=" + this.state.pagination)
      .then(res => this.setState({ wordItem: res.data.items, sumofpages: res.data.sumofpages}))
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

  changepage=(i)=>{
    this.setState({pagination:i},()=>{
      this.refreshList();
     }
    )
  }
  removeword=(id)=>{
    var csrftoken = this.getCookie('csrftoken');
    axios
    .post("/account/removeword",{idword:id},{headers: {'X-CSRFTOKEN': csrftoken}}).then(res => {
          if(res.data.signal==='done')
          {
            alert('your task is done')
            this.refreshList()
          }
          else{
            alert('something When Wrong')
            this.refreshList();
          }
      })
      .catch(err => console.log(err))
  }
  renderItems = () => {
    console.log(this.state.wordItem)

    return this.state.wordItem.map(item => (
      <tr>
        <td>{item.word.name}</td>
        <td>
          {item.verify}
        </td>
        <td>
         <a style={{ color: "blue" }} onClick={()=>{this.removeword(item.word.id)}} > <FontAwesomeIcon icon={faTimes} /></a>
        </td>
      </tr>
    )
    )
  };

  render() {
    return (
      <div style={{ width: "100%" }}>
        <br/>
        <div>
          <br/>
          <br/>
          <div class="row justify-content-md-center">     
           <div id="tableForm">
            <table className="tables">
              <tr>
                <th>Word</th>
                <th>Create_at</th>
                <th>Action</th>
              </tr>
              {this.renderItems()}
            </table>
            {
            this.state.sumofpages!=0 ?(
              <Pagination items={[]} current={this.state.pagination} sumofpages={this.state.sumofpages} changepagefunc={this.changepage}/>
            ):null
            }   
            <br/>
            <br/>
            <div> 
        </div> 
         </div>
        </div>
        </div>
    </div>)
  }
}