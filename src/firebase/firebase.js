import firebase from "firebase";

class Firebase {
  getOrders = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  getMenu = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/menuItems/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  addNewMenuItem = (newItem) => {
    return new Promise((resolve, reject) => {
      const itemsRef = firebase.database().ref('menuItems');
      if (newItem.menuItem !== '') {
        itemsRef.push(newItem)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error('MenuItem is empty'));
      }
    });
  };

  postChats = (sender, orderId, content) => {
    return new Promise(resolve => {
      const chatRef = firebase.database().ref(`/chats/${orderId}`);
      chatRef.once("value", snapshot => {
        if (!snapshot.exists()) {
          chatRef.set({});
        }
        chatRef.push({
          content: content,
          timestamp: Date.now(),
          sender: sender,
        }).then(() => {
          resolve(true)
        }).catch(error =>{
          console.log("error", error)
          resolve({})
        })
      });
    });
  };

  updateOrderDetails = (orderId, detailsToUpdate) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + orderId + '/')
      .update(
        {
          cart: detailsToUpdate.cart? detailsToUpdate.cart : {},
          dueDateSelected: detailsToUpdate.dueDateSelected? detailsToUpdate.dueDateSelected : '',
          emailAddress: detailsToUpdate.emailAddress? detailsToUpdate.emailAddress : '',
          firstName: detailsToUpdate.firstName? detailsToUpdate.firstName : '',
          id: detailsToUpdate.id? detailsToUpdate.id : '',
          igname: detailsToUpdate.igname? detailsToUpdate.igname : '',
          lastName: detailsToUpdate.lastName? detailsToUpdate.lastName : '',
          orderAudioURL: detailsToUpdate.orderAudioURL? detailsToUpdate.orderAudioURL : '',
          briefNote: detailsToUpdate.briefNote? detailsToUpdate.briefNote : '',
          snippetVideoURL: detailsToUpdate.snippetVideoURL? detailsToUpdate.snippetVideoURL : '',
          statusValue: detailsToUpdate.statusValue? detailsToUpdate.statusValue : '',
        },
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  
  storage = () => {
    return firebase.storage()
  }

  getRimiSenTitles = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/rimiLyrics/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  getReelOrderById = (id) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/'+id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  updateSenTitle = (update) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref(`/rimis/${update.id}/`)
      .update(
        {
          senTitle: update.newSenTitle,
        },
      )
      .then((response) => {
        return new Promise(resolve => {
          firebase.database()
          .ref(`/rimis/${update.id}/updates/${update.updateId}`)
          .remove()
          .then(() => {
            resolve(true)
          }).catch( (error) =>{
            console.log("error", error)
          })
        })
        .then((response) => {
          resolve(true)
        })
        .catch(error => {
          console.log("error", error)
        })
      })
      .catch(error => {
        console.log("error", error)
      })
    })

  }

  sendForApproval = (item) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/rimis/'+item.id+'/updates/' + item.updateId + '/')
      .set(item)
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateVideoSnippetURL = (orderId, snippetVideoURL) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + orderId + '/')
      .update({snippetVideoURL})
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateGridRows = (item, itemId) => {
    return new Promise(resolve => {
      firebase.database()
      .ref(`/menuItems/${itemId}`)
      .update(item)
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  createbhukyskitchenOrder = (reel) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + reel.id + '/')
      .set(
        {
          id: reel.id,
          emailAddress: reel.emailAddress,
          igname: reel.igname,
          firstName: reel.firstName,
          lastName: reel.lastName,
          briefNote: reel.briefNote,
          dueDateSelected: reel.dueDateSelected,
          orderAudioURL: reel.orderAudioURL,
          cart: JSON.stringify(reel.cart),
          statusValue: 0,
          snippetVideoURL: "",
        }
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  // send a new message
  sendMessage = (senderId, recipientId, message) => {
    return firebase
      .database()
      .ref("messages")
      .push({
        senderId: senderId,
        recipientId: recipientId,
        message: message,
        timestamp: Date.now(),
      })
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log("Error sending message: ", error);
        return false;
      });
  };

  // get all messages between two users
  getMessages = (user1, user2) => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref("messages")
        .orderByChild("timestamp")
        .on("value", (snapshot) => {
          let messages = [];
          snapshot.forEach((childSnapshot) => {
            let message = childSnapshot.val();
            if (
              (message.senderId === user1 && message.recipientId === user2) ||
              (message.senderId === user2 && message.recipientId === user1)
            ) {
              messages.push(message);
            }
          });
          resolve(messages);
        }, (error) => {
          console.log("Error getting messages: ", error);
          reject(error);
        });
    });
  };

  // get a user's list of conversations
  getConversations = (userId) => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref("messages")
        .on("value", (snapshot) => {
          let conversations = new Map();
          snapshot.forEach((childSnapshot) => {
            let message = childSnapshot.val();
            if (message.senderId === userId || message.recipientId === userId) {
              let otherUserId =
                message.senderId === userId
                  ? message.recipientId
                  : message.senderId;
              if (!conversations.has(otherUserId)) {
                conversations.set(otherUserId, {
                  userId: otherUserId,
                  messages: [],
                });
              }
              conversations.get(otherUserId).messages.push(message);
            }
          });
          resolve(Array.from(conversations.values()));
        }, (error) => {
          console.log("Error getting conversations: ", error);
          reject(error);
        });
    });
  };

  // get the current user's ID (assuming you're using Firebase auth)
  getCurrentUserId = () => {
    return firebase.auth().currentUser.uid;
  };
}

export default new Firebase();
