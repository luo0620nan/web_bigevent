$(function(){
    console.log('我导入成功啦！');

    var form = layui.form;
    form.verify({
        nickname: function(value){
            if(value.length > 6) {
                return '昵称长度必须在 1~6 个字符之间'
            }
        }
    })
    initUserInfo();

    function initUserInfo() {
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
                // 调用 form.val() 为表单快速赋值
                form.val('formUserInfo' , res.data);
            },
        })
    }

    // 重置表单数据
    $('#btnReset').on('click',function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 调用初始化信息
        initUserInfo();
    })

    $('.layui-form').on('submit',function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/userinfo',
            method: 'POST',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            data: $(this).serialize(),
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('更新用户信息失败');
                }
                console.log(res);
                layer.msg('更新用户信息成功');
                // 调用 form.val() 为表单快速赋值
                // form.val('formUserInfo' , res.data);

                // 调用父页面中的信息，重新渲染用户头像和用户信息
                window.parent.getUserInfo();
            },
        })
    })
})