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
import axios from "axios";
import { ref } from "vue";
const service = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

service
  .request({
    method: "POST",
    url: `/_data/api/users`,
    data: { username: "chris", password: "123123" },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

const socket = new WebSocket("ws://localhost:8080/ws?id=123123123");

const registerMessage = () => {
  socket.onmessage = function (event) {
    var message = event.data;
    console.log("Received message:", message);
    displayMessage(JSON.parse(message).Content);
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

registerMessage();
</script>
