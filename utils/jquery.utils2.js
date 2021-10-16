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
 * getParams
 * @param {bool} actions 
 * @param {bool} pswdEncrypt 
 * @returns 
 */
$.fn.getParams = function (actions, pswdEncrypt) {
    pswdEncrypt = typeof pswdEncrypt !== 'undefined' ? pswdEncrypt : false;

    if (this.prop('tagName') === 'FORM') {
        data = {
            params: {},
            options: {},
            outside: false
        };

        if (actions) {
            data.options['action'] = this.attr('data-action') != undefined ? this.attr('data-action') : null;
            data.options['url'] = this.attr('action') != undefined ? this.attr('action') : null;
        }


        $.each(this.find('input, select, textarea'), function () {
            if ($(this).val() !== '' && $(this).attr('name') != undefined) {
                if ($(this).attr('data-form') !== 'not') {
                    if ($(this).attr('type') == 'radio') {
                        if ($(this).is(':checked')) {
                            data.params[$(this).attr('name')] = ($(this).attr('data-option') == "on" || $(this).attr('data-option') == '1') ? true : false;
                        }
                    } else if ($(this).attr('type') == 'password') {
                        var pswd = $(this).val();

                        if (pswdEncrypt)
                            pswd = sha512(pswd);

                        data.params[$(this).attr('name')] = pswd;
                    } else if ($(this).attr('type') == 'hidden') {
                        data.options[$(this).attr('name')] = $(this).val();
                    } else if ($(this).attr('type') == 'file') {
                        data[$(this).attr('name')] = $(this)[0].files[0];
                    } else if ($(this).attr('type') == 'button') {

                    } else {
                        data.params[$(this).attr('name')] = $(this).val();
                    }
                }
            }
        });

        return data;
    } else {
        console.log(this.prop('tagName') + ' is not Form')
        return false;
    }
};
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