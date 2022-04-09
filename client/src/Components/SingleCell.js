import { Component } from "react";
import "./SingleCell.css"

class Cell extends Component{
    constructor(props){
        super(props);
        this.state={
        activity: false
        }

    }


handleOnClick=()=>{
    this.setState({activity: !this.state.activity}, ()=>this.render);
}


render(){


    return(
        <>
        
        <button className={this.state.activity ? 'active':'not-active'} onClick={this.handleOnClick}></button>
        
        
        </>

    );
}

}

export default Cell