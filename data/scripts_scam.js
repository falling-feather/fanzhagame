// data/scripts_scam.js

DB.contacts["scammer_job"] = { name: "招聘-琳琳", avatar: ASSETS.scam_job, type: "single", day: 3, initMsg: "兼职结算通知" };
DB.contacts["scammer_service"] = { name: "京东售后", avatar: ASSETS.service, type: "single", day: 5, initMsg: "理赔通知" };
DB.contacts["campus_loan"] = { name: "校园金融", avatar: ASSETS.loan, type: "single", day: 6, initMsg: "免息备用金" };

Object.assign(DB.scripts, {
    // === 刷单 (Day 3) ===
    "scammer_job_day3": {
        "start": { text: "亲，您好~ 我是星辉传媒的琳琳。看您在兼职群里，想利用假期赚点零花钱吗？", next: "j1" },
        "j1": { options: [{ text: "什么兼职？", next: "j2" }, { text: "不感兴趣", isEnd: true }] },
        "j2": { text: "给抖音网红点赞，增加人气。一单3块，立结。完全免费，不需要押金。您可以试一单。", next: "j3" },
        "j3": { options: [{ text: "试试", next: "j4" }] },
        "j4": { text: "请搜索抖音号 883921，给置顶视频点赞，截图发我。", next: "j5" },
        "j5": { options: [{ text: "[发送截图]", next: "j6" }] },
        "j6": { text: "收到！请发支付宝账号，立马给您结算。", next: "j7" },
        "j7": { options: [{ text: "138xxxx8888", action: "get_3", next: "j8" }] }, // 真的加钱
        "j8": { text: "转过去了，您查收一下。亲，现在我们有冲量活动，佣金提高到30%。垫付100返130，名额有限。", next: "j9" },
        "j9": { 
            options: [
                { text: "刚才真的到账了，试个100的？", next: "j_trap_1" },
                { text: "要垫付？那是骗子", next: "j_safe" }
            ]
        },
        "j_safe": { text: "亲，只有100块，我们大公司不会骗您的。试一次如果不返现您报警。", next: "j_final_decide" },
        "j_final_decide": {
            options: [
                { text: "行吧，就一次", next: "j_trap_1" },
                { text: "滚", isEnd: true }
            ]
        },
        "j_trap_1": { text: "好的，请转账到财务账户：6228xxxx。备注您的名字。", next: "j_pay_100" },
        "j_pay_100": { options: [{ text: "已转账 100", cost: 100, next: "j_trap_big" }] },
        "j_trap_big": { text: "收到。系统显示您是幸运用户，触发了连单任务！必须做完3单才能提现。当前第1单已完成，请补单500元，返利800。", next: "j_pay_500" },
        "j_pay_500": {
            options: [
                { text: "怎么还要补单？退钱！", next: "j_refuse" },
                { text: "好，为了拿回本金(支付500)", cost: 500, next: "j_lost" }
            ]
        },
        "j_refuse": { text: "亲，系统锁定的，必须做完才能解锁。不做的话100就没了哦。", isEnd: true },
        "j_lost": { text: "(对方已将你拉黑)", isEnd: true }
    },

    // === 客服 (Day 5) ===
    "scammer_service_day5": {
        "start": { text: "您好，这里是京东物流。您购买的国庆大礼包在运输途中发生车祸损毁。", next: "s1" },
        "s1": { options: [{ text: "啊？那怎么办？", next: "s2" }] },
        "s2": { text: "我们现在对您进行双倍理赔，共200元。请下载‘全视通’APP，打开屏幕共享，我教您在后台领取。", next: "s3" },
        "s3": { 
            options: [
                { text: "好的，已下载(极度危险)", cost: 2000, next: "s_bad" },
                { text: "理赔直接退支付宝就行，为什么要APP？", next: "s_smart" }
            ]
        },
        "s_bad": { text: "【系统警告】验证码泄露，您的银行卡被盗刷 2000 元！", isEnd: true },
        "s_smart": { text: "嘟..嘟..嘟.. (对方挂断)", isEnd: true }
    },

    // === 贷款 (Day 6) ===
    "campus_loan_day6": {
        "start": { text: "同学你好，大学生专属备用金，无视征信，秒下款。借5000还5100，随借随还。", next: "l1" },
        "l1": { options: [{ text: "不需要", isEnd: true }, { text: "怎么借？", next: "l2" }] },
        "l2": { text: "只需要提供身份证正反面和手持身份证照片。另外为了风控，需要您的通讯录授权。", next: "l3" },
        "l3": { options: [{ text: "那算了，太可怕了", isEnd: true }] }
    }
});