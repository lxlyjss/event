$(function (){
    //活动详情页切换显示组别
    $(".content-top ul li").each(function (index){
        $(".content-top ul li").eq(index).click(function (){
            $(this).addClass("active").siblings().removeClass("active");
            $(".content-page").eq(index).show().siblings(".content-page").hide();
        });
    });
    //每页头像点击显示菜单
    $(".header-user .user-info").click(function (e){
        e.stopPropagation();
        $("header .user-list").slideDown(200);
    });
    $(window).click(function (e){
        e.stopPropagation();
        $("header .user-list").slideUp(200);
    });
    
    //登录
    window.userInfo = {
        name:"",//用户名
        userId:"",//用户id
        roleImg:"",//用户头像
        token:"",//用户登录的token
        url:"http://sport.72bike.com/"//网址
    };
    $.fn.setCookie = function (name,value){
        var path="";
        var cookiePath = "/";
        if(cookiePath!=null){
            path="; path="+cookiePath;
        }
        document.cookie = name + "="+ decodeURI(value)+ path + ";expires=Session";
    }
    $.fn.getCookie = function (name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return encodeURI(arr[2]);
        }else{
            return null;
        }
    }
    $.fn.isSign = function () {
        window.userInfo.token = $.fn.getCookie("token");//获取token
        if (window.userInfo.token != "" && window.userInfo.token != null) {
            $.ajax({
                url:"http://sport.72bike.com/sso/sso/check.do",
                dataType:"json",
                data:{"token":window.userInfo.token},
                async:false,
                timeout:"20000",
                success:function (data){
		            if (data._status == true) {//判断该用户已登录
		                window.userInfo.name = data._user.nickname;//用户名
		                window.userInfo.userId = data._user.id;//用户id
		                window.userInfo.userImg = data._user.userImg;//用户头像
		            } else {//未登录则跳转
		                //alert("你好,请重新登录!");
		                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf509754d3d6886a6&redirect_uri=http%3a%2f%2fsport.72bike.com%2factivity%2ffront%2fwxLogin&response_type=code&scope=snsapi_login&connect_redirect=1#wechat_redirect";//微信登录
		            }
                },
                error:function (){
                	//alert("载入失败!请重新刷新网页!");
                	 window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf509754d3d6886a6&redirect_uri=http%3a%2f%2fsport.72bike.com%2factivity%2ffront%2fwxLogin&response_type=code&scope=snsapi_login&connect_redirect=1#wechat_redirect";//微信登录
                }
            });
        } else {
            //未获取到token
            //alert("你好,请重新登录!");
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf509754d3d6886a6&redirect_uri=http%3a%2f%2fsport.72bike.com%2factivity%2ffront%2fwxLogin&response_type=code&scope=snsapi_login&connect_redirect=1#wechat_redirect";//微信登录
        }
        if($("#loginOut").length > 0){
        	$("#loginOut").click(function (){
        		window.location.href = window.userInfo.url + "activity/front/loginout";
        	});
        }
    }
    //微信分享
    $.fn.wxShare = function (){
        $.ajax({
            url:window.userInfo.url+"",
            data:{
                url:""
            },
            dataType:"json",
            success:function (result){
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: '', // 必填，公众号的唯一标识
                    timestamp: '', // 必填，生成签名的时间戳
                    nonceStr: '', // 必填，生成签名的随机串
                    signature: '',// 必填，签名，见附录1
                    jsApiList: [
                        "onMenuShareTimeline",
                        "onMenuShareAppMessage"
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function (){
                    wx.onMenuShareTimeline({
                        title: '', // 分享标题
                        link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: '', // 分享标题
                        desc: '', // 分享描述
                        link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: '', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });
            },
            error:function (){
                alert("获取微信分享接口失败!")
            }
        })
    }
});