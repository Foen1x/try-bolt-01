<template>
      <div class="topic-detail-container">
        <header class="subpage-header">
          <button @click="goBackToList" class="back-button"><</button>
          <h1>{{ topic?.title || '加载中...' }}</h1>
        </header>

        <div v-if="topic" class="topic-content">
          <div class="post main-post">
            <div class="post-header">
              <span class="author">{{ topic.author }}</span>
              <span class="post-date">发表于: {{ topic.postDate }}</span>
            </div>
            <div class="post-body" v-html="formattedContent(topic.content)"></div>
          </div>

          <h2 class="replies-title">回复 ({{ replies.length }})</h2>

          <div v-if="replies.length > 0" class="replies-list">
            <div v-for="(reply, index) in replies" :key="reply.id" class="post reply-post">
              <div class="post-header">
                <span class="author">{{ reply.author }}</span>
                <span class="post-date">回复于: {{ reply.replyDate }}</span>
                 <span class="floor">#{{ index + 1 }}</span>
              </div>
              <div class="post-body" v-html="formattedContent(reply.content)"></div>
            </div>
          </div>
          <div v-else class="no-replies">
            暂无回复，快来抢沙发！
          </div>

           <!-- Simple Reply Box (Optional) -->
           <div class="reply-box">
             <textarea placeholder="输入你的回复..."></textarea>
             <button>发表回复</button>
           </div>

        </div>
        <div v-else class="loading">
          正在加载主题...
        </div>

         <button @click="goBackToList" class="back-button-bottom">返回列表</button>
      </div>
    </template>

    <script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    interface Topic {
      id: number;
      category: string;
      title: string;
      postDate: string;
      lastReplyDate: string;
      replyCount: number;
      author: string;
      content: string;
    }

    interface Reply {
      id: number;
      topicId: number;
      author: string;
      replyDate: string; // YYYY-MM-DD HH:MM
      content: string;
    }

    // --- Mock Data (Simulate fetching based on ID) ---
    const topic = ref<Topic | null>(null);
    const replies = ref<Reply[]>([]);

    // Simulate fetching data when component mounts
    onMounted(() => {
      const topicId = parseInt(route.params.id as string, 10);
      // In a real app, you'd fetch this data from an API
      findMockTopicAndReplies(topicId);
    });

    const findMockTopicAndReplies = (id: number) => {
      // Simulate finding the topic (reuse logic/data from list if possible, or redefine)
       const foundTopic = generateMockTopic(id); // Use a generator for consistency
       topic.value = foundTopic;


      // Simulate finding replies for this topic
      replies.value = generateMockReplies(id, foundTopic?.replyCount || 0);
    };

     // Helper to generate a single topic's data consistently
    const generateMockTopic = (id: number): Topic => {
        const categories = ['技术交流', '产品建议', '日常闲聊', '官方公告'];
        const postDate = new Date(2024, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1);
        const lastReplyMinutes = Math.floor(Math.random() * 60 * 24 * 5);
        const lastReplyDate = new Date(Date.now() - lastReplyMinutes * 60 * 1000);
        const replyCount = Math.floor(Math.random() * 100);
         const category = categories[id % categories.length]; // Make category somewhat predictable

        return {
            id: id,
            category: category,
            title: `关于 ${category} 的讨论话题 #${id}`,
            postDate: postDate.toISOString().split('T')[0],
            lastReplyDate: `${lastReplyDate.toISOString().split('T')[0]} ${lastReplyDate.toTimeString().substring(0, 5)}`,
            replyCount: replyCount,
            author: `用户${String.fromCharCode(65 + (id % 15))}`, // Make author somewhat predictable
            content: `这是话题 #${id} 的主要内容。\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
        };
    }


    // Helper to generate replies
    const generateMockReplies = (topicId: number, count: number): Reply[] => {
      const generatedReplies: Reply[] = [];
      const baseTime = topic.value ? new Date(topic.value.postDate).getTime() : Date.now();
      const timeRange = Date.now() - baseTime; // Replies happen between post date and now

      for (let i = 1; i <= count; i++) {
        const replyTime = new Date(baseTime + Math.random() * timeRange);
        generatedReplies.push({
          id: (topicId * 1000) + i, // Unique reply ID
          topicId: topicId,
          author: `回复者${String.fromCharCode(65 + Math.floor(Math.random() * 20))}`,
          replyDate: `${replyTime.toISOString().split('T')[0]} ${replyTime.toTimeString().substring(0, 5)}`,
          content: `这是对主题 #${topicId} 的第 ${i} 条回复。\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.`
        });
      }
       // Sort replies by date ascending
       generatedReplies.sort((a, b) => new Date(a.replyDate).getTime() - new Date(b.replyDate).getTime());
      return generatedReplies;
    };

     // Format content with basic line breaks
     const formattedContent = (content: string) => {
         return content.replace(/\n/g, '<br>');
     }

    // --- Navigation ---
    const goBackToList = () => {
      // Go back in history if possible, otherwise go to forum list
      if (router.options.history.state.back) {
         router.back();
      } else {
         router.push({ name: 'ForumList' });
      }
    };

    </script>

    <style scoped>
    .topic-detail-container {
      padding: 15px;
      color: #333;
      background-color: #f8f9fa; /* Slightly different background */
      min-height: calc(100vh - 30px);
    }

    .subpage-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      background-color: #fff; /* Header background */
      margin: -15px -15px 20px -15px; /* Extend header */
      padding: 10px 15px;
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
      font-size: 1.1em; /* Slightly smaller title */
      margin: 0;
      flex-grow: 1;
      text-align: center;
      padding-right: 40px; /* Balance back button */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .loading {
      text-align: center;
      padding: 50px;
      color: #888;
    }

    .topic-content {
       background-color: #fff;
       padding: 15px;
       border-radius: 5px;
       box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .post {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
    }
     .post:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
     }

    .main-post {
      border-bottom: 2px solid #ddd;
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 0.85em;
      color: #666;
    }
    .author {
      font-weight: bold;
      color: #0056b3;
    }
     .floor {
        font-style: italic;
     }

    .post-body {
      font-size: 0.95em;
      line-height: 1.6;
      color: #333;
      word-wrap: break-word; /* Allow long words to break */
      white-space: pre-wrap; /* Respect whitespace and line breaks */
    }
     /* Target the v-html output */
     .post-body :deep(br) {
        margin-bottom: 0.5em; /* Add space after line breaks */
     }


    .replies-title {
      font-size: 1.1em;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
      color: #333;
    }

    .no-replies {
      text-align: center;
      color: #888;
      padding: 20px 0;
    }

     .reply-box {
        margin-top: 30px;
        border-top: 1px solid #eee;
        padding-top: 20px;
     }
      .reply-box textarea {
         width: 100%;
         min-height: 80px;
         padding: 10px;
         border: 1px solid #ccc;
         border-radius: 4px;
         margin-bottom: 10px;
         font-size: 0.9em;
         line-height: 1.5;
      }
       .reply-box button {
          padding: 8px 15px;
          background-color: #28a745; /* Green button */
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          float: right;
       }
        .reply-box button:hover {
           background-color: #218838;
        }


     .back-button-bottom {
        display: block;
        margin: 25px auto 10px auto; /* Center button at the bottom */
        padding: 10px 20px;
        background-color: #6c757d; /* Grey color */
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
     }
      .back-button-bottom:hover {
         background-color: #5a6268;
      }
    </style>
