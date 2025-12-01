// data/scripts_group.js

// 注册联系人
DB.contacts["class_group"] = { 
    name: "24软工一班学生小群", 
    avatar: ASSETS.group_icon, 
    type: "group", 
    day: 1, 
    initMsg: "[群消息] 班长: 国庆假期安全提醒" 
};

// 辅助刷屏函数
function getSpam() {
    return [
        { sender: "npc1", text: "老板大气！" }, { sender: "npc2", text: "谢谢老板" },
        { sender: "reze", text: "好人一生平安" }, { sender: "line", text: "收到" },
        { sender: "tong", text: "谢谢木哥~" }, { sender: "ben", text: "1" }
    ];
}

// 剧本注入
Object.assign(DB.scripts, {
    "class_group_day1": {
        "start": {
            sequence: [
                { sender: "monitor", text: "@所有人 国庆假条都批下来了。离校的同学记得锁门关窗，注意用电安全。" },
                { sender: "monitor", text: "另外最近学校周边有推销办卡的，大家长个心眼，别被骗了。" },
                { sender: "lin", text: "收到。班长，国庆有啥活动不？" },
                { sender: "monitor", text: "没有，大家各回各家。发个红包祝大家节日快乐。" },
                { sender: "monitor", type: "red_packet", amount: 10, text: "节日快乐" }
            ],
            next: "op_grab"
        },
        "op_grab": { options: [{ text: "抢红包", action: "grab_small", next: "roast" }] },
        "roast": {
            autoMe: "谢谢班长",
            sequence: [
                { sender: "lin", text: "就这？0.5？都不够买瓶水的。" },
                { sender: "reze", text: "有的拿就不错了" },
                { sender: "lin", text: "看我给兄弟们补个大的，庆祝黑神话通关！" },
                { sender: "lin", type: "red_packet", amount: 200, text: "猴哥牛逼" }
            ],
            next: "op_big"
        },
        "op_big": { options: [{ text: "木哥牛逼！抢！", action: "grab_big", next: "spam" }] },
        "spam": {
            autoMe: "老板大气！",
            sequence: [
                ...getSpam(),
                { sender: "tong", text: "哇，运气王是我！" },
                { sender: "lin", text: "大家玩得开心，我先润了，赶高铁。" },
                { sender: "monitor", text: "路上注意安全。" }
            ],
            isEnd: true
        }
    },

    "class_group_day4": {
        "start": {
            sequence: [
                { sender: "npc1", text: "有人在学校吗？西区食堂怎么关门了？" },
                { sender: "monitor", text: "国庆期间只有东区一楼开放。" },
                { sender: "reze", text: "饿死在宿舍了，谁去买饭带一份？" },
                { sender: "ben", text: "别叫，我也饿" },
                { sender: "lin", text: "兄弟们，杭州全是人，挤死了，后悔出门了。" },
                { sender: "line", text: "发张图看看？" },
                { sender: "lin", text: "[图片] 断桥变成人桥了。" },
                { sender: "tong", text: "哈哈哈哈惨" }
            ],
            isEnd: true
        }
    }
});