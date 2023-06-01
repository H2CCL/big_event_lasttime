var layer = layui.layer
// 1.
var $image = $('#image')
// 2.
const options = {
    aspectRatio: 1,
    preview: '.img-preview'
}
// 3.
$image.cropper(options)

$('#btnChooseImage').on('click', function() {
    $('#file').click()
})

$('#file').on('change', function(e) {
    var files = e.target.files
    if (files.length === 0) {
        return layer.msg('请选择照片')
    }
    var imageURL = URL.createObjectURL(files[0])
    $image.cropper('destroy').attr('src', imageURL).cropper(options)
})

$('#btnChooseImage').on('click', function() {
    var dataURL = $image.cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    }).toDataURL('image/png')

    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('更新头像失败')
            }
            layer.msg('更新头像成功')
            window.parent.getUserInfo()
        }
    })
})