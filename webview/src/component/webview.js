import React, { Component } from "react";
import {MDBProgress} from "mdbreact";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faPlus,faTrash } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from 'react-bootstrap';

export default class WebView extends Component {
  constructor(props) {
        super(props);
        this.state = 
        {
          page: "",
          current: 0,
          active:false,
          pagination:1,
          sumofpages:1,
          PageList:[],
          isdone:false,
          working:'',
          interval:
            setInterval(()=>{
            this.poll()
          
            },3000)
    
        };
  } 
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios
      .get("/get_view/"+this.getAllUrlParams().id)
      .then(res => this.setState({ PageList:res.data.items,sumofpages:res.data.sumofpages,isdone:res.data.isdone,working:res.data.state},()=>{
        if(this.state.isdone)
        {
          if(this.state.working.trim()==='n-active')
          {
           this.setState({active:false})
           this.StopPoll()
          }
        }
        else
        {
          console.log(this.state.working)
          if(this.state.working.trim()==='n-active')
          {
           this.setState({active:false})
           this.StopPoll()
          }
          else
          {
           this.setState({active:true,current:res.data.process_percent,page:res.data.current_web}) 
          }     
        }
      }))
      .catch(err => console.log(err));
  };
  
  getAllUrlParams= (url) => {
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
          } else if (obj[paramName] && typeof obj[paramName] === 'string'){
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
  renderItems = () => {
    return this.state.PageList.map(item=>(
        <tr>
          <td>{item.name}</td>
          <td>
          {
            item.is_valid == true ? (
              <FontAwesomeIcon icon={faCheck} />
            ):(<FontAwesomeIcon icon={faTimes} />)
          }
          </td>
        <td>
        {
          item.is_done == true ? (
          
          <div>
          <a className="stylebutton button" href={"/words?id=" + item.id}> <FontAwesomeIcon icon={faPlus} /></a>
          <a className="stylebutton1 button" href={"/words/" + item.id}> <FontAwesomeIcon icon={faTrash} /></a>
          </div> 
          ):(
          <a className="stylebutton button" onClick={()=>{this.reloadpage(item.id)}}> <FontAwesomeIcon icon={faPlus} /></a>
          )
        }
        </td>
        </tr>
        )
      )
  }
  reloadpage=(id)=>{
    var csrftoken = this.getCookie('csrftoken');
    axios
    .post("/reloadweb",{
      idweb:id
    },{
      headers: {
      'X-CSRFTOKEN': csrftoken
        }
      }
    ).then(res => {

    }).catch(err => console.log(err));
  }
  StopPoll= ()=> {
    clearInterval(this.state.interval);
  }
  poll = () => {      
      var csrftoken = this.getCookie('csrftoken');
      axios
      .post("/poll_state",{
        pagination: this.state.pagination,
        idDomain:this.getAllUrlParams().id
      },{
        headers: {
        'X-CSRFTOKEN': csrftoken
          }
        }
      ).then(res => {
        this.setState({PageList:res.data.items,sumofpages:res.data.sumofpages,isdone:res.data.isdone,working:res.data.state},()=>{
          if(this.state.isdone)
          {
            if(this.state.working==='n-active')
            {
             this.setState({active:false})
             this.StopPoll()
            }
          }
          else
          {
            if(this.state.working==='n-active')
            {
             this.setState({active:false})
             this.StopPoll()
            }
            else
            {
              console.log(this.state.current)
             this.setState({active:true,current:res.data.process_percent,page:res.data.current_web})
            }      
          }
        })
    }).catch(err => console.log(err));
  };
  getCookie=(name)=> {
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
  setPagination(event){
    console.log(event)
  }
  handleClick=(e)=> {
    const clickValue = e.target.offsetParent.getAttribute("data-page")
      ? e.target.offsetParent.getAttribute("data-page")
      : e.target.getAttribute("data-page");
    console.log(clickValue);
    this.setState({pagination:clickValue},this.poll);
  }
  paginationBasic=() => {
    let items = [];
    for (let number = 1; number <= this.state.sumofpages; number++) {
     items.push(
       <Pagination.Item key={number} data-page={number} active={number == this.state.pagination}>
       {number}
       </Pagination.Item>,
     );
    }
    return(
      <div>
         <br/>
         <Pagination size="sm" onClick={this.handleClick}>{items}</Pagination>
      </div>
   );
  }    
  render(){
      return (
      <div>
        {
         this.state.active==true ? (
        <div>    
        <div>{this.state.page}</div>
        <div className="process">
          <MDBProgress value={this.state.current} className="my-2" />
        </div>
         </div>):null
        }
        <table>
           <tr>
           <th>Pages</th>
           <th>State</th>
           <th>Buttons</th>
          </tr>
          {this.renderItems()}
        </table> 
         {this.paginationBasic()}
      </div> 
      )
  }
}