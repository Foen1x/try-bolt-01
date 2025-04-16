<template>
      <div class="home-container">
        <header class="home-header">
          <span class="icon">☁️</span> <!-- Placeholder icon -->
          <h1>首页</h1>
        </header>

        <section class="section">
          <h2 class="section-title">概览</h2>
          <div class="grid">
            <div v-for="item in overviewItems" :key="item.name" class="grid-item" @click="navigateTo(item.name)">
              <div class="item-icon">📖</div> <!-- Placeholder icon -->
              <div class="item-name">{{ item.name }}</div>
              <div class="item-value">{{ item.value }}</div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">应用</h2>
          <div class="grid">
            <div v-for="item in applicationItems" :key="item.name" class="grid-item" @click="navigateTo(item.name)">
              <div class="item-icon">📖</div> <!-- Placeholder icon -->
              <div class="item-name">{{ item.name }}</div>
            </div>
          </div>
        </section>

        <!-- Updated bottom navigation -->
        <footer class="bottom-nav">
          <div @click="navigateTo('/')" :class="{ active: $route.name === 'Home' }">🏠<br>首页</div>
          <div @click="navigateTo('/subpage/发现')" :class="{ active: $route.params.name === '发现' }">⚡<br>发现</div>
           <div @click="navigateTo('/subpage/学习')" :class="{ active: $route.params.name === '学习' }">🎓<br>学习</div>
          <div @click="navigateTo('/forum')" :class="{ active: $route.name === 'ForumList' || $route.name === 'TopicDetail' }">👥<br>社区</div>
          <div @click="navigateTo('/subpage/我的')" :class="{ active: $route.params.name === '我的' }">👤<br>我的</div>
        </footer>
         <!-- Logout button removed -->
      </div>
    </template>

    <script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const overviewItems = ref([
      { name: '文档数量', value: 999 },
      { name: '下载次数', value: 1999 },
      { name: '用户数量', value: 999 },
      { name: '分类数', value: 999 },
      { name: '点赞次数', value: 1999 },
      { name: '欠缺知识', value: 999 },
    ]);

    const applicationItems = ref([
      { name: '方案助手' },
      { name: '标书助手' },
      { name: '人才库' },
      { name: '合同助手' },
      { name: '合规助手' },
      { name: '临时工作组' },
    ]);

    // Updated navigation logic to handle different types of destinations
    const navigateTo = (destination: string | { name: string; params?: Record<string, string> }) => {
       if (typeof destination === 'string') {
            if (destination === '/') {
                 router.push({ name: 'Home' });
            } else if (destination === '/forum') {
                 router.push({ name: 'ForumList' });
            } else if (destination.startsWith('/subpage/')) {
                 const name = destination.split('/').pop() || 'Unknown';
                 router.push({ name: 'SubPage', params: { name: encodeURIComponent(name) } });
            } else if (destination === '文档数量') {
                 router.push({ name: 'DocumentTable' });
            } else {
                 // Default to generic subpage for other string names from grid items
                 router.push({ name: 'SubPage', params: { name: encodeURIComponent(destination) } });
            }
       } else {
            // Handle object-based navigation if needed in the future
            router.push(destination);
       }
    };

    // Logout function removed
    // const logout = () => {
    //   localStorage.removeItem('isAuthenticated');
    //   router.push({ name: 'Login' });
    // };
    </script>

    <style scoped>
    .home-container {
      background-color: #f4f6f8;
      padding-bottom: 70px; /* Space for bottom nav */
      color: #333;
    }

    .home-header {
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
    }

    .home-header .icon {
      font-size: 1.5em;
      margin-right: 10px;
      color: #888;
    }

    .home-header h1 {
      font-size: 1.2em;
      font-weight: 500;
      margin: 0;
      flex-grow: 1;
      text-align: center;
      color: #333;
    }

    .section {
      margin: 15px;
    }

    .section-title {
      text-align: center;
      font-size: 0.9em;
      color: #888;
      margin-bottom: 15px;
      padding: 5px 15px;
      background-color: #fff;
      border-radius: 15px;
      display: inline-block; /* Center alignment trick */
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .grid-item {
      background-color: #fff;
      border-radius: 8px;
      padding: 15px 10px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .grid-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .item-icon {
      font-size: 1.8em;
      color: #4dabf7; /* Light blue icon color */
      margin-bottom: 8px;
    }

    .item-name {
      font-size: 0.9em;
      color: #333;
      margin-bottom: 4px;
    }

    .item-value {
      font-size: 0.8em;
      color: #666;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-width: 480px; /* Match container width */
      margin: 0 auto; /* Center the nav */
      display: flex;
      justify-content: space-around;
      background-color: #fff;
      border-top: 1px solid #eee;
      padding: 10px 0;
      font-size: 0.7em;
      text-align: center;
      color: #666;
      box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
    }
    .bottom-nav > div {
       cursor: pointer;
       flex: 1; /* Ensure items take equal space */
    }
     .bottom-nav > div.active { /* Highlight active tab */
        color: #007bff;
     }

    /* Logout button style removed */
    </style>
