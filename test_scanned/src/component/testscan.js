import React, { Component } from "react";
import axios from "axios";
import { Button,Spinner } from "reactstrap";
import './testscan.css';
import WordForm from './wordview';
import Modal from './myModal';

export default class TestScan extends Component {
    constructor(props) {
        super(props);
        
        this.state =
        {
            modal:false,
            webpage:"",
            email:"",
            wait:false,
            sumofpages:0,
            WordList:[],
            iduser:0,
            done:false,
            id:0
        };
        this.handleChangeWebPage = this.handleChangeWebPage.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
    }
    refresh=()=>{
        
    }
    handleChangeWebPage(event) {
        this.setState({  webpage: event.target.value });
    }
    handleChangeEmail(event) {
        this.setState({  email: event.target.value });
    }
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
        
    testscan=()=>{
     
        var check = this.validURL(this.state.webpage);
        console.log(check)
        if(check===true)
        {
        this.setState({wait:true},()=>{
    
            var csrftoken = this.getCookie('csrftoken');
            console.log(csrftoken)
            axios
              .post("/testscan", {
                webpage:this.state.webpage,
                email:this.state.email
              }, {
                headers: {
                  'X-CSRFTOKEN': csrftoken
                }
              }
              ).then(res => {
                if (res.data.signal === "success") {
                  this.setState({ done:true,id:res.data.id,iduser:res.data.iduser })
                }
                if(res.data.signal === "email"){
                    this.setState({wait:false})
                    alert('Email not valid');
                }     
                if(res.data.signal === "duplicate"){
                    alert('This Email exist');
                }     
                this.setState({wait:false},()=>{
                    this.refresh();

                })   
              }).catch(err => console.log(err));
    
        })
        }
        else
        {
            alert('Address not valid');
        }
    
    }
    closemodal = () =>{
      this.setState({modal:false})
    }
    validURL= (str)=> {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }
    openmal = ()=>{
      this.setState({modal:true});
    }
    render(){
        console.log('open modal '+this.state.modal)
        console.log('open email '+this.state.email)
        return(
        <div>
         {this.state.wait==false ? (
          
          <div>
           {this.state.done==false ? (
             <div>
               <div class="search-box col-md-5"> 
                <div style={{width:"50%"}}>
                    <div class="input-group mb-2">                          
                        <input type="email" value={this.state.email} onChange={this.handleChangeEmail} class="form-control" aria-label="Search input with dropdown button" placeholder="Enter your email" />                                                       
                    </div>             
                </div>
                <div class="input-group mb-3">                          
                        <input type="text" value={this.state.webpage} onChange={this.handleChangeWebPage} class="form-control" aria-label="Search input with dropdown button" placeholder="Enter your webpage" />                                                       
                        <div class="input-group-append">                          
                            <Button className="btn btn-success" onClick={()=>this.testscan()}>Check</Button>                             
                        </div>
                </div>
              </div>   
            </div>
           ):
           (
            <div class="row justify-content-center">
              {this.state.modal == true ?
              (
                <Modal
                checkcode = {false}
                sigin = {true}
                gmail = {this.state.email}
                iduser = {this.state.iduser}
                toggle = {this.closemodal}
                />
              ):
              (
                <div> 
                  <div style={{width:"100%"}}>
                   <WordForm open={this.openmal} id={this.state.id} iduser={this.state.iduser} />
                  </div>
                </div>
              )
              }
            </div>
           )
           }
          </div>
         ):(
            <div class="search-box col-md-5"> 
             <div class="input-group mb-3">   
              <div style={{paddingLeft:"50%"}}>  
               <Spinner color="success" />
              </div>
             </div>
            </div>
         )
        }
        </div>
        )
    }

}