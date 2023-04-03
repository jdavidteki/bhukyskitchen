import React, { Component } from "react";

import "./AboutMe.css";

class AboutMe extends Component{
  constructor(props){
    super(props);

    this.state = {
        pageName: this.props.pageName
    }
  }

  componentDidMount(){
    //
  }

  render(){
    return (
        <div className="AboutMe l-container">
            <div className="AboutMe-left"></div>
            <div className="AboutMe-right">
                <h1 className="AboutMe-title">
                    About Me
                </h1>
                <div className="AboutMe-desc">
                    My name is Bhuky! Nice to meet you. Cooking is my passion and I love to share my recipes with the world. I am a self-taught cook and I have been cooking for over 20 years.
                    I have been cooking for my family and friends for years and I have always been asked to share my recipes. I have decided to share my recipes with the world and I hope you enjoy them as much as I do.
                    Here you will find a variety of recipes from my family and friends. I hope you enjoy them as much as I do.
                </div>
            </div>
        </div>
    )}
}

export default AboutMe;
