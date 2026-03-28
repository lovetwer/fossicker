<template>
  <view class="change-page">
    <view class="form-section card">
      <view class="form-item">
        <text class="form-label">原密码</text>
        <input
          v-model="oldPassword"
          type="password"
          placeholder="请输入原密码"
          class="form-input"
        />
      </view>
      <view class="form-item">
        <text class="form-label">新密码</text>
        <input
          v-model="newPassword"
          type="password"
          placeholder="请输入新密码"
          class="form-input"
        />
      </view>
      <view class="form-item">
        <text class="form-label">确认密码</text>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          class="form-input"
        />
      </view>
    </view>

    <view class="submit-section">
      <button class="submit-btn" @click="handleChangePassword" :disabled="submitting">
        {{ submitting ? '修改中...' : '确认修改' }}
      </button>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { putWithQuery } from '@/api/request.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      submitting: false
    }
  },
  methods: {
    async handleChangePassword() {
      if (!this.oldPassword) {
        this.$toastInfo('请输入原密码')
        return
      }
      if (!this.newPassword) {
        this.$toastInfo('请输入新密码')
        return
      }
      if (this.newPassword.length < 6) {
        this.$toastInfo('新密码至少6位')
        return
      }
      if (this.newPassword !== this.confirmPassword) {
        this.$toastInfo('两次密码不一致')
        return
      }

      this.submitting = true
      try {
        const res = await putWithQuery('/user/password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })

        if (res.code === 200) {
          this.$toastSuccess('密码修改成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          this.$toastError(res.message || '修改失败')
        }
      } catch (e) {
        this.$toastError('修改失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.change-page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f5f5;
}

.form-section {
  padding: 24rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.form-input {
  height: 88rpx;
  padding: 0 24rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.submit-section {
  margin-top: 48rpx;
  padding: 0 24rpx;
}

.submit-btn {
  height: 88rpx;
  border-radius: 12rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn[disabled] {
  opacity: 0.7;
}
</style>
