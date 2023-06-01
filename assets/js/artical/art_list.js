$(function() {
    var layer = layui.layer
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = Padzero(dt.getMonth() + 1)
        var d = Padzero(dt.getDate())

        var hh = Padzero(dt.getHours())
        var mm = Padzero(dt.getMinutes())
        var ss = Padzero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    // 补零
    function Padzero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initCate()
    var form = layui.form
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('#tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 分页
    var laypage = layui.laypage
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            jump: function(obj, first) {
                q.pagesize = obj.limit
                q.pagenum = obj.curr
                if (!first) {
                    initTable()
                }
            }
        })
    }

    $('body').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagesize = q.pagesize === 1 ? 1 : q.pagesize - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})