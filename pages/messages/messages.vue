<template>
  <view class="messages-page">
    <view class="header">
      <text class="title">消息通知</text>
      <view class="header-actions">
        <view class="send-btn" @click="goSendNotification" v-if="isAdmin">发通知</view>
        <view class="feedback-btn" @click="goFeedbackManage" v-if="isAdmin">处理反馈</view>
        <view class="mark-read-btn" @click="handleMarkAllRead" v-if="notifications.length > 0">全部已读</view>
      </view>
    </view>

    <view class="notification-list" v-if="notifications.length > 0">
      <view
        class="notification-item card"
        v-for="item in notifications"
        :key="item.id"
        :class="{ unread: !item.isRead, expanded: item.expanded }"
        @click="handleClick(item)"
      >
        <view class="item-icon" :class="getTypeClass(item.type)">
          <text>{{ getTypeIcon(item.type) }}</text>
        </view>
        <view class="item-content">
          <view class="item-header">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-time">{{ formatTime(item.createTime) }}</text>
          </view>
          <text class="item-desc" :class="{ expanded: item.expanded }">{{ item.content }}</text>
        </view>
        <view class="unread-dot" v-if="!item.isRead"></view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-text">暂无通知</text>
      <text class="empty-sub">审核结果和系统提醒会在这里显示</text>
    </view>

    <view class="load-more" v-if="hasMore && notifications.length > 0" @click="loadMore">
      <text>{{ loading ? '加载中...' : '加载更多' }}</text>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
  </view>
</template>

<script>
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '@/api/user.js'
import Empty from '@/components/empty/empty.vue'
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Empty, Toast, Modal },
  mixins: [toastMixin],
  data() {
    return {
      notifications: [],
      page: 0,
      size: 10,
      hasMore: false,
      loading: false
    }
  },
  computed: {
    isAdmin() {
      const userInfo = uni.getStorageSync('userInfo') || {}
      return userInfo.role === 'admin' || userInfo.isAdmin === true
    }
  },
  onLoad() {
    this.loadNotifications()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore()
    }
  },
  methods: {
    async loadNotifications() {
      this.loading = true
      try {
        const res = await getNotifications({ page: this.page, size: this.size })
        if (res.code === 200) {
          const data = res.data || res
          this.notifications = data.content || []
          this.hasMore = (data.number || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        // 获取通知失败
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      if (this.loading || !this.hasMore) return
      this.page++
      this.loading = true
      try {
        const res = await getNotifications({ page: this.page, size: this.size })
        if (res.code === 200) {
          const data = res.data || res
          this.notifications = [...this.notifications, ...(data.content || [])]
          this.hasMore = (data.number || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        this.page--
        // 加载更多失败
      } finally {
        this.loading = false
      }
    },
    async handleClick(item) {
      if (!item.isRead) {
        try {
          await markNotificationRead(item.id)
          item.isRead = true
        } catch (e) {
          // 标记已读失败
        }
      }
      // 如果有dealId则跳转到详情页
      if (item.dealId) {
        uni.navigateTo({ url: `/pages/detail/detail?id=${item.dealId}` })
        return
      }
      // 如果是反馈相关通知，管理员跳转到反馈管理页面
      const title = item.title || ''
      if (this.isAdmin && (title.includes('反馈') || title.includes('建议'))) {
        uni.navigateTo({ url: '/pages/feedback-manage/feedback-manage' })
        return
      }
      // 其他情况展开/收起
      item.expanded = !item.expanded
    },
    async handleMarkAllRead() {
      const res = await this.$modal({
        title: '全部已读',
        content: '确定要将所有通知标记为已读吗？'
      })
      if (res.confirm) {
        try {
          await markAllNotificationsRead()
          this.notifications.forEach(item => item.isRead = true)
          this.$toastSuccess('已标记全部已读')
        } catch (e) {
          this.$toastError('操作失败')
        }
      }
    },
    async handleDelete(item) {
      const res = await this.$modal({
        title: '删除通知',
        content: '确定要删除这条通知吗？'
      })
      if (res.confirm) {
        try {
          await deleteNotification(item.id)
          this.notifications = this.notifications.filter(n => n.id !== item.id)
          this.$toastSuccess('已删除')
        } catch (e) {
          this.$toastError('删除失败')
        }
      }
    },
    goSendNotification() {
      uni.navigateTo({ url: '/pages/send-notification/send-notification' })
    },
    goFeedbackManage() {
      uni.navigateTo({ url: '/pages/feedback-manage/feedback-manage' })
    },
    getTypeIcon(type) {
      const iconMap = {
        audit_approve: '✓',
        audit_reject: '✗',
        offline: '▼'
      }
      return iconMap[type] || '•'
    },
    getTypeClass(type) {
      const classMap = {
        audit_approve: 'success',
        audit_reject: 'danger',
        offline: 'warning'
      }
      return classMap[type] || 'default'
    },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`
      return `${date.getMonth() + 1}-${date.getDate()}`
    }
  }
}
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.send-btn {
  font-size: 26rpx;
  color: #c93a5a;
  padding: 10rpx 16rpx;
}
.feedback-btn {
  font-size: 26rpx;
  color: #059669;
  padding: 10rpx 16rpx;
}
.mark-read-btn {
  font-size: 26rpx;
  color: #c93a5a;
  padding: 10rpx 16rpx;
}
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 24rpx;
  position: relative;
}
.notification-item.unread {
  background: #fff;
}
.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6rpx;
  background: #c93a5a;
  border-radius: 3rpx 0 0 3rpx;
}
.item-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  flex-shrink: 0;
}
.item-icon.success {
  background: #e8f5e9;
  color: #4caf50;
}
.item-icon.danger {
  background: #ffebee;
  color: #f44336;
}
.item-icon.warning {
  background: #fff3e0;
  color: #ff9800;
}
.item-icon.default {
  background: #f5f5f5;
  color: #999;
}
.item-content {
  flex: 1;
  min-width: 0;
}
.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.item-title {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
}
.item-time {
  font-size: 22rpx;
  color: #bbb;
}
.item-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.3s ease;
}
.item-desc.expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}
.unread-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #c93a5a;
  flex-shrink: 0;
  margin-top: 8rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 160rpx;
  min-height: 60vh;
}
.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}
.empty-text {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 500;
  margin-bottom: 12rpx;
}
.empty-sub {
  font-size: 24rpx;
  color: #8a94a6;
}
.load-more {
  text-align: center;
  padding: 32rpx 0;
  color: #8a94a6;
  font-size: 24rpx;
}
</style>
