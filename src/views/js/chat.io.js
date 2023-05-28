let socket;
let user = "";
const chatBox = document.getElementById("chatBox");
const divChat = document.getElementById("messagesLog");
const username = document.getElementById("username");

Swal.fire({
  title: " Chat Authentication ",
  input: "text",
  text: "Enter your email for this chat",
  inputValidator: (value) => !value.trim() && "Please write your email",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  console.log("user: " + user);
  // document.getElementById('username').innerHTML = user + ': '
  username.innerHTML = user + ": ";
  socket = io();

  chatBox.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      if (chatBox.value.trim().length > 0) {
        socket.emit("message", {
          user,
          message: chatBox.value,
        });
        chatBox.value = "";
      }
    }
  });
  
  socket.on("conversations", (messages) => {
    let messagesReceived = "";
    console.log(messages);
    console.log(messages.user);
    const messagesLog = document.getElementById("messagesLog");

    let userMessage = document.createElement("i");
    let userMessageText = document.createTextNode("[" + messages.user + "]: ");
    userMessage.appendChild(userMessageText);

    let messageContent = document.createElement("p");
    let messageContentText = document.createTextNode(messages.message);
    messageContent.appendChild(userMessage);
    messageContent.appendChild(messageContentText);

    messagesLog.appendChild(messageContent);

    console.log(messagesReceived);
  });
});
