import React from "react";
import style from "./Cell.module.scss"

export default class Cell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            order:1
        }
    }

    onClick = ()=>{
        this.setState({order:2})
    }

    changeSize = (up)=>{
        let cell = this.props.cell;
        if(up){
            cell.width*=2;
            cell.height*=2;
            cell.order-=1;
        }else{
            cell.width/=2;
            cell.height/=2;
            cell.order+=1;
        }
        this.props.changeCell(cell);
    }


    render() {
        let cell = this.props.cell;
        let styles={
            width:cell.width+"em",
            height:cell.height+"em",
            order:cell.order
        }
        return(
            <div onClick={()=>this.changeSize(true)} style={{...styles,backgroundColor:`#0${("0"+cell.id).slice(-2)}000`}} className={style.cell}>
                {this.props.cell.id}
            </div>
        )
    }
}