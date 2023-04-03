import React, { Component } from "react";
import Firebase from "../../firebase/firebase.js";
import ProgressBar from "@ramonak/react-progress-bar";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AudioPlayer from 'react-h5-audio-player';
import cashappLogo from '../../assets/icons/cashappIcon.png';
import FancyVideo from "react-videojs-fancybox";
import {GetSelectedStatusLevelLabel} from '../../Helpers/Helpers.js'
import Cart from '../../components/Cart/Cart.js'
import Messages from '../../components/Messages/Messages.js'

import 'react-h5-audio-player/lib/styles.css';
import "./Orders.css";

class ConnectedOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: "",
      firstName: "",
      id: "",
      igname: "",
      lastName: "",
      briefNote: "",
    };
  }

  updateOrdersTotal() {
    // Find the cart items' total value
    const cartItemTotal = document.querySelector('.cart__total__cost').innerText;
    
    // Fill the Orders-total div with the cart items' total value
    const ordersTotalDiv = document.querySelector('#Orders-total');
    ordersTotalDiv.innerText = cartItemTotal;
  }

  componentDidMount() {
    if (this.props != undefined) {
      if (this.props?.match?.params?.id != undefined) {
        Firebase.getReelOrderById(this.props.match.params.id).then((val) => {
          this.setState({
            id: val.id,
            emailAddress: val.emailAddress,
            firstName: val.firstName,
            igname: val.igname,
            lastName: val.lastName,
            briefNote: val.briefNote,
            statusValue: val.statusValue,
            statusLabel: GetSelectedStatusLevelLabel(val.statusValue),
            dueDateSelected: val.dueDateSelected,
            orderAudioURL: val.orderAudioURL,
            snippetVideoURL: val.snippetVideoURL,
            cart: val.cart
          });
        }).then(() => {
          this.updateOrdersTotal();
        });
      }
    }
  }

  render() {
    if (this.state.id) {
      return (
        <div className="Orders l-container">
          <h1 className="Orders-header">Order Details</h1>
          <ProgressBar
            completed={this.state.statusValue ? this.state.statusValue : '20'}
            customLabel={this.state.statusLabel ? this.state.statusLabel : 'idea generation'}
            className="Orders-progressBar"
            bgColor="#f5ab3c"
            animateOnRender
            baseBgColor="#f7de8b"
            height="20px"
            labelSize="9px"
          />
          <div className="Orders-details">
            <div className="Orders-details-level">
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Order Reference</div>
                <div className="Orders-orderThings-mid">{this.state.id}</div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Owner</div>
                <div className="Orders-orderThings-mid">
                  {this.state.lastName}, {this.state.firstName}
                </div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
            </div>
            <div className="Orders-details-level">
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Date Due</div>
                <div className="Orders-orderThings-mid">
                  {this.state.dueDateSelected}
                </div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Total: </div>
                <div id="Orders-total" className="Orders-orderThings-bottom">
                  {/* //js will fill this in */}
                </div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
            </div>
          </div>

          <div className="Orders-moreDetails">
            {this.state.snippetVideoURL && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Video Snippet</div>
                <div className="Orders-infoCard-infoDetails">
                  <FancyVideo
                    source={this.state.snippetVideoURL}
                    poster="https://firebasestorage.googleapis.com/v0/b/bhukyskitchen-d7606.appspot.com/o/images%2FScreen%20Shot%202022-10-18%20at%202.38.47%20PM.png?alt=media&token=1f64edde-6b4a-499e-8e93-83edb5d5f67b"
                    id={"sintel3"}
                    fitToView={true}
                  />
                </div>
              </div>
            )}
            {this.state.igname && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">IG Name</div>
                <div className="Orders-infoCard-infoDetails">{this.state.igname}</div>
              </div>
            )}
            <div className="Orders-infoCard">
              <div className="Orders-infoCard-title">Order</div>
              <Cart fromOrderComponent={true} cart={this.state.cart ? JSON.parse(this.state.cart) : {}} /> 
            </div>
            <div className="Orders-infoCard Orders-statusValue" onClick={() => location.href = this.state.briefNote}>
              <div className="Orders-infoCard-title">Note</div>
              <div className="Orders-infoCard-infoDetails">
                {this.state.briefNote}
              </div>
              </div>
            {this.state.orderAudioURL && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Voice Note</div>
                <div className="Orders-infoDetails">
                  <AudioPlayer
                    className={"Orders-audio"}
                    controlsList="nodownload"
                    src={this.state.orderAudioURL}
                  />
                </div>
              </div>
            )}
            <div className="Orders-infoCard Orders-cashApp" onClick={() => location.href = `https://cash.app/$bhukyskitchen/`}>
              <div className="Orders-infoCard-title">Make Payment</div>
              <div className="Orders-infoDetails">
                <img className="Orders-cashApp-Logo" src={cashappLogo} alt="cashapp.logo"/>
              </div>
            </div>
            <div className="Orders-infoCard">
              <Messages orderId={this.state.id} fromCustomer={true} />
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="l-container">bhukyskitchening...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {};
};

let Orders = withRouter(connect(mapStateToProps)(ConnectedOrders));
export default withRouter(Orders);
