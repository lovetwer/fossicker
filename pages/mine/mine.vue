<template>
  <view class="mine-page">
    <view class="hero">
      <view class="hero-bg">
        <view class="decoration circle-1"></view>
        <view class="decoration circle-2"></view>
        <view class="decoration circle-3"></view>
      </view>
      <view class="hero-content">
        <view class="avatar-ring" @click="goLogin">
          <view class="avatar-circle">
            <image v-if="!isLogin" src="/static/app-icon.svg" mode="aspectFit" class="sheep-icon"></image>
            <text v-else>{{ userInitial }}</text>
          </view>
        </view>
        <view class="user-info" v-if="isLogin">
          <text class="user-name">{{ displayName }}</text>
          <text class="user-level">LV{{ level }} · 省钱行动派</text>
        </view>
        <view class="user-info" v-else @click="goLogin">
          <text class="user-name">点击登录</text>
          <text class="user-level">同步你的发布、收藏和消息提醒</text>
        </view>
      </view>
      <text class="setting-btn" @click="goSetting">设置</text>
    </view>

    <view class="menu-list card">
      <view class="menu-item" @click="goMyDeals">
        <view>
          <text class="menu-title">我的发布</text>
          <text class="menu-subtitle">回看你发现的所有宝藏</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goHistory">
        <view>
          <text class="menu-title">浏览历史</text>
          <text class="menu-subtitle">你最近看过哪些福利</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goMessages">
        <view>
          <text class="menu-title">消息通知</text>
        </view>
        <view class="trailing">
          <text class="badge" v-if="unreadCount > 0">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="menu-list card" v-if="isAdmin">
      <view class="menu-item" @click="goAudit">
        <view>
          <text class="menu-title">审核管理</text>
          <text class="menu-subtitle">快速处理待审核宝藏</text>
        </view>
        <view class="trailing">
          <text class="badge warm" v-if="auditCount > 0">{{ auditCount }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="menu-list card">
      <view class="menu-item" @click="goAbout">
        <view>
          <text class="menu-title">关于我们</text>
          <text class="menu-subtitle">看看这款应用的初衷和版本信息</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goFeedback">
        <view>
          <text class="menu-title">意见反馈</text>
          <text class="menu-subtitle">告诉我们你还想加什么功能</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- #ifdef H5 -->
    <!-- 下载 App 按钮 -->
    <view class="download-section" @click="goDownloadApp">
      <view class="download-left">
        <view class="download-icon-box">
          <image src="/static/app-icon.svg" mode="aspectFit" class="download-icon-img"></image>
        </view>
        <view class="download-info">
          <text class="download-title">下载赛博摸金 App</text>
          <text class="download-subtitle">更流畅的体验 · 更多功能</text>
        </view>
      </view>
      <text class="download-link">去下载 ›</text>
    </view>
    <!-- #endif -->

    <view class="logout-btn card" v-if="isLogin" @click="logout">
      <text>退出登录</text>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
    
    <!-- 自定义 TabBar -->
    <custom-tabbar :current="2"></custom-tabbar>
  </view>
</template>

<script>
import { getUserInfo, getUnreadCount, getMyDeals } from '@/api/user.js'
import { getVersionList } from '@/api/version.js'
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast, Modal, CustomTabbar },
  mixins: [toastMixin],
  data() {
    return {
      isLogin: false,
      userInfo: {},
      unreadCount: 0,
      auditCount: 0
    }
  },
  computed: {
    isAdmin() {
      return this.userInfo.role === 'admin' || this.userInfo.isAdmin === true
    },
    displayName() {
      if (this.userInfo.nickname) return this.userInfo.nickname
      const id = this.userInfo._id || this.userInfo.id || ''
      return id ? `用户${String(id).slice(-6)}` : '摸金校尉'
    },
    userInitial() {
      return this.isLogin && this.displayName ? this.displayName.slice(0, 1) : '绵'
    },
    approvedCount() {
      return this.userInfo.approvedCount || this.userInfo.publishCount || 0
    },
    level() {
      // 发布多少条就是LV几，最低LV1
      const count = this.approvedCount
      return Math.max(1, count)
    }
  },
  onShow() {
    this.checkLogin()
    this.loadUnreadCount()
  },
  methods: {
    checkLogin() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      if (token && userInfo) {
        this.isLogin = true
        this.userInfo = userInfo
        this.loadUserInfo()
      } else {
        this.isLogin = false
        this.userInfo = {}
      }
    },
    async loadUserInfo() {
      try {
        const res = await getUserInfo()
        this.userInfo = res.data || res
        // 获取发布数量
        await this.loadPublishCount()
        uni.setStorageSync('userInfo', this.userInfo)
      } catch (e) {
        // 获取用户信息失败
      }
    },
    async loadPublishCount() {
      try {
        const res = await getMyDeals({ page: 0, size: 1000 })
        // 从响应中获取列表长度
        let list = []
        if (res.data && Array.isArray(res.data.content)) {
          list = res.data.content
        } else if (res.data && Array.isArray(res.data.list)) {
          list = res.data.list
        } else if (Array.isArray(res.data)) {
          list = res.data
        }
        const total = list.length
        this.userInfo = { ...this.userInfo, approvedCount: total }
      } catch (e) {
        // 获取发布数量失败
      }
    },
    async loadUnreadCount() {
      try {
        const res = await getUnreadCount()
        // 兼容多种返回格式
        if (res.code === 200) {
          this.unreadCount = res.data?.unreadCount ?? res.data?.count ?? res.unreadCount ?? res.count ?? 0
        } else {
          this.unreadCount = res.unreadCount ?? res.count ?? 0
        }
      } catch (e) {
        // 获取未读数量失败
      }
    },
    goLogin() {
      if (!this.isLogin) {
        uni.navigateTo({ url: '/pages/login/login' })
      }
    },
    goSetting() {
      uni.navigateTo({ url: '/pages/settings/settings' })
    },
    goMyDeals() {
      if (!this.checkAuth()) return
      uni.navigateTo({ url: '/pages/my-deals/my-deals' })
    },
    goHistory() {
      if (!this.checkAuth()) return
      uni.navigateTo({ url: '/pages/history/history' })
    },
    goMessages() {
      uni.navigateTo({ url: '/pages/messages/messages' })
    },
    goAbout() {
      this.$modal({
        title: '关于赛博摸金',
        content: '赛博摸金 v1.0.0\n\n在数字世界中探寻宝藏，让每一次点击都有价值。',
        showCancel: false
      })
    },
    goFeedback() {
      uni.navigateTo({ url: '/pages/feedback/feedback' })
    },
    async goDownloadApp() {
      uni.showLoading({ title: '获取中...' })
      try {
        const platform = uni.getSystemInfoSync().platform.toLowerCase()
        // H5环境下默认使用android平台
        const platformType = platform === 'android' ? 'android' : (platform === 'ios' ? 'ios' : 'android')
        const res = await getVersionList({
          platform: platformType,
          status: 1
        })
        uni.hideLoading()
        if (res.code === 200 && res.data && res.data.length > 0) {
          const latestVersion = res.data[0]
          const downloadUrl = latestVersion.downloadUrl
          if (downloadUrl) {
            const confirmResult = await this.$modal({
              title: '下载 App',
              content: '发现版本 v' + latestVersion.versionName + '\n\n点击确定复制下载链接',
              confirmText: '复制链接',
              showCancel: false
            })
            if (confirmResult.confirm) {
              uni.setClipboardData({
                data: downloadUrl,
                success: () => {
                  this.$toastSuccess('下载链接已复制，请前往浏览器打开')
                },
                fail: () => {
                  this.$toastInfo('下载链接：' + downloadUrl)
                }
              })
            }
          } else {
            this.$toastError('暂无下载链接')
          }
        } else {
          this.$toastError('暂无可用版本')
        }
      } catch (e) {
        uni.hideLoading()
        this.$toastError('获取失败')
      }
    },
    goAudit() {
      uni.navigateTo({ url: '/pages/audit/audit' })
    },
    async checkAuth() {
      if (!this.isLogin) {
        const res = await this.$modal({
          title: '需要先登录',
          content: '登录后才能查看个人内容，是否现在去登录？'
        })
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
        return false
      }
      return true
    },
    async logout() {
      const res = await this.$modal({
        title: '确认退出',
        content: '退出后将清除当前账号的本地登录状态。'
      })
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        this.isLogin = false
        this.userInfo = {}
        this.$toastSuccess('已退出登录')
      }
    }
  }
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
}
.hero,
.menu-list,
.logout-btn {
  margin-bottom: 20rpx;
}
.hero {
  padding: 40rpx 32rpx 36rpx;
  border-radius: 32rpx;
  background: linear-gradient(145deg, #fff5f7 0%, #faf0f3 100%);
  position: relative;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.decoration {
  position: absolute;
  border-radius: 50%;
}
.circle-1 {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.15) 0%, rgba(201, 58, 90, 0.05) 100%);
  top: -80rpx;
  right: -60rpx;
}
.circle-2 {
  width: 150rpx;
  height: 150rpx;
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.12) 0%, rgba(201, 58, 90, 0.03) 100%);
  bottom: -50rpx;
  left: -40rpx;
}
.circle-3 {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.2) 0%, rgba(201, 58, 90, 0.08) 100%);
  top: 50%;
  right: 20%;
}
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  position: relative;
  z-index: 1;
}
.avatar-ring {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #c93a5a 0%, #e66584 100%);
  padding: 6rpx;
  box-shadow: 0 12rpx 40rpx rgba(201, 58, 90, 0.25);
}
.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  color: #c93a5a;
  font-size: 44rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sheep-icon {
  width: 80%;
  height: 80%;
}
.user-info {
  text-align: center;
}
.user-name {
  display: block;
  font-size: 36rpx;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 8rpx;
}
.user-level {
  display: block;
  font-size: 24rpx;
  color: #7b8594;
}
.setting-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  color: #999;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8rpx);
  z-index: 10;
}
.menu-list {
  padding: 6rpx 0;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 26rpx 28rpx;
  border-bottom: 1rpx solid rgba(31, 41, 55, 0.06);
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-title {
  display: block;
  font-size: 29rpx;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.unread-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #c93a5a;
  box-shadow: 0 0 8rpx rgba(201, 58, 90, 0.5);
}
.menu-subtitle {
  display: block;
  font-size: 23rpx;
  color: #8a94a6;
}
.trailing {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.badge {
  min-width: 40rpx;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #c93a5a;
  color: #fff;
  text-align: center;
  font-size: 22rpx;
}
.badge.warm {
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
}
.menu-arrow {
  font-size: 34rpx;
  color: #c2c8d2;
}

/* 下载 App */
.download-section {
  margin: 24rpx 24rpx 32rpx;
  padding: 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f0f0f0;
}
.download-left {
  display: flex;
  align-items: center;
}
.download-icon-box {
  width: 72rpx;
  height: 72rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.download-icon-img {
  width: 48rpx;
  height: 48rpx;
}
.download-info {
  display: flex;
  flex-direction: column;
}
.download-title {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 6rpx;
}
.download-subtitle {
  font-size: 24rpx;
  color: #9ca3af;
}
.download-link {
  font-size: 28rpx;
  color: #c93a5a;
  font-weight: 500;
}

.logout-btn {
  padding: 28rpx;
  text-align: center;
}
.logout-btn text {
  font-size: 30rpx;
  color: #8f1f39;
  font-weight: 600;
}
</style>






