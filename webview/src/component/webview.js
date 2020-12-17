import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faPlus,faTrash,faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Progress } from 'reactstrap';
import Pagination from './pagination'
export default class WebView extends Component {
  constructor(props) {
        super(props);
        this.state = 
        {
          page: "",
          current: 0,
          active:false,
          pagination:1,
          sumofpages:0,
          PageList:[],
          isdone:false,
          working:'',
          pending:false,
          interval:
            setInterval(()=>{
            this.poll()
          
            },3000)
    
        };
  } 
  componentDidMount() {
    this.refreshList();
  }
  changepage=(i)=>{
    this.setState({pagination:i},()=>{
      console.log(this.state.pagination)
      this.poll()
     }
    )
  }
  refreshList = () => {
    console.log(this.state.pagination)
    axios
      .get("/get_view/"+this.getAllUrlParams().id+"?pagi="+this.state.pagination)
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
          console.log(res.data.signal)
            if(res.data.signal!='Pending' && res.data.signal!='Wait')
           {
            console.log('wtf')
             this.setState({active:true,current:res.data.process_percent,page:res.data.current_web,pending:false}) 
           }
           if(res.data.signal=='Pending'){
            this.setState({pending:true});
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
          item.is_valid == true ? (
          <div>
          <a className="stylebutton button" href={"/words?id=" + item.id}> <FontAwesomeIcon icon={faPlus} /></a>
          <a className="stylebutton1 button" href={"/words/" + item.id}> <FontAwesomeIcon icon={faTrash} /></a>
          </div> 
          ):(
          <a className="stylebutton2 button" onClick={()=>{this.reloadpage(item.id)}}> <FontAwesomeIcon icon={faSyncAlt} /></a>
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
        if(res.data.signal==='done')
        {
          alert('your task is done');
          this.refreshList();
        }
        else
        {
          alert('something when wrong');
          this.refreshList();
        }
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
            console.log(res.data.signal)
            if(res.data.signal!='Pending' && res.data.signal!='Wait')
           {
             this.setState({active:true,current:res.data.process_percent,page:res.data.current_web,pending:false}) 
           }
           else{
            this.setState({pending:true});
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
 
  render(){
      return (
      <div>
        {
         this.state.active==true ? (
        <div>  
        <div>{this.state.current}%</div>
            <div className="process">
            <Progress value={this.state.current}/>
        </div>  
        <br/>
        </div>):(
          <div>
          {
            console.log(this.state.pending),
            this.state.pending==false ?(
            <div>
              
            </div>
            ):(
              <div><h2>This Task is Pending because the server is overloading,pls wait a minute</h2></div>
            )
          }
          </div>
        )
        }
        <table className="containTable">
           <tr>
           <th>Pages</th>
           <th>State</th>
           <th>Buttons</th>
          </tr>
          {this.renderItems()}
        </table> 
        {
          this.state.sumofpages!=0 ?(
              <Pagination items={[]} current={this.state.pagination} sumofpages={this.state.sumofpages} changepagefunc={this.changepage}/>
          ):null
        }   
      </div> 
      )
  }
}