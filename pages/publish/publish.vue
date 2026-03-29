<template>
  <view class="publish-page">
    <scroll-view class="form-scroll" scroll-y>
      <view class="form-container card">
        <view class="section-head">
          <view class="paint-visual" aria-hidden="true">
            <view class="paint-shadow"></view>
            <view class="paint-handle"></view>
            <view class="paint-ring"></view>
            <view class="paint-ferrule"></view>
            <view class="paint-tip"></view>
            <view class="paint-drop drop-main"></view>
            <view class="paint-drop drop-small"></view>
          </view>
          <text class="section-title">基础信息</text>
          <text class="section-tip">先把能快速判断价值的信息补完整。</text>
        </view>

        <view class="form-item">
          <view class="label-row">
            <text class="label">标题</text>
            <text class="required">*</text>
          </view>
          <input
            v-model="form.title"
            placeholder="例如：京东 PLUS 年卡限时返 25 元红包"
            class="input"
            maxlength="50"
          />
        </view>

        <view class="form-item">
          <view class="label-row">
            <text class="label">平台</text>
            <text class="required">*</text>
          </view>
          <input
            v-model="form.platform"
            placeholder="例如：淘宝、京东、美团、支付宝"
            class="input"
          />
        </view>

        <view class="form-item">
          <view class="label-row">
            <text class="label">分类</text>
            <text class="required">*</text>
          </view>
          <picker mode="selector" :range="categories" range-key="name" :value="categoryIndex" @change="onCategoryChange">
            <view class="picker-wrapper">
              <text :class="['picker-text', form.categoryId ? 'active' : '']">
                {{ selectedCategoryName || '选择分类，帮助大家更快找到' }}
              </text>
              <text class="arrow">选择</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">预计收益</text>
          <view class="profit-input-wrapper">
            <text class="profit-symbol">+</text>
            <input
              v-model="form.profit"
              type="digit"
              placeholder="0.00"
              class="input profit-input"
            />
            <text class="profit-unit">元</text>
          </view>
        </view>

        <view class="form-item">
          <text class="label">活动链接</text>
          <input
            v-model="form.link"
            placeholder="https://..."
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="label">过期时间</text>
          <picker mode="date" :value="form.expireDate" @change="onDateChange">
            <view class="picker-wrapper">
              <text :class="['picker-text', form.expireDate ? 'active' : '']">
                {{ form.expireDate || '选择结束日期，方便大家安排领取顺序' }}
              </text>
              <text class="arrow">选择</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="form-container card">
        <view class="section-head">
          <text class="section-title">详细说明</text>
          <text class="section-tip">建议写清领取步骤、使用门槛和注意事项。</text>
        </view>

        <view class="form-item no-gap">
          <textarea
            v-model="form.content"
            placeholder="示例：1. 先领券；2. 再下单；3. 叠加会员红包后预计实付 xx 元。"
            class="textarea"
            maxlength="500"
          />
          <text class="word-count">{{ form.content.length }}/500</text>
        </view>

        <view class="form-item no-gap">
          <text class="label">活动截图</text>
          <view class="image-list">
            <view
              v-for="(img, index) in form.images"
              :key="index"
              class="image-item"
            >
              <image :src="img" mode="aspectFill" class="uploaded-img" />
              <text class="delete-btn" @click="deleteImage(index)">×</text>
            </view>
            <view class="upload-btn" @click="chooseImage" v-if="form.images.length < 6">
              <text class="plus">+</text>
              <text class="upload-tip">上传截图 {{ form.images.length }}/6</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-space"></view>
    </scroll-view>

    <view class="submit-section">
      <button class="submit-btn" @click="submit" :disabled="submitting">
        {{ submitting ? '正在发布...' : '发布这条宝藏' }}
      </button>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
    
    <!-- 自定义 Modal -->
    <modal ref="modal"></modal>
  </view>
</template>

<script>
import { publishDeal, getCategories } from '@/api/deal.js'
import { uploadImage } from '@/api/upload.js'
import Toast from '@/components/toast/toast.vue'
import Modal from '@/components/modal/modal.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast, Modal },
  mixins: [toastMixin],
  data() {
    return {
      submitting: false,
      categories: [],
      categoryIndex: -1,
      form: {
        title: '',
        platform: '',
        categoryId: '',
        profit: '',
        link: '',
        expireDate: '',
        content: '',
        images: []
      }
    }
  },
  computed: {
    selectedCategoryName() {
      if (this.categoryIndex >= 0 && this.categories[this.categoryIndex]) {
        return this.categories[this.categoryIndex].name
      }
      return ''
    }
  },
  onLoad() {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategories()
        // 閫傞厤鍚庣杩斿洖鏍煎紡
        if (res.data && Array.isArray(res.data)) {
          this.categories = res.data
        } else if (Array.isArray(res)) {
          this.categories = res
        }
      } catch (e) {
        console.error('获取分类失败', e)
      }
    },
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
      this.form.categoryId = this.categories[this.categoryIndex]?.id || ''
    },
    onDateChange(e) {
      this.form.expireDate = e.detail.value
    },
    chooseImage() {
      uni.chooseImage({
        count: 6 - this.form.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async res => {
          // 涓婁紶鍥剧墖鍒版湇鍔″櫒
          uni.showLoading({ title: '上传中...' })
          try {
            const uploadPromises = res.tempFilePaths.map(path => uploadImage(path))
            const results = await Promise.all(uploadPromises)
            console.log('涓婁紶缁撴灉:', results)
            // 閫傞厤鍚庣杩斿洖鏍煎紡: { code: 200, message: '...', data: '鍥剧墖URL' }
            const imageUrls = results.map(r => {
              if (r.code === 200 && r.data) {
                return r.data
              }
              return null
            }).filter(url => url)
            console.log('鍥剧墖URLs:', imageUrls)
            this.form.images = [...this.form.images, ...imageUrls]
          } catch (e) {
            console.error('上传失败:', e)
            this.$toastError('上传失败')
          } finally {
            uni.hideLoading()
          }
        }
      })
    },
    deleteImage(index) {
      this.form.images.splice(index, 1)
    },
    validate() {
      if (!this.form.title.trim()) {
        this.$toastInfo('请输入标题')
        return false
      }
      if (!this.form.platform.trim()) {
        this.$toastInfo('请输入平台')
        return false
      }
      if (!this.form.categoryId) {
        this.$toastInfo('请选择分类')
        return false
      }
      if (!this.form.content.trim()) {
        this.$toastInfo('请补充详细说明')
        return false
      }
      return true
    },
    async submit() {
      if (!this.validate()) return

      const token = uni.getStorageSync('token')
      if (!token) {
        const res = await this.$modal({
          title: '需要先登录',
          content: '登录后才可以发布宝藏，是否现在去登录？'
        })
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
        return
      }

      this.submitting = true

      try {
        // 获取选中的分类名称
        const selectedCategory = this.categories[this.categoryIndex]
        const categoryName = selectedCategory ? selectedCategory.name : ''

        const data = {
          ...this.form,
          categoryName: categoryName,
          profit: parseFloat(this.form.profit) || 0,
          expireTime: this.form.expireDate ? new Date(this.form.expireDate).toISOString() : null
        }

        await publishDeal(data)

        this.$toastSuccess('发布成功')
        this.form = {
          title: '',
          platform: '',
          categoryId: '',
          profit: '',
          expireDate: '',
          content: '',
          images: []
        }
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1200)
      } catch (e) {
        this.$toastError('发布失败，请稍后再试')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.publish-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24rpx;
}

.form-scroll {
  flex: 1;
}

.form-container {
  margin-bottom: 20rpx;
  padding: 28rpx;
}

.section-tip {
  display: block;
  font-size: 25rpx;
  color: #7b8594;
  line-height: 1.7;
}

.section-head {
  position: relative;
  margin-bottom: 24rpx;
  padding-right: 164rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.paint-visual {
  position: absolute;
  top: -8rpx;
  right: 0;
  width: 150rpx;
  height: 92rpx;
  pointer-events: none;
}

.paint-shadow {
  position: absolute;
  left: 18rpx;
  right: 12rpx;
  bottom: 4rpx;
  height: 18rpx;
  border-radius: 999rpx;
  background: radial-gradient(circle at center, rgba(201, 58, 90, 0.16) 0%, rgba(201, 58, 90, 0) 72%);
  filter: blur(6rpx);
}

.paint-handle {
  position: absolute;
  right: 30rpx;
  top: 12rpx;
  width: 82rpx;
  height: 18rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #ffcad6 0%, #f08ca4 45%, #c93a5a 100%);
  transform: rotate(-28deg);
  box-shadow: 0 10rpx 20rpx rgba(107, 26, 48, 0.14);
}

.paint-ring {
  position: absolute;
  right: 58rpx;
  top: 26rpx;
  width: 10rpx;
  height: 22rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.7);
  transform: rotate(-28deg);
}

.paint-ferrule {
  position: absolute;
  right: 18rpx;
  top: 34rpx;
  width: 20rpx;
  height: 16rpx;
  border-radius: 6rpx;
  background: linear-gradient(180deg, #ffd7e1 0%, #f2a1b5 100%);
  transform: rotate(-28deg);
}

.paint-tip {
  position: absolute;
  right: 2rpx;
  top: 44rpx;
  width: 0;
  height: 0;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 24rpx solid #7f2d3f;
  transform: rotate(-28deg);
}

.paint-drop {
  position: absolute;
  border-radius: 50%;
}

.drop-main {
  right: 40rpx;
  top: 52rpx;
  width: 16rpx;
  height: 16rpx;
  background: rgba(201, 58, 90, 0.16);
}

.drop-small {
  right: 22rpx;
  top: 20rpx;
  width: 8rpx;
  height: 8rpx;
  background: rgba(240, 140, 164, 0.55);
}

.form-item {
  margin-bottom: 26rpx;
}

.form-item.no-gap {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 27rpx;
  color: #2f3948;
  font-weight: 600;
  margin-bottom: 14rpx;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-bottom: 14rpx;
}

.label-row .label {
  margin-bottom: 0;
}

.required {
  color: #c93a5a;
}

.input,
.picker-wrapper,
.textarea,
.profit-input-wrapper {
  background: rgba(253, 247, 250, 0.96);
  border: 1rpx solid rgba(31, 41, 55, 0.05);
  border-radius: 22rpx;
}

.input,
.picker-wrapper,
.profit-input-wrapper {
  height: 92rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.picker-wrapper,
.profit-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-text {
  font-size: 26rpx;
  color: #9aa3af;
}

.picker-text.active {
  color: #2f3948;
}

.arrow {
  font-size: 24rpx;
  color: #c93a5a;
}

.profit-symbol {
  color: #c93a5a;
  font-size: 34rpx;
  font-weight: 700;
  margin-right: 8rpx;
}

.profit-input {
  flex: 1;
  background: transparent;
  height: 100%;
}

.profit-unit {
  color: #667085;
  font-size: 26rpx;
}

.textarea {
  width: 100%;
  min-height: 280rpx;
  padding: 24rpx;
  font-size: 28rpx;
  line-height: 1.7;
}

.word-count {
  display: block;
  text-align: right;
  margin-top: 12rpx;
  color: #8a94a6;
  font-size: 24rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
}

.image-item,
.upload-btn {
  width: calc((100% - 36rpx) / 3);
  height: 210rpx;
  border-radius: 22rpx;
}

.image-item {
  position: relative;
}

.uploaded-img {
  width: 100%;
  height: 100%;
  border-radius: 22rpx;
}

.delete-btn {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  background: rgba(31, 41, 55, 0.75);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed rgba(201, 58, 90, 0.14);
  background: rgba(252, 244, 247, 0.96);
}

.plus {
  font-size: 52rpx;
  color: #c93a5a;
  line-height: 1;
}

.upload-tip {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #8a94a6;
}

.bottom-space {
  height: 60rpx;
}

.submit-section {
  padding: 18rpx 0 120rpx;
}

.submit-btn {
  height: 80rpx;
  border-radius: 16rpx;
  background: #fff;
  border: 2rpx solid #c93a5a;
  color: #c93a5a;
  font-size: 26rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn[disabled] {
  opacity: 0.7;
}
</style>








