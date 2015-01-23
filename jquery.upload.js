/**
 * a jQuery plugin for upload large files via pieces.
 *
 * jpssff@gmail.com
 * 2015-01-23
 *
 */
(function($) {
    $.upload = function(input, args) {
        var $file = $(input);
        var def = $.Deferred();
        if (!($file[0] && $file[0].files && $file[0].files[0])) {
            return def;
        }
        var file = $file[0].files[0];
        var params = args.data || {};
        var name = $file.attr('name');
        var pieceSize = args.pieceSize || 1024 * 1024; //默认1M每片
        var index = -1,
            totalPiece = Math.ceil(file.size / pieceSize);
        var totalSize = file.size;
        var emptyFn = function() {};
        var trueFn = function() {
            return true;
        };
        args.progress = args.progress || emptyFn;
        args.checkProgress = args.checkProgress || trueFn;
        args.before = args.before || trueFn;
        args.success = args.success || emptyFn;
        args.error = args.error || emptyFn;
        if (args.before(file) === false) return def;
        var uploadPiece = function() {
            index++;
            var start = index * pieceSize;
            var end = Math.min(totalSize, start + pieceSize);
            var data = new FormData();
            $.each(params, function(k, v) {
                data.append(k, v);
            });
            data.append('name', name);
            data.append('pieceIndex', index);
            data.append('pieceFileName', file.name);
            data.append('pieceData', file.slice(start, end));
            data.append('pieceTotal', totalPiece);
            $.ajax({
                url: args.url,
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                dataType: 'json'
            }).done(function(res) {
                if (!args.checkProgress(res)) {
                    def.reject(res);
                    return;
                }
                args.progress(index, totalPiece, res);
                if (index == (totalPiece - 1)) {
                    args.success(res);
                    def.resolve(res);
                    return;
                }
                uploadPiece();
            }).fail(function(e) {
                args.error(e);
                def.reject(e);
            });
        };
        uploadPiece();
        return def;
    };
})(jQuery);