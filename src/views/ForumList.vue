<template>
      <div class="forum-list-container">
        <header class="subpage-header">
          <button @click="goBackHome" class="back-button"><</button>
          <h1>社区论坛</h1>
          <!-- Optional: Add New Post Button -->
          <!-- <button class="new-post-button">+</button> -->
        </header>

        <!-- New List-based Layout -->
        <div class="topic-list">
          <div v-if="paginatedTopics.length === 0" class="no-data">
            暂无主题
          </div>
          <div v-for="topic in paginatedTopics" :key="topic.id" class="topic-item" @click="goToTopic(topic.id)">
            <div class="topic-main">
              <span class="topic-category">[{{ topic.category }}]</span>
              <span class="topic-title">{{ topic.title }}</span>
            </div>
            <div class="topic-meta">
              <span class="meta-item">序号: {{ topic.index }}</span>
              <span class="meta-item">发表: {{ topic.postDate }}</span>
              <span class="meta-item">回复: {{ topic.replyCount }}</span>
              <span class="meta-item latest-reply">最新: {{ topic.lastReplyDate }}</span>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        </div>

        <!-- Bottom Navigation -->
        <footer class="bottom-nav">
           <div @click="goBackHome" :class="{ active: $route.name === 'Home' }">🏠<br>首页</div>
           <div @click="navigateTo('/subpage/发现')" :class="{ active: $route.params.name === '发现' }">⚡<br>发现</div>
           <div @click="navigateTo('/subpage/学习')" :class="{ active: $route.params.name === '学习' }">🎓<br>学习</div>
           <div @click="navigateTo('/forum')" :class="{ active: $route.name === 'ForumList' || $route.name === 'TopicDetail' }">👥<br>社区</div>
           <div @click="navigateTo('/subpage/我的')" :class="{ active: $route.params.name === '我的' }">👤<br>我的</div>
        </footer>
      </div>
    </template>

    <script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    interface Topic {
      id: number;
      index: number;
      category: string;
      title: string;
      postDate: string; // YYYY-MM-DD
      lastReplyDate: string; // YYYY-MM-DD HH:MM
      replyCount: number;
      author: string;
      content: string;
    }

    // --- Mock Data (remains the same) ---
    const mockTopics = ref<Topic[]>([]);
    const categories = ['技术交流', '产品建议', '日常闲聊', '官方公告'];

    for (let i = 1; i <= 25; i++) {
      const postDate = new Date(2024, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1);
      const lastReplyMinutes = Math.floor(Math.random() * 60 * 24 * 5); // Within last 5 days
      const lastReplyDate = new Date(Date.now() - lastReplyMinutes * 60 * 1000);

      mockTopics.value.push({
        id: i,
        index: i,
        category: categories[Math.floor(Math.random() * categories.length)],
        title: `关于 ${categories[Math.floor(Math.random() * categories.length)]} 的讨论话题 #${i} - 这是一个可能有点长的标题，需要换行显示`,
        postDate: postDate.toISOString().split('T')[0],
        lastReplyDate: `${lastReplyDate.toISOString().split('T')[0]} ${lastReplyDate.toTimeString().substring(0, 5)}`,
        replyCount: Math.floor(Math.random() * 100),
        author: `用户${String.fromCharCode(65 + Math.floor(Math.random() * 15))}`,
        content: `这是话题 #${i} 的主要内容。\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
      });
    }
     mockTopics.value.sort((a, b) => new Date(b.lastReplyDate).getTime() - new Date(a.lastReplyDate).getTime());
     mockTopics.value.forEach((topic, index) => topic.index = index + 1);


    // --- Pagination (remains the same) ---
    const currentPage = ref(1);
    const itemsPerPage = 10;

    const totalPages = computed(() => {
      return Math.ceil(mockTopics.value.length / itemsPerPage);
    });

    const paginatedTopics = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return mockTopics.value.slice(start, end);
    });

    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // --- Navigation (remains the same, plus added generic navigateTo for bottom nav) ---
    const goToTopic = (id: number) => {
      router.push({ name: 'TopicDetail', params: { id: id.toString() } });
    };

    const goBackHome = () => {
      router.push({ name: 'Home' });
    };

    // Generic navigation for bottom bar items
    const navigateTo = (destination: string | { name: string; params?: Record<string, string> }) => {
       if (typeof destination === 'string') {
            if (destination === '/') {
                 router.push({ name: 'Home' });
            } else if (destination === '/forum') {
                 // Already here, do nothing or refresh? For now, do nothing.
                 // router.push({ name: 'ForumList' });
            } else if (destination.startsWith('/subpage/')) {
                 const name = destination.split('/').pop() || 'Unknown';
                 router.push({ name: 'SubPage', params: { name: encodeURIComponent(name) } });
            } else if (destination === '文档数量') { // Keep this case if needed elsewhere
                 router.push({ name: 'DocumentTable' });
            } else {
                 router.push({ name: 'SubPage', params: { name: encodeURIComponent(destination) } });
            }
       } else {
            router.push(destination);
       }
    };

    </script>

    <style scoped>
    .forum-list-container {
      padding: 15px;
      padding-bottom: 80px; /* Increased space for bottom nav */
      color: #333;
      background-color: #f4f6f8; /* Match home background */
      min-height: 100vh;
    }

    .subpage-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px; /* Reduced margin */
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      background-color: #fff; /* White header */
      margin: -15px -15px 15px -15px; /* Extend header */
      padding: 10px 15px;
    }
    .back-button {
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
      margin-right: 10px; /* Reduced margin */
      padding: 0 5px;
      color: #007bff;
    }
    h1 {
      font-size: 1.2em;
      margin: 0;
      flex-grow: 1;
      text-align: center;
      padding-right: 35px; /* Adjusted balance */
    }

    /* New Topic List Styles */
    .topic-list {
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }

    .topic-item {
      padding: 12px 15px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .topic-item:last-child {
      border-bottom: none;
    }
    .topic-item:hover {
      background-color: #f9f9f9;
    }

    .topic-main {
      display: flex;
      align-items: flex-start; /* Align items to the top */
      margin-bottom: 8px;
    }

    .topic-category {
      font-size: 0.9em;
      color: #007bff;
      margin-right: 8px;
      white-space: nowrap; /* Keep category on one line */
      font-weight: 500;
    }

    .topic-title {
      font-size: 1em;
      color: #333;
      line-height: 1.4;
      font-weight: 500;
      /* Allow wrapping */
      white-space: normal;
      word-break: break-word;
    }

    .topic-meta {
      display: flex;
      flex-wrap: wrap; /* Allow meta items to wrap */
      gap: 4px 12px; /* Row and column gap */
      font-size: 0.8em;
      color: #666;
    }

    .meta-item {
      white-space: nowrap; /* Keep individual meta items on one line */
    }
    .latest-reply {
       /* Optionally push to the right if space allows, but wrap is priority */
       /* margin-left: auto; */
    }

    .no-data {
      text-align: center;
      color: #888;
      padding: 30px 15px;
      font-size: 0.9em;
    }

    /* Pagination Styles (remain similar) */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-top: 10px; /* Add some space above pagination */
    }
    .pagination button {
      padding: 6px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
    }
    .pagination button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .pagination span {
      font-size: 0.9em;
      color: #555;
    }

    /* Bottom Nav Styles (remain similar) */
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
      z-index: 10; /* Ensure it's above content */
    }
    .bottom-nav > div {
       cursor: pointer;
       flex: 1; /* Ensure items take equal space */
    }
    .bottom-nav > div.active {
       color: #007bff; /* Highlight active tab */
    }
    </style>
