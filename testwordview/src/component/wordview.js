import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode,faTimes,faArrowAltCircleLeft,faImage,faDownload,faSync } from '@fortawesome/free-solid-svg-icons'
import {Button,Spinner} from 'reactstrap'
import Pagination from './pagination'
export default class WordForm extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
          src:"",
          size:[],
          picbox:false,
          pagination:1,
          sumofpages:0,
          WordList:[],
          modal:false,
          url:"",
          wait:false,
          activeItem: {
            id: "",
            name: ""
          },
        };
        
    }
    componentWillMount() {
      this.refreshList()
    }
    test=(page)=>{
      this.setState({pagination:page},()=>this.refreshList())
    }
    changepage=(i)=>{
       this.setState({pagination:i},()=>{
        console.log(this.state.pagination)
        this.refreshList()
       }
       )
    }

    refreshList = () => {
      axios
        .get("/get_words/"+this.getAllUrlParams().id+"?page="+this.state.pagination)
        .then(res => this.setState({ WordList: res.data.items,sumofpages:res.data.sum },()=>{
          console.log('Tong '+this.state.sumofpages)
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
    ignore=(item)=>{
      var csrftoken = this.getCookie('csrftoken');
      axios
      .post("/personal",{
         id:item.id
      },{
        headers: {
        'X-CSRFTOKEN': csrftoken
        }
        }
      )
        .then(res => {
            if(res.data=="success")
            {
              alert('Your Task is Done')
              this.refreshList();
            }
          }
         )
        .catch(err => console.log(err));
    }
    poll = () => {
      var csrftoken = this.getCookie('csrftoken');
      this.setState({wait:true},()=>{
        axios
        .post("/analyze_pic",{
           idpage:this.getAllUrlParams().id
        },{
          headers: {
          'X-CSRFTOKEN': csrftoken
          }
          }
        )
          .then(res => {
             this.setState({src:res.data.pic,size:res.data.size},()=>{
               if(this.state.src!="fail.jpeg")
               { 
                this.setState({picbox:true,wait:false})
               }
               else
               {
                 alert("This Website can't be capture");
                 this.setState({picbox:false,wait:false})
               }
             })
            }
           )
          .catch(err => console.log(err))})
      }
    hide=()=>{
      this.setState({picbox:false})
    }
 
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
    handleClick=(e)=> {
      const clickValue = e.target.offsetParent.getAttribute("data-page")
        ? e.target.offsetParent.getAttribute("data-page")
        : e.target.getAttribute("data-page");
      this.setState({pagination:clickValue},this.refreshList);
    }
   
    openmodal = (item) =>{
      this.setState({modal:true,activeItem:item})
    }
    closemodal = () =>{
      this.setState({modal:false})
    }
    download = ()=>{
      window.location.href="/media/picture/"+this.state.src;
    }
    
    renderItems = () => {
            return this.state.WordList.map(item=>(
              <tr>
                <td className="tdword">{item.name}</td>
                <td className="tdsuggest">   
               </td>
                <td className="tdbutton">     
                <button className="btn btn-secondary mr-2 Buttonstyle" onClick={() => this.openmodal(item)}>
                  <FontAwesomeIcon icon={faCode} />
                </button> 
                <button className="btn btn-secondary mr-2 Buttonstyle" onClick={() => this.ignore(item)}> 
                  <FontAwesomeIcon icon={faTimes} /> 
                 </button > 
                </td>
              </tr>
              )
            )
    };
    wait=()=>{
        this.poll();
    }
    createPage=()=>{
      return(
        <Pagination current={this.state.pagination} sumofpages={this.state.sumofpages} changepagefunc={this.changepage}/>
      )
    }
    render()
    {
      document.getElementsByTagName('nav')[0].style.display='flex';
      document.getElementsByClassName('test')[0].style.display='block';
      return (
        
        <main className={this.state.wait==true || this.state.picbox==true  ? "blackform mainForm":"whiteform mainForm"}>
            {this.state.picbox==false && this.state.wait == true ? ( 
            <div>
            {
                document.getElementsByTagName('nav')[0].style.setProperty('display','none'),
                document.getElementsByClassName('test')[0].style.setProperty('display','none')
            }  
            <Spinner style={{ width: '3rem',color:"light", height: '3rem',left:'50%',right:'50%' }} />{' '}
            </div>): null}
            <br/>
            <div class="row justify-content-md-center">
             {this.state.picbox == true && this.state.wait == false ? (
               <div style={{width:"100%"}}>
                {
                document.getElementsByTagName('nav')[0].style.setProperty('display','none'),
                document.getElementsByClassName('test')[0].style.setProperty('display','none')
                }  
                <div class="row justify-content-md-center">
                  <div id="buttonleft">
                   <Button color="dark" onClick={()=>this.poll()}> <FontAwesomeIcon icon={faSync} /> </Button> 
                   <Button color="dark" onClick={()=>this.hide()}> <FontAwesomeIcon icon={faArrowAltCircleLeft} /> </Button> 
                   <Button color="dark"> <a style={{color:"white"}} href={"/media/picture/"+this.state.src} download><FontAwesomeIcon icon={faDownload}/></a></Button> 
                  </div>
                </div>   
      
               </div>
             ) : null}
             
            {this.state.picbox == false && this.state.wait == false ? (
            <div style={{width:"100%"}}>
           
            <div class="row justify-content-md-center">
             <div id="buttonleft">
              
              <Button color="success" onClick={()=>{this.wait()}}><FontAwesomeIcon icon={faImage} /> </Button> 
             </div>
            </div>   
            <br/>
            <div class="row justify-content-md-center">
            <div id="tableForm">
             <table className="containTable">
              <tr>
                 <th>Words</th>
                 <th>Suggestion</th>
                 <th>buttons</th>
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
            ) : null }
          </div>
        </main>
      );
    }
}