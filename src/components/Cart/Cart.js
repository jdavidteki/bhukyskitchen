import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./Cart.css";

class ConnectedCart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            total: 0,
        };
    }

    componentDidMount() {
        this.updateCart(this.props.cart);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.cart !== this.props.cart) {
            this.updateCart(this.props.cart);
        }
    }

    updateCart = (cart) => {
        const items = Object.keys(cart).map((key) => {
            const [name, price] = key.split("$");
            return {
                name: name,
                price: parseInt(price),
                quantity: cart[key],
            };
        });

        const total = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        this.setState({
            items: items,
            total: total,
        });
    };

    addItem = (item) => {
        const { items, total } = this.state;

        const index = items.findIndex(
            (i) => i.name === item.name && i.price === item.price
        );

        if (index !== -1) {
            const newItems = [...items];
            newItems[index].quantity += item.quantity;
            this.setState({
                items: newItems,
                total: total + item.price * item.quantity,
            });
        } else {
            this.setState({
                items: [...items, item],
                total: total + item.price * item.quantity,
            });
        }
    };

    removeItem = (item) => {
        const { items, total } = this.state;

        const index = items.findIndex(
            (i) => i.name === item.name && i.price === item.price
        );

        if (index !== -1) {
            const itemToRemove = items[index];
            const newItems = [...items];
            newItems.splice(index, 1);
            this.setState({
                items: newItems,
                total: total - itemToRemove.price * itemToRemove.quantity,
            });
        }

        this.props.removeFromCart(item);
    };

    toggleVisibility = () => {
        // Toggle the cart visibility
        const cart = document.querySelector(".cart__items");
        cart.classList.toggle("cart__items--visible");
    };

    render() {
        const { items, total } = this.state;

        return (
            <div className="cart">
                <div className="cart__header">
                    <span>Cart</span>
                    <span>${total.toFixed(2)}</span>
                    <button className="cart__close" onClick={this.toggleVisibility}>
                        o:
                    </button>
                </div>
                <ul className="cart__items">
                    {items.map((item) => (
                        <li key={`${item.name}${item.price}`} className="cart__item">
                            <span>
                                {item.name} - ${item.price} x {item.quantity}
                            </span>
                            {!this.props.fromOrderComponent &&
                                <button onClick={() => this.removeItem(item)}>Remove</button>
                            }
                        </li>
                    ))}

                    <div className="cart__total">
                        <p>Total:</p>
                        <p className="cart__total__cost">${total.toFixed(2)}</p>
                    </div>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
  };
  
  let Cart = withRouter(connect(mapStateToProps)(ConnectedCart));
  export default withRouter(Cart);
  