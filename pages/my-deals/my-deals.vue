<template>
  <view class="my-deals-page">
    <view class="hero card">
      <text class="hero-title">我的发布</text>
      <text class="hero-subtitle">这里收纳了你发现的每一处宝藏，方便你回看和复盘。</text>
    </view>

    <view class="deal-list" v-if="deals.length > 0">
      <DealCard v-for="deal in deals" :key="deal._id || deal.id" :deal="deal" />
    </view>
    <view class="empty-state" v-else>
      <text class="empty-text">你还没有发布过宝藏</text>
      <text class="empty-sub">把刚发现的优惠整理一下发出来，很快这里就会丰富起来。</text>
    </view>
  </view>
</template>

<script>
import DealCard from '@/components/deal-card/deal-card.vue'
import Empty from '@/components/empty/empty.vue'
import { getMyDeals } from '@/api/user.js'

export default {
  components: { DealCard, Empty },
  data() {
    return {
      deals: [],
      page: 1,
      pageSize: 10,
      loading: false,
      hasMore: true
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    normalizeList(res) {
      if (res.data && Array.isArray(res.data.content)) return res.data.content
      if (res.data && Array.isArray(res.data.list)) return res.data.list
      if (Array.isArray(res.data)) return res.data
      return []
    },
    async loadData() {
      if (this.loading) return
      this.loading = true
      try {
        const res = await getMyDeals({ page: this.page, pageSize: this.pageSize })
        const list = this.normalizeList(res)
        if (this.page === 1) {
          this.deals = list
        } else {
          this.deals = [...this.deals, ...list]
        }
        this.hasMore = list.length === this.pageSize
      } catch (e) {
        this.deals = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.my-deals-page {
  min-height: 100vh;
  padding: 24rpx;
}
.hero {
  margin-bottom: 20rpx;
  padding: 28rpx;
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
.deal-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding-bottom: 40rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  min-height: 60vh;
}
.empty-text {
  font-size: 30rpx;
  color: #1f2937;
  margin-bottom: 16rpx;
  text-align: center;
}
.empty-sub {
  font-size: 26rpx;
  color: #8a94a6;
  text-align: center;
  padding: 0 60rpx;
  line-height: 1.6;
}
</style>
