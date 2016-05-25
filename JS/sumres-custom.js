// See [https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu] for repository of source code
/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
(function ($) {
	$(document).ready(function () {
			/**********************************************************************************************
			 * Tweak HTML source to work around some quirks of WordPress setup                            *
			 **********************************************************************************************/
			var dspSiteURL = window.location.pathname;
			switch(dspSiteURL) {
/*				case '/':
					$('#menu-item-35').remove();
					$('#spine-sitenav ul li').first().css('border-top', 'none');
					$('#spine-sitenav').addClass('homeless');
					break;*/
				case '/news/':
					$('div.column.one').first().parent('section').before('<section class="row single gutter pad-top"><div class="column one"><section class="article-header header-newsEvents"><div class="header-content"><h2>News</h2><h3>What We and Our Students Have Accomplished</h3></div></section></div></section>');
					break;
			}
	});
})(jQuery);