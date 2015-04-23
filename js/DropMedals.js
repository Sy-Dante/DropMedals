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
 * 实现抽奖
 * 已知问题：
 *      1、提示时间无法控制，过早提示中奖情况
 *      2、因为过早提示中奖情况，用户可在动画未完成时再次点击抽奖按钮，造成动画效果不理想
 */
var DropMedals = {
    
    /**
     * 创建抽奖功能
     * @param {string} main_selector    奖牌容器的css选择器，如：#main_selector
     * @param {type} click_selector     抽奖按钮的css选择器 或 设为onload，如：#start
     */
    create: function (main_selector, click_selector) {
        //容器宽高设为全屏
        $(main_selector).width(box_width);
        $(main_selector).height(box_height);
        
        this.li = $(main_selector).children();
        this.len = this.li.length;
        //创建一个提示
//        $('body').append("<div id='medals_msg'></div>");
//        this.msg=$('#medals_msg');
//        this.msg.hide();
        
        //设为载入即抽奖
        if (click_selector === "onload") {
            this.init();
            setTimeout(function(){
                DropMedals.play();
                setTimeout(function(){
                    DropMedals.get_medal();
                }, interval_time*5);
            }, interval_time);
        } else {
            //绑定抽奖按钮
            this.click_button = $(click_selector);
            this.click_button.click(function () {
                DropMedals.init();
                setTimeout(function(){
                    DropMedals.play();
                    setTimeout(function(){
                        DropMedals.get_medal();
                    }, interval_time*5);
                }, interval_time);
            });
        }
    },
    
    /**
     * 初始化
     */
    init: function () {
        //将奖牌置于空中
        this.li.each(function () {
            var li_width = $(this).width();
            var li_height = $(this).height();
            $(this).removeAttr("style");
            $(this).css({
                position: "absolute",
                display: "block",
                top: -(li_height + Math.random() * 500),
                left: (Math.random() * (box_width - li_width))
            });
        });
        //随机出本次中奖奖章，并给出提示
        this.winning_medals = parseInt(Math.random() * (this.len), 10);
//        this.msg.html("<h2>中奖号为："+$(this.li.eq(this.winning_medals)).html()+"</h2>");
//        this.msg.show("slow");
        this.click_button.html("本次随机中奖奖章："+$(this.li.eq(this.winning_medals)).html()+"，抽奖中");
        this.click_button.attr("disabled","disabled");
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
        var random_medals = parseInt(Math.random() * (this.len), 10);
        var cur_height = $(this.li.eq(random_medals)).height() * medal_scaling;
        var cur_width = $(this.li.eq(random_medals)).width() * medal_scaling;
        $(this.li.eq(random_medals)).animate({
            top: (box_height / 2 - cur_height / 2),
            left: (box_width / 2 - cur_width / 2),
            width: cur_width,
            height: cur_height
        }, "fast");
        if(random_medals === this.winning_medals){
//            this.msg.html("<h2>恭喜中奖！</h2>");
            this.click_button.html("恭喜你中奖，填写邮箱领取游戏礼包！");
        }else{
//            this.msg.html("<h2>很遗憾！你中的是："+$(this.li.eq(random_medals)).html()+"</h2>");
            this.click_button.html("对不起，没有中奖，原因可能是……你这个人太懒！，再撸一次！");
            this.click_button.removeAttr("disabled");
        }
//        this.msg.show("slow");
//        alert("box{ "+box_width+" , "+box_height+" } cur{ "+cur_width+" , "+cur_height+" } x,y{ "+(box_height / 2 - cur_height / 2)+" , "+(box_width / 2 - cur_width / 2)+" }")
    }
};