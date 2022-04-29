$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 分页
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dt.getDate();
        d = d < 10 ? '0' + d : d;
        var hh = dt.getHours();
        hh = hh < 10 ? '0' + hh : hh;
        var mm = dt.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;
        var ss = dt.getSeconds();
        ss = ss < 10 ? '0' + ss : ss;

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' +ss
    }

    // 定义一个查询的参数对象,将来请求数据的时候,需要将参数提交到服务器
    var q = {
        pagenum: 1,      //页码值，默认第一次请求的数据
        pagesize: 2,     //每页显示几条数据，默认显示两条
        cate_id: '',     //文章分类的id
        state: ''        //文章的发布状态
    }

    
    // 获取文章列表数据
    initTabList();
    // 初始化文章列表分类
    initCate();
    // 获取文章列表数据的方法
    function initTabList() {
        $.ajax({
            // 这个 url 地址的前半段在 baseAPI.js 中拼接了
            url: '/my/article/list',
            method: 'GET',
            // headers 就是请求头配置对象
            // 这里的 headers 请求头放到了 baseAPI.js 中
            // 像 login.js 中的请求 URL地址拼接一样麻烦，就封装到了 baseAPI.js 中
            data: q,
            success: function(res){
                if(res.status != 0){
                    // return console.log(res.message);
                    return layer.msg('获取文章列表失败！');
                }
                console.log(res);
                // 使用模板引擎渲染数据
                var htmlstr = template('tpi-table',res);
                $('tbody').html(htmlstr); 
                // 调用渲染分页的方法
                renderPage(res.total);
            },
        })
    }

    // 初始化文章列表分类
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
                    return layer.msg('获取文章列表失败！');
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

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        // 获取表单选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state').val();
        // 未查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的参数对象重新渲染数据
        initTabList();
    })

    // 定义渲染分页的方法
    // 当表格渲染完成之后，调用这个分页方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID   注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,   // 每页显示几条数据
            curr: q.pagenum,     // 默认被选中的分页
            layout: ['count','limit','prev','page','next','skip'],
            limits: [2,3,5,10],
            // 分页发生切换时，触发这个回调函数
            // 触发 jump 回调的方式有两种
            // 1、点击页码的时候，会触发 jump 回调函数
            // 2、只要调用了 laypage.render() 方法，就会触发 jump 回调
            // 所以第二种触发 jump 回调的方法是造成死循环的原因
            jump: function(obj , frist) {
                // 可以用过 frist 的值来判断是通过那种方式触发的 jump 回调
                // 当页面执行第二种触发方法时，frist 的值为 true
                // 当页面执行第一种触发方法时，frist 的值为 undefined
                // 把最新的页码值赋值到 q 参数对象
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 参数对象获取对应的数据列表，并重新渲染数据
                // 直接调用 initTabList() 会发生死循环
                if(!frist) {  //!frist 取反的意思
                    initTabList();
                }
            }
          });
    }

    // 通过代理形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete' , function() {
        var id = $(this).attr('data-id');
        // 获取删除按钮的个数
        var len = $('#btn-delete').length;
        console.log(len);
        // 提示用户是否要删除
        layer.confirm('确定删除？', {icon: 3, title:'提示'}, function(index){
            // console.log(index);
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status != 0){
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    console.log(res);
                    // 当数据删除完成之后，需要判断当前这一页中还有没有剩余的数据，如果没有剩余的数据，则让页码值减1之后，再重新调用 initTabList() 方法
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    initTabList();
                    // 根据索引，关闭相应的弹出层
                    layer.close(index);
                    initTabList();
                }
              })
        })
    })

    // 通过代理的形式，为编辑按钮绑定点击事件
    $('tbody').on('click', '#btn-compile' , function() {
        // 获取这个按钮对应的文章id
        var id = $(this).attr('data-id');
        console.log(id);
        location.href = '../artice/artice_comp.html?id=' + id;
    })
})