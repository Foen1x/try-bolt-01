<template>
      <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit">Login</button>
        </form>
      </div>
    </template>

    <script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const username = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();

    const handleLogin = () => {
      if (username.value === 'admin' && password.value === 'admin') {
        // Simulate successful login
        localStorage.setItem('isAuthenticated', 'true');
        error.value = '';
        router.push({ name: 'Home' }); // Navigate to Home page
      } else {
        localStorage.removeItem('isAuthenticated');
        error.value = 'Invalid username or password';
      }
    };
    </script>

    <style scoped>
    .login-container {
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }
    h2 {
      margin-bottom: 20px;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
      width: 100%;
      max-width: 300px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
    }
    input[type="text"],
    input[type="password"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box; /* Include padding in width */
    }
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      width: 100%;
      max-width: 320px; /* Match input width */
      box-sizing: border-box;
    }
    button:hover {
      background-color: #0056b3;
    }
    .error-message {
      color: red;
      margin-top: -10px;
      margin-bottom: 15px;
      font-size: 0.9em;
    }
    </style>
