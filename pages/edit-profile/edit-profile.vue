<template>
  <view class="edit-profile-page">
    <view class="hero card">
      <text class="hero-title">首次登录，先完成你的情报站身份</text>
      <text class="hero-subtitle">昵称只支持英文和数字，方便我们避免特殊字符带来的兼容问题。</text>
    </view>

    <view class="form-container card">
      <view class="form-item">
        <text class="label">昵称 <text class="required">*</text></text>
        <view class="nickname-row">
          <input v-model="form.nickname" placeholder="请输入昵称（英文和数字）" class="input" maxlength="20" @input="onNicknameInput" />
          <text class="random-btn" @click="randomNickname">换一个</text>
        </view>
      </view>

      <view class="form-item">
        <text class="label">密码 <text class="required">*</text></text>
        <input v-model="form.password" type="password" placeholder="请设置密码（至少 6 位）" class="input" maxlength="20" />
      </view>

      <view class="form-item">
        <text class="label">确认密码 <text class="required">*</text></text>
        <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" class="input" maxlength="20" />
      </view>
    </view>

    <view class="submit-bar">
      <button class="submit-btn" @click="submit" :disabled="submitting">
        {{ submitting ? '注册中...' : '完成注册' }}
      </button>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { register } from '@/api/user.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      deviceId: '',
      deviceModel: '',
      submitting: false,
      form: {
        nickname: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  onLoad(options) {
    this.deviceId = options.deviceId
    this.deviceModel = options.deviceModel
    this.generateDefaultNickname()
  },
  methods: {
    generateDefaultNickname() {
      const cleanModel = this.deviceModel ? this.deviceModel.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) : 'Device'
      const timestamp = Date.now().toString().slice(-6)
      this.form.nickname = cleanModel + timestamp
    },
    randomNickname() {
      const cleanModel = this.deviceModel ? this.deviceModel.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) : 'Device'
      const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
      this.form.nickname = cleanModel + randomNum
    },
    onNicknameInput(e) {
      const value = e.detail.value
      const filtered = value.replace(/[^a-zA-Z0-9]/g, '')
      if (value !== filtered) this.form.nickname = filtered
    },
    async submit() {
      if (!this.form.nickname.trim()) {
        this.$toastInfo('请输入昵称')
        return
      }
      if (!/^[a-zA-Z0-9]+$/.test(this.form.nickname)) {
        this.$toastInfo('昵称只能包含英文和数字')
        return
      }
      if (!this.form.password.trim()) {
        this.$toastInfo('请设置密码')
        return
      }
      if (this.form.password.length < 6) {
        this.$toastInfo('密码至少 6 位')
        return
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.$toastInfo('两次输入的密码不一致')
        return
      }

      this.submitting = true
      try {
        const res = await register({
          openId: this.deviceId,
          nickname: this.form.nickname,
          password: this.form.password,
          deviceModel: this.deviceModel
        })
        uni.setStorageSync('token', res.data.token)
        uni.setStorageSync('userInfo', res.data.user)
        this.$toastSuccess('注册成功')
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } catch (e) {
        if (e.code === 409) {
          this.$toastError('昵称已被使用')
        } else {
          this.$toastError('注册失败，请稍后再试')
        }
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.edit-profile-page {
  min-height: 100vh;
  padding: 24rpx 24rpx 160rpx;
}
.hero,
.form-container {
  margin-bottom: 20rpx;
  padding: 28rpx;
}
.hero-title {
  display: block;
  font-size: 38rpx;
  color: #1f2937;
  font-weight: 700;
  line-height: 1.35;
  margin-bottom: 12rpx;
}
.hero-subtitle {
  display: block;
  font-size: 25rpx;
  color: #7b8594;
  line-height: 1.7;
}
.form-item {
  margin-bottom: 24rpx;
}
.form-item:last-child {
  margin-bottom: 0;
}
.label {
  display: block;
  font-size: 27rpx;
  color: #2f3948;
  font-weight: 600;
  margin-bottom: 14rpx;
}
.required {
  color: #c93a5a;
}
.nickname-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.input {
  flex: 1;
  height: 92rpx;
  border-radius: 22rpx;
  background: rgba(253, 247, 250, 0.96);
  padding: 0 24rpx;
  font-size: 28rpx;
}
.random-btn {
  padding: 0 20rpx;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22rpx;
  background: rgba(253, 240, 245, 0.95);
  color: #8f1f39;
  font-size: 24rpx;
  white-space: nowrap;
}
.submit-bar {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 24rpx;
}
.submit-btn {
  height: 96rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  box-shadow: 0 18rpx 34rpx rgba(201, 58, 90, 0.1);
}
.submit-btn[disabled] {
  opacity: 0.72;
}
</style>






