<template>
      <div id="main-container">
        <router-view></router-view>
      </div>
    </template>

    <script setup lang="ts">
    // No script needed for basic layout
    </script>

    <style>
    /* Add some basic styles if needed, or rely on style.css */
    #main-container {
      max-width: 480px; /* Simulate mobile width */
      margin: 0 auto;
      background-color: #f4f6f8; /* Light background */
      min-height: 100vh;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    </style>
