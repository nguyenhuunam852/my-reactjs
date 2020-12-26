import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from "reactstrap";
import axios from "axios";


export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:true,
            iduser:0,
            gmail: "",
            password: "",
            confirm_password: ""
        }
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    
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
    handleChangeConfirmPassword(event) {
      this.setState({ confirm_password: event.target.value });
    }
    handleChangePassword(event) {
      this.setState({ password: event.target.value });
    }
    componentDidMount()
    {
      console.log('checkcode:'+this.props.checkcode)
      if(this.props.checkcode==false)
      {
        this.setState({ gmail: this.props.gmail });
      }
    }
    handleSubmit(event) {
      if (this.state.password != this.state.confirm_password) {
        alert("Confirm Password Fail");
      }
      else {
        var csrftoken = this.getCookie('csrftoken');
        axios
          .post("/admin/adduser", {
            iduser:this.props.iduser,
            user: this.state.password,
          }, {
            headers: {
              'X-CSRFTOKEN': csrftoken
            }
          }
          ).then(res => {
            if (res.data.signal === "success") {
              alert('Your Task is Done');
              window.location.href = '/account/login/';
            }
            if (res.data.signal === "password") {
              alert('Password Problem')
            }
            if (res.data.signal === "duplicate") {
              alert('Your email is exist')
            }
          }).catch(err => console.log(err));
      }
      event.preventDefault();
    }
  
    createIfame=(url)=>{
       return(
        <div>
           <iframe id="iframe" src={this.props.url} width="100%" height="100%" allowfullscreen />
        </div>
       )
    }
    handleClose=()=>{
        this.setState({show:false},this.props.close())
    }
    findAnother=()=>{
      var childiFrame = document.getElementById("iframe");
      childiFrame.contentWindow.gotoAnother();
    }
  
    
    tunnel=(fn)=> {
     fn();
    }
  
    render() {
        console.log('checkcode:'+this.props.checkcode)
        return (
          
          <div>
          {this.props.checkcode ? (
          <Modal isOpen={this.state.show} toggle={this.props.toggle} size="lg">
            <ModalHeader closeButton> View Source Code </ModalHeader>
            <ModalBody>
               {this.createIfame(this.props.url)}
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={() => this.findAnother()}>
                Find Another
              </Button>
              <Button color="primary" onClick={this.props.toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
          ):(<div>
            <Modal isOpen={this.state.show} toggle={this.props.toggle} size="lg">
            <ModalHeader closeButton> Sign in </ModalHeader>
            <form onSubmit={this.handleSubmit} style={{height:"400px"}}>
            <div class="container">
             
             <div class="row justify-content-center">
              <div>
              <label>
               Gmail:
              </label>
              <br />
              <input type="text" value={this.state.gmail} />
              <br />
              <label>
               Password:
              </label>
              <br />
               <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
              <br />
              <label>
                Confirm:
              </label>
              <br />
              <input type="password" value={this.state.confirm_password} onChange={this.handleChangeConfirmPassword} />
              <br/>
              <br/>
              </div>
              </div>
             </div>
           
          

            <ModalFooter>
              <Button color="sucess" type="submit">
                Sign in
              </Button>
              <Button color="primary" onClick={this.props.toggle}>
                Close
              </Button>
            </ModalFooter>
            </form>
          </Modal>
          </div>
          )
          }
          </div>

        );
    }
}