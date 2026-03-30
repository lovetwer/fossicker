<template>
  <view class="audit-page">
    <view class="hero card">
      <text class="hero-title">审核工作台</text>
      <text class="hero-subtitle">把待处理内容集中在一个清晰的队列里，降低判断成本。</text>
    </view>

    <view class="tab-bar card">
      <view v-for="tab in tabs" :key="tab.value" class="tab-item" :class="{ active: currentTab === tab.value }" @click="switchTab(tab.value)">
        {{ tab.label }}
        <text class="tab-badge" v-if="tab.count > 0">{{ tab.count }}</text>
      </view>
    </view>

    <scroll-view class="audit-list" scroll-y @scrolltolower="loadMore" :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="deal-item card" v-for="deal in auditList" :key="deal.id || deal._id">
        <view class="deal-header">
          <text class="platform-tag">{{ deal.platform || '全网' }}</text>
          <text class="status-tag" :class="deal.status">{{ getStatusText(deal.status) }}</text>
        </view>

        <text class="deal-title">{{ deal.title }}</text>

        <view class="deal-content" v-if="deal.content">
          {{ deal.content.substring(0, 100) }}{{ deal.content.length > 100 ? '...' : '' }}
        </view>

        <!-- 图片展示 -->
        <view class="deal-images" v-if="deal.images && deal.images.length > 0">
          <image
            v-for="(img, index) in deal.images"
            :key="index"
            :src="img"
            mode="aspectFill"
            class="deal-image"
            lazy-load
            @click="previewImage(deal.images, index)"
          />
        </view>
        <!-- 调试信息 -->
        <view v-else style="font-size: 20rpx; color: #999; margin-bottom: 16rpx;">
          无图片数据: {{ JSON.stringify(deal.images) }}
        </view>

        <view class="deal-profit" v-if="deal.profit">
          <text class="profit-label">预计收益</text>
          <text class="profit-value">+{{ deal.profit }} 元</text>
        </view>

        <view class="deal-info">
          <text class="publish-time">{{ formatTime(deal.createTime || deal.publishTime) }}</text>
          <text class="publisher">发布者 {{ deal.publisherName || deal.userId || '未知' }}</text>
        </view>

        <view class="action-bar" v-if="deal.status === 0 || deal.status === 'pending'">
          <button class="btn-reject" @click="handleReject(deal)">驳回</button>
          <button class="btn-approve" @click="handleApprove(deal)">通过</button>
        </view>
        <view class="action-bar" v-else-if="deal.status === 1 || deal.status === 'approved'">
          <button class="btn-reject" @click="handleOffline(deal)">下架</button>
        </view>
      </view>

      <Empty v-if="auditList.length === 0 && !loading" :text="emptyText" subText="当前状态下还没有需要处理的内容。" icon="🧾" />

      <view class="load-more" v-if="auditList.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="!hasMore">没有更多内容了</text>
        <text v-else>继续下滑查看更多</text>
      </view>
    </scroll-view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
  </view>
</template>

<script>
import Empty from '@/components/empty/empty.vue'
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import toastMixin from '@/mixins/toast.js'
import { formatTime } from '@/utils/util.js'
import { getPendingDeals, approveDeal, rejectDeal, offlineDeal, getDealList } from '@/api/deal.js'

export default {
  components: { Empty, Toast, Modal },
  mixins: [toastMixin],
  data() {
    return {
      tabs: [
        { label: '待审核', value: 'pending', count: 0 },
        { label: '已通过', value: 'approved', count: 0 },
        { label: '已驳回/已下架', value: 'rejected', count: 0 }
      ],
      currentTab: 'pending',
      auditList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      refreshing: false,
      hasMore: true
    }
  },
  computed: {
    emptyText() {
      const texts = { pending: '没有待审核内容', approved: '还没有通过的记录', rejected: '还没有驳回或下架的记录' }
      return texts[this.currentTab]
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    formatTime,
    getStatusText(status) {
      const texts = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
      return texts[status] || status
    },
    normalizeList(res) {
      if (res.data && Array.isArray(res.data.content)) return res.data.content
      if (res.data && Array.isArray(res.data.list)) return res.data.list
      if (Array.isArray(res.data)) return res.data
      return []
    },
    switchTab(tab) {
      if (this.currentTab === tab) return
      this.currentTab = tab
      this.page = 1
      this.auditList = []
      this.loadData()
    },
    async loadData() {
      if (this.loading) return
      this.loading = true
      try {
        let res
        if (this.currentTab === 'pending') {
          res = await getPendingDeals({ page: this.page - 1, pageSize: this.pageSize })
        } else {
          res = await getDealList({ status: this.currentTab === 'approved' ? 1 : 2, page: this.page - 1, pageSize: this.pageSize })
        }
        let list = this.normalizeList(res)
        // 不再覆盖后端返回的status，使用后端真实状态
        // 0=待审核, 1=已通过, 2=已驳回/已下架
        if (this.page === 1) {
          this.auditList = list
        } else {
          this.auditList = [...this.auditList, ...list]
        }
        this.hasMore = list.length === this.pageSize
      } catch (e) {
        this.$toastError('加载失败')
      } finally {
        this.loading = false
        this.refreshing = false
      }
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
    async handleApprove(deal) {
      const res = await this.$modal({
        title: '确认通过',
        content: '确认通过这条发布吗？'
      })
      if (res.confirm) {
        try {
          await approveDeal(deal.id || deal._id)
          this.$toastSuccess('已通过')
          this.onRefresh()
        } catch (e) {
          this.$toastError('操作失败')
        }
      }
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: images[current]
      })
    },
    async handleOffline(deal) {
      const res = await this.$modal({
        title: '确认下架',
        content: '确定要下架这条发布吗？下架后将移动到已驳回列表。'
      })
      if (res.confirm) {
        try {
          await offlineDeal(deal.id || deal._id)
          this.$toastSuccess('已下架')
          this.onRefresh()
        } catch (e) {
          this.$toastError('操作失败')
        }
      }
    },
    async handleReject(deal) {
      const res = await this.$modal({
        title: '确认驳回',
        content: '确认驳回这条发布吗？'
      })
      if (res.confirm) {
        try {
          await rejectDeal(deal.id || deal._id)
          this.$toastSuccess('已驳回')
          this.onRefresh()
        } catch (e) {
          this.$toastError('操作失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.audit-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 0;
  gap: 20rpx;
}
.hero,
.tab-bar {
  padding: 24rpx;
}
.hero-title {
  display: block;
  font-size: 38rpx;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 10rpx;
}
.hero-subtitle {
  display: block;
  font-size: 25rpx;
  color: #7b8594;
  line-height: 1.7;
}
.tab-bar {
  display: flex;
  gap: 12rpx;
}
.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 18rpx 0;
  border-radius: 999rpx;
  color: #667085;
  background: rgba(253, 247, 250, 0.84);
  font-size: 25rpx;
}
.tab-item.active {
  color: #fff;
  background: #1f2937;
}
.tab-badge {
  min-width: 34rpx;
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  text-align: center;
  font-size: 20rpx;
}
.audit-list {
  flex: 1;
}
.deal-item {
  margin-bottom: 18rpx;
  padding: 24rpx;
}
.deal-header,
.deal-info,
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.deal-header {
  margin-bottom: 18rpx;
}
.platform-tag,
.status-tag {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}
.platform-tag {
  color: #fff;
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
}
.status-tag.pending {
  background: rgba(255, 188, 77, 0.18);
  color: #a15c00;
}
.status-tag.approved {
  background: rgba(43, 182, 115, 0.16);
  color: #1c7a4c;
}
.status-tag.rejected {
  background: rgba(201, 58, 90, 0.08);
  color: #b43e35;
}
.deal-title {
  display: block;
  font-size: 31rpx;
  color: #1f2937;
  line-height: 1.45;
  font-weight: 700;
  margin-bottom: 14rpx;
}
.deal-content {
  font-size: 26rpx;
  color: #667085;
  line-height: 1.7;
  margin-bottom: 16rpx;
}
.deal-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.deal-image {
  width: calc((100% - 24rpx) / 3);
  height: 180rpx;
  border-radius: 16rpx;
  background: #f5f5f5;
}
.deal-profit {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  padding: 18rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.06) 0%, rgba(244, 183, 196, 0.08) 100%);
  margin-bottom: 16rpx;
}
.profit-label {
  font-size: 24rpx;
  color: #8f1f39;
}
.profit-value {
  font-size: 33rpx;
  color: #8f1f39;
  font-weight: 700;
}
.deal-info {
  margin-bottom: 18rpx;
  font-size: 23rpx;
  color: #8a94a6;
}
.action-bar {
  gap: 16rpx;
}
.btn-reject,
.btn-approve {
  flex: 1;
  height: 72rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
}
.btn-reject {
  background: #fff;
  border: 2rpx solid #ddd;
  color: #666;
}
.btn-approve {
  background: #fff;
  border: 2rpx solid #c93a5a;
  color: #c93a5a;
}
.load-more {
  text-align: center;
  padding: 24rpx 0 36rpx;
  color: #8a94a6;
  font-size: 24rpx;
}
</style>







