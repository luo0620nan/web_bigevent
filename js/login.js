$(function () {
    // 点击去注册账号
    $('#link_reg').on('click',function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录账号
    $('#link_login').on('click',function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从 layui 上获取 form对象
    var form = layui.form;
    // 通过 form.verify() 函数自定义检验规则
    form.verify({
        // 自定义了一个叫 pwd 的密码校验
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位,且不能出现空格'
        ],
        repwd: function(value) {
            // 通过形参拿到的是密码框中的内容
            // 还需要拿到输入框中的内容
            // 然后进行一次是否相等的判断
            // 如果判断失败，则return一个消息即可
            var pwd = $('.reg-box [name=password').val();
            if(pwd != value) {
                return '两次密码输入不一致！';
            }
        }
    })
    var layer = layui.layer;
    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        // 发起 Ajax 请求
        var data = {username: $('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()};
        // 这个 url 地址的前半段在 baseAPI.js 中拼接了
        $.post('/api/reguser', data , function(res) {
            console.log(res);
            if(res.status != 0){
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            layer.msg('注册成功！');
            // 模拟鼠标再一次点击事件,使当前的注册页面跳转到登录页面
            $('#link_login').click();
        })
    })
    // 监听登录表单的提交请求
    $('#form_login').submit(function(e){
        e.preventDefault();
        // var data = $(this).serialize();  //这句话获取不到表单内的值
        var data = {username: $('#form_login [name=username]').val(),password:$('#form_login [name=password]').val()}
        console.log(data);
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/api/login',
            method: 'POST',
            // 快速获取表单里的数据
            data: data,
            success: function(res){
                console.log(res);
                if(res.status != 0){
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功！');
                console.log(res.token);
                // 将登陆成功的字符串保存到 localStorage 中
                localStorage.setItem('token',res.token);
                location.href = 'index.html';
            }
        })
    })
})

// api文档地址
// https://www.showdoc.com.cn/escook?page_id=3707158761215217