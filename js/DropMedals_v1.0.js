//屏幕宽高
var box_width = window.innerWidth;
var box_height = window.innerHeight;
//从初始化到奖牌掉落的时间间隔
var interval_time = 1000;
//奖牌掉落的动画基础时间
var medal_animate = 3000;
//抽中奖牌的显示大小
var medal_scaling = 2;

/**
 * 实现奖牌掉落并抽奖
 * 基于Jquery，请先载入Jquery包
 * @author SY
 */
var DropMedals = {
    
    /**
     * 创建抽奖功能
     * @param {string} main_selector    奖牌容器的css选择器，如：#main_selector
     * @param {string} click_selector     抽奖按钮的css选择器 或 设为onload，如：#start
     * @param {string} msg_selector     抽奖提示信息的css选择器，如：#start
     */
    create: function (main_selector, click_selector, msg_selector) {
        //容器宽高设为全屏
        $(main_selector).width(box_width);
        $(main_selector).height(box_height);
        
        //获得容器内元素
        this.li = $(main_selector).children();
        this.len = this.li.length;
        
        //提示框和按钮
        this.msg = $(msg_selector);
        this.click_button = $(click_selector);
        
        if (click_selector === "onload") {
            //设为载入即抽奖
            DropMedals.trigger();
        } else {
            //绑定抽奖按钮
            this.click_button.click(function () {
                    DropMedals.trigger();
            });
        }
    },
    
    /**
     * 动画及功能触发器
     */
    trigger: function(){
        DropMedals.init();
        setTimeout(function(){
            DropMedals.play();
            setTimeout(function(){
                DropMedals.get_medal();
            }, interval_time*5);
        }, interval_time);
    },
    
    /**
     * 初始化奖牌位置及提示
     */
    init: function () {
        //将奖牌置于空中
        this.li.each(function () {
            $(this).removeAttr("style");
            var li_width = $(this).width();
            var li_height = $(this).height();
            $(this).css({
                position: "absolute",
                display: "block",
                top: -(li_height + Math.random() * 500),
                left: (Math.random() * (box_width - li_width)),
                transform: "rotate("+(30 - Math.random() * 60)+"deg)",
                lineHeight: li_height+"px"
            });
        });
        //随机出本次中奖奖章，并给出提示
        this.winning_medals = parseInt(Math.random() * (this.len), 10);
        this.msg.html("本次随机中奖奖章："+$(this.li.eq(this.winning_medals)).html()+"，抽奖中");
        this.click_button.unbind("click");
//        alert(this.click_button.html());
    },
    
    /**
     * 实现奖牌从空中掉落
     */
    play: function () {
        this.li.each(function () {
            var li_height = $(this).height();
            $(this).animate({
                top: box_height + li_height
            }, (Math.random() * 1000 + medal_animate));
        });
    },
    
    /**
     * 随机获取奖章并突出显示，提示中奖信息
     */
    get_medal: function () {
        //随机取奖牌
        var random_medals = parseInt(Math.random() * (this.len), 10);
        //奖牌放大
        var cur_height = $(this.li.eq(random_medals)).height() * medal_scaling;
        var cur_width = $(this.li.eq(random_medals)).width() * medal_scaling;
        //居中显示动画
        $(this.li.eq(random_medals)).animate({
            top: (box_height / 2 - cur_height / 2),
            left: (box_width / 2 - cur_width / 2),
            width: cur_width,
            height: cur_height
        }, "fast");
        //调整样式
        setTimeout(function(){
            $(DropMedals.li.eq(random_medals)).css({
                transform:"rotate(0deg)",
                lineHeight: cur_height+"px"
            });
        }, 0.01);
        //判断中奖情况
        if(random_medals === this.winning_medals){
            this.msg.html("恭喜你中奖，填写<a href='javascript:;'>邮箱</a>领取游戏礼包！");
        }else{
            this.msg.html("对不起，没有中奖，原因可能是……你这个人太懒！，再撸一次！");
            this.click_button.click(function () {
                DropMedals.trigger();
            });
        }
    }
};