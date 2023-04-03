import React, { Component } from "react";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import { Recorder } from "react-voice-recorder";
import validator from 'validator'
import emailjs from '@emailjs/browser'
import Menu from "../../components/Menu/Menu.js"

import "./PurchaseReel.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-voice-recorder/dist/index.css";

class ConnectedPurchaseReel extends Component {
  constructor(props) {
    super(props);

    this.state = {
			errorMsg: "",
			briefNote: "",
			igname: "",
			emailAddress: "",
			firstName: "",
			lastName: "",
			downloadURL: "",
      dueDateSelected: new Date(),

      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: null,
          m: null,
          s: null,
        },
      },
    };
  }

  componentDidMount() {
		//
  }


  handleAudioStop(data) {
    this.setState({ audioDetails: data });
  }

  handleAudioUpload(orderID){
		if (this.state.audioDetails.chunks != null){
			let audioBlob = new Blob(this.state.audioDetails.chunks, {type: 'audio/mpeg'});

			Firebase.storage()
			.ref("audioFolder/")
			.child(orderID + ".mp3")
			.put(audioBlob)
			.then((url) => {
				this.setState({avatarOnFile: true });
			})
			.catch((error) => {
				this.setState({errorMsg: error.message})
			})
		}
  }

  handleRest() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    };
    this.setState({ audioDetails: reset });
  }

  handleGetCart = (cart) => {
    this.setState({cart: cart});
  }

	placeOrder(){

		let errors = ""
		let audioRecorded = false

    if(this.state.cart == null){
      errors += " You did not add any items to your cart \n"
    }

		if(this.state.firstName == ""){
			errors += " First name is empty \n"
		}

		if(this.state.lastName == ""){
			errors += " Last name is empty \n"
		}

		if(!validator.isEmail(this.state.emailAddress)){
			errors += " Email Address is invalid \n"
		}

		let orderId = (this.state.emailAddress + Date.now()).replace(/[^a-z0-9]/gi, '');
		if (this.state.audioDetails.chunks != null){
			audioRecorded = true
		}

		this.setState({errorMsg: errors})

		if (errors == "" ){

			let reel = {
				id: orderId,
				emailAddress: this.state.emailAddress,
				igname: this.state.igname,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				briefNote: this.state.briefNote,
        dueDateSelected: this.state.dueDateSelected.toString().substring(0, 16),
        orderAudioURL: "",
        cart: this.state.cart,
			}

      if(audioRecorded){
        let audioURL = `https://firebasestorage.googleapis.com/v0/b/bhukyskitchen-2a524.appspot.com/o/audioFolder%2F${orderId}.mp3?alt=media&token=22ca9d49-2743-42cf-9ebd-738e307ba023`
        reel.orderAudioURL = audioURL
				this.handleAudioUpload(orderId)
			}

			Firebase.createbhukyskitchenOrder(reel)
			.then(() =>{
        this.sendEmail(orderId) //unconmment to send email

        setTimeout(() => {
          location.href = "orders/" + orderId
          // this.props.changePage("orders/" + orderId)
        }, 1000)
			})
		}

	}

  sendEmail(orderId){
    let message =  `
      We have received your order (${orderId}) and it is in the works

      In the meantime, relax, listen to some Burna Boy, and your food will be ready as soon as possible.

      You can follow the progress of your order and message Lola here: https://www.bhukyskitchen.com/orders/${orderId}
    `

    var templateParams = {
      to_name: this.state.firstName,
      from_name: 'bhukyskitchen',
      message: message,
      recipient_email: this.state.emailAddress,
      sender_email: "jesuyedd@gmail.com",
      order_id: orderId
    };

    emailjs.send('service_yn2l3x8', 'template_nnb32k5', templateParams, 'VSKnf4Vspvt3LgOiz')
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
        this.setState({errorMsg: error.message})
    });
  }

  render() {
    return (
      <div className="PurchaseReel l-container">
        <Menu returnCartElements={this.handleGetCart} />

        <div className="PurchaseReel-name PurchaseReel-eachSection">
          <h3>* What's your name?</h3>
          <TextField
            value={this.state.firstName}
            placeholder="First Name **"
            onChange={(e) => {
              this.setState({ firstName: e.target.value });
            }}
          />
					<TextField
            value={this.state.lastName}
            placeholder="Last Name **"
            onChange={(e) => {
              this.setState({ lastName: e.target.value });
            }}
          />
					<TextField
            value={this.state.emailAddress}
            placeholder="Email Address **"
            onChange={(e) => {
              this.setState({ emailAddress: e.target.value });
            }}
          />
					<TextField
            value={this.state.igname}
            placeholder="Instagram Username **"
            onChange={(e) => {
              this.setState({ igname: e.target.value });
            }}
          />
        </div>

        <div className="PurchaseReel-voiceNote PurchaseReel-eachSection">
          <h3>
            Leave us a voicenote with all the answers from the questions below
            so you don't have to answer the questions. Then hit pay and the
            bottom of this page
          </h3>

          <Recorder
            record={true}
            audioURL={this.state.audioDetails.url}
            showUIAudio
            handleAudioStop={(data) => this.handleAudioStop(data)}
            handleOnChange={(value) => this.handleOnChange(value, "firstname")}
            handleRest={() => this.handleRest()}
          />
        </div>

        <div className="PurchaseReel-dueDateSelection PurchaseReel-eachSection">
          <h3>* Select due date</h3>
          <DatePicker
            selected={this.state.dueDateSelected}
            onSelect={(e) => this.setState({dueDateSelected: e})} //when day is clicked
            onChange={(e) => this.setState({dueDateSelected: e})} //only when value has changed
            minDate={new Date()}
          />
        </div>

        <div className="PurchaseReel-sampleVideo PurchaseReel-eachSection">
          <h3>* Is there something else you need that we haven't covered?</h3>
          <TextField
            value={this.state.briefNote}
            placeholder="enter brief note here"
            onChange={(e) => {
              this.setState({ briefNote: e.target.value });
            }}
          />
        </div>

				<div className="PurchaseReel-placeOrder PurchaseReel-eachSection">
					{this.state.errorMsg &&
						<pre>Error(s): <br></br>{this.state.errorMsg}</pre>
					}

					<Button
						variant="contained"
						style={{backgroundColor: '#f5ab3c', color: 'white', marginTop: 32, marginBottom: 16}}
						onClick={() => this.placeOrder()}
					>
						Place Order
					</Button>
				</div>

				{/* <div className="PurchaseReel-stripePayment PurchaseReel-eachSection">
					<CardForm/>
				</div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let PurchaseReel = withRouter(connect(mapStateToProps)(ConnectedPurchaseReel));
export default withRouter(PurchaseReel);
