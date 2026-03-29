// 常量定义

export const APP_NAME = '薅羊毛情报站'

export const CATEGORIES = [
  { id: 'all', name: '全部', emoji: '✨', description: '所有可用优惠' },
  { id: 'ecommerce', name: '电商', emoji: '🛍', description: '平台大促与下单返利' },
  { id: 'food', name: '外卖', emoji: '🍱', description: '吃喝券包与拼单福利' },
  { id: 'finance', name: '金融', emoji: '💳', description: '支付立减与开卡奖励' },
  { id: 'video', name: '影音', emoji: '🎬', description: '会员充值与内容礼包' },
  { id: 'travel', name: '出行', emoji: '✈️', description: '打车机酒和通勤优惠' },
  { id: 'game', name: '游戏', emoji: '🎮', description: '充值特惠与限时礼包' },
  { id: 'other', name: '其他', emoji: '🧩', description: '值得关注的零散福利' }
]

export const PLATFORMS = {
  ecommerce: ['淘宝', '京东', '拼多多', '抖音', '快手', '苏宁'],
  food: ['美团', '饿了么', '大众点评', '肯德基', '麦当劳'],
  finance: ['支付宝', '微信支付', '云闪付', '招商银行', '工商银行'],
  video: ['爱奇艺', '腾讯视频', '优酷', '哔哩哔哩', '芒果TV', '网易云音乐', 'QQ音乐'],
  travel: ['滴滴', '高德', '携程', '飞猪', '12306'],
  game: ['Steam', 'Epic', '腾讯游戏', '网易游戏'],
  other: ['其他']
}

export const TAG_COLORS = {
  hot: '#c93a5a',
  new: '#2bb673',
  limited: '#ffb347',
  exclusive: '#6c63ff',
  free: '#00a6a6'
}

export const SORT_OPTIONS = [
  { value: 'newest', label: '最新发布' },
  { value: 'hottest', label: '热度优先' },
  { value: 'ending', label: '即将结束' }
]

export const HOT_KEYWORDS = ['京东', '淘宝', '美团', '饿了么', '爱奇艺', '腾讯视频', '会员', '红包']

export const HOT_PLATFORMS = ['淘宝', '京东', '拼多多', '美团', '饿了么', '支付宝', '爱奇艺', '腾讯视频']

export const STATUS_CODE = {
  SUCCESS: 200,
  ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404
}
