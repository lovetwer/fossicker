<template>
  <view class="search-page">
    <view class="search-header card">
      <view class="search-box">
        <text class="search-icon">⌕</text>
        <input
          v-model="keyword"
          placeholder="搜索平台、会员、红包、返利..."
          class="search-input"
          confirm-type="search"
          @confirm="doSearch"
          :focus="true"
        />
        <text class="clear-icon" v-if="keyword" @click="clearKeyword">×</text>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <view class="search-history card" v-if="!hasSearch && history.length > 0">
      <view class="section-header">
        <text class="section-title">最近搜索</text>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>
      <view class="tag-list">
        <text v-for="(item, index) in history" :key="index" class="tag-item" @click="quickSearch(item)">{{ item }}</text>
      </view>
    </view>

    <view class="hot-search card" v-if="!hasSearch">
      <view class="section-header">
        <text class="section-title">热门搜索</text>
      </view>
      <view class="tag-list">
        <text v-for="(item, index) in hotKeywords" :key="index" class="tag-item hot" @click="quickSearch(item)">{{ item }}</text>
      </view>
    </view>

    <scroll-view class="search-result" scroll-y v-if="hasSearch" @scrolltolower="loadMore">
      <view class="result-head">
        <text class="result-title">“{{ keyword }}” 的搜索结果</text>
        <text class="result-count">共 {{ resultList.length }} 条</text>
      </view>

      <view class="result-list" v-if="resultList.length > 0">
        <DealCard v-for="deal in resultList" :key="deal._id || deal.id" :deal="deal" />
      </view>

      <Empty v-if="resultList.length === 0 && !loading" text="没有找到匹配结果" subText="试试更短的关键词，或者换平台名称搜索。" icon="🧭" />

      <view class="load-more" v-if="resultList.length > 0">
        <text v-if="loading">搜索中...</text>
        <text v-else-if="!hasMore">没有更多结果了</text>
      </view>
    </scroll-view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
  </view>
</template>

<script>
import DealCard from '@/components/deal-card/deal-card.vue'
import Empty from '@/components/empty/empty.vue'
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import toastMixin from '@/mixins/toast.js'
import { searchDeals } from '@/api/deal.js'
import { HOT_KEYWORDS } from '@/utils/constant.js'

export default {
  components: { DealCard, Empty, Toast, Modal },
  mixins: [toastMixin],
  data() {
    return {
      keyword: '',
      history: [],
      hotKeywords: HOT_KEYWORDS,
      hasSearch: false,
      resultList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      hasMore: true
    }
  },
  onLoad(options) {
    if (options.keyword) {
      this.keyword = options.keyword
      this.doSearch()
    }
    this.loadHistory()
  },
  methods: {
    loadHistory() {
      const history = uni.getStorageSync('searchHistory')
      this.history = history ? JSON.parse(history) : []
    },
    saveHistory() {
      let history = this.history.filter(item => item !== this.keyword)
      history.unshift(this.keyword)
      history = history.slice(0, 10)
      this.history = history
      uni.setStorageSync('searchHistory', JSON.stringify(history))
    },
    async clearHistory() {
      const res = await this.$modal({
        title: '清空搜索记录',
        content: '确认删除本地搜索历史吗？'
      })
      if (res.confirm) {
        this.history = []
        uni.removeStorageSync('searchHistory')
      }
    },
    clearKeyword() {
      this.keyword = ''
      this.hasSearch = false
      this.resultList = []
    },
    quickSearch(keyword) {
      this.keyword = keyword
      this.doSearch()
    },
    normalizeList(res) {
      if (res.data && Array.isArray(res.data.content)) return res.data.content
      if (res.data && Array.isArray(res.data.list)) return res.data.list
      if (res.data && Array.isArray(res.data.data)) return res.data.data
      if (Array.isArray(res.data)) return res.data
      return []
    },
    doSearch() {
      if (!this.keyword.trim()) {
        this.$toastInfo('请输入搜索内容')
        return
      }
      this.hasSearch = true
      this.page = 1
      this.saveHistory()
      this.loadData()
    },
    async loadData() {
      if (this.loading) return
      this.loading = true
      try {
        const res = await searchDeals({
          keyword: this.keyword,
          page: this.page - 1,
          size: this.pageSize
        })
        const list = this.normalizeList(res)
        if (this.page === 1) {
          this.resultList = list
        } else {
          this.resultList = [...this.resultList, ...list]
        }
        this.hasMore = list.length === this.pageSize
      } catch (e) {
        this.resultList = []
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      if (!this.hasMore || this.loading) return
      this.page += 1
      this.loadData()
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.search-page {
  height: 100vh;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.search-header,
.search-history,
.hot-search {
  padding: 24rpx;
}
.search-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 22rpx;
  height: 88rpx;
  border-radius: 999rpx;
  background: rgba(253, 247, 250, 0.96);
}
.search-icon,
.clear-icon {
  font-size: 30rpx;
  color: #8a94a6;
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  margin: 0 14rpx;
}
.cancel-btn {
  font-size: 26rpx;
  color: #667085;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}
.section-title {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 700;
}
.clear-btn {
  font-size: 24rpx;
  color: #8a94a6;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}
.tag-item {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(253, 247, 250, 0.96);
  color: #5d6573;
  font-size: 24rpx;
}
.tag-item.hot {
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.06) 0%, rgba(230, 101, 132, 0.08) 100%);
  color: #8f1f39;
  font-weight: 600;
}
.search-result {
  flex: 1;
}
.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6rpx 4rpx 18rpx;
}
.result-title {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 700;
}
.result-count {
  font-size: 24rpx;
  color: #8a94a6;
}
.result-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding-bottom: 30rpx;
}
.load-more {
  text-align: center;
  padding: 24rpx 0 36rpx;
  color: #8a94a6;
  font-size: 24rpx;
}
</style>







