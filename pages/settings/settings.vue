<template>
  <view class="settings-page">
    <view class="section card">
      <view class="section-title">账户设置</view>
      <view class="menu-list">
        <view class="menu-item" @click="goChangePassword">
          <text class="menu-text">修改密码</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goChangeNickname">
          <text class="menu-text">修改昵称</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="section card" v-if="isAdmin">
      <view class="section-title">系统管理</view>
      <view class="menu-list">
        <view class="menu-item" @click="goVersionManage">
          <text class="menu-text">版本管理</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="section card">
      <view class="section-title">帮助与反馈</view>
      <view class="menu-list">
        <view class="menu-item" @click="goFeedback">
          <text class="menu-text">意见反馈</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="section card">
      <view class="section-title">通用设置</view>
      <view class="menu-list">
        <view class="menu-item" @click="clearCache">
          <text class="menu-text">清除缓存</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="checkUpdate" v-if="!isH5">
          <text class="menu-text">检查更新</text>
          <view class="menu-right">
            <text class="version-text">v{{ version }}</text>
            <text class="menu-arrow">›</text>
          </view>
        </view>
        <view class="menu-item" v-else @click="goDownloadApp">
          <text class="menu-text">下载 App</text>
          <view class="menu-right">
            <text class="download-tip">获取更多功能</text>
            <text class="menu-arrow">›</text>
          </view>
        </view>
        <view class="menu-item" @click="goDisclaimer">
          <text class="menu-text">免责声明</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goAbout">
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>

    <view class="bottom-tip">赛博摸金 v{{ version }}</view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
  </view>
</template>

<script>
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import toastMixin from '@/mixins/toast.js'
import { checkVersionUpdate, getVersionList, getLatestVersion } from '@/api/version.js'

export default {
  components: { Toast, Modal },
  mixins: [toastMixin],
  data() {
    return {
      version: '1.0.0',
      cacheSize: '0 KB'
    }
  },
  computed: {
    isAdmin() {
      const userInfo = uni.getStorageSync('userInfo') || {}
      return userInfo.role === 'admin' || userInfo.isAdmin === true
    },
    isH5() {
      return uni.getSystemInfoSync().platform === 'h5' || typeof plus === 'undefined'
    }
  },
  onLoad() {
    this.loadVersion()
    this.calculateCacheSize()
  },
  methods: {
    loadVersion() {
      try {
        const versionInfo = uni.getStorageSync('appVersion')
        if (versionInfo && versionInfo.versionName) {
          this.version = versionInfo.versionName
        } else {
          this.version = '1.0.0'
        }
      } catch (e) {
        console.log('读取版本失败', e)
        this.version = '1.0.0'
      }
    },
    goChangePassword() {
      uni.navigateTo({ url: '/pages/change-password/change-password' })
    },
    goChangeNickname() {
      uni.navigateTo({ url: '/pages/change-nickname/change-nickname' })
    },
    goFeedback() {
      uni.navigateTo({ url: '/pages/feedback/feedback' })
    },
    goVersionManage() {
      uni.navigateTo({ url: '/pages/admin-version/admin-version' })
    },
    async goDownloadApp() {
      uni.showLoading({ title: '获取中...' })
      try {
        const platform = uni.getSystemInfoSync().platform.toLowerCase()
        const res = await getVersionList({
          platform: platform === 'android' ? 'android' : 'ios',
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
    calculateCacheSize() {
      try {
        const info = uni.getStorageInfoSync()
        const sizeKB = info.currentSize
        if (sizeKB > 1024) {
          this.cacheSize = (sizeKB / 1024).toFixed(1) + ' MB'
        } else {
          this.cacheSize = sizeKB + ' KB'
        }
      } catch (e) {
        this.cacheSize = '未知'
      }
    },
    async clearCache() {
      const res = await this.$modal({
        title: '清除缓存',
        content: '确定要清除所有缓存吗？'
      })
      if (res.confirm) {
        uni.clearStorageSync()
        this.calculateCacheSize()
        this.$toastSuccess('缓存已清除')
      }
    },
    goDisclaimer() {
      uni.navigateTo({ url: '/pages/disclaimer/disclaimer' })
    },
    goAbout() {
      this.$modal({
        title: '关于我们',
        content: '赛博摸金 - 在数字世界中探寻宝藏！\n\n版本：' + this.version,
        showCancel: false
      })
    },
    async checkUpdate() {
      uni.showLoading({ title: '检查中...' })
      try {
        const platform = uni.getSystemInfoSync().platform.toLowerCase()
        // 获取云端最新版本
        const res = await getLatestVersion({
          platform: platform === 'android' ? 'android' : 'ios'
        })
        uni.hideLoading()
        if (res.code === 200 && res.data) {
          const latestVersion = res.data
          const cloudVersion = latestVersion.versionName || '1.0.0'
          // 对比本地版本和云端版本
          const compareResult = this.compareVersion(cloudVersion, this.version)
          if (compareResult > 0) {
            // 云端版本更新
            const confirmResult = await this.$modal({
              title: '发现新版本 v' + cloudVersion,
              content: latestVersion.updateContent || '有新版本可以更新！\n\n是否立即下载？',
              confirmText: '立即更新',
              cancelText: '稍后'
            })
            if (confirmResult.confirm && latestVersion.downloadUrl) {
              const downloadUrl = latestVersion.downloadUrl
              const isApp = uni.getSystemInfoSync().platform === 'android' || uni.getSystemInfoSync().platform === 'ios'
              if (isApp) {
                plus.runtime.openURL(downloadUrl)
              } else {
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
            }
          } else {
            this.$toastSuccess('已是最新版本')
          }
        } else {
          this.$toastSuccess('已是最新版本')
        }
      } catch (e) {
        uni.hideLoading()
        this.$toastSuccess('已是最新版本')
      }
    },
    compareVersion(v1, v2) {
      const parseV = (v) => v.split('.').map(s => parseInt(s) || 0)
      const arr1 = parseV(v1)
      const arr2 = parseV(v2)
      for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        const n1 = arr1[i] || 0
        const n2 = arr2[i] || 0
        if (n1 > n2) return 1
        if (n1 < n2) return -1
      }
      return 0
    },
    async handleLogout() {
      const res = await this.$modal({
        title: '退出登录',
        content: '确定要退出当前账号吗？'
      })
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('currentUser')
        uni.removeStorageSync('userInfo')
        uni.redirectTo({ url: '/pages/index/index' })
        this.$toastSuccess('已退出登录')
      }
    }
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f5f5;
}

.section {
  margin-bottom: 24rpx;
  padding: 24rpx;
}

.section-title {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.cache-size,
.version-text,
.download-tip {
  font-size: 24rpx;
  color: #c93a5a;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.logout-section {
  margin-top: 60rpx;
  padding: 0 24rpx;
}

.logout-btn {
  height: 88rpx;
  border-radius: 12rpx;
  background: #fff;
  border: 2rpx solid #ddd;
  color: #666;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-tip {
  text-align: center;
  font-size: 22rpx;
  color: #ccc;
  margin-top: 60rpx;
  padding-bottom: 40rpx;
}
</style>
