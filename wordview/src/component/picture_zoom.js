import React, { Component } from "react";
import './picture-zoom.css';

export default class PictureZoomBox extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = 
        {
          src:this.props.url,
          width:this.props.size[0]+"px",
          height:this.props.size[1]+"px",
          smallwidth:this.props.size[0]*0.02+"px",
          smallheight:this.props.size[1]*0.02+"px",

        };
        console.log(this.state)
    }
    
    imagezoom = (imgID,resultID)=>{
        var img, lens, result, cx;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);

        lens = document.createElement("DIV");
        lens.setAttribute("class", "img-zoom-lens");
        lens.style.height=this.state.smallheight;
        lens.style.width="10px";

        img.parentElement.insertBefore(lens, img);

        cx = result.offsetWidth / lens.offsetWidth;

        result.style.backgroundImage = "url('"+ img.src + "')";
        result.style.backgroundSize = (img.offsetWidth/0.02) + "px " + (img.offsetHeight/0.02) + "px";
        
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        /*and also for touch screens:*/
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);

        function moveLens(e) {
            var pos, x, y;
            /*prevent any other actions that may occur when moving over the image:*/
            e.preventDefault();
            /*get the cursor's x and y positions:*/
            pos = getCursorPos(e);
            /*calculate the position of the lens:*/
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);
            /*prevent the lens from being positioned outside the image:*/
           
    
            var bar = document.getElementsByClassName('navbar').offsetHeight;            
            //var imgx = (headx-img.offsetWidth)/2
           
            y = 20+bar;
            if (x < 0) {
              x = 0;
            }
            if(x+lens.offsetWidth>img.offsetWidth){
                 x= img.offsetWidth-lens.offsetWidth
            }
            var a = img.getBoundingClientRect();
            
            lens.style.left = a.left+x+ "px";
            lens.style.top = y + "px";
            /*display what the lens "sees":*/
            result.style.backgroundPosition = "-" + (x*cx) + "px -" + (0) + "px";
        }
          
        function getCursorPos(e) {
            var a, x = 0, y = 0;
            e = e || window.event;
            /*get the x and y positions of the image:*/
            a = img.getBoundingClientRect();
            /*calculate the cursor's x and y coordinates, relative to the image:*/
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {x : x, y : y};
        }
    }
    componentDidMount(){
        this.imagezoom("myimage", "myresult");
    }
  
    render(){
      
      return (
          <div id="picbox">
              <div id="head" className="row justify-content-md-center">
                 <img id="myimage" alt="test" src={"/media/picture/"+this.state.src} width={this.state.smallwidth} height={this.state.smallheight}/>
                 <div id="myresult" class="img-zoom-result" style={{height:this.state.height}}></div>
              </div>
          </div>
      )
    }
}