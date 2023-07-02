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
import { inject,ref } from "vue";
import { roomSocketKey } from "@/utils/provide"

const roomSocket = inject(roomSocketKey)

const registerMessage = () => {
  roomSocket!.value!.onmessage = function (event) {
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
  roomSocket!.value!.send(inputValue.value);
  inputValue.value = "";
};

const init = () => {
  registerMessage();
};

init();
</script>
