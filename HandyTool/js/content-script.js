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
});