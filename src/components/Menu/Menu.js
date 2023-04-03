import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Firebase from "../../firebase/firebase.js";
import Cart from "../../components/Cart/Cart.js";
import MenuItem from "../../components/MenuItem/MenuItem.js";

import "./Menu.css";

class ConnectedMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuSectionName: "Our Selections",
      menuOptions: [],
      menuByCategory: {}, // initial menu by category
      filteredMenuOptions: [], // Filtered menu options based on search query
      searchQuery: '', // initial search query
      noResults: false, // initial no results state
      cart: {}
    };
  }

  videoEls = []

  componentDidMount() {
    this.videoEls.forEach((item) => {
      item &&
      item.play().catch(error => {
        console.error("Error attempting to play", error);
      });
    });
  
    Firebase.getMenu().then(val => {
      this.setState({ menuOptions: val });
      const menuByCategory = this.getMenuByCategory(val);
      this.setState({ menuByCategory: menuByCategory });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.cart !== prevState.cart) {
      this.props.returnCartElements(this.state.cart);
    }
  }
  
  updateCart = (action, menuItem, size) => {
    const { cart } = this.state;
  
    if (action === "add") {
      const updatedCart = {
        ...cart,
        [menuItem.menuItem + size]: (cart[menuItem.menuItem + size] || 0) + 1
      };
      this.setState({ cart: updatedCart });
    } else if (action === "remove" && cart[menuItem.menuItem + size] > 0) {
      const updatedCart = {
        ...cart,
        [menuItem.menuItem + size]: (cart[menuItem.menuItem + size] || 0) - 1
      };
      this.setState({ cart: updatedCart });
    }
  };  

  handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    
    // Filter menu options based on search query
    const filteredMenuOptions = this.state.menuOptions.filter(menu => {
      return menu.menuItem.toLowerCase().includes(searchQuery);
    });
  
    // Group filtered menu options by category
    const filteredMenuByCategory = filteredMenuOptions.reduce((acc, menu) => {
      if (!acc[menu.category]) {
        acc[menu.category] = [];
      }
      acc[menu.category].push(menu);
      return acc;
    }, {});
  
    this.setState({
      menuByCategory: filteredMenuByCategory,
      filteredMenuOptions: filteredMenuOptions,
      searchQuery: searchQuery,
      noResults: filteredMenuOptions.length === 0
    });
  }
  
  getMenuByCategory(menuOptions) {
    // Group menu options by category
    const menuByCategory = menuOptions.reduce((acc, menu) => {
      if (!acc[menu.category]) {
        acc[menu.category] = [];
      }
      acc[menu.category].push(menu);
      return acc;
    }, {});
  
    return menuByCategory;
  }

  removeFromCart = (itemToRemove) => {
    const itemName = itemToRemove.name;
    const itemPrice = itemToRemove.price;
    const itemKey = itemName + '$' + itemPrice;
  
    const cart = {...this.state.cart}; // make a copy of the cart object
  
    if (itemKey in cart) {
      if (cart[itemKey] === 1) {
        delete cart[itemKey];
      } else {
        cart[itemKey] -= 1;
      }
    }
  
    this.setState({ cart });
  }

  render() {
    let menuByCategory = this.state.menuByCategory;
    if (this.state.searchQuery) {
      menuByCategory = this.getMenuByCategory(this.state.filteredMenuOptions);
    }
  
    // Map over the menu by category and render each section
    return (
      <div className="Menu">
        <Cart cart={this.state.cart} removeFromCart={this.removeFromCart}/>
        <div className="Menu-searchBar">
          <input
            type="text"
            placeholder="Search for dishes..."
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />
        </div>
        {this.state.noResults ?
            <div className="Menu-noResults">
              Sorry, we no get!
            </div>
          :
            Object.entries(menuByCategory).map(([category, menuOptions]) => (
              <div className="Menu-levelOptions Menu-a" key={category}>
                <h3>{category}</h3>
                <div className="Menu-levelOptionsGallery">
                  {menuOptions.map((menu, index) => {
                    return menu.available && menu.available == "yes" && (
                      <div className="Menu-itemsClasses">
                        {menu.twoLbowl && 
                          <MenuItem
                            menu={menu}
                            cart={this.state.cart}
                            updateCart={this.updateCart}
                            size={menu.twoLbowl}
                            type="bowl"
                          />
                        }

                        {menu.halfTray && 
                          <MenuItem
                            menu={menu}
                            cart={this.state.cart}
                            updateCart={this.updateCart}
                            size={menu.halfTray}
                            type="half tray"
                          />
                        } 

                        {menu.fullTray && 
                          <MenuItem
                            menu={menu}
                            cart={this.state.cart}
                            updateCart={this.updateCart}
                            size={menu.fullTray}
                            type="full tray"
                          />
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default withRouter(Menu);
