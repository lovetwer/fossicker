<template>
  <view class="category-page">
    <view class="hero card">
      <text class="hero-kicker">探索频道</text>
      <text class="hero-title">按场景找福利，比按平台翻更快</text>
      <text class="hero-subtitle">挑一个你最近最常用的消费场景，我们把入口帮你提前整理好。</text>
    </view>

    <view class="category-grid card">
      <view
        v-for="item in categories"
        :key="item.id"
        class="category-item"
        @click="goCategory(item.id)"
      >
        <view class="icon-wrapper" :style="{ background: getCardGradient(item.id) }">
          <text class="category-emoji">{{ item.emoji }}</text>
        </view>
        <text class="category-name">{{ item.name }}</text>
        <text class="category-desc">{{ item.description }}</text>
      </view>
    </view>

    <view class="hot-section card">
      <view class="section-head">
        <text class="section-title">热门平台雷达</text>
        <text class="section-subtitle">点一下直接带着关键词去搜</text>
      </view>
      <view class="platform-list">
        <view
          v-for="platform in hotPlatforms"
          :key="platform"
          class="platform-tag"
          @click="goPlatform(platform)"
        >
          {{ platform }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { CATEGORIES, HOT_PLATFORMS } from '@/utils/constant.js'

export default {
  data() {
    return {
      categories: CATEGORIES.filter(item => item.id !== 'all'),
      hotPlatforms: HOT_PLATFORMS
    }
  },
  methods: {
    getCardGradient(id) {
      const colors = {
        ecommerce: 'linear-gradient(135deg, rgba(255, 140, 102, 0.22) 0%, rgba(201, 58, 90, 0.06) 100%)',
        food: 'linear-gradient(135deg, rgba(255, 204, 102, 0.24) 0%, rgba(255, 160, 92, 0.12) 100%)',
        finance: 'linear-gradient(135deg, rgba(70, 184, 130, 0.2) 0%, rgba(33, 158, 188, 0.12) 100%)',
        video: 'linear-gradient(135deg, rgba(108, 99, 255, 0.18) 0%, rgba(79, 70, 229, 0.12) 100%)',
        travel: 'linear-gradient(135deg, rgba(41, 173, 255, 0.18) 0%, rgba(27, 78, 163, 0.12) 100%)',
        game: 'linear-gradient(135deg, rgba(255, 89, 94, 0.18) 0%, rgba(106, 13, 173, 0.12) 100%)',
        other: 'linear-gradient(135deg, rgba(122, 136, 158, 0.18) 0%, rgba(59, 72, 91, 0.12) 100%)'
      }
      return colors[id] || colors.other
    },
    goCategory(categoryId) {
      uni.setStorageSync('selectedCategory', categoryId)
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    goPlatform(platform) {
      uni.navigateTo({
        url: `/pages/search/search?keyword=${platform}`
      })
    }
  }
}
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  padding: 24rpx;
}

.hero,
.category-grid,
.hot-section {
  margin-bottom: 20rpx;
}

.hero {
  padding: 30rpx;
}

.hero-kicker {
  display: inline-flex;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(253, 240, 245, 0.95);
  color: #8f1f39;
  font-size: 22rpx;
  margin-bottom: 18rpx;
}

.hero-title {
  display: block;
  font-size: 40rpx;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 12rpx;
}

.hero-subtitle {
  display: block;
  font-size: 26rpx;
  color: #667085;
  line-height: 1.7;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
  padding: 24rpx;
}

.category-item {
  padding: 24rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.78);
}

.icon-wrapper {
  width: 92rpx;
  height: 92rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18rpx;
}

.category-emoji {
  font-size: 42rpx;
}

.category-name {
  display: block;
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 10rpx;
}

.category-desc {
  display: block;
  font-size: 24rpx;
  color: #7b8594;
  line-height: 1.6;
}

.hot-section {
  padding: 28rpx;
}

.section-head {
  margin-bottom: 18rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.section-subtitle {
  font-size: 24rpx;
  color: #8a94a6;
}

.platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.platform-tag {
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.06) 0%, rgba(230, 101, 132, 0.08) 100%);
  color: #8f1f39;
  font-size: 25rpx;
  font-weight: 600;
}
</style>







