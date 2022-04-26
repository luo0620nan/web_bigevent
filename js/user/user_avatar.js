$(function () {
    console.log("我导入成功啦！");
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 为上传按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 为文件选择框绑定 change 事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        console.log(filelist);
        // 判定用户有没有选择文件
        if (filelist.length == 0) {
            return layer.msg('请选择图片');
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 将文件转化为路径
        var ImgURL = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', ImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为确定按钮绑定事件
    $('#btnUpload').on('click', function () {
        // 拿到用户裁剪后的图像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            // 调用接口，把头像上传到服务器
            $.ajax({
                // 这个 url 地址的前半段在 baseAPI.js 中拼接了
                url: '/my/update/avatar',
                method: 'POST',
                // headers 就是请求头配置对象
                // 这里的 headers 请求头放到了 baseAPI.js 中
                // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
                data: {
                    avatar: dataURL
                },
                success: function(res){
                    if(res.status != 0){
                        // return console.log(res.message);
                        return layer.msg('更换头像失败！');
                    }
                    console.log(res);
                    layer.msg('更换头像成功！');
                    // 调用父页面中的信息，重新渲染用户头像和用户信息
                    window.parent.getUserInfo();     
                },
            })
    })
})