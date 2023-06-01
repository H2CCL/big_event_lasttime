$(function() {
    var form = layui.form
    var layer = layui.layer
    $('#link_reg').on('click', function() {
        $('.login_box').hide()
        $('.reg_box').show()
    })
    $('#link_login').on('click', function() {
        $('.login_box').show()
        $('.reg_box').hide()
    })
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var pwd = $('[name=password]').val()
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.post('/api/reguser', {username: $('#form_reg[name=username]').val(), password: $('#form_reg[name=password]').val()}, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
        })
    })
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')

                localStorage.setItem('token', res.token)

                location.href = '/index.html'
            }
        })
    })
})