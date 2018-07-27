// 校验规则
const regGroup = {
    // 'username': /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
    'username': /^(.)+$/,
    'number_id': /^\d+$/,
    'link': /^(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/,
    'wechat_account': /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
    // 'wechat_account': /^(https|http):\/\/mp.weixin.qq.com\/([^\s]+)/,
    'sina_account':  /^$/,
    'meipai_account': /^(https|http):\/\/www.meipai.com\/user\/([^\s]+)/,
    'miaopai_account': /^(https|http):\/\/www.yixia.com\/u\/([^\s]+)/,
    'kuaishou_account': /^(https|http):\/\/((live.kuaishou.com\/profile)|(www.gifshow.com\/s))\/([^\s]+)/,
    'douyin_account': /^(https|http):\/\/((www.douyin.com\/share\/user)|(v.douyin.com))\/([^\s]+)/,
    // 'douyin_account': /^(https|http):\/\/www.douyin.com\/share\/user\/([^\s]+)/,
    'xigua_account': /^(https|http):\/\/m.365yg.com\/video\/app\/user\/home\/\?to_user_id=([^\s]+)/,
    'huoshan_account': /^(https|http):\/\/reflow.huoshan.com\/share\/user\/([^\s]+)/,
    'bilibili_account': /^(https|http):\/\/space.bilibili.com\/([^\s]+)/,
    'xiaohongshu_account': /^(https|http):\/\/www.xiaohongshu.com\/user\/profile\/([^\s]+)/,
    'huajiao_account': /^\d+$/,
    'yingke_account': /^\d+$/,
    'yizhibo_account': /^\d+$/,
    'xiaokaxiu_account': /^\d+$/,
}
// 平台map表
export const platformTypesMap = {
    '9': {
        name: '微信', value: 9, img: '',
        placeholder: `示例：\n周冬雨   zhoudongyu`,
        reg1: regGroup['username'], reg2: regGroup['wechat_account'],
        fetchTips: ``,
        text: "和微信号"
    },
    '1': {
        name: '新浪微博', value: 1, img: '',
        placeholder: `示例：\n周冬雨`,
        reg1: regGroup['username'], reg2: regGroup['sina_account'],
        text: ""
    },
    '25': {
        name: '美拍', value: 25, img: require('../static/img/meipai.png'),
        placeholder: `示例：\n周冬雨    http://www.meipai.com/user/1024690924?client_id=1089857299&utm_medium=qq`,
        reg1: regGroup['username'], reg2: regGroup['meipai_account'],
        fetchTips: `如何获取主页链接`,
        text: "和主页链接"
    },
    '24': {
        name: '秒拍', value: 24, img: require('../static/img/miaopai.png'),
        placeholder: `示例：\n周冬雨    http://www.yixia.com/u/mob_70909080`,
        reg1: regGroup['username'], reg2: regGroup['miaopai_account'],
        fetchTips: `如何获取主页链接`,
        text: "和主页链接"
    },
    '103': {
        name: '快手', value: 103, img: require('../static/img/kuaishou.png'),
        placeholder: `示例：\n周冬雨   http://www.gifshow.com/s/qJIlUR-H \n或 周冬雨 https://live.kuaishou.com/profile/3x9mfduvhvu2ehwi`,
        reg1: regGroup['username'], reg2: regGroup['kuaishou_account'],
        fetchTips: `如何获取主页链接`,
        text: "和主页链接"
    },
    '115': {
        name: '抖音', value: 115, img: require('../static/img/dy.png'),
        placeholder: `示例：\n周冬雨   http://v.douyin.com/7ufpE/`,
        reg1: regGroup['username'], reg2: regGroup['douyin_account'],
        fetchTips: `如何获取主页链接	`,
        text: "和主页链接"
    },
    '118': {
        name: '西瓜视频', value: 118, img: '',
        placeholder: `示例：\n周冬雨   http://m.365yg.com/video/app/user/home/?to_user_id=54535817080&iid=35922525365&device_id=40300194368&format=html&app=video_article`,
        reg1: regGroup['username'], reg2: regGroup['xigua_account'],
        text: "和主页链接",
        fetchTips: '',
    },
    '116': {
        name: '火山小视频', value: 116, img: '',
        placeholder: `示例：\n周冬雨  http://reflow.huoshan.com/share/user/69530797384`,
        reg1: regGroup['username'], reg2: regGroup['huoshan_account'],
        fetchTips: '',
        text: "和主页链接"
    },
    '110': {
        name: '哔哩哔哩动画', value: 110, img: '',
        placeholder: `示例：\n周冬雨   https://space.bilibili.com/101575318/`,
        reg1: regGroup['username'], reg2: regGroup['bilibili_account'],
        fetchTips: ``,
        text: "和主页链接"
    },
    '93': {
        name: '小红书', value: 93, img: require('../static/img/xiaohongshu.png'),
        placeholder: `示例：\n周冬雨   https://www.xiaohongshu.com/user/profile/5a76887311be10434bce5629`,
        reg1: regGroup['username'], reg2: regGroup['xiaohongshu_account'],
        fetchTips: `如何获取主页链接`,
        text: "和主页链接"
    },
    '108': {
        name: '花椒', value: 108, img: require('../static/img/huajiao.png'),
        placeholder: `示例：\n周冬雨 15484`,
        reg1: regGroup['username'], reg2: regGroup['huajiao_account'],
        fetchTips: `	如何获取花椒号`,
        text: "和花椒号"
    },
    '105': {
        name: '映客', value: 105, img: require('../static/img/yingke.png'),
        placeholder: `示例：\n周冬雨 15484`,
        reg1: regGroup['username'], reg2: regGroup['yingke_account'],
        fetchTips: `如何获取映客号`,
        text: "和映客号"
    },
    '106': {
        name: '一直播', value: 106, img: require('../static/img/yizhibo.png'),
        placeholder: `示例：\n周冬雨 15484`,
        reg1: regGroup['username'], reg2: regGroup['yizhibo_account'],
        fetchTips: `如何获取一直播ID`,
        text: "和一直播ID"
    },
    '109': {
        name: '小咖秀', value: 109, img: require('../static/img/xiaokaxiu.png'),
        placeholder: `示例：\n周冬雨 15484`,
        reg1: regGroup['username'], reg2: regGroup['xiaokaxiu_account'],
        fetchTips: `如何获取小咖号`,
        text: "和小咖号"
    }
}
// 所有平台
export const allSelect = Object.keys(platformTypesMap)
// 账号状态
export const accountStatusMap = {
    '1': {id: 1, text: '未入库'},
    '2': {id: 2, text: '已上架'},
    '3': {id: 3, text: '已下架'},
    '4': {id: 4, text: '抓取中'},
    '5': {id: 5, text: '抓取失败'},
}
// 拓号进度
export const progressMap = {
    '1': {id: 1, text: '已联系到自媒体'},
    '2': {id: 2, text: '已沟通需求等待反馈'},
    '3': {id: 3, text: '不合作'},
    '4': {id: 4, text: '未联系上'},
    '5': {id: 5, text: '提供的信息有误，无法拓号'},
}
// 拓号完成状态
export const finishStatusMap = {
    '0': {id: '0', text: '待拓号'},
    '1': {id: 1, text: '拓号终止'},
    '2': {id: 2, text: '拓号完成'},
}
// 区域
export const areaMap = {
    '1': {id: 1, text: '北京'},
    '2': {id: 2, text: '上海'},
    '3': {id: 3, text: '广州'},
    '4': {id: 4, text: '深圳'},
}
// 需求计划
export const requirementPlanMap = {
    '1': {id: 1, text: '已合作拓展'},
    '2': {id: 2, text: '未合作拓展'}
}
// 需求来源
export const sourceMap = {
    '1': {id: 1, text: '客户'},
    '2': {id: 2, text: '自发'}
}
// 历史需求统计数据
export const dashboardMap = {
    'total_commit': {
        name: '历史总提交数',
        count: 0,
        filter: {
            account_name: undefined,
            created_at_end: "",
            created_at_start: "",
            finish_status: undefined,
            launched_before_end: "",
            launched_before_start: "",
            platform: undefined,
            progress_status: undefined,
            requirement_name: undefined,
            status: undefined,
            updated_at: undefined,
        }
    },
    'finished': {
        name: '总完成拓号数',
        count: 0,
        filter: {
            account_name: undefined,
            created_at_end: "",
            created_at_start: "",
            finish_status: '2',
            launched_before_end: "",
            launched_before_start: "",
            platform: undefined,
            progress_status: undefined,
            requirement_name: undefined,
            status: undefined,
            updated_at: undefined,
        }
    },
    'today_finished': {
        name: '今日完成拓号数',
        count: 0,
        filter: {
            account_name: undefined,
            created_at_end: "",
            created_at_start: "",
            finish_status: '2',
            launched_before_end: "",
            launched_before_start: "",
            platform: undefined,
            progress_status: undefined,
            requirement_name: undefined,
            status: undefined,
            updated_at: undefined,
        }
    },
    'unfinished': {
        name: '未完成拓号数',
        count: 0,
        filter: {
            account_name: undefined,
            created_at_end: "",
            created_at_start: "",
            finish_status: 0,
            launched_before_end: "",
            launched_before_start: "",
            platform: undefined,
            progress_status: undefined,
            requirement_name: undefined,
            status: undefined,
            updated_at: undefined,
        }
    },
    'stop_num': {
        name: '终止拓号',
        count: 0,
        filter: {
            account_name: undefined,
            created_at_end: "",
            created_at_start: "",
            finish_status: '1',
            launched_before_end: "",
            launched_before_start: "",
            platform: undefined,
            progress_status: undefined,
            requirement_name: undefined,
            status: undefined,
            updated_at: undefined,
        }
    },

}
// 定向拓号任务统计数据
export const dashboardAccountMap = {
    'totalCount': {
        name: '历史拓号需求总数',
        count: 0,
        filter: {
            account_name: undefined,
            creator: undefined,
            finish_status: undefined,
            launched_before_end_at: undefined,
            launched_before_start_at: undefined,
            requirement_name: undefined,
            requirement_plan: undefined,
            status: undefined,
            weibo_type: undefined,
            updated_start_at: undefined,
            updated_end_at: undefined,
        }
    },
    'finishedCount': {
        name: '总完成拓号数',
        count: 0,
        filter: {
            account_name: undefined,
            creator: undefined,
            finish_status: 2,
            launched_before_end_at: undefined,
            launched_before_start_at: undefined,
            requirement_name: undefined,
            requirement_plan: undefined,
            status: undefined,
            weibo_type: undefined,
            updated_start_at: undefined,
            updated_end_at: undefined,
        }
    },
    'todayFinishedCount': {
        name: '今日完成拓号数',
        count: 0,
        filter: {
            account_name: undefined,
            creator: undefined,
            finish_status: 2,
            launched_before_end_at: undefined,
            launched_before_start_at: undefined,
            requirement_name: undefined,
            requirement_plan: undefined,
            status: undefined,
            weibo_type: undefined,
            updated_start_at: undefined,
            updated_end_at: undefined,
        }
    },
    'unfinishedCount': {
        name: '未完成拓号数',
        count: 0,
        filter: {
            account_name: undefined,
            creator: undefined,
            finish_status: 0,
            launched_before_end_at: undefined,
            launched_before_start_at: undefined,
            requirement_name: undefined,
            requirement_plan: undefined,
            status: undefined,
            weibo_type: undefined,
            updated_start_at: undefined,
            updated_end_at: undefined,
        }
    },
    'stopCount': {
        name: '终止拓号',
        count: 0,
        filter: {
            account_name: undefined,
            creator: undefined,
            finish_status: 1,
            launched_before_end_at: undefined,
            launched_before_start_at: undefined,
            requirement_name: undefined,
            requirement_plan: undefined,
            status: undefined,
            weibo_type: undefined,
            updated_start_at: undefined,
            updated_end_at: undefined,
        }
    },

}
