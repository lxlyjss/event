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
		                //alert(window.userInfo.userId)
		                window.userInfo.userImg = data._user.userImg;//用户头像
		                //setUserInfo(window.userInfo.name, window.userInfo.userImg, window.userInfo.userId);//设置用户显示
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
//        function setUserInfo(name,img,id){
//            $(".header-user .user-info p img").attr("src",img);
//        }
        if($("#loginOut").length > 0){
        	$("#loginOut").click(function (){
        		window.location.href = window.userInfo.url + "activity/front/loginout";
        	});
        }
    }
});