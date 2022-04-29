$(function() {
    var layer = layui.layer;
    var form = layui.form;
    
    initCate();
     // 初始化富文本编辑器
     var tinyID = 'textarea';
    tinymce.init({
        selector: '#' + tinyID,
        language:'zh_CN',
        plugins : 'image' ,
        toolbar: 'undo redo | styleselect | lineheight| bold italic alignleft aligncenter alignright alignjustify |image',
        // images_upload_url: '/demo/upimg.php',
        // images_upload_base_path: '/demo',
        // content_css: '../css/content.css',
      });
        

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/article/cates',
            method: 'GET',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('初始化文章分类失败！');
                }
                console.log(res);
                // 使用模板引擎渲染数据
                var htmlstr = template('tpi-cate',res);
                $('[name=cate_id]').html(htmlstr); 
                // 因为文档执行 layui.js 之后发现这个下拉列表没有东西，就不会渲染这个下拉列表，等模板引擎和自己定义的这个 js 文件执行之后也不会渲染这个下拉列表，所以要想成功渲染这个下拉列表，就要执行 layui 的 form.render() 属性，让模板引擎和自己定义的 js 文件执行之后重新运行一下 layui 渲染列表
                form.render();
            },
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coveFile').click();
    })

    // 为文件选择框绑定 change 事件
    $('#coveFile').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        console.log(filelist);
        // 判定用户有没有选择文件
        if (filelist.length == 0) {
            return layer.msg('请选择图片');
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        console.log(file);
        // 将文件转化为路径
        var ImgURL = URL.createObjectURL(file);
        console.log(ImgURL);
        // 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', ImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    
    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    // 保存富文本编辑器中的内容
    // function saveContent(){ tinymce.editors[tinyID].save(); }
    
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit',function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存放到 fd 中
        fd.append('state', art_state);
        // 保存富文本编辑器中的内容
        var text = $('#textarea').val();
        console.log(text);
        fd.append('content',text)
        // 将封面裁剪过后的图片输出为一个文件对象
        $image  .cropper('getCroppedCanvas', { 
            // 创建一个 Canvas 画布    
            width: 400,    
            height: 280  
        })  
        .toBlob(function(blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象    
            // 得到文件对象后，进行后续的操作  
            fd.append('cover_img',blob);
            // 发起 Ajax 数据请求
            publishArticle(fd);
        })

    })
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        // setup: function(editor){ 
        //     editor.on('change',function(){ editor.save(); });
        // },
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/article/add',
            method: 'POST',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            data: fd,
            // 如果向服务器提交的是 FormData 格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('发布文章失败！');
                }
                console.log(res);
                layer.msg('发布文章成功！');
                location.href = '../artice/artice_list.html';
            },
        })
    }
})