/**
 * 实现奖牌掉落抽奖动画
 * @type Object|@arr;default_parameters|@arr;parameters
 */
var DropMedals = new Object();

/**
 * 创建动画
 * @param {Json} parameters     参数json
 */
DropMedals.create = function(parameters){

    //定义默认值
    var default_parameters = {
        "main_selector" : "",   //容器css选择器，如：#main
        "msg_selector" : "",    //提示框css选择器，如：#msg
        "animate_time" : 5000,  //掉落动画的时间（ms）
        "medal_scaling" : 2,    //中奖奖牌放大倍数
        "is_winner" : true,     //是否抽中
        "box_width" : window.innerWidth,
        "box_height" : window.innerHeight,
        "callback" : function(){alert("callback");}
    };

    //参数初始化
    for (var key in default_parameters){
        DropMedals[key] = typeof parameters[key] === "undefined" ? default_parameters[key] : parameters[key];
    }
    
    //容器宽高设置
    $(DropMedals.main_selector).width(DropMedals.box_width);
    $(DropMedals.main_selector).height(DropMedals.box_height);

    //获得容器内元素
    DropMedals.li = $(DropMedals.main_selector).children();
    DropMedals.len = DropMedals.li.length;

    //提示框
    DropMedals.msg = $(DropMedals.msg_selector);
    //运行触发器
    DropMedals.trigger();
};

/**
 * 动画及功能触发器
 */
DropMedals.trigger = function(){
    //确保动画执行完整
    if(!DropMedals.li.is(":animated")){
        DropMedals.init(function(){
            DropMedals.play(function(){
                DropMedals.get_medal(function(){
                    DropMedals.callback();
                });
            });
        });
    }
};

/**
 * 初始化奖牌位置及提示
 * @param {function} callback
 */
DropMedals.init = function (callback) {
    //将奖牌置于空中
    DropMedals.li.each(function () {
        $(this).removeAttr("style");
        var li_width = $(this).width();
        var li_height = $(this).height();
        $(this).css({
            position: "absolute",
            display: "block",
            top: -(li_height + Math.random() * 500),
            left: (Math.random() * (DropMedals.box_width - li_width)),
            transform: "rotate("+(30 - Math.random() * 60)+"deg)",
            lineHeight: li_height+"px"
        });
    });
    //随机出本次中奖奖章，并给出提示
    DropMedals.winning_medals = parseInt(Math.random() * (DropMedals.len), 10);
    DropMedals.msg.html("本次随机中奖奖章："+$(DropMedals.li.eq(DropMedals.winning_medals)).html()+"，抽奖中");
    (callback && typeof(callback) === "function") && callback();
};

/**
 * 实现奖牌从空中掉落
 * @param {function} callback
 */
DropMedals.play = function (callback) {
    DropMedals.li.each(function () {
        var li_height = $(this).height();
        $(this).animate({
            top: DropMedals.box_height + li_height
        }, (Math.random() * 1000 + DropMedals.animate_time));
    });
    (callback && typeof(callback) === "function") && callback();
};

/**
 * 随机获取奖章并突出显示，提示中奖信息
 * @param {function} callback
 */
DropMedals.get_medal = function (callback) {
    //判断中奖情况
    if(DropMedals.is_winner){
        var random_medals = DropMedals.winning_medals;
    }else{
        //未中奖的情况，随机抽个奖牌，只要与中奖奖牌不同即可
        var random_medals;
        while(true){
            random_medals = parseInt(Math.random() * (DropMedals.len), 10);
            if(random_medals != DropMedals.winning_medals){
                break;
            }
        }
    }
    //奖牌放大
    var cur_height = $(DropMedals.li.eq(random_medals)).height() * DropMedals.medal_scaling;
    var cur_width = $(DropMedals.li.eq(random_medals)).width() * DropMedals.medal_scaling;
    //居中显示动画
    $(DropMedals.li.eq(random_medals)).animate({
        top: (DropMedals.box_height / 2 - cur_height / 2),
        left: (DropMedals.box_width / 2 - cur_width / 2),
        width: cur_width,
        height: cur_height
    }, "fast" ,function(){
        $(DropMedals.li.eq(random_medals)).css({
            transform:"rotate(0deg)",
            lineHeight: cur_height+"px"
        });
        (callback && typeof(callback) === "function") && callback();
    });
};