import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
    import Login from './views/Login.vue';
    import Home from './views/Home.vue';
    import SubPage from './views/SubPage.vue';
    import DocumentTable from './views/DocumentTable.vue';
    import ForumList from './views/ForumList.vue'; // Import Forum List
    import TopicDetail from './views/TopicDetail.vue'; // Import Topic Detail

    // Simple authentication check
    const isAuthenticated = () => {
      return localStorage.getItem('isAuthenticated') === 'true';
    };

    const routes: Array<RouteRecordRaw> = [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
      },
      {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
      },
      {
        path: '/document-table',
        name: 'DocumentTable',
        component: DocumentTable,
        meta: { requiresAuth: true }
      },
      // Forum Routes
      {
        path: '/forum',
        name: 'ForumList',
        component: ForumList,
        meta: { requiresAuth: true }
      },
      {
        path: '/forum/topic/:id', // Route for specific topic
        name: 'TopicDetail',
        component: TopicDetail,
        props: true, // Pass route params (id) as props
        meta: { requiresAuth: true }
      },
      // Generic route for OTHER sub pages (keep last or before wildcard)
      {
        path: '/subpage/:name',
        name: 'SubPage',
        component: SubPage,
        props: true,
        meta: { requiresAuth: true }
      },
      // Redirect to login if no other route matches
      {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
      }
    ];

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    // Navigation guard (remains the same)
    router.beforeEach((to, from, next) => {
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

      if (requiresAuth && !isAuthenticated()) {
        next({ name: 'Login' });
      } else if (to.name === 'Login' && isAuthenticated()) {
        next({ name: 'Home' });
      } else {
        next();
      }
    });

    export default router;
