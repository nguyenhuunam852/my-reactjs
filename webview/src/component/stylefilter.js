import React, { Component } from "react";
import './stylefilter1.css'

//

export default class Stylefilter extends Component{
    constructor(props) {
        super(props);
    }

    render(){
      return(
          <div className="breadcrumb-container">
            <nav className="breadcrumbs">
            <ol>
                <li>
                    <a className="breadcrumb" onClick={()=>this.props.setfilter(0)}>
                       <span property="name">All scanned webpage</span>
                    </a>
                </li>

                <li>
                    <a className="breadcrumb" onClick={()=>this.props.setfilter(1)}>
                       <span property="name">All success scanned webpage</span>
                    </a>
                </li>

                <li>
                    <a className="breadcrumb" onClick={()=>this.props.setfilter(2)}>
                       <span property="name">All fail scanned webpage</span>
                    </a>
                </li>

                <li>
                    <a className="breadcrumb" onClick={()=>this.props.setfilter(3)}>
                       <span property="name">All webpage have wrong words</span>
                    </a>
                </li>

                <li>
                    <a className="breadcrumb" onClick={()=>this.props.setfilter(4)}>
                       <span property="name">All perfect webpage</span>
                    </a>
                </li>
            </ol>
            </nav>
          </div>
      )
    }
}