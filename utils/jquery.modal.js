/**
 * Validate form based in Bootstrap
 * @returns 
 */
$.fn.validate = function () {
    if (this.prop('tagName') === 'FORM') {
        var isOk = true;

        $.each(this.find('input, select, textarea'), function () {
            if ($(this).attr('required')) {
                if ($(this).val() === '' || $(this).parent().hasClass('has-error')) {
                    $(this).focus().blur().focus();
                    isOk = false;
                    return false;
                }
            }
        });

        return isOk;
    } else {
        console.log(this.prop('tagName') + ' is not Form')
        return false;
    }
}
/**
 * 
 * @param {Object} params 
 */
$.fn.loadData = function (params) {
    if (params.buttonOK !== undefined) {
        var attr = params.buttonOK.options === undefined ? null : params.buttonOK.options;
        var $btnSave = $('<button/>')
            .addClass('psld btn btn-' + params.buttonOK.class)
            .html(params.buttonOK.text);
        $btnSave.attr('onclick', params.buttonOK.method);
        if (attr != null) $btnSave.attr(attr);
    }

    $(this).removeClass('bd-example-modal-sm');
    $(this).find('.modal-dialog').removeClass('modal-sm');
    $(this).removeClass('bd-example-modal-lg');
    $(this).find('.modal-dialog').removeClass('modal-lg');

    if (params.size !== undefined) {
        $(this).addClass(params.size.contentCls);
        $(this).find('.modal-dialog').addClass(params.size.bodyCls);
    }

    $(this).find('.modal-title').empty().html(params.title);
    $(this).find('.modal-body').empty().html(params.body);
    $(this).find('.modal-footer').find('.psld').remove();
    $(this).find('.modal-footer').append($btnSave);
    $(this).find('.modal-footer').removeClass('d-none');
    if (!params.visibleFooter) $(this).find('.modal-footer').addClass('d-none');
}