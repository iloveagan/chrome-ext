jQuery(function($) {
	//alert('hello');
	var showBtn = $('input[value="show tables"]:button');
	var filterInput = '&nbsp;&nbsp;DB SEARCH:<input type="text" id="db_filter" value="" style="width:100px;"/>';
	//filterInput = '&nbsp;<input type="text" id="db_filter" value=""/>';
	if (showBtn.length > 0) {
		$('input[value="show tables"]:button').after(filterInput);
	}else{
		$('textarea#sql').before(filterInput + '<br/>');
	}
	var opts = jQuery('select#sql_mode option').map(function () {
		return [[this.value, jQuery(this).text()]];
	});
	jQuery('#db_filter').keyup(function () {
		var rxp = new RegExp(jQuery('#db_filter').val(), 'i');
		var optlist = jQuery('select#sql_mode').empty();
		opts.each(function () {
			if (rxp.test(this[1])) {
				optlist.append(jQuery('<option/>').attr('value', this[0]).text(this[1]));
			}
		});
	});

	// refresh the page
	if (jQuery('a[name="Graph"]').length) {
		var interval = 300;
		var refreshDiv = '<span>自动刷新每隔<input type="text" id="auto_refresh_interval" value="'+interval+'" style="width:50px"/>秒<input id="auto_refresh" type="checkbox" value="1"/></span>';
		$('form[name="myform"] table').after(refreshDiv);
		jQuery('#auto_refresh').click(function(){
			interval = parseInt($('#auto_refresh_interval').val().trim());
			interval = interval * 1000;
			if ($(this).is(':checked') && interval > 0) {
				timer = setInterval(function(){
					window.location.reload();
				},interval);
			}else{
				if (typeof(timer) != 'undefined') {
					clearInterval(timer);
				}
			}
		});
		jQuery('#auto_refresh').click();
	}

    if (jQuery("div#myCalendarTb-page").length) {
        var button = '<button id="overtimebutton" type="button" class="el-button el-button--primary"><span>COUNT</span></button>';
        jQuery('div.date-container button:eq(0)').after(button);
    }

    jQuery('button#overtimebutton').bind('click', function(){
        // 考勤计算 START
        var totalDay = 0;
        var totalHours = 0;
        var totalMinutes = 0;
        var bugDays = 0;
        var currentYear = jQuery("div.title label span:eq(0)").text();
        var currentMonth = jQuery("div.title label span:eq(1)").text();
        var reTime = /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/;
        jQuery("div.calendar-ls table tr:not('.t-head') td").each(function(){
            var d_number = jQuery('.d_number',$(this)).text()
            if ($('div',this).hasClass('sign')) {
                start = jQuery('.first span', $(this)).text();
                end = jQuery('.last span', $(this)).text();
                if (reTime.test(start) && reTime.test(end)) {
                    var start_arr = start.split(':');
                    var end_arr = end.split(':');
                    if (start_arr.length && end_arr.length)
                    {
                        ++totalDay;
                        var s = new Date(currentYear, currentMonth, d_number, start_arr[0], start_arr[1], start_arr[2]);
                        var e = new Date(currentYear, currentMonth, d_number, end_arr[0], end_arr[1], end_arr[2]);
                    var dateDiff = e.getTime() - s.getTime();//时间差的毫秒数
                    var hourDiff = dateDiff / (60 * 1000);//计算出相差小时数
                    totalMinutes += hourDiff;
                }
            }else{
                if(jQuery('.last span', $(this)).length > 0){
                    ++bugDays;
                }
            }
        }
        console.log($(this));
        console.log(totalDay);
        console.log(totalHours);
        console.log(totalMinutes);
        });
        totalHours = totalMinutes / 60;
        var overtimeHours = (totalMinutes - totalDay * 9 * 60)/60;
        var label = "<label id='overtimelabel'></label>";
        var add = "<span>工作总小时数："+totalHours.toFixed(2)+"</span> <span>正常考勤天数："+totalDay+"</span> <span>异常考勤天数："+bugDays+" </span> <span>加班小时数："+overtimeHours.toFixed(2)+"</span>";
        if ($("label#overtimelabel").length) {
            $("label#overtimelabel").html();
        }else{
            jQuery("div.title").append(label);
        }
        jQuery("label#overtimelabel").html(add);
    // 考勤计算 END
    });
	
});