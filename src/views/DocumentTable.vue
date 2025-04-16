<template>
      <div class="document-table-container">
        <header class="subpage-header">
          <button @click="goBack" class="back-button"><</button>
          <h1>文档列表</h1>
        </header>

        <div class="controls">
          <input type="text" v-model="searchQuery" placeholder="模糊搜索..." class="search-input">
          <select v-model="filterLevel" class="filter-select">
            <option value="">所有密级</option>
            <option v-for="level in securityLevels" :key="level" :value="level">{{ level }}</option>
          </select>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortBy('index')" :class="{ sortable: true, sorted: sortKey === 'index' }">
                序号 <span v-if="sortKey === 'index'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('name')" :class="{ sortable: true, sorted: sortKey === 'name' }">
                文件名 <span v-if="sortKey === 'name'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('uploadDate')" :class="{ sortable: true, sorted: sortKey === 'uploadDate' }">
                上传日期 <span v-if="sortKey === 'uploadDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('uploader')" :class="{ sortable: true, sorted: sortKey === 'uploader' }">
                上传人 <span v-if="sortKey === 'uploader'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('size')" :class="{ sortable: true, sorted: sortKey === 'size' }">
                大小 (KB) <span v-if="sortKey === 'size'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('securityLevel')" :class="{ sortable: true, sorted: sortKey === 'securityLevel' }">
                密级 <span v-if="sortKey === 'securityLevel'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedData.length === 0">
              <td :colspan="6" class="no-data">没有匹配的数据</td>
            </tr>
            <tr v-for="item in paginatedData" :key="item.id">
              <td>{{ item.index }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.uploadDate }}</td>
              <td>{{ item.uploader }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.securityLevel }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination" v-if="totalPages > 1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        </div>

         <button @click="goBack" class="back-button-bottom">返回首页</button>
      </div>
    </template>

    <script setup lang="ts">
    import { ref, computed, watch } from 'vue'; // Watch is correctly imported
    import { useRouter } from 'vue-router';

    const router = useRouter();

    // --- Mock Data ---
    interface Document {
      id: number;
      index: number;
      name: string;
      uploadDate: string; // YYYY-MM-DD
      uploader: string;
      size: number; // in KB
      securityLevel: string;
    }

    const mockDocuments = ref<Document[]>([]);
    const securityLevels = ['公开', '内部', '秘密', '机密'];

    // Generate more mock data
    for (let i = 1; i <= 55; i++) {
      const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      mockDocuments.value.push({
        id: i,
        index: i,
        name: `文件_${String(i).padStart(3, '0')}.pdf`,
        uploadDate: date.toISOString().split('T')[0],
        uploader: `用户${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`, // UserA, UserB, ...
        size: Math.floor(Math.random() * 5000) + 100, // 100KB to 5100KB
        securityLevel: securityLevels[Math.floor(Math.random() * securityLevels.length)],
      });
    }

    // --- State for Table Features ---
    const searchQuery = ref('');
    const filterLevel = ref(''); // Selected security level for filtering
    const sortKey = ref<keyof Document | 'index'>('index'); // Default sort by index
    const sortOrder = ref<'asc' | 'desc'>('asc');
    const currentPage = ref(1);
    const itemsPerPage = 10;

    // --- Computed Properties for Data Handling ---

    // 1. Filter Data (Search + Level Filter)
    const filteredData = computed(() => {
      let data = mockDocuments.value;

      // Apply security level filter
      if (filterLevel.value) {
        data = data.filter(doc => doc.securityLevel === filterLevel.value);
      }

      // Apply search query (fuzzy search on name, uploader)
      if (searchQuery.value) {
        const lowerQuery = searchQuery.value.toLowerCase();
        data = data.filter(doc =>
          doc.name.toLowerCase().includes(lowerQuery) ||
          doc.uploader.toLowerCase().includes(lowerQuery) ||
          doc.securityLevel.toLowerCase().includes(lowerQuery) ||
          doc.uploadDate.includes(lowerQuery) ||
          String(doc.size).includes(lowerQuery) ||
          String(doc.index).includes(lowerQuery)
        );
      }
      return data;
    });

    // 2. Sort Data
    const sortedData = computed(() => {
      const key = sortKey.value;
      if (!key) return filteredData.value;

      return [...filteredData.value].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Handle different data types for comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        let comparison = 0;
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }

        return sortOrder.value === 'desc' ? (comparison * -1) : comparison;
      });
    });

    // 3. Paginate Data
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedData.value.slice(start, end);
    });

    // 4. Calculate Total Pages
    const totalPages = computed(() => {
      return Math.ceil(sortedData.value.length / itemsPerPage);
    });

    // --- Methods ---
    const sortBy = (key: keyof Document | 'index') => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
      }
       currentPage.value = 1; // Reset to first page on sort
    };

    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const goBack = () => {
      router.push({ name: 'Home' }); // Navigate back to Home
    };

    // Reset page number if filters change
    watch([searchQuery, filterLevel], () => {
        currentPage.value = 1;
    });

    </script>

    <style scoped>
    .document-table-container {
      padding: 15px;
      color: #333;
      background-color: #fff; /* White background for table area */
      min-height: calc(100vh - 30px); /* Adjust based on padding */
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

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap; /* Allow wrapping on smaller screens */
    }

    .search-input, .filter-select {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .search-input {
      flex-grow: 1; /* Take available space */
      min-width: 150px;
    }
     .filter-select {
       min-width: 120px;
     }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 0.9em;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .data-table th, .data-table td {
      border: 1px solid #eee;
      padding: 10px 8px;
      text-align: left;
      white-space: nowrap; /* Prevent wrapping */
    }

    .data-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      cursor: default;
    }
     .data-table th.sortable {
        cursor: pointer;
        user-select: none; /* Prevent text selection on click */
     }
      .data-table th.sortable:hover {
         background-color: #e9ecef;
      }
      .data-table th.sorted {
         background-color: #e2e6ea;
      }
      .data-table th span {
         font-size: 0.8em;
         margin-left: 4px;
         color: #007bff;
      }


    .data-table tbody tr:nth-child(even) {
      background-color: #fdfdfd;
    }
     .data-table tbody tr:hover {
        background-color: #f1f1f1;
     }

     .no-data td {
        text-align: center;
        color: #888;
        padding: 20px;
     }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .pagination button {
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .pagination button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .pagination span {
      font-size: 0.9em;
      color: #555;
    }

     .back-button-bottom {
        display: block;
        margin: 20px auto 0; /* Center button at the bottom */
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
