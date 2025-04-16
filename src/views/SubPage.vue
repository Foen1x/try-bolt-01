<template>
      <div class="subpage-container">
        <header class="subpage-header">
          <button @click="goBack" class="back-button"><</button>
          <h1>{{ decodedName }}</h1>
        </header>
        <div class="content">
          <p>This is the sub-page for: <strong>{{ decodedName }}</strong></p>
          <p>Content for this page goes here.</p>
           <button @click="goBack">Back to Home</button>
        </div>
      </div>
    </template>

    <script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';

    // Define props using defineProps
    const props = defineProps<{
      name: string // Route param passed as prop
    }>();

    const router = useRouter();

    // Decode the name from the URL param
    const decodedName = computed(() => decodeURIComponent(props.name));

    const goBack = () => {
      router.push({ name: 'Home' }); // Navigate back to Home
    };
    </script>

    <style scoped>
     .subpage-container {
      padding: 20px;
      color: #333;
    }
     .subpage-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .back-button {
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
      margin-right: 15px;
      padding: 0 10px;
      color: #007bff;
    }
    h1 {
      font-size: 1.2em;
      margin: 0;
      flex-grow: 1;
      text-align: center; /* Center title */
       padding-right: 40px; /* Adjust to balance back button */
    }
    .content {
      text-align: center;
    }
     .content button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
     .content button:hover {
      background-color: #0056b3;
    }
    </style>
