<template>
  <view class="my-feedback-page">
    <view v-if="feedbackList.length > 0" class="feedback-list">
      <view
        v-for="item in feedbackList"
        :key="item.id"
        class="feedback-item card"
        @click="viewDetail(item)"
      >
        <view class="item-header">
          <view class="type-tag" :class="item.type">
            {{ getTypeLabel(item.type) }}
          </view>
          <view class="status-tag" :class="item.status === 0 ? 'pending' : 'replied'">
            {{ item.status === 0 ? '待处理' : '已回复' }}
          </view>
        </view>
        
        <text class="content">{{ item.content }}</text>
        
        <view v-if="item.images" class="image-list">
          <image
            v-for="(img, index) in item.images.split(',')"
            :key="index"
            :src="img"
            mode="aspectFill"
            class="feedback-image"
            lazy-load
          />
        </view>
        
        <view v-if="item.status === 1 && item.reply" class="reply-box">
          <text class="reply-label">官方回复：</text>
          <text class="reply-content">{{ item.reply }}</text>
        </view>
        
        <text class="time">{{ formatTime(item.createTime) }}</text>
      </view>
      
      <view v-if="!hasMore && feedbackList.length > 0" class="no-more">
        没有更多记录了
      </view>
    </view>
    
    <view v-else class="empty-state">
      <text class="empty-icon">💬</text>
      <text class="empty-text">暂无反馈记录</text>
      <text class="empty-sub">有问题或建议？去提交反馈吧</text>
      <button class="go-feedback-btn" @click="goFeedback">去反馈</button>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { getMyFeedback } from '@/api/feedback.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      feedbackList: [],
      page: 0,
      size: 10,
      hasMore: true,
      loading: false
    }
  },
  onLoad() {
    this.loadFeedback()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore()
    }
  },
  methods: {
    async loadFeedback() {
      this.loading = true
      try {
        const res = await getMyFeedback({ page: this.page, size: this.size })
        if (res.code === 200) {
          const data = res.data || res
          this.feedbackList = data.content || []
          this.hasMore = (data.number || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        this.$toastError('加载失败')
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      this.page++
      this.loading = true
      try {
        const res = await getMyFeedback({ page: this.page, size: this.size })
        if (res.code === 200) {
          const data = res.data || res
          this.feedbackList.push(...(data.content || []))
          this.hasMore = (data.number || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        this.page--
        this.$toastError('加载失败')
      } finally {
        this.loading = false
      }
    },
    getTypeLabel(type) {
      const map = {
        suggestion: '功能建议',
        bug: '问题反馈',
        other: '其他'
      }
      return map[type] || '其他'
    },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    viewDetail(item) {
      // 可以展开查看详情
    },
    goFeedback() {
      uni.navigateTo({ url: '/pages/feedback/feedback' })
    }
  }
}
</script>

<style scoped>
.my-feedback-page {
  min-height: 100vh;
  background: #f8f6f8;
  padding: 20rpx;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.feedback-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.type-tag {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.type-tag.suggestion {
  background: #dbeafe;
  color: #2563eb;
}

.type-tag.bug {
  background: #fee2e2;
  color: #dc2626;
}

.type-tag.other {
  background: #f3f4f6;
  color: #6b7280;
}

.status-tag {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.status-tag.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-tag.replied {
  background: #d1fae5;
  color: #059669;
}

.content {
  font-size: 28rpx;
  color: #1f2937;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

.image-list {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.feedback-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
}

.reply-box {
  background: #f9fafb;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.reply-label {
  font-size: 24rpx;
  color: #059669;
  font-weight: 600;
  margin-bottom: 8rpx;
  display: block;
}

.reply-content {
  font-size: 26rpx;
  color: #4b5563;
  line-height: 1.5;
  display: block;
}

.time {
  font-size: 24rpx;
  color: #9ca3af;
}

.no-more {
  text-align: center;
  padding: 40rpx;
  font-size: 26rpx;
  color: #9ca3af;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  min-height: 50vh;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #6b7280;
  margin-bottom: 12rpx;
}

.empty-sub {
  font-size: 26rpx;
  color: #9ca3af;
  margin-bottom: 40rpx;
}

.go-feedback-btn {
  width: 240rpx;
  height: 80rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
