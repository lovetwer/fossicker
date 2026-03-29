<template>
  <view class="disclaimer-page">
    <view class="header">
      <text class="title">免责声明</text>
    </view>
    
    <view class="content card">
      <view class="section">
        <text class="section-title">一、信息来源与真实性</text>
        <text class="section-text">
          1. 本应用（"赛博摸金"）仅作为优惠信息分享平台，所有优惠信息均由用户自行发布。
          
          2. 我们不对用户发布信息的真实性、准确性、完整性、合法性做任何明示或暗示的保证。
          
          3. 优惠信息可能存在时效性，活动规则可能随时变更，请以各平台官方最新规则为准。
          
          4. 建议用户在参与任何优惠活动前，务必前往官方平台核实活动详情。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">二、平台责任限制</text>
        <text class="section-text">
          1. 因使用本应用信息导致的任何损失（包括但不限于财产损失、账号风险等），本平台不承担任何责任。
          
          2. 用户应自行判断优惠信息的可靠性，谨慎参与各类活动。
          
          3. 对于第三方平台的链接跳转，本平台不对其安全性、合法性负责。
          
          4. 如用户发现虚假信息，可通过举报功能反馈，我们将及时处理。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">三、知识产权</text>
        <text class="section-text">
          1. 本应用展示的品牌名称、商标、Logo 等知识产权归 respective 权利人所有。
          
          2. 本平台仅作信息展示用途，不代表与任何品牌存在合作关系。
          
          3. 如权利人认为内容侵权，可联系我方删除。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">四、用户行为规范</text>
        <text class="section-text">
          1. 用户发布信息应遵守法律法规，不得发布虚假、欺诈信息。
          
          2. 禁止利用本平台从事任何违法违规活动。
          
          3. 用户应对自己发布的内容承担全部法律责任。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">五、其他</text>
        <text class="section-text">
          1. 本声明最终解释权归本平台所有。
          
          2. 本平台保留随时修改本声明的权利。
          
          3. 如对本声明有任何疑问，请联系客服。
        </text>
      </view>

      <view class="section">
        <text class="section-title">六、相关协议</text>
        <view class="link-list">
          <text class="link-item" @click="goAgreement">《用户协议》</text>
          <text class="link-item" @click="goPrivacy">《隐私政策》</text>
        </view>
      </view>
    </view>

    <view class="footer">
      <text class="footer-text">最后更新：2026年3月</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DisclaimerPage',
  methods: {
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
.disclaimer-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf8f9 0%, #f8f0f2 100%);
  padding: 24rpx;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1f2937;
}

.content {
  padding: 32rpx;
}

.section {
  margin-bottom: 48rpx;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #c93a5a;
  margin-bottom: 20rpx;
}

.section-text {
  display: block;
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.8;
  white-space: pre-wrap;
}

.footer {
  text-align: center;
  padding: 40rpx 0;
}

.footer-text {
  font-size: 24rpx;
  color: #9ca3af;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.link-item {
  font-size: 28rpx;
  color: #c93a5a;
  text-decoration: underline;
}
</style>
