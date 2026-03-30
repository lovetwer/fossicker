<template>
  <view class="history-page">
    <view class="header">
      <text class="title">浏览历史</text>
      <text class="clear-btn" @click="handleClear" v-if="historyList.length > 0">清空</text>
    </view>

    <view class="history-list" v-if="historyList.length > 0">
      <view
        class="history-item card"
        v-for="item in historyList"
        :key="item.id"
        @click="goDetail(item.dealId)"
      >
        <view class="item-content">
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-platform">{{ item.platform }}</text>
          </view>
          <view class="item-meta">
            <text class="item-profit" v-if="item.profit">赚 {{ item.profit }}</text>
            <text class="item-time">{{ formatTime(item.browseTime) }}</text>
          </view>
        </view>
        <view class="item-image" v-if="item.images && item.images.length > 0">
          <image :src="item.images[0]" mode="aspectFill" lazy-load></image>
        </view>
        <text class="delete-btn" @click.stop="handleDelete(item.dealId)">删除</text>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-text">暂无浏览记录</text>
      <text class="empty-sub">去看看有什么优惠吧</text>
    </view>

    <view class="load-more" v-if="hasMore && historyList.length > 0" @click="loadMore">
      <text>{{ loading ? '加载中...' : '加载更多' }}</text>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
  </view>
</template>

<script>
import { getHistory, deleteHistory, clearHistory } from '@/api/user.js'
import Empty from '@/components/empty/empty.vue'
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Empty, Toast, Modal },
  mixins: [toastMixin],
  data() {
    return {
      historyList: [],
      page: 0,
      size: 10,
      hasMore: false,
      loading: false
    }
  },
  onLoad() {
    this.loadHistory()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore()
    }
  },
  methods: {
    async loadHistory() {
      this.loading = true
      try {
        const res = await getHistory({ page: this.page, size: this.size })
        if (res.code === 200) {
          const data = res.data || res
          this.historyList = data.content || []
          this.hasMore = (data.page || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        // 获取浏览历史失败
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      if (this.loading || !this.hasMore) return
      this.page++
      this.loading = true
      try {
        const res = await getHistory({ page: this.page, size: this.size })
        if (res.code === 200) {
          const data = res.data || res
          this.historyList = [...this.historyList, ...(data.content || [])]
          this.hasMore = (data.page || 0) < (data.totalPages - 1)
        }
      } catch (e) {
        this.page--
        // 加载更多失败
      } finally {
        this.loading = false
      }
    },
    async handleDelete(dealId) {
      const res = await this.$modal({
        title: '删除记录',
        content: '确定要删除这条浏览记录吗？'
      })
      if (res.confirm) {
        try {
          await deleteHistory(dealId)
          this.historyList = this.historyList.filter(item => item.dealId !== dealId)
          this.$toastSuccess('已删除')
        } catch (e) {
          this.$toastError('删除失败')
        }
      }
    },
    async handleClear() {
      const res = await this.$modal({
        title: '清空历史',
        content: '确定要清空所有浏览记录吗？'
      })
      if (res.confirm) {
        try {
          await clearHistory()
          this.historyList = []
          this.$toastSuccess('已清空')
        } catch (e) {
          this.$toastError('清空失败')
        }
      }
    },
    goDetail(dealId) {
      uni.navigateTo({ url: `/pages/detail/detail?id=${dealId}` })
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
.history-page {
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
.clear-btn {
  font-size: 26rpx;
  color: #c93a5a;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  position: relative;
}
.item-content {
  flex: 1;
  min-width: 0;
}
.item-info {
  margin-bottom: 12rpx;
}
.item-title {
  display: block;
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-platform {
  display: block;
  font-size: 22rpx;
  color: #8a94a6;
  margin-top: 4rpx;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.item-profit {
  font-size: 24rpx;
  color: #c93a5a;
  font-weight: 500;
}
.item-time {
  font-size: 22rpx;
  color: #bbb;
}
.item-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  overflow: hidden;
  flex-shrink: 0;
}
.item-image image {
  width: 100%;
  height: 100%;
}
.delete-btn {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  font-size: 22rpx;
  color: #bbb;
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
