// data/scripts_social.js

// 注册联系人
DB.contacts["mom"] = { name: "妈妈", avatar: ASSETS.mom, type: "single", day: 1, initMsg: "在吗？" };
DB.contacts["uncle_dashun"] = { name: "大顺表哥", avatar: ASSETS.uncle, type: "single", day: 5, initMsg: "大侄子" };
DB.contacts["date_girl"] = { name: "网恋-小甜", avatar: ASSETS.date_girl, type: "single", day: 2, initMsg: "早安呀~" };

Object.assign(DB.scripts, {
    // === 妈妈 (Day 1) ===
    "mom_day1": {
        "start": { text: "儿砸，放假也不回家，在学校干啥呢？", next: "m1" },
        "m1": { options: [{ text: "复习功课呢", next: "m2" }, { text: "跟同学玩", next: "m2" }] },
        "m2": { text: "别老吃外卖，对胃不好。天冷了记得加衣服。你爸昨天还念叨你呢。", next: "m3" },
        "m3": { text: "生活费还够不？给你转点，别省着。", next: "m4" },
        "m4": { options: [{ text: "够花，不用转", next: "m_refuse" }, { text: "谢谢妈！", next: "m_accept" }] },
        "m_refuse": { text: "拿着吧，买点水果吃。", next: "m_accept" },
        "m_accept": { 
            text: "转账给您 500.00 元", 
            // 模拟转账效果，这里其实是妈妈转给我，为了简化直接用文字表示，或者加action
            action: "get_salary_mid", // +500余额
            isEnd: true 
        }
    },

    // === 网恋 (Day 2) ===
    "date_girl_day2": {
        "start": { text: "早安~ 昨晚做梦梦到你了。", next: "d1" },
        "d1": { options: [{ text: "梦到啥了？", next: "d2" }] },
        "d2": { text: "梦到我们见面了呀。对了，我看中一条裙子，好想买来穿给你看，可是生活费花超了...", next: "d3" },
        "d3": { 
            options: [
                { text: "多少钱？我给你买", cost: 300, next: "d_bad" },
                { text: "我也没钱，吃土呢", next: "d_good" }
            ] 
        },
        "d_bad": { text: "哥哥真好！爱你么么哒！(之后会很少回复)", isEnd: true },
        "d_good": { text: "哦，那我去问问别人。", isEnd: true }
    },

    // === 大顺表哥 (Day 5 - 话痨铺垫版) ===
    "uncle_dashun_day5": {
        "start": { text: "大侄子，忙着没？", next: "u1" },
        "u1": { options: [{ text: "没呢表哥，咋了？", next: "u2" }] },
        "u2": { text: "害，没啥大事。就是刚才翻相册，看到你小时候穿开裆裤的照片，乐死我了。一晃眼都读大学了。", next: "u3" },
        "u3": { options: [{ text: "哈哈，那时候不懂事", next: "u4" }] },
        "u4": { text: "你爸妈身体还硬朗吧？上次回老家听二舅说你妈腿疼，去医院看了没？", next: "u5" },
        "u5": { options: [{ text: "看了，老毛病", next: "u6" }] },
        "u6": { text: "那就好。咱们这辈人在外头打拼，图个啥，不就图个家里平安嘛。表哥我现在搞建材生意，也挺难的。", next: "u7" },
        "u7": { options: [{ text: "生意不好做吗？", next: "u8" }] },
        "u8": { text: "生意是挺好，就是甲方结款太慢！压了我几十万货款，搞得我现在连工人工资都发不出。愁死我了。", next: "u_hook" },
        "u_hook": { 
            text: "那个... 大侄子，虽然张口挺不好意思的。你手头宽裕不？能不能先挪给表哥2000块？下周二结款了立马给你打回去，表哥给你发个大红包。", 
            next: "u_decide" 
        },
        "u_decide": {
            options: [
                { text: "行，表哥你拿去用 (支付2000)", cost: 2000, next: "u_paid" },
                { text: "表哥我真没钱，还是学生呢", next: "u_refuse" }
            ]
        },
        "u_paid": { text: "好兄弟！帮大忙了！下周二准时还你！(其实你再也收不到了)", isEnd: true },
        "u_refuse": { 
            text: "那好吧，表哥也知道你为难。没事，我再找找别人。你在学校照顾好自己啊。", 
            action: "flag_refuse_dashun", // 打标记
            isEnd: true 
        }
    },

    // === 大顺回归 (Day 7) ===
    "uncle_dashun_return_day7": {
        "start": { text: "大侄子... 哎呀我是真没脸找你了。但是表哥真是走投无路了。", next: "ur1" },
        "ur1": { text: "工人都堵到家里来了，老婆带着孩子回娘家了。你要是能帮，就帮衬一把，1000也行，500也行。算表哥求你了。", next: "ur_op" },
        "ur_op": {
            options: [
                { text: "看着太心酸了，借吧 (支付1000)", cost: 1000, next: "ur_paid" },
                { text: "我都说了没钱，拉黑了", next: "ur_block" }
            ]
        },
        "ur_paid": { text: "谢谢！你是我的救命恩人！等我有钱了一定十倍奉还！(结局：钱没了)", isEnd: true },
        "ur_block": { text: "行... 打扰了。", isEnd: true }
    }
});