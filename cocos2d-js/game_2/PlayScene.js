﻿var PlayLayer = cc.Layer.extend({
    bgSprite: null,
    targetSprites: null,
    score: 0,
    timeout: 60,
    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.Target_plist);
        //console.log("cc.spriteFrameCache", cc.spriteFrameCache);
        //cc.spriteFrameCache.addSpriteFrames(new cc.SpriteFrame(res.Target_plist));
        var size = cc.winSize;
        this.bgSprite = new cc.Sprite(res.Background_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            rotation: 0
        });
        this.addChild(this.bgSprite, 0);
        this.targetSprites = [];

        this.schedule(this.update, 1, 16 * 1024, 1);

        this.scoreLabel = new cc.LabelTTF("score:0", "Arial", 36);
        this.scoreLabel.attr({
            x: size.width - 70,
            y: size.height - 20,
            fillStyle: cc.color("#000")
        });
        this.addChild(this.scoreLabel, 5);

        this.timeoutLabel = new cc.LabelTTF("time:" + this.timeout, "Arial", 36);
        this.timeoutLabel.x = 70;
        this.timeoutLabel.y = size.height - 20;
        this.timeoutLabel.fillStyle = cc.color("#000");
        this.addChild(this.timeoutLabel, 5);

        this.schedule(this.timer, 1, this.timeout, 1);

        return true;
    },
    addTarget: function () {
        //var target = new cc.Sprite(res.Target_png);
        var target = new TargetSprite(res.Target_png);
        var size = cc.winSize;

        var x = target.width / 2 + (size.width - target.width) * cc.random0To1();

        target.attr({
            x: x,
            y: size.height - 30
        });
        this.addChild(target, 5);
        var dorpAction = cc.MoveTo.create(2, cc.p(target.x, -30));
        target.runAction(dorpAction);
        this.targetSprites.push(target);
    },
    removeTarget: function () {
        for (var i = 0 ; i < this.targetSprites.length ; ++i) {
            if (0 >= this.targetSprites[i].y) {
                this.targetSprites[i].removeFromParent();
                this.targetSprites[i] = undefined;
                this.targetSprites.splice(i, 1);
                i--;
            }
        }
        console.log("remove target ...");
    },
    update: function () {
        this.addTarget();
        this.removeTarget();
    },
    addScore: function () {
        this.score += 1;
        this.scoreLabel.setString("score:" + this.score);
    },
    timer: function () {
        if (this.timeout == 0) {
            var gameOver = new cc.LayerColor(cc.color(225, 225, 225, 100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("Game Over", "Arial", 38);
            titleLabel.attr({
                x: size.width / 2,
                y: size.height / 2
            });
            gameOver.addChild(titleLabel, 5);
            var TryAgainItem = new cc.MenuItemFont("Try Again", function () {
                console.log("try again");
                //var transition = cc.TransitionFade(1,new PlayScene(),cc.color(225,225,225,225));
                //cc.director.runScene(transition);

                cc.director.runScene(new PlayScene());
            }, this);
            TryAgainItem.attr({
                x: size.width / 2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });
            var menu = new cc.Menu(TryAgainItem);
            menu.x = 0;
            menu.y = 0;
            gameOver.addChild(menu, 1);
            this.getParent().addChild(gameOver);
            this.unschedule(this.update);
            this.unschedule(this.timer);
            return;
        }
        this.timeout -= 1;
        this.timeoutLabel.setString("time:" + this.timeout);
    }
});

var currentLayer = null;
var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PlayLayer();
        currentLayer = layer;
        this.addChild(layer);
    }
});