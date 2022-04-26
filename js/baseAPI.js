// 注意每次调用$.get() 或 $.post() 或 $.ajax() 的时候会先调用ajaxPrefilter
// 这个函数，在这个函数中，可以拿到我们给ajax提供的配置对象
// ajaxPrefilter 是 jQuery 的 Ajax 中提供的（相当于内置对象）
$.ajaxPrefilter(function(options){
    console.log(options);
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);

    // 统一为有权限的接口设置 headers 请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    // 不管成功或者是失败，都会执行 complete
    options.complete = function(res) {
        console.log(res);
            // 在 complete 回调函数中，可以用 responseJSON 拿到服务器的响应数据
            if(res.responseJSON.status == 1 || res.responseJSON.message == '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token');
                // 强制跳转到登录页面
                location.href = 'login.html';
            }
    }
    
})