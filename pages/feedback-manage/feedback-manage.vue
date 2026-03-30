<template>
  <view class="feedback-manage-page">
    <view class="filter-bar">
      <view
        v-for="item in statusOptions"
        :key="item.value"
        class="filter-item"
        :class="{ active: currentStatus === item.value }"
        @click="changeStatus(item.value)"
      >
        {{ item.label }}
      </view>
    </view>
    
    <view v-if="feedbackList.length > 0" class="feedback-list">
      <view
        v-for="item in feedbackList"
        :key="item.id"
        class="feedback-item card"
      >
        <view class="item-header">
          <view class="user-info">
            <text class="nickname">{{ item.userNickname || '匿名用户' }}</text>
            <text class="type-tag" :class="item.type">{{ getTypeLabel(item.type) }}</text>
          </view>
          <text class="time">{{ formatTime(item.createTime) }}</text>
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
            @click="previewImage(item.images.split(','), index)"
          />
        </view>
        
        <view v-if="item.contact" class="contact-info">
          <text class="contact-label">联系方式：</text>
          <text class="contact-value">{{ item.contact }}</text>
        </view>
        
        <view v-if="item.status === 1 && item.reply" class="reply-box">
          <view class="reply-header">
            <text class="reply-label">已回复</text>
            <text class="reply-time">{{ formatTime(item.replyTime) }}</text>
          </view>
          <text class="reply-content">{{ item.reply }}</text>
        </view>
        
        <view v-else class="reply-action">
          <view class="reply-input-box">
            <textarea
              v-model="item.replyText"
              class="reply-input"
              placeholder="请输入回复内容..."
              maxlength="500"
            />
            <button
              class="reply-btn"
              :disabled="!item.replyText || item.replying"
              @click="handleReply(item)"
            >
              {{ item.replying ? '回复中...' : '回复' }}
            </button>
          </view>
        </view>
      </view>
      
      <view v-if="!hasMore && feedbackList.length > 0" class="no-more">
        没有更多反馈了
      </view>
    </view>
    
    <view v-else class="empty-state">
      <text class="empty-text">暂无反馈</text>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { getFeedbackList, replyFeedback } from '@/api/feedback.js'
import { sendNotification } from '@/api/user.js'
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
      loading: false,
      currentStatus: null,
      statusOptions: [
        { label: '全部', value: null },
        { label: '待处理', value: 0 },
        { label: '已回复', value: 1 }
      ]
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
        const params = { page: this.page, size: this.size }
        if (this.currentStatus !== null) {
          params.status = this.currentStatus
        }
        const res = await getFeedbackList(params)
        if (res.code === 200) {
          const data = res.data || res
          this.feedbackList = (data.content || []).map(item => ({
            ...item,
            replyText: ''
          }))
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
        const params = { page: this.page, size: this.size }
        if (this.currentStatus !== null) {
          params.status = this.currentStatus
        }
        const res = await getFeedbackList(params)
        if (res.code === 200) {
          const data = res.data || res
          const newItems = (data.content || []).map(item => ({
            ...item,
            replyText: ''
          }))
          this.feedbackList.push(...newItems)
          this.hasMore = (data.number || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        this.page--
        this.$toastError('加载失败')
      } finally {
        this.loading = false
      }
    },
    changeStatus(status) {
      this.currentStatus = status
      this.page = 0
      this.loadFeedback()
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
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: images[current]
      })
    },
    async handleReply(item) {
      if (!item.replyText.trim()) return
      
      item.replying = true
      try {
        await replyFeedback(item.id, item.replyText.trim())
        
        // 给用户发送通知
        try {
          const typeMap = {
            suggestion: '功能建议',
            bug: '问题反馈',
            other: '其他'
          }
          const typeLabel = typeMap[item.type] || '反馈'
          await sendNotification({
            title: `您的${typeLabel}已收到回复`,
            content: `管理员回复：${item.replyText.trim()}`,
            userId: item.userId
          })
        } catch (e) {
          // 发送通知失败
        }
        
        item.status = 1
        item.reply = item.replyText.trim()
        item.replyTime = new Date().toISOString()
        this.$toastSuccess('回复成功')
      } catch (e) {
        this.$toastError('回复失败')
      } finally {
        item.replying = false
      }
    }
  }
}
</script>

<style scoped>
.feedback-manage-page {
  min-height: 100vh;
  background: #f8f6f8;
}

.filter-bar {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.filter-item {
  padding: 16rpx 32rpx;
  background: #f3f4f6;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #6b7280;
  transition: all 0.2s;
}

.filter-item.active {
  background: #c93a5a;
  color: #fff;
}

.feedback-list {
  padding: 0 20rpx;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.nickname {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
}

.type-tag {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
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

.time {
  font-size: 24rpx;
  color: #9ca3af;
}

.content {
  font-size: 28rpx;
  color: #374151;
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
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
}

.contact-info {
  background: #f9fafb;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 20rpx;
}

.contact-label {
  font-size: 24rpx;
  color: #6b7280;
}

.contact-value {
  font-size: 26rpx;
  color: #1f2937;
  font-weight: 500;
}

.reply-box {
  background: #ecfdf5;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-top: 20rpx;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.reply-label {
  font-size: 24rpx;
  color: #059669;
  font-weight: 600;
}

.reply-time {
  font-size: 22rpx;
  color: #6b7280;
}

.reply-content {
  font-size: 26rpx;
  color: #374151;
  line-height: 1.5;
  display: block;
}

.reply-action {
  margin-top: 20rpx;
}

.reply-input-box {
  display: flex;
  gap: 16rpx;
}

.reply-input {
  flex: 1;
  height: 80rpx;
  background: #fafafa;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.reply-btn {
  width: 100rpx;
  height: 80rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 28rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
}

.reply-btn[disabled] {
  background: #ddd;
  color: #999;
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
  padding: 200rpx 40rpx;
  min-height: 50vh;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #6b7280;
}
</style>
