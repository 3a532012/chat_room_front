<template>
  <div>
    <h1>Chat Room</h1>
    <input
      v-model="inputValue"
      type="text"
      id="messageInput"
      placeholder="Enter message"
    />
    <button @click="sendMessage">Send</button>
    <div id="chatMessages"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const socket = new WebSocket("ws://localhost:8080/ws");

const registerMessage = () => {
  socket.onmessage = function (event) {
    var message = event.data;
    console.log("Received message:", message);
    displayMessage(message);
    // Add your logic to display the message in the chat interface
  };
};
const displayMessage = (message: string) => {
  var chatMessages = document.getElementById("chatMessages");
  var newMessage = document.createElement("p");
  newMessage.textContent = message;
  chatMessages!.appendChild(newMessage);
};
const inputValue = ref<string>("");
const sendMessage = () => {
  socket.send(inputValue.value);
  inputValue.value = "";
};

const initConnect = () => {
  socket.onopen = () => {
    // The WebSocket connection is open, you can send/receive messages here

    // Request the history from the server
    socket.send("get-history");
  };
};
registerMessage();
initConnect();
</script>
