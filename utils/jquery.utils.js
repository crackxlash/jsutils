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
    pswdEncrypt = typeof pswdEncrypt !== 'undefined' ? pswdEncrypt : false;

    if (this.prop('tagName') === 'FORM') {
        data = {
            params : {},
            options : {}
        };
        
        if (actions) {
            data.options['action'] = this.attr('data-action') != undefined ? this.attr('data-action') : null;
            data.options['url'] = this.attr('action') != undefined ? this.attr('action') : null;
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
                        data[$(this).attr('name')] = $(this)[0].files[0];
                    }else if ($(this).attr('type') == 'button') {
                        
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
	    $('body').find('.btn-save').html('Actualizar').removeClass('btn-primary').addClass('btn-warning');
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
                
                if (params[name] != undefined) {
                    $(this).val(params[name]);
		}
		else {
	            $(this).parent().find('.form-group').remove();
		}
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
	$('body').find('.btn-save').html('Guardar').removeClass('btn-warning').addClass('btn-primary');
    } else {
        console.log(this.prop('tagName') + ' is not Form')
        return false;
    }
};

$.fn.fill = function(optionDefault, key, value, data) {
    optionDefault = typeof optionDefault === undefined ? 'una opción' : optionDefault;
    if (this.prop('tagName') === 'SELECT') {
	var option = '<option value="default">Selecciona ' + optionDefault + '</option>';
	$(this).empty();
	$.each(data, function (i, val) {
	    option += '<option value="' + val[key] + '"> ' + val[value] + ' </option>';
	});
	
	$(this).append(option);
    } else {
        console.log(this.prop('tagName') + ' is not select')
        return false;
    }
};

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

String.prototype.urlParamsUnique = function() {
	var p = '',
		bef = null,
    	url = this.split('?'),
    	getParams = url[1].split('&');
        
	getParams.forEach(function(qs) {
    	if(qs.split('=')[0] != bef) 
        	p += qs + '&';
            
    	bef = qs.split('=')[0];
    });

    return url[0] + '?' + p.slice(0, -1);
};

Array.prototype.isEmpty = function () {
     return this.length > 0 ? true : false; 
};

Date.prototype.format = function (format, separator) {
    format = typeof format !== 'undefined' ? format : 'mdyy';
    separator = typeof separator !== 'undefined' ? separator : '/';
    
    getDate = new Date(this).toISOString().slice(0, 10).split('-');
    
    switch (format) {
        case 'mdyy' : return getDate[1]+ separator +getDate[2]+ separator +getDate[0];
            break;
        case 'dmyy':  return getDate[2]+ separator +getDate[1]+ separator +getDate[0];
            break;
        case 'yymd':  return getDate[0]+ separator +getDate[1]+ separator +getDate[2];
            break;
        case 'yydm':  return getDate[0]+ separator +getDate[2]+ separator +getDate[1];
            break;
        default :  return getDate[1]+ separator +getDate[2]+ separator +getDate[0];
            break;
    }
};
