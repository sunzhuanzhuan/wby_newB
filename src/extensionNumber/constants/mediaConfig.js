// 校验规则
const regGroup = {
    // 'username': /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
    'username': /^(.)+$/,
    'number_id': /^\d+$/,
    'link': /^(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/,
    'wechat_account': /^(https|http):\/\/mp.weixin.qq.com\/mp\/getmasssendmsg\?__biz=([^\s]+)/,
    'sina_account': /^(https|http):\/\/((m.weibo.cn\/u)|(weibo.com))\/([^\s]+)/,
    'meipai_account': /^(https|http):\/\/www.meipai.com\/user\/([^\s]+)/,
    'miaopai_account': /^(https|http):\/\/www.yixia.com\/u\/([^\s]+)/,
    'kuaishou_account': /^(https|http):\/\/live.kuaishou.com\/profile\/([^\s]+)/,
    'douyin_account': /^(https|http):\/\/www.douyin.com\/share\/user\/([^\s]+)/,
    'xigua_account': /^(https|http):\/\/m.365yg.com\/video\/app\/user\/home\/\?to_user_id=([^\s]+)/,
    'huoshan_account': /^(https|http):\/\/reflow.huoshan.com\/share\/user\/([^\s]+)/,
    'bilibili_account': /^(https|http):\/\/space.bilibili.com\/([^\s]+)/,
    'xiaohongshu_account': /^(https|http):\/\/www.xiaohongshu.com\/user\/profile\/([^\s]+)/,
    'huajiao_account': /^(https|http):\/\/www.huajiao.com\/user\/([^\s]+)/,
    'yingke_account': /^\d+$/,
    'yizhibo_account': /^(https|http):\/\/www.yizhibo.com\/member\/personel\/user_info\?memberid=([^\s]+)/,
    'xiaokaxiu_account': /^(https|http):\/\/v.xiaokaxiu.com\/u\/([^\s]+)/,
}
export const platformTypesMap = {
    '0': {
        name: '微信', value: 0, img: '',
        placeholder: `示例：\n乔布堂   http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MjgzMTAwODI0MA%3D%3D&wx_header=1`,
        reg1: regGroup['username'], reg2: regGroup['wechat_account'],
    },
    '1': {
        name: '新浪微博', value: 1, img: '',
        placeholder: `示例：\n范冰冰   https://m.weibo.cn/u/3952070245`,
        reg1: regGroup['username'], reg2: regGroup['sina_account'],
    },
    '2': {
        name: '美拍', value: 2, img: require('../static/img/meipai.png'),
        placeholder: `示例：\n李秋泽CZ   http://www.meipai.com/user/63844184`,
        reg1: regGroup['username'], reg2: regGroup['meipai_account'],
    },
    '3': {
        name: '秒拍', value: 3, img: require('../static/img/miaopai.png'),
        placeholder: `示例：\nLorem周   https://www.yixia.com/u/mob_53580412`,
        reg1: regGroup['username'], reg2: regGroup['miaopai_account'],
    },
    '4': {
        name: '快手', value: 4, img: require('../static/img/kuaishou.png'),
        placeholder: `示例：\n林家妞儿   https://live.kuaishou.com/profile/1XPaCXnlajP7IZBW_hFEO_Tw`,
        reg1: regGroup['username'], reg2: regGroup['kuaishou_account'],
    },
    '5': {
        name: '抖音', value: 5, img: require('../static/img/dy.png'),
        placeholder: `示例：\nChiang   https://www.douyin.com/share/user/74684277013`,
        reg1: regGroup['username'], reg2: regGroup['douyin_account'],
    },
    '6': {
        name: '西瓜', value: 6, img: '',
        placeholder: `示例：\n老刘短视频   http://m.365yg.com/video/app/user/home/?to_user_id=51931729823`,
        reg1: regGroup['username'], reg2: regGroup['xigua_account'],
    },
    '7': {
        name: '火山', value: 7, img: '',
        placeholder: `示例：\n祢是我的独家记忆_   http://reflow.huoshan.com/share/user/69530797384`,
        reg1: regGroup['username'], reg2: regGroup['huoshan_account'],
    },
    '8': {
        name: 'B站', value: 8, img: '',
        placeholder: `示例：\n一碗榴莲酱   https://space.bilibili.com/274859381/#/`,
        reg1: regGroup['username'], reg2: regGroup['bilibili_account'],
    },
    '9': {
        name: '小红书', value: 9, img: '',
        placeholder: `示例：\nKouoeul C.   http://www.xiaohongshu.com/user/profile/58288c3e50c4b4713b4db90c`,
        reg1: regGroup['username'], reg2: regGroup['xiaohongshu_account'],
    },
    '10': {
        name: '花椒', value: 10, img: require('../static/img/huajiao.png'),
        placeholder: `示例：\n万能胶   http://www.huajiao.com/user/90639987`,
        reg1: regGroup['username'], reg2: regGroup['huajiao_account'],
    },
    '11': {
        name: '映客', value: 11, img: require('../static/img/yingke.png'),
        placeholder: `示例：\n老马   64074372`,
        reg1: regGroup['username'], reg2: regGroup['yingke_account'],
    },
    '12': {
        name: '一直播', value: 12, img: require('../static/img/yizhibo.png'),
        placeholder: `示例：\n月亮   https://www.yizhibo.com/member/personel/user_info?memberid=289866060`,
        reg1: regGroup['username'], reg2: regGroup['yizhibo_account'],
    },
    '13': {
        name: '小咖秀', value: 13, img: require('../static/img/xiaokaxiu.png'),
        placeholder: `示例：\n蒙谦皓   https://v.xiaokaxiu.com/u/261329111.html`,
        reg1: regGroup['username'], reg2: regGroup['xiaokaxiu_account'],
    }
}

export const allReadios = {
    '0': {
        name: '已联系到自媒体', value: 0,
    },
    '1': {
        name: '已告知需求等待反馈', value: 1,
    },
    '2': {
        name: '未联系上', value: 2,
    },
    '3': {
        name: '不合作', value: 3,
    },
}

export const allSelect = Object.keys(platformTypesMap);
export const allReadio = Object.keys(allReadios)
export default { platformTypesMap, allSelect, allReadio, allReadios }
/*
wjmeipai201ev.xundameng.com:8097/dashboard.action
wjmeipai201703 081 //dev .xundameng.com:8097/dashboard.action
wjmeipai201703081518   http://dev.xundameng.com:8097/dashboard.action
wjmeipai201703081518   http://dev.xundameng.com:8097/dashboard.action
wjmeipai201 703081518 http://dev.xundameng.com:8097/dashboard.action
 http://dev.xundameng.com:8097/dashboard.action
*/

