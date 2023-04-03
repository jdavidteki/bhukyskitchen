import React from 'react';

import './MenuItem.css';

function MenuItem({ menu, cart, updateCart, size, type }) {
  return (
    <div className="MenuItem-galleryEntry">
      <video
        className="MenuItem-video"
        playsInline
        loop
        muted
        controls
        alt="All the devices"
        src={menu.video ? menu.video : "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuVideos%2F278394309_2686492134829997_8358157508114295731_n.mp4?alt=media&token=68b96784-4d34-4de5-ad26-374e149a0a60"}
        poster={menu.poster ? menu.poster : "https://firebasestorage.googleapis.com/v0/b/bhukyskitchen-2a524.appspot.com/o/menuImages%2Ffriedrice.png?alt=media&token=c4ae131b-aed9-41e5-834b-083348e9e4f1"}
      />

      <div className="MenuItem-videoDescription">
        <h3>{menu.menuItem}</h3>
        <p>{menu.addInfo}</p>
        <p>{type}</p>
        <p>{size}</p>
      </div>

      <div className="MenuItem-selectItem">
        <div className="MenuItem-selectItem--addToCart MenuItem-selectItem--updateCart" onClick={() => updateCart("add", menu, size)}>+</div>
        {cart[menu.menuItem+size] > 0 &&
          <div className="MenuItem-selectItem--itemCount">{cart[menu.menuItem+size]}</div>
        }
        <div className="MenuItem-selectItem--removeFromCart MenuItem-selectItem--updateCart" onClick={() => updateCart("remove", menu, size)}>-</div>
      </div>
    </div>
  );
}

export default MenuItem;
