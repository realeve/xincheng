let isMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i) ||
    navigator.userAgent.match(/MicroMessenger/i)
  ) {
    return true;
  } else {
    return false;
  }
};

const state = {
  isLoading: false,
  userInfo: {},
  cdnUrl: 'http://cbpc540.applinzi.com/index.php',
  tips: '',
  sport: {
    id: 1,
    name: '',
    orgname: '', // 机构名
    timeRange: '', // 活动时间
    loadWXInfo: true, // 抽奖活动将载入用户个人信息
    uid: 0,
    userName: '',
    cardNo: '',
    isLogin: false,
    maxTimes: 1,
    curTimes: 0,
    testMode: false
  },
  is_teacher: 1,
  paperInit: false,
  peopleCount: 0,
  isPC: !isMobile(),
  refreshInterval: 5 * 1000
};

export default state;
