import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from "reactstrap";


export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:true
        }
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
        return (
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
        );
    }
}