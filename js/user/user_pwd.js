$(function(){
    console.log('我导入成功啦!');
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位,且不能出现空格'
          ],
        samePwd: function(value) {
            if(value == $('#oldPwd').val()) {
                return '新密码不能和旧密码一致'
            }
        },
        rePwd: function(value) {
            if(value !== $('#newPwd').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    $('.layui-form').on('submit',function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/updatepwd',
            method: 'POST',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            data: $(this).serialize(),
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('密码修改失败！');
                }
                console.log(res);
                layer.msg('密码修改成功！');
                // 重置表单
                // form 表单有个 reset() 方法，可以重置表单信息，不过是原生 js 方法
                // 所以要把 jQuery 转换成原生 js
                $('.layui-form')[0].reset();            
            },
        })
    })
})