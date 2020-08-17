import React from "react";
import style from "./Screen.module.scss"
import Cell from "../Cell/Cell";
import Masonry from "react-masonry-css"

export default class Screen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            cells:[],
            breakpointColumnsObj : {
                default: 4,
                1100: 3,
                700: 2,
                500: 1
            }
        }
    }
    componentDidMount() {
        let cells = this.state.cells;
        {Array.from(new Array(10).keys()).map(item=>{
            cells.push({id:item,width:20,height:10,order:4})
        })}
        this.setState({cells:cells})
    }

    changeCell = (cell)=>{
        let cells = this.state.cells;
        let newCell = {...cell}
        cells.splice(cells.indexOf(cells.find(i=>i.id===cell.id)),1,newCell);
        cells.sort((a,b)=>{
            if(a.order>b.order) return 1;
            if(a.order<b.order) return -1;
            if(a.order===b.order) return 0;
        })
        this.setState({cells:cells})
    }

    render() {
        return(
            <div className={style.screen}>
                {this.state.cells.map((item,i)=>{
                    return <Cell cell={item} changeCell={this.changeCell} key={i} color={i}/>
                })}
            </div>
        )
    }
}