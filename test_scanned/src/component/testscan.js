import React, { Component } from "react";
import axios from "axios";
import { Modal,Button } from "reactstrap";
import './testscan.css';

export default class TestScan extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            webpage="",
            email=""
        };
        this.handleChangeWebPage = this.handleChangeWebPage.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
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
        var csrftoken = this.getCookie('csrftoken');
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
              alert('Your Task is Done')
              this.refreshList();
            }
          
            else {
              alert('Something Went Wrong :((')
              this.refreshList();
    
            }
          }).catch(err => console.log(err));
    
    }
    render(){
        return(
        <div>
        
         <div class="search-box col-md-5">     
            <div class="input-group mb-3">                          
              <input type="text" value={this.state.webpage} onChange={this.handleChangeWebPage} class="form-control" aria-label="Search input with dropdown button" placeholder="Enter your webpage" />                                                       
            </div>          
            <div class="input-group mb-3">                          
              <input type="text" value={this.state.webpage} onChange={this.handleChangeWebPage} class="form-control" aria-label="Search input with dropdown button" placeholder="Enter your webpage" />                                                       
              <div class="input-group-append">                          
                  <Button className="btn btn-success" onClick={()=>this.testscan} />                             
              </div>
           </div>
         </div>
        </div>
        )
    }

}