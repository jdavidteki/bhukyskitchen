import React, { Component } from "react";
import logo from '../../assets/logos/logo.png';

import { GetSvgIcon } from "../../Helpers/Helpers.js";

import "./Header.css";

class Header extends Component{
  constructor(props){
    super(props);

    this.state = {
      catSelected: "bhukyskitchen",
      findMeIconHover: "#f5ab3c",
    }
  }

  handleCategoryClick(catSelected){
    this.setState({
      findMeIconHover: "black",
      createIconHover: "black",
      meCardsIconHover: "black",
    })

    if(catSelected == "bhukyskitchen"){
      this.setState({ findMeIconHover: "#f5ab3c"})
    }else if(catSelected == "aboutme"){
      this.setState({ createIconHover: "#f5ab3c"})
    }else if(catSelected == "mecards"){
      this.setState({ meCardsIconHover: "#f5ab3c"})
    }

    this.props.changePage(catSelected)
  }

  componentDidMount(){
    let path = window.location.pathname;
    this.setState({
      findMeIconHover: path.includes("bhukyskitchen/") || path.includes("rimicard") ? "#f5ab3c" : 'black',
      createIconHover: path.includes("aboutme/") ? "#f5ab3c" : 'black',
      meCardsIconHover: path.includes("mecards/") ? "#f5ab3c" : 'black',
    })
  }

  render(){
    return (
      <div className="Header">
        <div className="Header-logoWrapper" onClick={() => this.handleCategoryClick("bhukyskitchen")}>
          <img className="Header-logo" src={logo} alt="bhukyskitchen.me.logo" />
        </div>
        <div className="Header-mainMenu">
          <div className="Header-mainMenu-item Header-icon" onClick={() => this.handleCategoryClick("bhukyskitchen")}>
            {GetSvgIcon("findMeIcon", this.state.findMeIconHover)}
            <span className="Header-img-title">bhukyskitchen!</span>
          </div>
          <div className="Header-mainMenu-item Header-icon" onClick={() => this.handleCategoryClick("aboutme")}>
            {GetSvgIcon("createIcon", this.state.createIconHover)}
            <span className="Header-img-title">about.me</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
