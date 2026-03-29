<template>
  <view class="index-page">
    <view class="hero card">
      <view class="hero-visual" aria-hidden="true">
        <view class="visual-orb orb-left"></view>
        <view class="visual-orb orb-right"></view>
        <view class="visual-stack">
          <view class="stack-card stack-back"></view>
          <view class="stack-card stack-middle"></view>
          <view class="stack-card stack-front">
            <view class="stack-chip chip-red"></view>
            <view class="stack-chip chip-soft"></view>
            <view class="stack-line line-strong"></view>
            <view class="stack-line"></view>
            <view class="stack-line line-short"></view>
          </view>
        </view>
		
		
        <view class="floating-pill pill-main">红包</view>
        <view class="floating-pill pill-side">会员</view>
      </view>
      <view class="hero-info">
        <text class="hero-title">今日灵感</text>
        <view class="hero-badges">
          <text class="hero-badge">{{ filteredDealList.length }} 条在更</text>
          <text class="hero-badge accent">{{ expiringCount }} 条即将结束</text>
        </view>
      </view>
      <view class="search-entry" @click="goSearch">
        <text class="search-label">搜索淘宝、京东、会员、红包...</text>
        <text class="search-action">去看看</text>
      </view>
    </view>

    <view class="toolbar card">
      <scroll-view class="category-scroll" scroll-x show-scrollbar="false">
        <view class="category-list">
          <view
            v-for="item in categories"
            :key="item.name"
            class="category-pill"
            :class="{ active: currentCategory === item.name }"
            @click="onCategoryChange(item.name)"
          >
            <text class="category-text">{{ item.name }}</text>
            <view class="category-line"></view>
          </view>
        </view>
      </scroll-view>
      <view class="sort-bar">
        <view
          v-for="item in sortOptions"
          :key="item.value"
          class="sort-item"
          :class="{ active: currentSort === item.value }"
          @click="onSortChange(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <view class="deal-list">
      <view class="waterfall-container" v-if="filteredDealList.length">
        <view class="waterfall-column" v-for="(column, colIndex) in columns" :key="colIndex">
          <DealCard
            v-for="deal in column"
            :key="deal._id || deal.id"
            :deal="deal"
            class="waterfall-item"
          />
        </view>
      </view>

      <view class="loading-container" v-if="loading && filteredDealList.length === 0">
        <view class="loader"></view>
        <text class="loading-text">内容加载中...</text>
      </view>

      <Empty
        v-if="filteredDealList.length === 0 && !loading"
        text="还没有符合条件的宝藏"
        subText="换个分类看看，或者发布你刚发现的新福利。"
      />

      <view class="load-more" v-if="filteredDealList.length > 0">
        <text v-if="loading">正在刷新优惠情报...</text>
        <text v-else-if="!hasMore">已经到底了</text>
        <text v-else>上滑加载更多宝藏</text>
      </view>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 TabBar -->
    <custom-tabbar :current="0"></custom-tabbar>
  </view>
</template>

<script>
import DealCard from '@/components/deal-card/deal-card.vue'
import Empty from '@/components/empty/empty.vue'
import Toast from '@/components/toast/toast.vue'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import toastMixin from '@/mixins/toast.js'
import { SORT_OPTIONS } from '@/utils/constant.js'
import { getDealList, getCategories, getLatestDeals, getHotDeals, getEndingSoonDeals } from '@/api/deal.js'

export default {
  components: {
    DealCard,
    Empty,
    Toast,
    CustomTabbar
  },
  mixins: [toastMixin],
  data() {
    return {
      currentSort: 'newest',
      currentCategory: '全部',
      categories: [{ name: '全部', emoji: '📋' }],
      sortOptions: SORT_OPTIONS,
      dealList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      refreshing: false,
      hasMore: true
    }
  },
  computed: {
    filteredDealList() {
      if (this.currentCategory === '全部') return this.dealList
      return this.dealList.filter(item => item.categoryName === this.currentCategory)
    },
    columns() {
      const cols = [[], []]
      const heights = [0, 0]
      this.filteredDealList.forEach(deal => {
        const targetIndex = heights[0] <= heights[1] ? 0 : 1
        cols[targetIndex].push(deal)
        heights[targetIndex] += this.estimateDealHeight(deal)
      })
      return cols
    },
    expiringCount() {
      return this.filteredDealList.filter(item => item.expireTime && new Date(item.expireTime).getTime() > Date.now()).length
    }
  },
  onLoad() {
    this.syncSelectedCategory()
    this.loadCategories()
    this.loadData()
  },
  onShow() {
    this.syncSelectedCategory()
    this.page = 1
    this.loadData()
  },
  onReachBottom() {
    this.loadMore()
  },
  onPullDownRefresh() {
    this.onRefresh()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategories()
        let list = []
        if (res.data && Array.isArray(res.data)) {
          list = res.data
        } else if (Array.isArray(res)) {
          list = res
        }
        this.categories = [
          { name: '全部', emoji: '📋' },
          ...list.map(item => ({
            name: item.name || item.categoryName || '其他',
            emoji: item.emoji || '📦'
          }))
        ]
      } catch (e) {
        console.error('获取分类失败', e)
      }
    },
    syncSelectedCategory() {
      const selectedCategory = uni.getStorageSync('selectedCategory')
      if (selectedCategory) {
        this.currentCategory = selectedCategory
        uni.removeStorageSync('selectedCategory')
      }
    },
    normalizeList(res) {
      if (res.data && Array.isArray(res.data.content)) return res.data.content
      if (res.data && Array.isArray(res.data.list)) return res.data.list
      if (res.data && Array.isArray(res.data.data)) return res.data.data
      if (Array.isArray(res.data)) return res.data
      if (Array.isArray(res.list)) return res.list
      return []
    },
    async loadData() {
      if (this.loading) return
      this.loading = true

      try {
        const params = {
          page: this.page - 1,
          size: this.pageSize
        }
        // 如果不是全部，传分类名称
        if (this.currentCategory !== '全部') {
          params.categoryName = this.currentCategory
        }
        
        // 根据排序方式选择不同的接口
        let res
        switch (this.currentSort) {
          case 'newest':
            res = await getLatestDeals(params)
            break
          case 'hottest':
            res = await getHotDeals(params)
            break
          case 'ending':
            res = await getEndingSoonDeals(params)
            break
          default:
            res = await getLatestDeals(params)
        }

        const list = this.normalizeList(res)

        if (this.page === 1) {
          this.dealList = list
        } else {
          this.dealList = [...this.dealList, ...list]
        }

        this.hasMore = list.length === this.pageSize
      } catch (e) {
        this.$toastError(`加载失败${e && e.message ? `: ${e.message}` : ''}`)
      } finally {
        this.loading = false
        this.refreshing = false
        uni.stopPullDownRefresh()
      }
    },
    onSortChange(sort) {
      if (this.currentSort === sort) return
      this.currentSort = sort
      this.page = 1
      this.loadData()
    },
    onCategoryChange(category) {
      this.currentCategory = category
      this.page = 1
      this.loadData()
    },
    estimateDealHeight(deal) {
      let height = 220
      const titleLength = (deal.title || '').length
      const contentLength = (deal.content || '').length
      const imageCount = Array.isArray(deal.images) ? deal.images.length : 0

      height += Math.min(titleLength, 28) * 1.4
      height += Math.min(contentLength, 42) * 0.8
      if (imageCount > 0) height += 132 + (this.getDealSeed(deal) % 3) * 28
      if (deal.profit !== undefined && deal.profit !== null && deal.profit !== '') height += 46
      return height
    },
    getDealSeed(deal) {
      const source = String(deal.id || deal._id || deal.title || '')
      return source.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    },
    loadMore() {
      if (!this.hasMore || this.loading) return
      this.page += 1
      this.loadData()
    },
    onRefresh() {
      this.refreshing = true
      this.page = 1
      this.loadData()
    },
    goSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      })
    }
  }
}
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  padding: 16rpx 20rpx 140rpx;
  box-sizing: border-box;
}

.hero {
  position: relative;
  overflow: hidden;
  padding: 22rpx;
  min-height: 236rpx;
}

.hero-info,
.search-entry {
  position: relative;
  z-index: 2;
}

.hero-info,
.search-entry {
  margin-right: 142rpx;
}

.hero-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-top: 4rpx;
}

.hero-title {
  display: block;
  font-size: 30rpx;
  line-height: 1.25;
  color: #1f2937;
  font-weight: 700;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.hero-badge {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  font-size: 19rpx;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: inset 0 0 0 1rpx rgba(31, 41, 55, 0.05);
}

.hero-badge.accent {
  color: #a12b48;
  background: rgba(253, 240, 245, 0.94);
}

.hero-visual {
  position: absolute;
  top: 14rpx;
  right: 8rpx;
  width: 206rpx;
  height: 168rpx;
  pointer-events: none;
  z-index: 1;
}

.visual-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(2rpx);
}

.orb-left {
  top: 18rpx;
  right: 104rpx;
  width: 42rpx;
  height: 42rpx;
  background: radial-gradient(circle at 30% 30%, #ffe1ea 0%, #f39ab0 72%, rgba(243, 154, 176, 0.2) 100%);
  box-shadow: 0 10rpx 22rpx rgba(201, 58, 90, 0.18);
}

.orb-right {
  top: 0;
  right: 20rpx;
  width: 26rpx;
  height: 26rpx;
  background: radial-gradient(circle at 30% 30%, #fff4f7 0%, #ffd0dc 70%, rgba(255, 208, 220, 0.18) 100%);
}

.visual-stack {
  position: absolute;
  right: 18rpx;
  top: 26rpx;
  width: 118rpx;
  height: 118rpx;
}

.stack-card {
  position: absolute;
  inset: 0;
  border-radius: 26rpx;
  box-shadow: 0 18rpx 36rpx rgba(107, 26, 48, 0.12);
}

.stack-back {
  transform: translate(-22rpx, 18rpx) rotate(-14deg);
  background: linear-gradient(180deg, rgba(255, 243, 246, 0.8) 0%, rgba(255, 225, 234, 0.95) 100%);
}

.stack-middle {
  transform: translate(-8rpx, 8rpx) rotate(-7deg);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(252, 235, 241, 0.98) 100%);
}

.stack-front {
  padding: 18rpx 16rpx;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 243, 246, 0.95) 100%);
  border: 1rpx solid rgba(255, 255, 255, 0.88);
  transform: rotate(6deg);
}

.stack-chip {
  height: 14rpx;
  border-radius: 999rpx;
  margin-bottom: 10rpx;
}

.chip-red {
  width: 56rpx;
  background: linear-gradient(90deg, #c93a5a 0%, #ef7e99 100%);
}

.chip-soft {
  width: 34rpx;
  background: rgba(201, 58, 90, 0.16);
}

.stack-line {
  height: 10rpx;
  border-radius: 999rpx;
  background: rgba(31, 41, 55, 0.09);
  margin-top: 10rpx;
}

.line-strong {
  width: 82rpx;
}

.line-short {
  width: 58rpx;
}

.floating-pill {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 18rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 24rpx rgba(107, 26, 48, 0.12);
}

.pill-main {
  right: 96rpx;
  bottom: 14rpx;
  color: #9a2140;
  background: rgba(255, 247, 249, 0.94);
  transform: rotate(-9deg);
}

.pill-side {
  right: 0;
  bottom: 38rpx;
  color: #fff;
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
  transform: rotate(8deg);
}

.search-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14rpx;
  width: 380rpx;
  max-width: calc(100% - 142rpx);
  padding: 12rpx 16rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, rgba(255, 244, 247, 0.96) 0%, rgba(253, 239, 243, 0.98) 100%);
  box-shadow: inset 0 0 0 1rpx rgba(201, 58, 90, 0.08);
}

.search-label {
  color: #8f6672;
  font-size: 20rpx;
}

.search-action {
  color: #c93a5a;
  font-size: 20rpx;
  font-weight: 600;
}

.toolbar {
  padding: 12rpx 18rpx 10rpx;
  margin-top: 14rpx;
}

.category-scroll {
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.category-list {
  display: flex;
  gap: 24rpx;
  padding: 0 2rpx 4rpx;
}

.category-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 0 12rpx;
  color: #94a3b8;
}

.category-pill.active {
  color: #1f2937;
}

.category-emoji {
  font-size: 20rpx;
}

.category-text {
  font-size: 24rpx;
  font-weight: 500;
  color: inherit;
}

.category-pill.active .category-text {
  font-weight: 700;
}

.category-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4rpx;
  border-radius: 999rpx;
  background: transparent;
}

.category-pill.active .category-line {
  background: linear-gradient(90deg, #c93a5a 0%, #e66584 100%);
}

.sort-bar {
  display: flex;
  gap: 10rpx;
  padding-top: 6rpx;
  flex-wrap: wrap;
}

.sort-item {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  color: #7b8494;
  background: rgba(248, 241, 244, 0.9);
  border: 1rpx solid rgba(201, 58, 90, 0.06);
}

.sort-item.active {
  color: #a12b48;
  font-weight: 600;
  background: rgba(253, 240, 245, 0.95);
  border-color: rgba(201, 58, 90, 0.14);
}

.deal-list {
  margin-top: 14rpx;
}

.waterfall-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
  align-items: start;
  width: 100%;
  padding-bottom: 32rpx;
  box-sizing: border-box;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  min-width: 0;
}

.waterfall-item {
  width: 100%;
  box-sizing: border-box;
}

.load-more {
  text-align: center;
  padding: 32rpx 0 40rpx;
  font-size: 24rpx;
  color: #8a94a6;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.loader {
  width: 80rpx;
  aspect-ratio: 1;
  display: grid;
  border: 6rpx solid #0000;
  border-radius: 50%;
  border-right-color: #c93a5a;
  animation: l15 1s infinite linear;
}

.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
  animation: l15 2s infinite;
}

.loader::after {
  margin: 8px;
  animation-duration: 3s;
}

@keyframes l15 {
  100% {
    transform: rotate(1turn);
  }
}

.loading-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #8a94a6;
}
</style>


