<template>
  <view class="deal-card" @click="goDetail">
    <view class="card-inner">
      <view class="card-header">
        <view class="header-left">
          <text class="platform-dot"></text>
          <text class="platform-text">{{ deal.platform || '全网' }}</text>
        </view>
        <text class="category-text">{{ categoryName }}</text>
      </view>

      <text class="card-title">{{ deal.title || '发现一条值得关注的优惠情报' }}</text>

      <text class="card-content" v-if="deal.content">
        {{ shortContent }}
      </text>

      <view class="image-wrapper" v-if="displayImages.length">
        <image
          v-for="(img, index) in displayImages"
          :key="index"
          :src="img"
          mode="aspectFill"
          class="deal-image"
          lazy-load
        />
      </view>

      <view class="card-footer">
        <view class="profit-tag" v-if="deal.profit !== undefined && deal.profit !== null && deal.profit !== ''">
          <text class="profit-value">+{{ deal.profit }}</text>
          <text class="profit-unit">元</text>
        </view>
        <text class="time-text">{{ formatTime(deal.publishTime || deal.createTime) || '刚刚' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { formatTime } from '@/utils/util.js'

export default {
  name: 'DealCard',
  props: {
    deal: {
      type: Object,
      required: true
    }
  },
  computed: {
    categoryName() {
      return this.deal.categoryName || this.deal.category || '其他'
    },
    displayImages() {
      return Array.isArray(this.deal.images) ? this.deal.images.slice(0, 1) : []
    },
    shortContent() {
      const content = this.deal.content || ''
      return content.length > 20 ? `${content.slice(0, 20)}...` : content
    }
  },
  methods: {
    formatTime,
    goDetail() {
      const id = this.deal.id || this.deal._id
      if (!id) return
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      })
    }
  }
}
</script>

<style scoped>
.deal-card {
  background: #fafafa;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #f0f0f0;
}

.card-inner {
  padding: 22rpx;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.platform-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #c93a5a;
}

.platform-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #c93a5a;
}

.category-text {
  font-size: 22rpx;
  color: #999;
}

.card-title {
  display: block;
  font-size: 28rpx;
  line-height: 1.5;
  color: #1a1a1a;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.card-content {
  display: block;
  font-size: 24rpx;
  line-height: 1.6;
  color: #666;
  margin-bottom: 14rpx;
}

.image-wrapper {
  display: flex;
  gap: 10rpx;
  margin-bottom: 14rpx;
}

.deal-image {
  width: 100%;
  height: 200rpx;
  border-radius: 10rpx;
  background: #eee;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profit-tag {
  display: flex;
  align-items: baseline;
  background: #fff0f3;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.profit-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #c93a5a;
}

.profit-unit {
  font-size: 22rpx;
  color: #c93a5a;
  margin-left: 2rpx;
}

.time-text {
  font-size: 22rpx;
  color: #bbb;
}
</style>
