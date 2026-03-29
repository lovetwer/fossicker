<template>
  <scroll-view class="detail-page" scroll-y>
    <view class="hero card" v-if="deal._id || deal.id">
      <view class="hero-top">
        <view class="hero-tags">
          <text class="platform-tag">{{ deal.platform || '全网' }}</text>
          <text class="category-tag">{{ categoryName }}</text>
          <text class="publish-time">{{ formatTime(deal.publishTime || deal.createTime) || '刚刚发布' }}</text>
        </view>
        <view class="share-btn-wrap" @tap="shareDeal">
          <image class="share-btn" src="/static/share.png" mode="aspectFit" />
        </view>
      </view>

      <text class="detail-title">{{ deal.title }}</text>
      <text class="detail-subtitle">把关键信息先看清，再决定要不要马上冲。</text>

      <view class="summary-grid">
        <view class="summary-card emphasis" v-if="deal.profit !== undefined && deal.profit !== null && deal.profit !== ''">
          <text class="summary-label">预计收益</text>
          <text class="summary-value">+{{ deal.profit }} 元</text>
        </view>
        <view class="summary-card" v-if="deal.expireTime">
          <text class="summary-label">结束倒计时</text>
          <text class="summary-value small">{{ formatCountdown(deal.expireTime) }}</text>
        </view>
      </view>
    </view>

    <view class="content-card card" v-if="deal._id || deal.id">
      <view class="section-head">
        <text class="section-title">玩法说明</text>
        <text class="section-tip">建议先看使用门槛和领取方式</text>
      </view>
      <text class="content-text">{{ deal.content || '发布者还没有补充更多说明。' }}</text>
    </view>

    <view class="images-card card" v-if="deal.images && deal.images.length > 0">
      <view class="section-head">
        <text class="section-title">活动截图</text>
        <text class="section-tip">点击可查看大图</text>
      </view>
      <view class="image-list">
        <image
          v-for="(img, index) in deal.images"
          :key="index"
          :src="img"
          mode="aspectFill"
          class="content-image"
          lazy-load
          @click="previewImage(index)"
        />
      </view>
    </view>

    <view class="link-card card" v-if="deal.link">
      <view class="section-head">
        <text class="section-title">活动链接</text>
        <text class="section-tip">复制后可到浏览器或 App 打开</text>
      </view>
      <view class="link-box" @click="copyLink">
        <text class="link-text">{{ deal.link }}</text>
        <text class="copy-btn">复制</text>
      </view>
    </view>

    <Empty v-if="!loading && !(deal._id || deal.id)" text="这条宝藏暂时无法查看" subText="你可以返回列表刷新后再试。" icon="📭" />
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </scroll-view>
</template>

<script>
import { formatTime, formatCountdown, copyText } from '@/utils/util.js'
import { CATEGORIES } from '@/utils/constant.js'
import { getDealDetail, addDealHot } from '@/api/deal.js'
import Empty from '@/components/empty/empty.vue'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Empty, Toast },
  mixins: [toastMixin],
  data() {
    return {
      dealId: '',
      deal: {},
      loading: false
    }
  },
  computed: {
    categoryKey() {
      return this.deal.categoryId || this.deal.category || this.deal.categoryName || ''
    },
    categoryInfo() {
      return (
        CATEGORIES.find(item => item.id === this.categoryKey || item.name === this.categoryKey) ||
        CATEGORIES.find(item => item.id === 'other')
      )
    },
    categoryName() {
      return this.categoryInfo ? this.categoryInfo.name : '其他'
    },
    categoryEmoji() {
      return this.categoryInfo ? this.categoryInfo.emoji : '🧩'
    }
  },
  onLoad(options) {
    this.dealId = options.id
    this.loadDetail()
  },
  methods: {
    formatTime,
    formatCountdown,
    async loadDetail() {
      this.loading = true
      try {
        const res = await getDealDetail(this.dealId)
        const data = res.data || res || {}
        this.deal = {
          ...data,
          _id: data.id || data._id,
          images: Array.isArray(data.images) ? data.images : []
        }
        // 浏览详情时自动增加热度
        this.addHot()
      } catch (e) {
        this.$toastError('详情加载失败')
      } finally {
        this.loading = false
      }
    },
    // 增加热度
    async addHot() {
      try {
        await addDealHot(this.dealId, 1)
      } catch (e) {
        // 热度增加失败不提示用户，静默处理
        console.log('增加热度失败', e)
      }
    },
    copyLink() {
      copyText(this.deal.link)
    },
    previewImage(index) {
      uni.previewImage({
        current: this.deal.images[index],
        urls: this.deal.images
      })
    },
    // 分享当前页面
    shareDeal() {
      const shareTitle = this.deal.title || '发现了一个宝藏优惠'
      const shareDesc = this.deal.content ? this.deal.content.slice(0, 50) + '...' : '快来看看这个优惠'
      const sharePath = `/pages/detail/detail?id=${this.dealId}`
      const shareUrl = `https://focker.us.ci/#${sharePath}`
      
      // #ifdef APP-PLUS
      uni.share({
        provider: 'weixin',
        title: shareTitle,
        desc: shareDesc,
        type: 0,
        href: shareUrl,
        imageUrl: this.deal.images && this.deal.images.length > 0 ? this.deal.images[0] : '',
        scene: 'WXSceneSession',
        success: () => {
          this.$toastSuccess('分享成功')
        },
        fail: (err) => {
          console.log('分享失败', err)
        }
      })
      // #endif
      
      // #ifdef H5
      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: shareUrl
        }).catch(err => {
          console.log('分享取消', err)
        })
      } else {
        uni.setClipboardData({
          data: shareUrl,
          success: () => {
            this.$toastSuccess('链接已复制')
          }
        })
      }
      // #endif
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 24rpx;
}

.hero,
.content-card,
.images-card,
.link-card {
  margin-bottom: 20rpx;
  padding: 28rpx;
}

.hero-top,
.hero-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.hero-tags {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.share-btn-wrap {
  padding: 8rpx;
}

.share-btn {
  width: 40rpx;
  height: 40rpx;
}

.platform-tag,
.category-tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  font-size: 23rpx;
}

.platform-tag {
  color: #fff;
  background: linear-gradient(135deg, #c93a5a 0%, #d94d71 100%);
}

.category-tag {
  color: #c93a5a;
  font-size: 23rpx;
}

.publish-time {
  font-size: 24rpx;
  color: #94a3b8;
}

.detail-title {
  display: block;
  font-size: 42rpx;
  line-height: 1.35;
  color: #1f2937;
  font-weight: 700;
  margin: 24rpx 0 12rpx;
}

.detail-subtitle {
  display: block;
  font-size: 26rpx;
  line-height: 1.7;
  color: #667085;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 26rpx;
}

.summary-card {
  padding: 22rpx;
  border-radius: 24rpx;
  background: rgba(253, 247, 250, 0.92);
}

.summary-card.emphasis {
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.08) 0%, rgba(244, 183, 196, 0.08) 100%);
}

.summary-label {
  display: block;
  font-size: 24rpx;
  color: #8a94a6;
  margin-bottom: 12rpx;
}

.summary-value {
  display: block;
  font-size: 38rpx;
  color: #8f1f39;
  font-weight: 700;
}

.summary-value.small {
  font-size: 28rpx;
  color: #2f3948;
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

.section-tip {
  font-size: 24rpx;
  color: #8a94a6;
}

.content-text {
  font-size: 29rpx;
  line-height: 1.9;
  color: #374151;
  white-space: pre-wrap;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.content-image {
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  background: #f6efe7;
}

.link-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  border-radius: 22rpx;
  background: rgba(253, 247, 250, 0.92);
}

.link-text {
  flex: 1;
  font-size: 25rpx;
  color: #2563eb;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
  color: #fff;
  font-size: 24rpx;
}
</style>






