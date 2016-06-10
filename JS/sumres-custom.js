// See [https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu] for repository of source code
/************************************************************************************************************
 * CUSTOM JQUERY-BASED DYNAMIC CONTENT                                                                      *
 ************************************************************************************************************/
(function ($) {
	$(document).ready(function () {
		/**********************************************************************************************
		 * Tweak HTML source to work around some quirks of WordPress setup                            *
		 **********************************************************************************************/
		var siteURL = window.location.pathname;
		switch (siteURL) {
			/* case '/':
			$('#menu-item-35').remove();
			$('#spine-sitenav ul li').first().css('border-top', 'none');
			$('#spine-sitenav').addClass('homeless');
			break;*/
		case '/news/':
			$('div.column.one').first().parent('section').before('<section class="row single gutter pad-top"><div class="column one"><section class="article-header header-newsEvents"><div class="header-content"><h2>News</h2><h3>What We and Our Students Have Accomplished</h3></div></section></div></section>');
			break;
		}
		InitExpiringItems(".has-expiration", "expirationDate");
	});

	function (slctrExpiringElems, dataAttrExprtnDate) {
		var today = new Date();
		var $expiringElems = $(slctrExpiringElems);
		$expiringElems.each(function () {
			var $this = $(this);
			var exprtnDateVal = $this.data(dataAttrExprtnDate);
			if (exprtnDateVal != undefined) {
                // TODO: use regex to enforce correct date format strings
                var exprtnDateObj = new Date(exprtnDateVal);
                if (today > exprtnDateObj) {
                    $this.animate({
                        "opacity": "0.5"
                    }, 333);
                }
            } 
		});
	}
})(jQuery);
