import React, { Component } from "react";
export default class Pagination extends Component {
    constructor(props) {
        super(props);
        console.log('Tong moi : '+this.props.sumofpages);
    }
    
    createPagination= () =>{
        var run=this.props.sumofpages;
        let pageCutLow = this.props.current - 1;
        let pageCutHigh = this.props.current + 1;       
        if(this.props.current>1)
        {
          this.props.items.push(<li className="page-item previous no"><a onClick={()=>this.props.changepagefunc(this.props.current-1)}>Previous</a></li>);
        }
        if(run<6)
        {
          for(let i=1;i<=run;i++)
          {
            if(i!=this.props.current)
            {
                this.props.items.push(<li className="page-item no"><a onClick={()=>this.props.changepagefunc(i)}>{i}</a></li>);
            }
            else
            {
                this.props.items.push(<li className="page-item active"><a onClick={()=>this.props.changepagefunc(i)}>{i}</a></li>);
            }
          }
        }
        else
        {
          if(this.props.current>2)
          {
            this.props.items.push(<li className="no page-item"><a onClick={()=>this.props.changepagefunc(1)}>1</a></li>);
            if(this.props.current>3)
            {
                this.props.items.push(<li class="page-item"><a onClick={()=>{this.props.changepagefunc(this.props.current-2)}}>...</a></li>);
            }
          }
          if(this.props.current===1)
          {
            pageCutHigh += 2;
          }
          else if (this.props.current === 2) {
              pageCutHigh += 1;
          }
          if (this.props.current === this.props.sumofpages) {
              pageCutLow -= 2;
          }
          else if (this.props.current === this.props.sumofpages-1) {
             pageCutLow -= 1;
          }
          for (let p = pageCutLow; p <= pageCutHigh; p++) {
              if (p === 0) {
                p += 1;
              }
              if (p > this.props.sumofpages) {
                continue
              }
              if(p!=this.props.current)
              {
                this.props.items.push(<li className="page-item no"><a onClick={()=>this.props.changepagefunc(p)}>{p}</a></li>);
              }
              else
              {
                this.props.items.push(<li className="page-item active"><a onClick={()=>this.props.changepagefunc(p)}>{p}</a></li>);
              }
            }
          if (this.props.current < this.props.sumofpages-1) {
            if (this.props.current < this.props.sumofpages-2) {
                this.props.items.push(<li className="page-item"><a onClick={()=>this.props.changepagefunc(this.props.current+2)}>...</a></li>);
            }
            this.props.items.push(<li class="page-item no"><a onClick={()=>this.props.changepagefunc(this.props.sumofpages)}>{this.props.sumofpages}</a></li>);
          }
        }
        return (
          <div>
            <div>
              <ul>
                {this.props.items}
              </ul>
            </div>
          </div>
        )
      }
      render()
      {
        return(
        <div>
            {this.createPagination()}
        </div>
        )
      }
      
}