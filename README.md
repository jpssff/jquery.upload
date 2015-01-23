# jquery.upload
a jQuery plugin for upload large files via pieces.

## Demo

```html
$('#upload').click(function(){
    var log = function(msg){
        $('#info').text(msg);
    };
    $.upload($('#file'), {
        url: 'upload.php',
        before: function(file) {
            return true;
        },
        progress: function(index, total, res){
            log('pieces:' + (index + 1) + '/' + total + 'done.');
        },
        checkProgress: function(res){
            return res.status == 0;
        }
    })
    .done(function(){
        log('done');
    })
    .fail(function(e){
        log('error:' + JSON.stringify(e));
    });
});
```