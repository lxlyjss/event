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
        // userId:"",//用户id
        userId:"10",
        roleImg:"",//用户头像
        token:"",//用户登录的token
        // url:"http://sport.72bike.com/"//网址
        url:"http://192.168.9.17:8080/",
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
        //alert(window.userInfo.token);
        if (window.userInfo.token != "" && window.userInfo.token != null) {
            $.ajax({
                url:window.userInfo.url+"sso/sso/check.do",
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
    };
    $.fn.getUrlData = function (url,val){
        var url = url.slice(1).split("&");
        for(var i = 0;i < url.length;i++){
            if(url[i].indexOf(val) != -1){
                var index = url[i].indexOf("=");
                return url[i].slice(index+1);
            }
        }
        return null;
    };
    //微信分享
    $.fn.weShare = function (shareData){
        $.ajax({
            url:window.userInfo.url+"activity/front/activity/shareInfo",
            type:"GET",
            data:shareData,
            async:true,
            dataType:"json",
            success:function (data){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                    appId: data.sign.appId, // 必填，公众号的唯一标识
                    timestamp: data.sign.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.sign.nonceStr, // 必填，生成签名的随机串
                    signature: data.sign.signature,// 必填，签名，见附录1
                    jsApiList: [
                        "onMenuShareTimeline",
                        "onMenuShareAppMessage"
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                if(data){
                    weixin(data,shareData);
                }
                wx.error(function (res) {
                    //alert(res);
                });

            },
            error:function (error){
                console.log(error)
            }
        });
        function weixin(data,shareData){
            wx.ready(function(res) {
                wx.onMenuShareAppMessage({
                    title: data.share.title,
                    desc:data.share.des,
                    link: data.share.link,
                    imgUrl: data.share.imgUrl,
                    trigger: function(res) {},
                    success: function(res) {
                        $.ajax({
                            url:window.userInfo.url+"activity/front/activity/share",
                            data:{
                                userId:shareData.userId,
                                activityId:shareData.activityId,
                                type:"1"//朋友
                            },
                            dataType:"json",
                            success:function (result){
                                if(result.result == 1){
                                    //alert("分享成功");
                                }
                            },
                            error:function (error){
                                //alert("分享失败!");
                            }
                        });
                    },
                    cancel: function(res) {},
                    fail: function(res) {}
                });
                wx.onMenuShareTimeline({
                    title: data.share.title,
                    desc:data.share.des,
                    link: data.share.link,
                    imgUrl: data.share.imgUrl,
                    trigger: function(res) {},
                    success: function(res) {
                        $.ajax({
                            url:window.userInfo.url+"activity/front/activity/share",
                            data:{
                                userId:shareData.userId,
                                activityId:shareData.activityId,
                                type:"0"//朋友圈
                            },
                            dataType:"json",
                            success:function (result){
                                if(result.result == 1){
                                    //alert("分享成功");
                                }
                            },
                            error:function (error){
                                //alert("分享失败!");
                            }
                        });
                    },
                    cancel: function(res) {},
                    fail: function(res) {}
                });
            });
        }
    }
});