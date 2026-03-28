<template>
  <scroll-view class="category-scroll" scroll-x show-scrollbar="false">
    <view class="category-list">
      <view
        v-for="item in categories"
        :key="item.id"
        class="category-item"
        :class="{ active: current === item.id }"
        @click="selectCategory(item.id)"
      >
        <text class="category-emoji">{{ item.emoji }}</text>
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { CATEGORIES } from '@/utils/constant.js'

export default {
  name: 'CategoryTag',
  props: {
    current: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      categories: CATEGORIES
    }
  },
  methods: {
    selectCategory(id) {
      this.$emit('change', id)
    }
  }
}
</script>

<style scoped>
.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: flex;
  gap: 16rpx;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 14rpx 22rpx;
  background: rgba(255, 255, 255, 0.72);
  border: 1rpx solid rgba(31, 41, 55, 0.06);
  border-radius: 999rpx;
}

.category-item.active {
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
  box-shadow: 0 14rpx 28rpx rgba(201, 58, 90, 0.09);
}

.category-emoji {
  font-size: 28rpx;
}

.category-name {
  font-size: 24rpx;
  color: #5d6573;
  white-space: nowrap;
}

.category-item.active .category-name {
  color: #fff;
  font-weight: 600;
}
</style>






