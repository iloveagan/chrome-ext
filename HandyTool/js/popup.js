jQuery(function($) {
	var current_date = new Date();
	var this_timestamp = Math.round(current_date.getTime() / 1000);
	var this_date = formatDate(current_date);
	$("#date_str").text(this_date);
	$("#timestamp").text(this_timestamp);
	$("#md5_btn").click(function() {
		var md5_hash = '';
		var str = $('#process_str').val().trim();
		if (str == '' || str == undefined) {
			setResult();
			return false;
		}
		var md5_result = hex_md5(str);
		setResult(md5_result);
	});
	// encode or decode the string
	$("#url_encode_btn,#url_decode_btn").click(function () {
		var result = '';
		var str = $('#process_str').val().trim();
		if (str == '' || str == undefined) {
			setResult();
			return false;
		}
		if ($(this).attr('id') == 'url_encode_btn') {
			result = encodeURIComponent(str);
		}else{
			result = decodeURIComponent(str);
		}
		setResult(result);
	});
	// convert the unix timestamp string to date
	// or convert the date to unix timestamp string
	$("#date_convert_btn").click(function() {
		setResult('');
		var str = $('#process_str').val().trim();
		if (str == '' || str == undefined) {
			setResult();
			return false;
		}
		var is_int = /^\d+$/;
		//var is_date = /^([\d]{4})([\/\\\-\. ]([\d]{1,2})){2}$/;
		var is_full_date = /^([\d]{4})([\/\\\-\. ]([\d]{1,2})){2}( (([\d]{1,2})[:]?){0,2}([\d]{1,2}))?$/;
		var result = '';
		// first match the timestamp format
		if (is_int.test(str)) {
			result = timestampToDate(str);
		}else {
			var date_obj = strToDate(str);
			if (typeof(date_obj) === 'string') {
				result = date_obj;
			}else if (typeof(date_obj) === 'object') {
				// get the format date
				var date_format = formatDate(date_obj);
				var date_timestamp = Math.round(date_obj.getTime() / 1000);
				result = '' + date_format + ' >>> ' + date_timestamp;
			}else{
				result = 'format error';
			}
			/*
			var is_date = new RegExp("^([\\d]{4})[\\/\\-\\.\\\\ ]([\\d]{1,2})[\\/\\-\\.\\\\ ]([\\d]{1,2})( (([\\d]{1,2})[:]){0,2}([\\d]{1,2})){0,1}$");
			var match_ret = is_date.exec(str);
			if (null == match_ret) {
				result = 'format error';
			}
			*/
		}
		if (result == '') {
			result = 'convert error';
		}
		setResult(result);
		return true;
	});
	function timestampToDate(timestamp) {
		timestamp = parseInt(timestamp);
		if (isNaN(timestamp)) {
			return '';
		}
		var date_str = new Date(timestamp * 1000);
		return formatDate(date_str);
	}
	function formatDate(date_obj) {
		var s = '';
		var year = date_obj.getFullYear();
		var month = date_obj.getMonth() + 1;
		if (10 > month) {
			month = '0' + month;
		}
		var day = date_obj.getDate();
		if (10 > day) {
			day = '0' + day;
		}
		var hour = date_obj.getHours();
		if (10 > hour) {
			hour = '0' + hour;
		}
		var minute = date_obj.getMinutes();
		if (10 > minute) {
			minute = '0' + minute;
		}
		var second = date_obj.getSeconds();
		if (10 > second) {
			second = '0' + second;
		}
		s = '' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		return s;
	}
	function strToDate(str) {
		var ret = 'too short';
		if (8 > str.length) {
			return ret;
		}
		var is_date = new RegExp("^([\\d]{4})[\\/\\-\\.\\\\ ]([\\d]{1,2})[\\/\\-\\.\\\\ ]([\\d]{1,2})( (([\\d]{1,2})[:]){0,2}([\\d]{1,2})){0,1}$");
		var match_ret = is_date.exec(str);
		if (null == match_ret) {
			ret = 'format error';
		}else{
			var year = parseInt(match_ret[1]);
			if (year < 1970) {
				year = 1970;
			}
			var month = parseInt(match_ret[2]);
			if (0 < month) {
				month = month - 1;
			}
			var day = parseInt(match_ret[3]);
			if (day < 1){
				day = 1;
			}
			var hour = minute = second = 0;
			if (undefined != match_ret[4]) {
				var time = match_ret[4].replace(' ','');
				var time_arr = time.split(':');
				hour = parseInt(time_arr[0]);
				if (undefined != time_arr[1]) {
					minute = parseInt(time_arr[1]);
				}
				if (undefined != time_arr[2]) {
					second = parseInt(time_arr[2]);
				}
			}
			if (hour < 0) {
				hour = 0;
			}
			if (minute < 0) {
				minute = 0;
			//}else if (minute > 60) {
				//minute = 59;
			}
			if (second < 0) {
				second = 0;
			//}else if (second > 60) {
				//second = 59;
			}
			var date_obj = new Date(year, month, day, hour, minute, second); 
			//var date_obj = new Date(Date.UTC(year, month, day, hour, minute, second)); 
			return date_obj;
		}
		
	}
	function setResult(str) {
		if (undefined == str) {
			str = 'empty string';
		}
		$('#error_result').text(str);
	}
});