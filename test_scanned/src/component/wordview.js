import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode,faSignInAlt,faTimes,faArrowAltCircleLeft,faImage,faDownload,faSync } from '@fortawesome/free-solid-svg-icons'
import Modal from './myModal'
import {Button,Spinner} from 'reactstrap'
import PictureZoomBox from './picture_zoom'
import Pagination from './pagination'
import './wordform.css';
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
    componentDidMount() {
      this.refreshList();
    }
    test=(page)=>{
      this.setState({pagination:page},()=>this.refreshList())
    }
    refreshList = () => {
      axios
        .get("/get_words/"+this.props.id+"?page="+this.state.pagination+"&iduser="+this.props.iduser)
        .then(res => this.setState({ WordList: res.data.items,sumofpages:res.data.sum }))
        .catch(err => console.log(err));
    };
    poll = () => {
      var csrftoken = this.getCookie('csrftoken');
      console.log('wait');
      this.setState({wait:true},()=>{
        axios
        .post("/analyze_pic",{
           idpage:this.props.id,
           iduser:this.props.iduser
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
           
          })
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
   
    renderItems = () => {
            return this.state.WordList.map(item=>(
              <tr>
                <td className="tdword">{item.name}</td>
                <td className="tdsuggest">   
                 {item.suggestion}
               </td>
                <td className="tdbutton">     
                <button className="btn btn-secondary mr-2 Buttonstyle" onClick={() => this.openmodal(item)}>
                  <FontAwesomeIcon icon={faCode} />
                </button> 
                </td>
              </tr>
              )
            )
    };
    wait=()=>{
        this.poll();
    }
    changepage=(i)=>{
      this.setState({pagination:i},()=>{
       this.refreshList()
       }
      )
   }

    render()
    {
      document.getElementsByTagName('nav')[0].style.display='flex';
      return (
        
        <main className={this.state.wait==true || this.state.picbox==true  ? "blackform mainForm":"whiteform mainForm"}>
            {this.state.picbox==false && this.state.wait == true ? ( 
            <div>
            {
                document.getElementsByTagName('nav')[0].style.setProperty('display','none')
            } 
            <div style={{left:'50%',top:'50%',position:'fixed'}}>
              <Spinner color="light" style={{ width: '10rem',color:"light", height: '10rem' }} />{' '}
            </div>
            </div>): null}
            <br/>
            <div class="row justify-content-md-center">
             {this.state.picbox == true && this.state.wait == false ? (
               <div style={{width:"100%"}}>
                {
                document.getElementsByTagName('nav')[0].style.setProperty('display','none')
                //document.getElementsByClassName('test')[0].style.setProperty('display','none')
                }  
                <div class="row justify-content-md-center">
                  <div id="buttonleft">
                   <Button color="dark" onClick={()=>this.hide()}> <FontAwesomeIcon icon={faArrowAltCircleLeft} /> </Button> 
                  </div>
                </div>   
                
                <div class="row justify-content-md-center">
                <PictureZoomBox
                 url ={this.state.src}
                 size = {this.state.size}
                />
                </div>  
               </div>
             ) : null}
             
            {this.state.picbox == false && this.state.wait == false ? (
            <div style={{width:"100%"}}>
           
            <div class="row justify-content-md-center">
             <div id="buttonleft">
              <Button color="primary" onClick={()=>this.props.open()}><FontAwesomeIcon icon={faSignInAlt}/></Button>                             
              <Button color="success" onClick={()=>{this.wait()}}><FontAwesomeIcon icon={faImage}/> </Button> 
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
             }          {
          this.state.modal == true ? (
          <Modal
            checkcode = {true}
            sigin = {false}
            url ={"/gethref?idurl="+this.props.id+"&idword="+this.state.activeItem.id}
            toggle = {this.closemodal}
          />
          ) : null
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