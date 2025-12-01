const Game = {
    state: {
        day: 1,
        balance: 2000.00,
        currentChatId: null,
        chatProgress: {},
        chatHistory: {},
        flags: {} 
    },

    timer: null, 

    init() {
        document.getElementById('my-avatar').style.backgroundImage = `url(${ASSETS.me})`;
        this.initDayProgress();
        this.renderList();
        UI.showTransition(1, "国庆假期第一天");
    },

    initDayProgress() {
        Object.keys(DB.contacts).forEach(id => {
            const contact = DB.contacts[id];
            if (contact.day === this.state.day) {
                // 如果是第一次初始化该对话，或者该对话还未存在
                if (!this.state.chatProgress[id]) {
                    this.state.chatProgress[id] = { nodeId: 'start', index: 0, finished: false };
                }
            }
        });
        
        // 特殊：Day 7 大顺回归逻辑
        if (this.state.day === 7 && this.state.flags.refused_dashun) {
            this.state.chatProgress['uncle_dashun_return'] = { nodeId: 'start', index: 0, finished: false };
        }
    },

    endDay() {
        if (this.state.day >= 7) return alert("游戏结束，最终余额：" + this.state.balance.toFixed(2));
        this.state.day++;
        this.state.currentChatId = null;
        this.initDayProgress();
        UI.closeChat();
        UI.resetChatArea();
        this.renderList();
        UI.showTransition(this.state.day, "新的一天");
    },

    renderList() {
        const listEl = document.getElementById('contact-list');
        listEl.innerHTML = '';
        
        // 1. 筛选当前可见的联系人
        let activeContacts = Object.keys(DB.contacts).filter(id => {
            const c = DB.contacts[id];
            // 天数判定
            if (c.day > this.state.day) return false;
            
            // 大顺判定 (修复逻辑)
            if (id === 'uncle_dashun') {
                // 必须 >= Day 5 且 余额 > 1000 才会出现
                if (this.state.day < 5 || this.state.balance < 1000) return false;
                // 如果已经拒绝过，且到了Day 7，旧的大顺入口隐藏，由 return 入口接管
                if (this.state.day === 7 && this.state.flags.refused_dashun) return false;
            }
            return true;
        });

        // Day 7 插入大顺回归
        if (this.state.day === 7 && this.state.flags.refused_dashun) {
            activeContacts.push('uncle_dashun_return');
        }

        // 2. 构造数据对象以便排序
        let renderData = activeContacts.map(id => {
            // 处理特殊ID
            let contact = DB.contacts[id];
            if (id === 'uncle_dashun_return') {
                contact = { name: "大顺表哥", avatar: ASSETS.uncle, initMsg: "在吗？" };
            }

            // 获取预览文本
            let previewText = contact.initMsg || "";
            if (this.state.chatHistory[id] && this.state.chatHistory[id].length > 0) {
                const lastMsg = this.state.chatHistory[id][this.state.chatHistory[id].length - 1];
                previewText = lastMsg.type === 'red_packet' ? "[红包]" : lastMsg.text;
            }

            // 计算未读状态
            const progress = this.state.chatProgress[id];
            const isUnread = progress && !progress.finished;
            const badgeCount = isUnread ? (id === 'class_group' ? '99+' : '1') : 0;

            return {
                id,
                contact,
                previewText,
                isUnread,
                badgeCount
            };
        });

        // 3. 排序逻辑：未读 > 已读 (置顶)
        renderData.sort((a, b) => {
            if (a.isUnread && !b.isUnread) return -1;
            if (!a.isUnread && b.isUnread) return 1;
            return 0; // 保持原有顺序 (或者可以按 ID/时间 排序)
        });

        // 4. 渲染 DOM
        renderData.forEach(item => {
            const { id, contact, previewText, isUnread, badgeCount } = item;
            
            let badgeHtml = isUnread ? `<div class="badge">${badgeCount}</div>` : '';

            const el = document.createElement('div');
            el.className = 'chat-item';
            if (this.state.currentChatId === id) el.classList.add('active');
            el.onclick = () => this.enterChat(id, el, contact.name); 
            
            el.innerHTML = `
                <div class="avatar" style="background-image: url('${contact.avatar}')">${badgeHtml}</div>
                <div class="info">
                    <div class="name">${contact.name}</div>
                    <div class="preview">${previewText}</div>
                </div>
            `;
            listEl.appendChild(el);
        });
    },

    enterChat(id, elInstance, nameOverride) {
        if(this.state.currentChatId === id) return;
        this.stopScript(); 

        this.state.currentChatId = id;
        document.querySelectorAll('.chat-item').forEach(d => d.classList.remove('active'));
        if(elInstance) {
            elInstance.classList.add('active');
            const badge = elInstance.querySelector('.badge');
            if(badge) badge.style.display = 'none';
        }

        const chatName = nameOverride || DB.contacts[id].name;
        UI.openChat(chatName);

        // 渲染历史
        if (this.state.chatHistory[id]) {
            this.state.chatHistory[id].forEach(msg => UI.renderMsgDirectly(msg));
        }

        // 确定剧本ID
        let scriptKey = `${id}_day${this.state.day}`;
        if (id === 'uncle_dashun_return') scriptKey = 'uncle_dashun_return_day7';
        
        // 容错：如果该天没有特定剧本，尝试通用ID，或者不做任何事
        if (!DB.scripts[scriptKey]) {
            // 尝试查找通用剧本，例如 group_chat 可能会跨天复用 (此处暂不实现)
            return;
        }

        const progress = this.state.chatProgress[id];
        if (progress && !progress.finished) {
            this.runScriptLoop(scriptKey);
        }
    },

    runScriptLoop(scriptKey) {
        this.stopScript(); 

        const id = this.state.currentChatId;
        const progress = this.state.chatProgress[id];
        const script = DB.scripts[scriptKey];
        
        if (!script || !script[progress.nodeId]) return; 
        
        const node = script[progress.nodeId];

        if (node.sequence) {
            if (progress.index < node.sequence.length) {
                const msgData = node.sequence[progress.index];
                this.processAndSaveMsg(msgData, 'npc');
                
                progress.index++;
                // 动态延迟：字数越多读得越慢，但如果是刷屏则极快
                let delay = Math.min(1500, Math.max(800, msgData.text ? msgData.text.length * 100 : 800));
                if (id === 'class_group' && progress.nodeId.includes('spam')) delay = 150;

                this.timer = setTimeout(() => this.runScriptLoop(scriptKey), delay);
            } else {
                this.timer = setTimeout(() => this.finishNode(scriptKey, node), 500);
            }
        } 
        else if (node.text) {
             this.processAndSaveMsg({ text: node.text }, 'npc');
             this.finishNode(scriptKey, node);
        }
        else if (node.options) {
            UI.renderOptions(node.options, scriptKey);
        }
    },

    finishNode(scriptKey, node) {
        const id = this.state.currentChatId;
        const progress = this.state.chatProgress[id];

        if (node.next) {
            progress.nodeId = node.next;
            progress.index = 0;
            this.runScriptLoop(scriptKey);
        } else if (node.options) {
            UI.renderOptions(node.options, scriptKey);
        } else if (node.isEnd) {
            progress.finished = true;
            if(node.action) this.handleAction(node.action);
            this.renderList(); 
        }
    },

    stopScript() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    },

    handleOption(opt, scriptKey) {
        const id = this.state.currentChatId;
        const progress = this.state.chatProgress[id];

        this.processAndSaveMsg({ text: opt.text }, 'me');

        if (opt.cost) this.state.balance -= opt.cost;
        if (opt.action) this.handleAction(opt.action);
        
        UI.updateWallet(this.state.balance.toFixed(2));
        if (this.state.balance <= 0) alert("⚠️ 余额归零警告！");

        if (opt.next) {
            progress.nodeId = opt.next;
            progress.index = 0;
            
            const nextNode = DB.scripts[scriptKey][opt.next];
            if (nextNode && nextNode.autoMe) {
                setTimeout(() => {
                    this.processAndSaveMsg({ text: nextNode.autoMe }, 'me');
                    setTimeout(() => this.runScriptLoop(scriptKey), 500);
                }, 300);
            } else {
                this.runScriptLoop(scriptKey);
            }
        } else if (opt.isEnd) {
            progress.finished = true;
            this.renderList();
        }
    },

    handleAction(action) {
        if (action === 'flag_refuse_dashun') this.state.flags.refused_dashun = true;
        // 红包逻辑
        if (action === 'get_3') { this.state.balance += 3; UI.renderSystemMsg("支付宝到账 3.00 元"); }
        if (action === 'grab_small') { this.state.balance += 0.12; UI.renderSystemMsg("抢到 0.12 元"); }
        if (action === 'grab_big') { this.state.balance += 32.5; UI.renderSystemMsg("抢到 32.50 元"); }
    },

    processAndSaveMsg(msgData, source) {
        const id = this.state.currentChatId;
        // 兼容特殊回归ID
        const contact = DB.contacts[id] || { avatar: ASSETS.uncle }; 
        
        let msgObj = {
            type: source === 'me' ? 'me' : 'other',
            text: msgData.text,
            avatar: source === 'me' ? ASSETS.me : contact.avatar,
            senderName: null
        };

        if (msgData.type === 'red_packet') msgObj.type = 'red_packet';

        // 修复：群聊头像匹配逻辑
        if (contact.type === 'group' && source !== 'me') {
            // 优先检查 script 中的 sender 字段
            let senderKey = msgData.sender;
            // 如果 script 没写 sender，或者是单人聊天的 npc
            if (!senderKey) senderKey = 'npc1';

            if (GROUP_MEMBERS[id] && GROUP_MEMBERS[id][senderKey]) {
                msgObj.avatar = GROUP_MEMBERS[id][senderKey].avatar;
                msgObj.senderName = GROUP_MEMBERS[id][senderKey].name;
            } else {
                // 如果找不到映射，使用默认头像
                msgObj.avatar = ASSETS.group_icon;
            }
        }

        this.saveMsgToHistory(msgObj);
        UI.renderMsgDirectly(msgObj);
        this.renderList(); 
    },

    saveMsgToHistory(msgObj) {
        const id = this.state.currentChatId;
        if (!this.state.chatHistory[id]) this.state.chatHistory[id] = [];
        this.state.chatHistory[id].push(msgObj);
    }
};

const UI = {
    dom: {
        chatStage: document.getElementById('chat-stage'),
        msgContainer: document.getElementById('msg-container'),
        optPanel: document.getElementById('options-panel'),
        chatTitle: document.getElementById('chat-title')
    },
    openChat(title) {
        this.dom.chatTitle.innerText = title;
        this.dom.msgContainer.innerHTML = ''; 
        this.dom.optPanel.innerHTML = '';
        this.dom.chatStage.classList.add('active');
    },
    closeChat() {
        Game.stopScript();
        this.dom.chatStage.classList.remove('active');
        this.dom.msgContainer.innerHTML = '';
    },
    resetChatArea() {
        Game.stopScript();
        this.dom.msgContainer.innerHTML = '<div class="empty-state pc-only"><p>请选择左侧联系人</p></div>';
        this.dom.optPanel.innerHTML = '';
        this.dom.chatTitle.innerText = '微信';
    },
    renderMsgDirectly(msg) {
        if (msg.type === 'system') { this.renderSystemMsg(msg.text); return; }
        if (msg.type === 'red_packet') { this.appendRedPacket(msg); return; }
        this.appendMsg(msg.type, msg.text, msg.avatar, msg.senderName);
    },
    renderSystemMsg(text) {
        const div = document.createElement('div');
        div.className = 'msg-row system';
        div.innerHTML = `<div class="bubble">${text}</div>`;
        this.dom.msgContainer.appendChild(div);
        this.scrollToBottom();
    },
    appendMsg(type, text, avatar, senderName) {
        const div = document.createElement('div');
        div.className = `msg-row ${type}`;
        let nameHTML = senderName ? `<div class="group-sender">${senderName}</div>` : '';
        div.innerHTML = `
            <div class="avatar" style="background-image: url('${avatar}')"></div>
            <div class="msg-content">${nameHTML}<div class="bubble">${text}</div></div>
        `;
        this.dom.msgContainer.appendChild(div);
        this.scrollToBottom();
    },
    appendRedPacket(msg) {
        const div = document.createElement('div');
        div.className = 'msg-row other';
        let nameHTML = msg.senderName ? `<div class="group-sender">${msg.senderName}</div>` : '';
        div.innerHTML = `
            <div class="avatar" style="background-image: url('${msg.avatar}')"></div>
            <div class="msg-content">${nameHTML}
                <div class="red-packet"><div class="rp-icon"></div><div>${msg.text || '恭喜发财'}<br><small>查看红包</small></div></div>
            </div>
        `;
        this.dom.msgContainer.appendChild(div);
        this.scrollToBottom();
    },
    renderOptions(options, scriptKey) {
        this.dom.optPanel.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerText = opt.text + (opt.cost ? ` (-${opt.cost})` : '');
            btn.onclick = () => {
                this.dom.optPanel.innerHTML = '';
                Game.handleOption(opt, scriptKey);
            };
            this.dom.optPanel.appendChild(btn);
        });
        this.scrollToBottom();
    },
    toggleWallet() { alert("当前余额: " + Game.state.balance.toFixed(2)); },
    updateWallet(amount) { document.getElementById('wallet-amount').innerText = amount; },
    scrollToBottom() { setTimeout(() => { this.dom.msgContainer.scrollTop = this.dom.msgContainer.scrollHeight; }, 50); },
    showTransition(day, text) {
        const el = document.getElementById('transition-layer');
        document.getElementById('trans-title').innerText = `Day ${day}`;
        document.getElementById('trans-desc').innerText = text;
        document.getElementById('day-display').innerText = day;
        el.classList.remove('hidden');
    },
    hideTransition() { document.getElementById('transition-layer').classList.add('hidden'); }
};

window.onload = () => Game.init();