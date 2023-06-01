$(function() {
    initArtCaseList()
    var layer = layui.layer
    
    function initArtCaseList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            ,content: $('#dialog-add').html()
          });
    })

    // 通过代理的形式
    $('body').on('submit','#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCaseList()
                layer.close(indexAdd)
            }
        })
    })
    // 编辑
    var form = layui.form
    var indexEdit = null
    $('body').on('click','#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            ,content: $('#dialog-edit').html()
          });
          var id = $('.btn-edit').attr('data-id')
          $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            
            success: function(res) {
                form.val('form-edit', res.data)
                
            }
        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.close(indexEdit)
                initArtCaseList()
            }
        })
    })

    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('is not?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败')
                    }
                    initArtCaseList()
                }
            })
            layer.close(index);
          });
    })
})