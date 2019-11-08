(function () {
    'use strict';

    class person extends Laya.Script {

        constructor() {
            super();
            person.instance = this;
        }

        onEnable() {
            this.flagLeft = this.flagRight = this.flagDown = this.flagUp = true;//角色是否能按方向移动
            this.flag = false;//角色碰撞的是否是门
            this.monsterflag = false;//角色碰撞的是否是怪物
            this.shopflag = false;//角色碰撞的是否是商店
            this.teacherflag = false;//角色碰撞的是否是经验大师
            this.monsterposition = [];//记录怪物位于角色的哪一边
            this.position = [];//记录门位于角色的哪一边
            this.door = [];//记录现在碰到的每一个门
            this.monster = [];//记录现在碰到的每一个怪物
            this.doorOpen = false;//是否是开门引起的onTriggerExit
            this.keyFlag = true;//是否能移动
            this.flagkey = false;////是否检测到角色不能走了
            this._control = GameControl.instance;
        }

        onTriggerEnter(other, self, contact) {
            if (other.label == "left") {
                this.flagLeft = false;
            }
            if (other.label == "right") {
                this.flagRight = false;
            }
            if (other.label == "down") {
                this.flagDown = false;
            }
            if (other.label == "up") {
                this.flagUp = false;
            }
            if (other.owner.name == "yellow_door" || other.owner.name == "blue_door" || other.owner.name == "red_door") {
                this.flag = true;
                this.position.push(other.label);
                this.door.push(other.owner);
            }
            if (other.owner.name == "monster") {
                this.monsterflag = true;
                this.monsterposition.push(other.label);
                this.monster.push(other.owner);
            }
            if (other.owner.name == "shop") {
                this.shopflag = true;
            }
            if (other.owner.name == "teacher") {
                this.teacherflag = true;
            }
        }

        onTriggerExit() {
            this.keyFlag = false;
            if (!this.doorOpen) {
                this.flagLeft = this.flagRight = this.flagDown = this.flagUp = true;
                this.flag = false;
                this.monsterflag = false;
                this.shopflag = false;
                this.teacherflag = false;
                this.position = [];
                this.door = [];
                this.monster = [];
                this.monsterposition = [];
            }
            if (this.doorOpen) {
                let _this = this;
                this.doorOpen = false;
                switch (this.opening) {
                    case "left": {
                        this.flagLeft = true;
                    } break;
                    case "right": {
                        this.flagRight = true;
                    } break;
                    case "down": {
                        this.flagDown = true;
                    } break;
                    case "up": {
                        this.flagUp = true;
                    } break;
                }
                this.position.forEach(function (val, index) {
                    if (val == _this.opening) {
                        _this.position.splice(index, 1);
                        _this.door.splice(index, 1);
                    }
                });
                this.opening = "";
            }
        }

        onKeyDown(e) {
            if (this.keyFlag) {
                switch (e.keyCode) {
                    case 76: {
                        this._control.introduce();
                    } break;
                    case 37: {
                        //防止连续按键时动画只播放第0帧
                        if (!this.owner._isPlaying || this.owner._actionName != "left") {
                            this.owner.play(0, false, "left");
                            Laya.SoundManager.playSound("res/sounds/走.mp3", 1);
                        }
                        if (this.flagLeft && this.owner.x > 386) {
                            this.owner.x -= 64;
                        }
                        if (this.flag) {
                            let _this = this;
                            this.position.forEach(function (val, index) {
                                if (val == "left") {
                                    _this.opening = val;//正在开的门的位置
                                    _this.openDoor(index);
                                }
                            });
                        }
                        if (this.monsterflag) {
                            let _this = this;
                            this.monsterposition.forEach(function (val, index) {
                                if (val == "left") {
                                    _this._control.monster = _this.monster[index];
                                    _this._control.battle();
                                }
                            });
                        }
                    } break;
                    case 38: {
                        if (!this.owner._isPlaying || this.owner._actionName != "up") {
                            this.owner.play(0, false, "up");
                            Laya.SoundManager.playSound("res/sounds/走.mp3", 1);
                        }
                        if (this.flagUp && this.owner.y > 65) {
                            this.owner.y -= 64;
                        }
                        if (this.flag) {
                            let _this = this;
                            this.position.forEach(function (val, index) {
                                if (val == "up") {
                                    _this.opening = val;
                                    _this.openDoor(index);
                                }
                            });
                        }
                        if (this.monsterflag) {
                            let _this = this;
                            this.monsterposition.forEach(function (val, index) {
                                if (val == "up") {
                                    _this._control.monster = _this.monster[index];
                                    _this._control.battle();
                                }
                            });
                        }
                        if (this.shopflag) {
                            this._control.shop();
                        }
                    } break;
                    case 39: {
                        if (!this.owner._isPlaying || this.owner._actionName != "right") {
                            this.owner.play(0, false, "right");
                            Laya.SoundManager.playSound("res/sounds/走.mp3", 1);
                        }
                        if (this.flagRight && this.owner.x < 1154) {
                            this.owner.x += 64;
                        }
                        if (this.flag) {
                            let _this = this;
                            this.position.forEach(function (val, index) {
                                if (val == "right") {
                                    _this.opening = val;
                                    _this.openDoor(index);
                                }
                            });
                        }
                        if (this.monsterflag) {
                            let _this = this;
                            this.monsterposition.forEach(function (val, index) {
                                if (val == "right") {
                                    _this._control.monster = _this.monster[index];
                                    _this._control.battle();
                                }
                            });
                        }
                    } break;
                    case 40: {
                        if (!this.owner._isPlaying || this.owner._actionName != "down") {
                            this.owner.play(0, false, "down");
                            Laya.SoundManager.playSound("res/sounds/走.mp3", 1);
                        }
                        if (this.flagDown && this.owner.y < 833) {
                            this.owner.y += 64;
                        }
                        if (this.flag) {
                            let _this = this;
                            this.position.forEach(function (val, index) {
                                if (val == "down") {
                                    _this.opening = val;
                                    _this.openDoor(index);
                                }
                            });
                        }
                        if (this.monsterflag) {
                            let _this = this;
                            this.monsterposition.forEach(function (val, index) {
                                if (val == "down") {
                                    _this._control.monster = _this.monster[index];
                                    _this._control.battle();
                                }
                            });
                        }
                        if (this.teacherflag) {
                            this._control.experienced();
                        }
                    } break;
                }
                this.keyFlag = false;
            }
        }

        openDoor(num) {
            if (this.door[num].name == "yellow_door" && this._control.num_yellow_key.text > 0) {
                this.doorOpen = true;
                this.door[num].removeSelf();
                this._control.num_yellow_key.text--;
                Laya.SoundManager.playSound("res/sounds/开门.mp3", 1);
            }
            if (this.door[num].name == "blue_door" && this._control.num_blue_key.text > 0) {
                this.doorOpen = true;
                this.door[num].removeSelf();
                this._control.num_blue_key.text--;
                Laya.SoundManager.playSound("res/sounds/开门.mp3", 1);
            }
            if (this.door[num].name == "red_door" && this._control.num_red_key.text > 0) {
                this.doorOpen = true;
                this.door[num].removeSelf();
                this._control.num_red_key.text--;
                Laya.SoundManager.playSound("res/sounds/开门.mp3", 1);
            }
        }

        onUpdate() {
            //边界
            if (this.owner.y <= 65) {
                this.owner.y = 65;
            }
            if (this.owner.y >= 833) {
                this.owner.y = 833;
            }
            if (this.owner.x <= 386) {
                this.owner.x = 386;
            }
            if (this.owner.x >= 1154) {
                this.owner.x = 1154;
            }
            if (this.flagkey) {
                this.keyFlag = true;
                this.flagkey = false;
            }
            if (!this.keyFlag && !this.flagkey) {
                this.flagkey = true;
            }
        }

        onDisable() {
        }
    }

    class GameControl extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:num_yellow_key, tips:"黄色钥匙数量", type:Node}*/
            /** @prop {name:num_blue_key, tips:"蓝色钥匙数量", type:Node}*/
            /** @prop {name:num_red_key, tips:"红色钥匙数量", type:Node}*/
            /** @prop {name:layer, tips:"层数", type:Node}*/
            /** @prop {name:gold, tips:"金币", type:Node}*/
            /** @prop {name:experience, tips:"经验", type:Node}*/
            /** @prop {name:defense, tips:"防御", type:Node}*/
            /** @prop {name:attack, tips:"攻击", type:Node}*/
            /** @prop {name:life, tips:"生命", type:Node}*/
            /** @prop {name:grade_num, tips:"等级", type:Node}*/
            /** @prop {name:grade, tips:"角色等级图片", type:Node}*/
            /** @prop {name:tip, tips:"提示", type:Node}*/
            GameControl.instance = this;
        }

        onEnable() {
            this.person = person.instance;
            this.prompt = this.owner.getChildByName("prompt");
            this.visible_prompt = false;//是否检测到提示框已经可见
            this.equip_num = 1;//初始装备等级
            this.introduceFlag = false;//是否能查看本层怪物信息
        }

        //捡到钥匙
        addKey(name) {
            if (name == "yellow_key") {
                this.num_yellow_key.text++;
                this.tip.text = "捡到一把黄钥匙";
            }
            if (name == "blue_key") {
                this.num_blue_key.text++;
                this.tip.text = "捡到一把蓝钥匙";
            }
            if (name == "red_key") {
                this.num_red_key.text++;
                this.tip.text = "捡到一把红钥匙";
            }
            Laya.SoundManager.playSound("res/sounds/获得物品.mp3", 1);
            this.changePromptVisivle();
        }

        //升级装备
        upequip() {
            this.equip_num++;
            this.grade.texture = "gameImg/grade" + this.equip_num + " (1).png";
            this.person.owner.source = "grade" + this.equip_num + ".ani";
            this.attack.text = Math.ceil(Number(this.attack.text) * 1.1);
            this.defense.text = Math.ceil(Number(this.defense.text) * 1.1);
            this.life.text = Math.ceil(Number(this.life.text) * 1.1);
            this.tip.text = "装备升级！全属性提升10%";
            this.changePromptVisivle();
        }

        //升级
        upgrade() {
            this.grade_num.text++;
            this.attack.text = Number(this.attack.text) + 12;
            this.defense.text = Number(this.defense.text) + 12;
            this.life.text = Number(this.life.text) + 1000;
            Laya.SoundManager.playSound("res/sounds/升级.mp3", 1);
        }

        //遇怪
        battle() {
            Laya.Scene.open("battle.scene");
            for (let i = 0; i < this.owner._children.length; i++) {
                this.owner._children[i].active = false;
            }
        }

        //打开商店
        shop() {
            Laya.Scene.open("shop.scene");
            for (let i = 0; i < this.owner._children.length; i++) {
                this.owner._children[i].active = false;
            }
        }

        //经验大师场景
        experienced() {
            Laya.Scene.open("experience.scene");
            for (let i = 0; i < this.owner._children.length; i++) {
                this.owner._children[i].active = false;
            }
        }

        //上下楼
        stairs(method) {
            this.method = method;
            for (let i = 0; i < this.owner._children.length; i++) {
                this.owner._children[i].active = false;
            }
            let layers = this.owner.getChildByName("layer");
            if (method == "+") {
                layers.y += 960;
                this.layer.text++;
            }
            if (method == "-") {
                layers.y -= 960;
                this.layer.text--;
            }
            Laya.SoundManager.playSound("res/sounds/上下楼.mp3", 1);
            Laya.Scene.open("transition.scene");
            Laya.timer.once(1000, this, function () {
                Laya.Scene.close("transition.scene");
                for (let i = 0; i < this.owner._children.length; i++) {
                    this.owner._children[i].active = true;
                }
            });
        }

        //增加攻击防御生命属性
        increaseAttribute(name) {
            if (name == "red_gemstone") {
                this.attack.text = Number(this.attack.text) + 3;
                this.tip.text = "攻击力+3";
                Laya.SoundManager.playSound("res/sounds/获得物品.mp3", 1);
            }
            if (name == "blue_gemstone") {
                this.defense.text = Number(this.defense.text) + 3;
                this.tip.text = "防御力+3";
                Laya.SoundManager.playSound("res/sounds/获得物品.mp3", 1);
            }
            if (name == "blood") {
                this.life.text = Number(this.life.text) + 200;
                this.tip.text = "生命值+200";
                Laya.SoundManager.playSound("res/sounds/血瓶.mp3", 1);
            }
            this.changePromptVisivle();
        }

        changePromptVisivle() {
            if (this.prompt.visible) {
                Laya.timer.clearAll(this);
                this.visible_prompt = false;
            }
            this.prompt.visible = true;
        }

        introduce() {
            if(this.introduceFlag) {
                Laya.Scene.open("introduce.scene");
                for (let i = 0; i < this.owner._children.length; i++) {
                    this.owner._children[i].active = false;
                }
            }
        }

        clearance() {
            Laya.SoundManager.stopAll();
            Laya.SoundManager.playSound("res/sounds/通关结束.mp3", 1);
            Laya.Scene.closeAll();
            Laya.Dialog.closeAll();
        }

        onUpdate() {
            if (this.life.text <= 0) {
                Laya.SoundManager.playSound("res/sounds/游戏结束.mp3", 1);
                Laya.Scene.closeAll();
                Laya.Dialog.closeAll();
            }
            if (this.prompt.visible && !this.visible_prompt) {
                this.visible_prompt = true;
                if (this.tip.text == "已获得圣光徽 按L可查看怪物属性") {
                    Laya.timer.once(10000, this, function () {
                        this.prompt.visible = false;
                        this.visible_prompt = false;
                    });
                }
                else {
                    Laya.timer.once(1000, this, function () {
                        this.prompt.visible = false;
                        this.visible_prompt = false;
                    });
                }
            }
        }

        onDisable() {
        }
    }

    class Battle extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:stone,tips:"石头怪预制体对象",type:Prefab}*/
            /** @prop {name:master,tips:"法师怪预制体对象",type:Prefab}*/
            /** @prop {name:caution,tips:"注意预制体对象",type:Prefab}*/
            /** @prop {name:bat,tips:"蝙蝠预制体对象",type:Prefab}*/
            /** @prop {name:thorn,tips:"刺预制体对象",type:Prefab}*/
            /** @prop {name:telson,tips:"毒刺预制体对象",type:Prefab}*/
            /** @prop {name:substitute,tips:"替身预制体对象",type:Prefab}*/
            Battle.instance = this;
        }

        onEnable() {
            this._control = GameControl.instance;
            //生成不同的怪
            let name = this._control.monster.getComponent(Laya.RigidBody).label;
            if (name == "stone") {
                let stones = Laya.Pool.getItemByCreateFun("stone", this.stone.create, this.stone);
                stones.pos(1181, 741);
                this.owner.addChildAt(stones, 1);
            }
            if (name == "master") {
                let masters = Laya.Pool.getItemByCreateFun("master", this.master.create, this.master);
                masters.pos(1181, 865);
                this.owner.addChildAt(masters, 1);
            }
            if (name == "bat") {
                let bats = Laya.Pool.getItemByCreateFun("bat", this.bat.create, this.bat);
                bats.pos(1186, 167);
                this.owner.addChildAt(bats, 1);
                let thorns = Laya.Pool.getItemByCreateFun("thorn", this.thorn.create, this.thorn);
                thorns.pos(802, 865);
                this.owner.addChildAt(thorns, 2);
            }
        }

        //注意预制体的创建
        cautions(x, y) {
            let cautions = Laya.Pool.getItemByCreateFun("caution", this.caution.create, this.caution);
            cautions.pos(x, y);
            this.owner.addChild(cautions);
            Laya.timer.once(1000, this, function () {
                cautions.removeSelf();
                Laya.Pool.recover("caution", cautions);
            });
        }

        telsons(x, y, angle) {
            this.angle = angle;
            let telsons = Laya.Pool.getItemByCreateFun("telson", this.telson.create, this.telson);
            telsons.pos(x, y);
            telsons.active = true;
            if(angle > 0) {
                telsons.rotation = 145 - angle;
            }
            if (angle < 0) {
                telsons.rotation = Math.abs(angle) - 35;
            }
            this.owner.addChildAt(telsons, 3);
        }

        substitutes(x, y) {
            let substitutes = Laya.Pool.getItemByCreateFun("substitute", this.substitute.create, this.substitute);
            substitutes.pos(x, y);
            this.owner.addChildAt(substitutes, 2);
            Laya.timer.once(2000, this, function(){
                substitutes.removeSelf();
                Laya.Pool.recover("substitute", substitutes);
            });
        }

        activeFalse() {
            for (let i = 0; i < this.owner._children.length; i++) {
                this.owner._children[i].active = false;
            }
        }

        onDisable() {
        }
    }

    class Battle_Person extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:time_remaining, tips:"战斗剩余时间", type:Node}*/
            /** @prop {name:bullet,tips:"子弹预制体对象",type:Prefab}*/
            /** @prop {name:cover,tips:"保护罩预制体对象",type:Prefab}*/
            Battle_Person.instance = this;
        }

        onEnable() {
            this._control = GameControl.instance;
            this.battle = Battle.instance;
            this.owner.source = "grade" + this._control.equip_num + ".ani";
            this.owner.play(0, false, "right");
            this.jump = false;//是否正在跳跃
            this.jumpflag = 2;//已跳跃次数
            this.time = 0;//倒计时
            this.protect = false;//是否需要保护
            this.checkProtect = false;//检测是否开启保护
            this.bulletTime = 20;//子弹发射频率20帧一次一秒最大三发子弹
            this.bulletFlag = true;//是否允许子弹发射
            this.keyDownList = [];//按键列表
        }

        onTriggerEnter(other, self, contact) {
            if (other.label == "ground") {
                this.jumpflag = 0;
            }
        }

        onKeyDown(e) {
            let flag = true;
            this.keyDownList.forEach(function (val) {
                if (val == e.keyCode) {
                    flag = false;
                }
            });
            if (flag) {
                this.keyDownList.push(e.keyCode);
            }
        }

        onKeyUp(e) {
            let _this = this;
            this.keyDownList.forEach(function (val, index) {
                if (val == e.keyCode) {
                    _this.keyDownList.splice(index, 1);
                }
                if (val == 32) {
                    _this.jumpflag++;
                    _this.jump = false;
                }
            });
        }

        onUpdate() {
            let _this = this;
            this.keyDownList.forEach(function (val) {
                switch (val) {
                    case 37: {
                        if (!_this.owner._isPlaying || _this.owner._actionName != "left") {
                            _this.owner.play(0, false, "left");
                        }
                        if (_this.owner.x > 418) {
                            _this.owner.x -= 4;
                        }
                    } break;
                    case 39: {
                        if (!_this.owner._isPlaying || _this.owner._actionName != "right") {
                            _this.owner.play(0, false, "right");
                        }
                        if (_this.owner.x < 1186) {
                            _this.owner.x += 4;
                        }
                    } break;
                    case 32: {
                        if (_this.jumpflag < 2 && !_this.jump) {
                            _this.jump = true;
                            _this.owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -6 });
                        }
                    } break;
                    case 90: {
                        if (_this.bulletFlag) {
                            _this.bulletFlag = false;
                            let bullets = Laya.Pool.getItemByCreateFun("bullet", _this.bullet.create, _this.bullet);
                            if (_this.owner._actionName == "left") {
                                bullets.pos(_this.owner.x - 45, _this.owner.y - 10);
                            }
                            if (_this.owner._actionName == "right") {
                                bullets.pos(_this.owner.x + 31, _this.owner.y - 10);
                            }
                            bullets.active = true;//防止子弹还处于active:false阶段
                            _this.owner.parent.addChild(bullets);
                            Laya.SoundManager.playSound("res/sounds/开枪.mp3", 1);
                        }
                    } break;
                }
            });
            //边界
            if (this.owner.y <= 103) {
                this.owner.y = 103;
            }
            if (this.owner.x <= 418) {
                this.owner.x = 418;
            }
            if (this.owner.x >= 1186) {
                this.owner.x = 1186;
            }
            //倒计时
            this.time++;
            if (this.time == 60) {
                this.time = 0;
                this.time_remaining.text--;
                if (this.time_remaining.text == 0) {
                    this.battle.activeFalse();
                    Laya.Scene.close("battle.scene");
                    for (let i = 0; i < this._control.owner._children.length; i++) {
                        this._control.owner._children[i].active = true;
                    }
                    this._control.person.keyFlag = false;
                    this._control.tip.text = "战斗失败 该怪物已恢复至满血";
                    this._control.prompt.visible = true;
                }
            }
            //子弹恢复
            if (!this.bulletFlag) {
                this.bulletTime--;
                if (this.bulletTime == 0) {
                    this.bulletTime = 30;
                    this.bulletFlag = true;
                }
            }
            //受伤后2秒处于保护状态
            if (this.protect && !this.checkProtect) {
                Laya.SoundManager.playSound("res/sounds/受伤.mp3", 1);
                this.covers = Laya.Pool.getItemByCreateFun("cover", _this.cover.create, _this.cover);
                this.covers.pos(32, 32);
                this.owner.addChild(this.covers);
                this.checkProtect = true;//开启保护
                Laya.timer.once(2000, this, function () {
                    this.protect = false;
                    this.checkProtect = false;
                    this.covers.removeSelf();
                    Laya.Pool.recover("cover", this.covers);
                });
            }
        }

        onDisable() {
        }
    }

    class Experience extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            this.upgrade = this.owner.getChildByName("upgrade");
            this.attack = this.owner.getChildByName("attack");
            this.defense = this.owner.getChildByName("defense");
            this.life = this.owner.getChildByName("life");
            this.close = this.owner.getChildByName("close");
            this.tip = this.owner.getChildByName("tip");
            this._control = GameControl.instance;
        }

        onEnable() {
            this.upgrade.on(Laya.Event.CLICK, this, this.upgrades);
            this.attack.on(Laya.Event.CLICK, this, this.addAttack);
            this.defense.on(Laya.Event.CLICK, this, this.addDefense);
            this.life.on(Laya.Event.CLICK, this, this.addLife);
            this.close.on(Laya.Event.CLICK, this, this.closed);
            this.upgrade.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.attack.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.defense.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.life.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.close.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
        }

        playSounds() {
            Laya.SoundManager.playSound("res/sounds/选择.mp3", 1);
        }

        upgrades() {
            if (Number(this._control.experience.text) >= 100) {
                this._control.experience.text = Number(this._control.experience.text) - 100;
                this._control.upgrade();
            }
            else {
                this.tips();
            }
        }

        addAttack() {
            if (Number(this._control.experience.text) >= 30) {
                this._control.experience.text = Number(this._control.experience.text) - 30;
                this._control.attack.text = Number(this._control.attack.text) + 5;
            }
            else {
                this.tips();
            }
        }

        addDefense() {
            if (Number(this._control.experience.text) >= 30) {
                this._control.experience.text = Number(this._control.experience.text) - 30;
                this._control.defense.text = Number(this._control.defense.text) + 5;
            }
            else {
                this.tips();
            }
        }

        addLife() {
            if (Number(this._control.experience.text) >= 30) {
                this._control.experience.text = Number(this._control.experience.text) - 30;
                this._control.life.text = Number(this._control.life.text) + 500;
            }
            else {
                this.tips();
            }
        }

        tips() {
            if (this.tip.visible) {
                Laya.timer.clearAll(this);
            }
            Laya.SoundManager.playSound("res/sounds/错误.mp3", 1);
            this.tip.visible = true;
            Laya.timer.once(500, this, function () {
                this.tip.visible = false;
            });
        }

        closed() {
            Laya.Scene.close("experience.scene");
            for (let i = 0; i < this._control.owner._children.length; i++) {
                this._control.owner._children[i].active = true;
            }
        }

        onDisable() {
        }
    }

    class Prop extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this._control = GameControl.instance;
        }

        onTriggerEnter(other, self, contact) {
            if (other.owner.name == "person") {
                if (this.owner.name == "yellow_key" || this.owner.name == "blue_key" || this.owner.name == "red_key") {
                    this._control.addKey(this.owner.name);//捡到钥匙
                }
                if (this.owner.name == "gun") {
                    this._control.upequip();//升级装备
                }
                if (this.owner.name == "red_gemstone" || this.owner.name == "blue_gemstone" || this.owner.name == "blood") {
                    this._control.increaseAttribute(this.owner.name);//增加属性
                }
                if (this.owner.name == "badge") {
                    this._control.introduceFlag = true;
                    this._control.tip.text = "已获得圣光徽 按L可查看怪物属性";
                    this._control.changePromptVisivle();
                }
                if (this.owner.name == "upstairs") {
                    this._control.stairs("+");//上楼
                    return;
                }
                if (this.owner.name == "downstairs") {
                    this._control.stairs("-");//下楼
                    return;
                }
                if (this.owner.name == "princess") {
                    this._control.clearance();
                }
                this.owner.removeSelf();
            }
        }

        onDisable() {
        }
    }

    class Introduce extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:monster,tips:"怪物介绍预制体对象",type:Prefab}*/
        }

        onEnable() {
            this._control = GameControl.instance;
            this.compare = [];
            this.show();
        }

        show() {
            let _this = this;
            this.monsterBox = this._control.owner.getChildByName("layer").getChildByName("layer_" + this._control.layer.text).getChildByName("monsterBox")._children;
            for (let i = 0; i < this.monsterBox.length; i++) {
                let flag = true;
                this.compare.forEach(function (val, index) {
                    if (val == _this.monsterBox[i].getComponent(Laya.RigidBody).label) {
                        flag = false;
                    }
                });
                if (flag) {
                    this.compare.push(this.monsterBox[i].getComponent(Laya.RigidBody).label);
                }
            }
            for (let i = 0; i < this.compare.length; i++) {
                let monsters = Laya.Pool.getItemByCreateFun("stone", this.monster.create, this.monster);
                monsters.pos(480, (i + 1) * 100);
                this.owner.addChild(monsters);
                if (this.compare[i] == "stone") {
                    monsters._children[0].texture = "gameImg/石头怪.png";
                    monsters._children[1].text = "攻击力：15 防御力：5 生命值：200   难度：简单";
                }
                if (this.compare[i] == "master") {
                    monsters._children[0].texture = "gameImg/法师.png";
                    monsters._children[1].text = "攻击力：50 防御力：20 生命值：500 难度：一般";
                }
                if (this.compare[i] == "bat") {
                    monsters._children[0].texture = "gameImg/蝙蝠.png";
                    monsters._children[1].text = "攻击力：100 防御力：50 生命值：800 难度：困难";
                }
            }
        }

        onKeyDown(e) {
            if (e.keyCode == 76) {
                Laya.Scene.close("introduce.scene");
                for (let i = 0; i < this._control.owner._children.length; i++) {
                    this._control.owner._children[i].active = true;
                }
            }
        }

        onDisable() {
        }
    }

    class Shop extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            this.yellow_key = this.owner.getChildByName("yellow_key");
            this.blue_key = this.owner.getChildByName("blue_key");
            this.red_key = this.owner.getChildByName("red_key");
            this.attack = this.owner.getChildByName("attack");
            this.defense = this.owner.getChildByName("defense");
            this.life = this.owner.getChildByName("life");
            this.close = this.owner.getChildByName("close");
            this.tip = this.owner.getChildByName("tip");
            this._control = GameControl.instance;
        }

        onEnable() {
            this.yellow_key.on(Laya.Event.CLICK, this, this.addYellowKey);
            this.blue_key.on(Laya.Event.CLICK, this, this.addBlueKey);
            this.red_key.on(Laya.Event.CLICK, this, this.addRedKey);
            this.attack.on(Laya.Event.CLICK, this, this.addAttack);
            this.defense.on(Laya.Event.CLICK, this, this.addDefense);
            this.life.on(Laya.Event.CLICK, this, this.addLife);
            this.close.on(Laya.Event.CLICK, this, this.closed);
            this.yellow_key.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.blue_key.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.red_key.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.attack.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.defense.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.life.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
            this.close.on(Laya.Event.MOUSE_OVER, this, this.playSounds);
        }

        playSounds() {
            Laya.SoundManager.playSound("res/sounds/选择.mp3", 1);
        }

        addYellowKey() {
            if (Number(this._control.gold.text) >= 5) {
                this._control.gold.text = Number(this._control.gold.text) - 5;
                this._control.num_yellow_key.text++;
                Laya.SoundManager.playSound("res/sounds/花费金币.mp3", 1);
            }
            else {
                this.tips();
            }
        }

        addBlueKey() {
            if (Number(this._control.gold.text) >= 30) {
                this._control.gold.text = Number(this._control.gold.text) - 30;
                this._control.num_blue_key.text++;
                Laya.SoundManager.playSound("res/sounds/花费金币.mp3", 1);
            }
            else {
                this.tips();
            }
        }

        addRedKey() {
            if (Number(this._control.gold.text) >= 100) {
                this._control.gold.text = Number(this._control.gold.text) - 100;
                this._control.num_red_key.text++;
                Laya.SoundManager.playSound("res/sounds/花费金币.mp3", 1);
            }
            else {
                this.tips();
            }
        }

        addAttack() {
            if (Number(this._control.gold.text) >= 25) {
                this._control.gold.text = Number(this._control.gold.text) - 25;
                this._control.attack.text = Number(this._control.attack.text) + 4;
                Laya.SoundManager.playSound("res/sounds/花费金币.mp3", 1);
            }
            else {
                this.tips();
            }
        }

        addDefense() {
            if (Number(this._control.gold.text) >= 25) {
                this._control.gold.text = Number(this._control.gold.text) - 25;
                this._control.defense.text = Number(this._control.defense.text) + 4;
                Laya.SoundManager.playSound("res/sounds/花费金币.mp3", 1);
            }
            else {
                this.tips();
            }
        }

        addLife() {
            if (Number(this._control.gold.text) >= 25) {
                this._control.gold.text = Number(this._control.gold.text) - 25;
                this._control.life.text = Number(this._control.life.text) + 400;
                Laya.SoundManager.playSound("res/sounds/花费金币.mp3", 1);
            }
            else {
                this.tips();
            }
        }

        tips() {
            if (this.tip.visible) {
                Laya.timer.clearAll(this);
            }
            Laya.SoundManager.playSound("res/sounds/错误.mp3", 1);
            this.tip.visible = true;
            Laya.timer.once(500, this, function () {
                this.tip.visible = false;
            });
        }

        closed() {
            Laya.Scene.close("shop.scene");
            for (let i = 0; i < this._control.owner._children.length; i++) {
                this._control.owner._children[i].active = true;
            }
        }

        onDisable() {
        }
    }

    class Start extends Laya.Script {

        constructor() { 
            super();
        }

        onAwake() {
            this.start = this.owner.getChildByName("start");
            this.explain = this.owner.getChildByName("explain");
            this.leave = this.owner.getChildByName("leave");
            this.glowFilter = new Laya.GlowFilter("#ffff00", 10, 0, 0);
        }
        
        onEnable() {
            this.start.on(Laya.Event.MOUSE_OVER, this, this.spriteOver, [this.start]);
            this.start.on(Laya.Event.MOUSE_OUT, this, this.spriteOut, [this.start]);
            this.explain.on(Laya.Event.MOUSE_OVER, this, this.spriteOver, [this.explain]);
            this.explain.on(Laya.Event.MOUSE_OUT, this, this.spriteOut, [this.explain]);
            this.leave.on(Laya.Event.MOUSE_OVER, this, this.spriteOver, [this.leave]);
            this.leave.on(Laya.Event.MOUSE_OUT, this, this.spriteOut, [this.leave]);
            this.start.on(Laya.Event.CLICK, this, this.gameStart);
            this.explain.on(Laya.Event.CLICK, this, this.openExplain);
            this.leave.on(Laya.Event.CLICK, this, this.gameOver);
        }

        gameOver() {
            Laya.Scene.closeAll();
            Laya.Dialog.closeAll();
        }

        spriteOver(sprite) {
            Laya.SoundManager.playSound("res/sounds/选择.mp3", 1);
            sprite.filters = [this.glowFilter];
        }

        spriteOut(sprite) {
            sprite.filters = "";
        }

        gameStart() {
            Laya.Scene.open("game.scene");
            Laya.SoundManager.playSound("res/sounds/一二层.mp3", 0);
            Laya.SoundManager.autoStopMusic = false;
        }

        openExplain() {
            Laya.Scene.open("explain.scene");
        }

        onUpdate() {
            if(this.owner.alpha < 1) {
                this.owner.alpha += 0.01;
            }
            if(this.owner.alpha == 1 && this.start.alpha < 1) {
                this.start.alpha += 0.01;
                this.explain.alpha += 0.01;
                this.leave.alpha += 0.01;
            }
        }

        onDisable() {
        }
    }

    class Transition extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this._control = GameControl.instance;
            switch (this._control.layer.text) {
                case "1": {
                    this.owner.text = "第一层";
                } break;
                case "2": {
                    this.owner.text = "第二层";
                    if(this._control.method == "-") {
                        Laya.SoundManager.stopAll();
                        Laya.SoundManager.playSound("res/sounds/一二层.mp3", 0);
                        Laya.SoundManager.autoStopMusic = false;
                    }
                } break;
                case "3": {
                    this.owner.text = "第三层";
                    Laya.SoundManager.stopAll();
                    Laya.SoundManager.playSound("res/sounds/三层.mp3", 0);
                    Laya.SoundManager.autoStopMusic = false;
                } break;
                case "4": {
                    this.owner.text = "第四层";
                    Laya.SoundManager.stopAll();
                    Laya.SoundManager.playSound("res/sounds/四层.mp3", 0);
                    Laya.SoundManager.autoStopMusic = false;
                } break;
                case "5": {
                    this.owner.text = "第五层";
                    Laya.SoundManager.stopAll();
                    Laya.SoundManager.playSound("res/sounds/五层.mp3", 0);
                    Laya.SoundManager.autoStopMusic = false;
                } break;
            }
        }

        onDisable() {
        }
    }

    class Bat extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:life, tips:"生命值", type:Int}*/
            /** @prop {name:attack, tips:"攻击力", type:Int}*/
            /** @prop {name:defense, tips:"防御力", type:Int}*/
            /** @prop {name:experience, tips:"经验", type:Int}*/
            /** @prop {name:gold, tips:"金币", type:Int}*/
            Bat.instance = this;
        }

        onEnable() {
            this.person = Battle_Person.instance;
            this._control = GameControl.instance;
            this.attacktime = 300;//初始攻击间隔300帧
            this.life_text = this.owner.getChildByName('life');
            this.life_text.text = this.life;
            this.flag = true;//true向左 false向右
            this.maxLife = this.life;
            this.vita = this.owner.getChildByName("vita");
        }

        onTriggerEnter(other, self, contact) {
            if (other.label == "bullet") {
                if (this._control.attack.text - this.defense > 0) {
                    this.life -= (this._control.attack.text - this.defense);
                }
                else {
                    this.life--;
                }
                this.life_text.text = this.life;
                this.vita.width = this.life / this.maxLife * 100;
                Laya.SoundManager.playSound("res/sounds/命中.mp3", 1);
                if (this.life <= 0) {
                    this._control.experience.text = Number(this._control.experience.text) + this.experience;
                    this._control.gold.text = Number(this._control.gold.text) + this.gold;
                    this.person.battle.activeFalse();
                    Laya.Scene.close("battle.scene");
                    for (let i = 0; i < this._control.owner._children.length; i++) {
                        this._control.owner._children[i].active = true;
                    }
                    this._control.monster.removeSelf();
                    this._control.person.keyFlag = false;
                    this._control.tip.text = "战斗胜利 获得金币" + this.gold + " 获得经验" + this.experience;
                    this._control.prompt.visible = true;
                }
            }
        }

        attackSucceed() {
            if (this.attack - this._control.defense.text > 0) {
                this._control.life.text -= (this.attack - this._control.defense.text);
            }
        }

        onUpdate() {
            this.attacktime--;
            if (this.flag) {
                this.owner.x -= 5;
            }
            else {
                this.owner.x += 5;
            }
            if (this.owner.x <= 418) {
                this.owner.x = 418;
                this.flag = false;
            }
            if (this.owner.x >= 1186) {
                this.owner.x = 1186;
                this.flag = true;
            }
            if (this.attacktime == 0) {
                this.attacktime = Math.ceil(Math.random() * 200 + 100);//随机攻击间隔
                let angle = Math.atan(Math.abs(this.owner.y - this.person.owner.y) / (this.owner.x - this.person.owner.x)) * 180 / Math.PI;
                this.person.battle.telsons(this.owner.x, this.owner.y, angle);
                Laya.SoundManager.playSound("res/sounds/蝙蝠.mp3", 1);
            }
        }

        onDisable() {
        }
    }

    class Bullet extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this.person = Battle_Person.instance;
            this.rig = this.owner.getComponent(Laya.RigidBody);
            if (this.person.owner._actionName == "left") {
                this.rig.setVelocity({ x: -5, y: 0 });//速度
            }
            if (this.person.owner._actionName == "right") {
                this.rig.setVelocity({ x: 5, y: 0 });//速度
            }
        }

        //子弹遇到敌人清除子弹
        onTriggerEnter(other, self, contact) {
            if (other.label == "telson") {
                return;
            }
            if (other.label == "thorn") {
                this.rig.setVelocity({ x: 0, y: -5 });
                return;
            }
            this.owner.removeSelf();
        }

        //子弹遇到墙清除子弹
        onUpdate() {
            if (this.owner.x < 386 || this.owner.x > 1218 || this.owner.y < 65) {
                this.owner.removeSelf();
            }
        }

        //回收
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class Master extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:life, tips:"生命值", type:Int}*/
            /** @prop {name:attack, tips:"攻击力", type:Int}*/
            /** @prop {name:defense, tips:"防御力", type:Int}*/
            /** @prop {name:experience, tips:"经验", type:Int}*/
            /** @prop {name:gold, tips:"金币", type:Int}*/
            Master.instance = this;
        }

        onEnable() {
            this.person = Battle_Person.instance;
            this._control = GameControl.instance;
            this.attacktime = 300;//初始攻击间隔300帧
            this.life_text = this.owner.getChildByName('life');
            this.dodgetime = Math.ceil(Math.random() * 200 + 120);
            this.life_text.text = this.life;
            this.maxLife = this.life;
            this.vita = this.owner.getChildByName("vita");
        }

        onTriggerEnter(other, self, contact) {
            if (other.label == "bullet") {
                if (this._control.attack.text - this.defense > 0) {
                    this.life -= (this._control.attack.text - this.defense);
                }
                else {
                    this.life--;
                }
                this.life_text.text = this.life;
                this.vita.width = this.life / this.maxLife * 100;
                this.person.battle.substitutes(this.owner.x, this.owner.y);
                this.owner.x = Math.ceil(Math.random() * 768 + 418);
                Laya.SoundManager.playSound("res/sounds/命中.mp3", 1);
                if (this.life <= 0) {
                    this._control.experience.text = Number(this._control.experience.text) + this.experience;
                    this._control.gold.text = Number(this._control.gold.text) + this.gold;
                    this.person.battle.activeFalse();
                    Laya.Scene.close("battle.scene");
                    for (let i = 0; i < this._control.owner._children.length; i++) {
                        this._control.owner._children[i].active = true;
                    }
                    this._control.monster.removeSelf();
                    this._control.person.keyFlag = false;
                    this._control.tip.text = "战斗胜利 获得金币" + this.gold + " 获得经验" + this.experience;
                    this._control.prompt.visible = true;
                }
            }
        }

        attackSucceed() {
            if (this.attack - this._control.defense.text > 0) {
                this._control.life.text -= (this.attack - this._control.defense.text);
            }
        }

        createFire() {
            let ani = new Laya.Animation();
            ani.loadAnimation("fire.ani");
            ani.on(Laya.Event.COMPLETE, null, recover);
            function recover() {
                ani.removeSelf();
                Laya.Pool.recover("fire", ani);
            }
            return ani;
        }

        onUpdate() {
            this.attacktime--;
            this.dodgetime--;
            if (this.attacktime == 60) {
                this.attackpos = [this.person.owner.x - 64, this.owner.y];//攻击位置
                this.person.battle.cautions(this.person.owner.x - 32, this.owner.y + 32);
                Laya.SoundManager.playSound("res/sounds/警告.wav", 1);
            }
            if (this.attacktime == 0) {
                this.attacktime = Math.ceil(Math.random() * 200 + 100);//随机攻击间隔
                this.fires = Laya.Pool.getItemByCreateFun("fire", this.createFire, this);
                this.fires.pos(this.attackpos[0], this.attackpos[1]);
                this.owner.parent.addChildAt(this.fires, 2);
                this.fires.play();
                Laya.SoundManager.playSound("res/sounds/火.mp3", 1);
            }
            if (Math.abs(this.owner.x - this.person.owner.x) <= 64 && Math.abs(this.owner.y - this.person.owner.y) <= 64 && !this.person.protect) {
                this.person.protect = true;
                this.attackSucceed();
            }
            if (this.fires && this.fires._parent != null && (this.person.owner.x - this.fires.x) > -20 && (this.person.owner.x - this.fires.x) < 112 && Math.abs(this.person.owner.y - this.fires.y) <= 32 && !this.person.protect) {
                this.person.protect = true;
                this.attackSucceed();
            }
        }

        onDisable() {
        }
    }

    class Monster extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:life, tips:"生命值", type:Int}*/
            /** @prop {name:attack, tips:"攻击力", type:Int}*/
            /** @prop {name:defense, tips:"防御力", type:Int}*/
            /** @prop {name:experience, tips:"经验", type:Int}*/
            /** @prop {name:gold, tips:"金币", type:Int}*/
            Monster.instance = this;
        }

        onEnable() {
            this.person = Battle_Person.instance;
            this._control = GameControl.instance;
            this.attacktime = 300;//初始攻击间隔300帧
            this.maxLife = this.life;
            this.vita = this.owner.getChildByName("vita");
            this.life_text = this.owner.getChildByName('life');
            this.life_text.text = this.life;
        }

        onTriggerEnter(other, self, contact) {
            if (other.label == "bullet") {
                if (this._control.attack.text - this.defense > 0) {
                    this.life -= (this._control.attack.text - this.defense);
                }
                else {
                    this.life--;
                }
                this.life_text.text = this.life;
                this.vita.width = this.life / this.maxLife * 100;
                Laya.SoundManager.playSound("res/sounds/命中.mp3", 1);
                if (this.life <= 0) {
                    this._control.experience.text = Number(this._control.experience.text) + this.experience;
                    this._control.gold.text = Number(this._control.gold.text) + this.gold;
                    this.person.battle.activeFalse();
                    Laya.Scene.close("battle.scene");
                    for (let i = 0; i < this._control.owner._children.length; i++) {
                        this._control.owner._children[i].active = true;
                    }
                    this._control.monster.removeSelf();
                    this._control.person.keyFlag = false;
                    this._control.tip.text = "战斗胜利 获得金币" + this.gold + " 获得经验" + this.experience;
                    this._control.prompt.visible = true;
                }
            }
        }

        attackSucceed() {
            if (this.attack - this._control.defense.text > 0) {
                this._control.life.text -= (this.attack - this._control.defense.text);
            }
        }

        onUpdate() {
            this.attacktime--;
            if (this.attacktime == 0) {
                this.attacktime = Math.ceil(Math.random() * 200 + 100);//随机攻击间隔
                Laya.Tween.to(this.owner, { x: this.person.owner.x, y: this.person.owner.y }, 1000);
            }
            if (Math.abs(this.owner.x - this.person.owner.x) <= 64 && Math.abs(this.owner.y - this.person.owner.y) <= 64 && !this.person.protect) {
                this.person.protect = true;
                this.attackSucceed();
            }
        }

        onDisable() {
        }
    }

    class Telson extends Laya.Script {

        constructor() { 
            super();
        }
        
        onEnable() {
            this.bat = Bat.instance;
            let speed = (this.owner.x - this.bat.person.owner.x) / ((this.owner.y - this.bat.person.owner.y) / 5);
            this.rig = this.owner.getComponent(Laya.RigidBody);
            this.rig.setVelocity({ x: speed, y: 5 });//速度
        }

        onTriggerEnter(other, self, contact) {
            if (other.label == "person") {
                if (!this.bat.person.protect) {
                    this.bat.person.protect = true;
                    this.bat.attackSucceed();
                }
            }
        }
        
        onUpdate() {
            if (this.owner.x >= 1186 || this.owner.x <= 418 || this.owner.y >= 870) {
                this.owner.removeSelf();
            }
        }

        onDisable() {
            Laya.Pool.recover("telson", this.owner);
        }
    }

    class Thorn extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this.bat = Bat.instance;
        }

        onUpdate() {
            if (Math.abs(this.owner.x - this.bat.person.owner.x) <= 64 && Math.abs(this.owner.y - this.bat.person.owner.y) <= 64 && !this.bat.person.protect) {
                this.bat.person.protect = true;
                this.bat.attackSucceed();
            }
        }

        onDisable() {
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("game/Battle_Person.js",Battle_Person);
    		reg("game/Battle.js",Battle);
    		reg("game/Experience.js",Experience);
    		reg("game/Prop.js",Prop);
    		reg("game/person.js",person);
    		reg("game/GameControl.js",GameControl);
    		reg("game/Introduce.js",Introduce);
    		reg("game/Shop.js",Shop);
    		reg("game/Start.js",Start);
    		reg("game/Transition.js",Transition);
    		reg("game/Bat.js",Bat);
    		reg("game/Bullet.js",Bullet);
    		reg("game/Master.js",Master);
    		reg("game/Monster.js",Monster);
    		reg("game/Telson.js",Telson);
    		reg("game/Thorn.js",Thorn);
        }
    }
    GameConfig.width = 1280;
    GameConfig.height = 960;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "start.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
