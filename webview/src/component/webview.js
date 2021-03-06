import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faPlus,faTrash,faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Progress,Button } from 'reactstrap';
import Stylefilter from './stylefilter';
import Pagination from './pagination';
import './webview.css';

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
          task:0,
          sumofitems:0,
          tempagination:1,
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
    this.setState({tempagination:i},()=>{this.poll()
    })
  }
  refreshList = () => {
    axios
      .get("/get_view/"+this.getAllUrlParams().id+"?pagi=1&task="+this.state.task)
      .then(res => this.setState({ PageList:res.data.items,sumofpages:res.data.sumofpages,isdone:res.data.isdone,pagination:1,working:res.data.state},()=>{
        if(this.state.isdone)
        {
          if(this.state.working.trim()==='n-active')
          {
           this.setState({sumofitems:res.data.sumofitems})
           this.setState({active:false})
           this.StopPoll()
          } 
        }
        else
        {
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
          {item.amountofwords>0 ? (
            <a className="stylebutton button" href={"/words?id=" + item.id}> <FontAwesomeIcon icon={faPlus} /></a>
          ):null}
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
          this.poll();
        }
        else
        {
          alert('something when wrong');
          this.poll();
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
        pagination: this.state.tempagination,
        idDomain:this.getAllUrlParams().id,
        task:this.state.task
      },{
        headers: {
        'X-CSRFTOKEN': csrftoken
          }
        }
      ).then(res => {
        this.setState({pagination:this.state.tempagination,PageList:res.data.items,sumofpages:res.data.sumofpages,isdone:res.data.isdone,working:res.data.state},()=>{
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
  filterlist=(task)=>{
    this.setState({task:task},()=>{
      this.refreshList()
    })
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
       
        <br/>        
        {
          this.state.isdone==true ? (
            <div>  
            
            <Stylefilter setfilter={this.filterlist}/> 
            
            </div>
            
          ):null
        }
 
        <br/> 
          <h5>Amount of Webpage:{this.state.sumofitems}</h5>
          <br/>
          <table className="containTable">
            <tr>
            <th>Pages</th>
            <th>State</th>
            <th>Buttons</th>
           </tr>
           {this.renderItems()}
          </table> 
          <br/>
          {
           this.state.sumofpages!=0 ?(
               <Pagination items={[]} current={this.state.pagination} sumofpages={this.state.sumofpages} changepagefunc={this.changepage}/>
           ):null
          }   
         </div>
      )
  }
}