$(function() {
    var form = layui.form;
    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
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
                    return layer.msg('获取文章列表失败！');
                }
                console.log(res);
                var htmlstr = template('tpi-table',res);
                $('tbody').html(htmlstr); 
            },
        })
    }

    // 为添加类别按钮绑定点击事件
    var index;
    $('#btnAddCate').on('click',function() {
        // 弹出层
        index = layer.open({
            // 弹出层类型
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            // 弹出层宽和高
            area: ['500px','250px'],
          });   
    })

    // 通过代理的形式，为 form-add 绑定 submit 事件
    $('body').on('submit', '#form-add' , function(e) {
        e.preventDefault();
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/article/addcates',
            method: 'POST',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            data: $(this).serialize(),
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('新增分类失败！');
                }
                console.log(res);
                initArtCateList();
                // 根据索引，关闭相应的弹出层
                layer.close(index);
            },
        })
    })

    // 通过代理形式，为编辑按钮绑定点击事件
    var indexEdit;
    $('tbody').on('click', '#btn-edit' , function() {
        indexEdit = layer.open({
            // 弹出层类型
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            // 弹出层宽和高
            area: ['500px','250px'],
          });
          var id = $(this).attr('data-id');
          $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit' , res.data);
            }
          })
    })
    // 通过代理形式，为修改分类绑定点击事件
    $('body').on('submit', '#form-edit' , function(e) {
        e.preventDefault();
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/article/updatecate',
            method: 'POST',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            data: $(this).serialize(),
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('修改失败！');
                }
                console.log(res);
                initArtCateList();
                // 根据索引，关闭相应的弹出层
                layer.close(indexEdit);
            },
        })
    })

    // 通过代理形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete' , function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确定删除？', {icon: 3, title:'提示'}, function(index){
            // console.log(index);
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status != 0){
                        return layer.msg('删除文章类别失败！');
                    }
                    layer.msg('删除文章类别成功！');
                    console.log(res);
                    initArtCateList();
                // 根据索引，关闭相应的弹出层
                    layer.close(index);
                }
              })
        })
    })
})