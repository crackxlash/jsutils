$.fn.validate = function () {
    if (this.prop('tagName') === 'FORM') {
        var isOk = true;
    
        $.each(this.find('input, select, textarea'), function() {
            if ($(this).attr('required')) {
                if($(this).val() === '' || $(this).parent().hasClass('has-error')) {
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

$.fn.getParams = function(actions, pswdEncrypt) {
    pswdEncrypt === undefined ? false : pswdEncrypt;
    if (this.prop('tagName') === 'FORM') {
        data = {
            params : {},
            options : {}
        };
        
        if (actions) {
            data['action'] = this.attr('data-action') != undefined ? this.attr('data-action') : null;
            data['url'] = this.attr('action') != undefined ? this.attr('action') : null;
        }
    
        
        $.each(this.find('input, select, textarea'), function() {
            if($(this).val() !== '' && $(this).attr('name') != undefined) {
                if($(this).attr('data-form') !== 'not') {
                    if($(this).attr('type') == 'radio') {
                        if ($(this).is(':checked')) {
                            data.params[$(this).attr('name')] = ($(this).attr('data-option') == "on" || $(this).attr('data-option') == '1') ? true : false;
                        }
                    }else if ($(this).attr('type') == 'password') {
                        var pswd = $(this).val();
                        
                        if (pswdEncrypt)
                            pswd = sha512(pswd);

                        data.params[$(this).attr('name')] = pswd;
                    }else if ($(this).attr('type') == 'hidden') {
                        data.options[$(this).attr('name')] = $(this).val();
                    }else if ($(this).attr('type') == 'file') {
                        data[$(this).attr('name')] = $(this)[0].files;
                    }else {
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

$.fn.setParams = function (params) {
    var select;
    if (params) {
        if (this.prop('tagName') === 'FORM') {
            $.each(this.find('input, select, textarea, button'), function() {
                var name = $(this).attr('name');
                if($(this).attr('type') === 'button' || $(this).attr('type') === 'submit') {
                    if ($(this).html() == 'Guardar') {
                        $(this).html('Actualizar').removeClass('btn-primary').addClass('btn-warning');    
                        $(this).attr('data-update', '1');
                    }
                } else if ($(this).attr('type') === 'radio') {
                    if(params[name] != undefined) {
                        if (params[name] && $(this).attr('data-option') == 'on') {
                            $('input[name="'+name+'"]')[1].removeAttribute('checked');
                            $(this).attr('checked', 'checked');
                        } else if (!params[name] && $(this).attr('data-option') == 'off') {                           
                            $('input[name="'+name+'"]')[0].removeAttribute('checked');
                            $(this).attr('checked', 'checked');
                        }
                    }
                }
                
                if (params[name] != undefined) 
                    $(this).val(params[name]);
            });
        }
    }
}

$.fn.onChange = function (now, old) {
    var flag = false,
        query = '',
        changes = {
            Expression : '',
            AttributeValues : {}
        };
        
    if (now) {
        $.each(now.params, function (i, val) {
            if (old[i] !== undefined) {
                if(old[i] != val) {
                    query += i + '=:' + i + ',';
                    changes.AttributeValues[':' + i] = val;
                    flag = true;
                }
            }
        });
        
        if (flag) {
            changes.Expression = 'set ' + query.slice(0, -1);;
            return changes;
        } else {
            return {};
        }
    }
}

$.fn.clear = function() {
    if (this.prop('tagName') === 'FORM') {
        this[0].reset();
        this.find('button').attr('disabled', 'disabled');
    } else {
        console.log(this.prop('tagName') + ' is not Form')
        return false;
    }
};


window.toast = function (message, options) {
    options === undefined ? {} : options;
    var alert,
        position = {
            topRight : {
                top : '12px',
                right : '12px'
            },
            topLeft : {
                top : '12px',
                left : '12px'
            },
            topMiddle : {
                top : '12px',
                right : '12px'
            },
            bottomRight : {
                bottom : '12px',
                right : '12px'
            },
            bottomLeft : {
                bottom : '12px',
                left : '12px'
            },
            bottomMiddle : {
                bottom : '12px',
                right : '12px'
            }
        };
        
    options = jQuery.isEmptyObject(options) ? {
            type : 'default',
            title : 'Alert!',
            icon : 'info',
        } : options;
        
    cssClass = options.class || '';
    timeout = options.timeout != undefined ? 5000 : options.timeout;
    cssPosition = position[options.position] == undefined ? position.topRight : position[options.position];
    alert = '<div class="alert alert-{0} alert-dismissible '+ cssClass +'">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">Ã—</button>' +
                    '<h4><i class="icon fa fa-{1}"></i> {2}</h4>' +
                    '{3}' +
                '</div>';

    $('body').append(alert.format(options.type, options.icon, options.title, message));
    $('body').find('.alert').css({ position: 'absolute',
                   background: '#fbfbfb',
                   'min-width': '200px',
                   'z-index': '999999'});

    $('body').find('.alert').css(cssPosition);
    $('body').stop().animate({scrollTop:0}, '500', 'swing');
    
    setTimeout(function () {
        $('body').find('.alert').fadeOut(2000);
    }, timeout);
}

String.prototype.getExtension = function () {
    var re = /(?:\.([^.]+))?$/;
    return re.exec(this)[1]; 
}

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

String.prototype.padLeft = function (pad) {
    return (pad + this).slice(-pad.length);
}

Date.prototype.format = function (format, separator) {
    format = typeof format !== 'undefined' ? format : 'yyyy-mm-dd';
    separator = typeof separator !== 'undefined' ? separator : '-';

    var year = this.getFullYear(),
        month = (this.getMonth() + 1).toString().padLeft('00'),
        day = this.getDate().toString().padLeft('00');

    switch (format) {
        case 'mmddyyyy': return month + separator + day + separator + year;
            break;
        case 'ddmmyyyy': return day + separator + month + separator + year;
            break;
        case 'yyyymmdd': return year + separator + month + separator + day;
            break;
        case 'yyyyddmm': return year + separator + day + separator + month;
            break;
        default: return year + separator + month + separator + day;
            break;
    }
}
