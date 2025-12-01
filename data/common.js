// data/common.js

const ASSETS = {
    me: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    group_icon: "https://api.dicebear.com/7.x/identicon/svg?seed=SoftwareEng24",
    // 亲友
    mom: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom",
    dad: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dad",
    uncle: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uncle",
    cousin: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cousin",
    date_girl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Date",
    // 同学
    monitor: "https://api.dicebear.com/7.x/micah/svg?seed=Monitor",
    ben: "https://api.dicebear.com/7.x/micah/svg?seed=Ben",
    lin: "https://api.dicebear.com/7.x/micah/svg?seed=Lin",
    llline: "https://api.dicebear.com/7.x/micah/svg?seed=Line",
    reze: "https://api.dicebear.com/7.x/micah/svg?seed=Reze",
    tong: "https://api.dicebear.com/7.x/micah/svg?seed=Tong",
    // 诈骗/陌生人
    scam_job: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
    scam_friend: "https://api.dicebear.com/7.x/micah/svg?seed=Scam1",
    service: "https://api.dicebear.com/7.x/identicon/svg?seed=JD",
    loan: "https://api.dicebear.com/7.x/micah/svg?seed=Loan",
    police: "https://api.dicebear.com/7.x/avataaars/svg?seed=Police"
};

const GROUP_MEMBERS = {
    "class_group": {
        "monitor": { name: "@Bierrari", avatar: ASSETS.monitor },
        "ben": { name: "早睡学长奔", avatar: ASSETS.ben },
        "lin": { name: "地道杭州人 木木三", avatar: ASSETS.lin },
        "line": { name: "LLLine", avatar: ASSETS.llline },
        "reze": { name: "吃饱了没事做的Reze", avatar: ASSETS.reze },
        "tong": { name: "彤", avatar: ASSETS.tong },
        "npc1": { name: "哈吉go", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=NPC1" },
        "npc2": { name: "乄", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=NPC2" }
    }
};

// 初始化数据库
const DB = {
    contacts: {},
    scripts: {}
};