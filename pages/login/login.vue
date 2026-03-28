<template>
  <view class="login-page">
    <!-- 顶部图标区域 -->
    <view class="logo-section">
      <view class="sheep">
        <!-- 羊毛 -->
        <view class="wool wool-1"></view>
        <view class="wool wool-2"></view>
        <view class="wool wool-3"></view>
        <view class="wool wool-4"></view>
        <view class="wool wool-5"></view>
        <view class="wool wool-6"></view>
        <view class="wool wool-7"></view>
        <!-- 脸 -->
        <view class="face">
          <view class="eye eye-left">
            <view class="pupil"></view>
            <view class="highlight"></view>
          </view>
          <view class="eye eye-right open">
            <view class="pupil"></view>
            <view class="highlight"></view>
          </view>
          <view class="eye eye-right closed"></view>
          <view class="cheek cheek-left"></view>
          <view class="cheek cheek-right"></view>
          <view class="nose"></view>
          <view class="mouth"></view>
        </view>
        <!-- 羊角 -->
        <view class="horn horn-left"></view>
        <view class="horn horn-right"></view>
      </view>
      <text class="app-name">薅羊毛</text>
      <text class="app-slogan">优雅省钱 · 品质生活</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form card">
      <view class="form-header">
        <text class="form-title">欢迎回来</text>
        <text class="form-subtitle">登录后查看你的优惠情报</text>
      </view>

      <button class="primary-btn" @click="deviceLogin" :disabled="loading">
        {{ loading ? '登录中...' : '设备一键登录' }}
      </button>

      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">或</text>
        <view class="divider-line"></view>
      </view>

      <view class="account-form" v-if="showAccountLogin">
        <input 
          v-model="accountForm.username" 
          placeholder="请输入账号" 
          class="account-input"
        />
        <input 
          v-model="accountForm.password" 
          type="password" 
          placeholder="请输入密码" 
          class="account-input"
        />
        <button class="primary-btn account-btn" @click="accountLogin" :disabled="loading">
          {{ loading ? '登录中...' : '立即登录' }}
        </button>
        <view class="other-login" @click="showAccountLogin = false">
          <text class="other-text">收起</text>
        </view>
      </view>

      <view class="other-login" @click="showAccountLogin = true" v-else>
        <text class="other-text">使用账号密码登录</text>
      </view>

      <!-- 协议同意 -->
      <view class="agreement-section">
        <view class="checkbox" :class="{ checked: agreeAgreement }" @click="agreeAgreement = !agreeAgreement">
          <text v-if="agreeAgreement">✓</text>
        </view>
        <view class="agreement-text">
          <text>我已阅读并同意</text>
          <text class="link" @click="goAgreement">《用户协议》</text>
          <text>和</text>
          <text class="link" @click="goPrivacy">《隐私政策》</text>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="bottom-tips">
      <text class="tip-item">• 保存你的发布记录</text>
      <text class="tip-item">• 查看审核与提醒通知</text>
      <text class="tip-item">• 建立自己的优惠情报档案</text>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { login } from '@/api/user.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      loading: false,
      showAccountLogin: false,
      deviceId: '',
      deviceModel: '',
      agreeAgreement: false,
      accountForm: {
        username: '',
        password: ''
      }
    }
  },
  onLoad() {
    this.getDeviceInfo()
  },
  methods: {
    getDeviceInfo() {
      uni.getSystemInfo({
        success: res => {
          this.deviceId = res.deviceId
          this.deviceModel = res.deviceModel
        }
      })
    },
    async deviceLogin() {
      if (!this.agreeAgreement) {
        this.$toastInfo('请先同意用户协议和隐私政策')
        return
      }
      if (!this.deviceId) {
        this.$toastError('获取设备信息失败')
        return
      }
      this.loading = true
      try {
        const res = await login({
          openId: this.deviceId,
          deviceModel: this.deviceModel,
          loginType: 'device'
        })
        if (res.code === 200) {
          this.handleLoginSuccess(res.data)
        } else {
          throw res
        }
      } catch (e) {
        if (e && e.code === 404) {
          uni.navigateTo({ url: `/pages/edit-profile/edit-profile?deviceId=${this.deviceId}&deviceModel=${this.deviceModel}` })
        } else {
          this.$toastError(e && e.message ? e.message : '登录失败')
        }
      } finally {
        this.loading = false
      }
    },
    async accountLogin() {
      if (!this.agreeAgreement) {
        this.$toastInfo('请先同意用户协议和隐私政策')
        return
      }
      if (!this.accountForm.username.trim()) {
        this.$toastInfo('请输入账号')
        return
      }
      if (!this.accountForm.password.trim()) {
        this.$toastInfo('请输入密码')
        return
      }
      this.loading = true
      try {
        const res = await login({
          username: this.accountForm.username,
          password: this.accountForm.password,
          loginType: 'account'
        })
        if (res.code === 200) {
          this.handleLoginSuccess(res.data)
        } else {
          throw res
        }
      } catch (e) {
        this.$toastError(e && e.message ? e.message : '账号或密码错误')
      } finally {
        this.loading = false
      }
    },
    handleLoginSuccess(data) {
      uni.setStorageSync('token', data.token)
      uni.setStorageSync('userInfo', data.user)
      this.$toastSuccess('登录成功')
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 1000)
    },
    goAgreement() {
      uni.navigateTo({ url: '/pages/agreement/agreement' })
    },
    goPrivacy() {
      uni.navigateTo({ url: '/pages/privacy/privacy' })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8e8ea 0%, #f0d0d8 30%, #e8b8c8 70%, #d8a0b0 100%);
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 图标区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

/* 绵羊图标 */
.sheep {
  width: 200rpx;
  height: 200rpx;
  position: relative;
  animation: float 3s ease-in-out infinite;
  margin-bottom: 30rpx;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15rpx); }
}

/* 羊毛 */
.wool {
  position: absolute;
  background: #fff5f0;
  border-radius: 50%;
}

.wool-1 { width: 140rpx; height: 140rpx; left: 30rpx; top: 45rpx; }
.wool-2 { width: 70rpx; height: 70rpx; left: 0; top: 35rpx; }
.wool-3 { width: 70rpx; height: 70rpx; right: 0; top: 35rpx; }
.wool-4 { width: 55rpx; height: 55rpx; left: 0; top: 75rpx; }
.wool-5 { width: 55rpx; height: 55rpx; right: 0; top: 75rpx; }
.wool-6 { width: 55rpx; height: 55rpx; left: 25rpx; top: 10rpx; }
.wool-7 { width: 55rpx; height: 55rpx; right: 25rpx; top: 10rpx; }

/* 脸 */
.face {
  position: absolute;
  width: 90rpx;
  height: 100rpx;
  background: #fff8f5;
  border-radius: 50%;
  left: 55rpx;
  top: 65rpx;
  z-index: 2;
}

/* 眼睛 */
.eye {
  position: absolute;
  width: 20rpx;
  height: 24rpx;
  background: #8b3850;
  border-radius: 50%;
  top: 32rpx;
}

.eye-left { left: 18rpx; }
.eye-right { right: 18rpx; }

.pupil {
  position: absolute;
  width: 8rpx;
  height: 10rpx;
  background: #fff;
  border-radius: 50%;
  top: 3rpx;
  left: 3rpx;
}

.highlight {
  position: absolute;
  width: 5rpx;
  height: 5rpx;
  background: #fff;
  border-radius: 50%;
  top: 6rpx;
  right: 5rpx;
}

/* 眨眼动画 */
.eye-right.open {
  animation: blink-open 3s ease-in-out infinite;
}

.eye-right.closed {
  background: transparent;
  border: none;
  height: 5rpx;
  top: 40rpx;
  border-top: 5rpx solid #8b3850;
  border-radius: 0;
  animation: blink-closed 3s ease-in-out infinite;
}

.eye-right.closed .pupil,
.eye-right.closed .highlight {
  display: none;
}

@keyframes blink-open {
  0%, 40%, 60%, 100% { opacity: 1; }
  45%, 55% { opacity: 0; }
}

@keyframes blink-closed {
  0%, 40%, 60%, 100% { opacity: 0; }
  45%, 55% { opacity: 1; }
}

/* 腮红 */
.cheek {
  position: absolute;
  width: 22rpx;
  height: 12rpx;
  background: #e8b8a0;
  border-radius: 50%;
  top: 55rpx;
  opacity: 0.6;
}

.cheek-left { left: 8rpx; }
.cheek-right { right: 8rpx; }

/* 鼻子 */
.nose {
  position: absolute;
  width: 16rpx;
  height: 11rpx;
  background: #d4a090;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: 60rpx;
}

/* 嘴巴 */
.mouth {
  position: absolute;
  width: 32rpx;
  height: 16rpx;
  left: 50%;
  transform: translateX(-50%);
  top: 75rpx;
  border: 3rpx solid #d4a090;
  border-top: none;
  border-radius: 0 0 32rpx 32rpx;
  background: #ffb0b0;
}

/* 羊角 */
.horn {
  position: absolute;
  width: 24rpx;
  height: 48rpx;
  border: 6rpx solid #e8c0a8;
  border-radius: 50%;
  top: 0;
}

.horn-left {
  left: 22rpx;
  border-right: none;
  transform: rotate(-30deg);
}

.horn-right {
  right: 22rpx;
  border-left: none;
  transform: rotate(30deg);
}

/* 应用名称 */
.app-name {
  font-size: 48rpx;
  font-weight: 800;
  color: #8b3850;
  margin-bottom: 12rpx;
}

.app-slogan {
  font-size: 26rpx;
  color: #a86078;
}

/* 登录表单 */
.login-form {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.form-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.form-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
  display: block;
  margin-bottom: 12rpx;
}

.form-subtitle {
  font-size: 26rpx;
  color: #6b7280;
}

.primary-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 8rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 80rpx;
  text-align: center;
  border: none;
  padding: 0;
}

.primary-btn[disabled] {
  opacity: 0.6;
}

.btn-icon {
  font-size: 32rpx;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 30rpx 0;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #e5e7eb;
}

.divider-text {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 账号密码表单 */
.account-form {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.account-input {
  width: 100%;
  height: 80rpx;
  background: #f9fafb;
  border: 1rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.account-btn {
  margin-top: 10rpx;
}

/* 其他登录方式 */
.other-login {
  text-align: center;
  padding: 20rpx 0;
}

.other-text {
  color: #6b7280;
  font-size: 28rpx;
}

/* 底部提示 */
.bottom-tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.tip-item {
  font-size: 24rpx;
  color: #8b5a6b;
}

.agreement-section {
  display: flex;
  align-items: flex-start;
  margin-top: 32rpx;
  padding: 0 20rpx;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #c93a5a;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.checkbox.checked {
  background: #c93a5a;
  color: #fff;
}

.checkbox text {
  font-size: 24rpx;
}

.agreement-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}

.agreement-text .link {
  color: #c93a5a;
}
</style>
