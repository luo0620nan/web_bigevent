$(function(){
    // 调用 getUserInfo() 获取用户的基本信息
    getUserInfo();

    // 点击退出按钮，退出登录
    $('#btnLogout').on('click',function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            console.log(1111);
            // 清空本地存储中的token
            localStorage.removeItem('token');
            // 重新跳转到登录页面
            location.href = 'login.html';

            layer.close(index);
        });     
          
    })
})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        // 这个 url 地址的前半段在 baseAPI.js 中拼接了
        url: '/my/userinfo',
        method: 'GET',
        // headers 就是请求头配置对象
        // 这里的 headers 请求头放到了 baseAPI.js 中
        // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
        success: function(res){
            if(res.status != 0){
                // return console.log(res.message);
                return layer.msg('获取用户基本信息失败');
            }
            console.log(res);
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },
        
        // complete: function(res) {
            
        // }
    })
}

function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    // 渲染图片头像
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var frist = name[0].toUpperCase();
        $('.text-avatar').html(frist).show();
    }
    
}