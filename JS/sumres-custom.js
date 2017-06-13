// See [https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu] for repository of source code
/************************************************************************************************************
 * CUSTOM JQUERY-BASED DYNAMIC CONTENT                                                                      *
 ************************************************************************************************************/
(function ($) {
$(function () {
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
	initAnchorFix("#wpadminbar", ".vpue-jump-bar");
	initDelayedNotices("p.notice", "is-delayed");
	initExpiringItems(".has-expiration", "expirationDate", "is-expired");
	initFacultyEmailAutoEntry("li.gfield.sets-faculty-email", "li.gform_hidden");
});

function initAnchorFix(slctrToc) {
	var $toc = $(slctrToc);
	if($toc.length) {
		window.onhashchange = adjustScrollingAfterAnchor;
	}
}

function adjustScrollingAfterAnchor() {
	var currentScrollPos = ($(window).scrollTop() || $("body").scrollTop());
	var windowWidth = $(window).width();
	var scrollingAdjustment = 0;
	var $wpadminbar = $("#wpadminbar");
	var $spineHeader = $("#spine").find(".spine-header");
	var $toc = $(".vpue-jump-bar").first();
	var tocTrigger = $toc.offset().top + $toc.height() + 100;
	var $floatingToc = $(".vpue-jump-bar.floating");
	var updatedScrollPos;
	if ($wpadminbar.length && $wpadminbar.css("top") === "0px") {
		scrollingAdjustment += $wpadminbar.outerHeight();
	}
	if($spineHeader.width() != windowWidth) {
		if ($floatingToc.length && currentScrollPos > tocTrigger) {
			scrollingAdjustment += $floatingToc.outerHeight() + 8;
		}
	} else {
		scrollingAdjustment += $spineHeader.outerHeight();
		if ($floatingToc.length && currentScrollPos > tocTrigger) {
			scrollingAdjustment += 23;
		}				
	}
	updatedScrollPos = currentScrollPos >= scrollingAdjustment ? currentScrollPos - scrollingAdjustment : 0;
	$("html, body").scrollTop(updatedScrollPos);
}

function initDelayedNotices(slctrNotices, clssIsDelayed) {
	var $delayedNotices = $(slctrNotices + "." + clssIsDelayed);
	var $this;
	$delayedNotices.each(function () {
		$this = $(this);
		setTimeout(function() {
			$this.removeClass(clssIsDelayed);
		}, 500);
	});
}

function initExpiringItems(slctrExpiringElems, dataAttrExprtnDate, clssExpired) {
	var today = new Date();
	var $expiringElems = $(slctrExpiringElems);
	var $this;
	var exprtnDateVal;
	var exprtnDateObj;
	$expiringElems.each(function () {
		$this = $(this);
		exprtnDateVal = $this.data(dataAttrExprtnDate);
		if (exprtnDateVal != undefined) {
			// TODO: use regex to enforce correct date format strings
			exprtnDateObj = new Date(exprtnDateVal);
			if (today > exprtnDateObj) {
				$this.addClass(clssExpired);
			}
		} 
	});
	resortListsWithExpiredItems(clssExpired);
}

function resortListsWithExpiredItems(clssExpired) {
	var $expiredItems = $("." + clssExpired);
	var $listsWithExpiredItems = $expiredItems.parent("ul");
	var $thisList;
	var $listItems;
	var $lastItem;
	var $curItem;
	var $clonedItem;
	var idx;
	$listsWithExpiredItems.each(function() {
		$thisList = $(this);
		if (!$thisList.hasClass('cascaded-layout')) {
			$listItems = $thisList.children("li");
			$lastItem = $listItems.eq($listItems.length - 1);
			for (idx = 0; idx < $listItems.length; idx++) {
				$curItem = $listItems.eq(idx);
				if ($curItem.hasClass(clssExpired)) {
					$curItem.detach().insertAfter($lastItem);
				}
			}
		} else {
			$listItems = $thisList.children("li");
			$lastItem = $listItems.eq($listItems.length - 1);
			for (idx = 0; idx < $listItems.length; idx++) {
				$curItem = $listItems.eq(idx);
				if ($curItem.hasClass(clssExpired)) {
					$clonedItem = $curItem.clone();
					$thisList.append($clonedItem).masonry("appended", $clonedItem);
					$thisList.masonry("remove", $curItem).masonry("layout");
				}
			}
		}
	});
	// TODO: move expired list items to the back of the list, then redo layouts on any lists controlled by masonry JS.
}

function initFacultyEmailAutoEntry(slctrSelectBox, slctrHiddenFields) {
	var $selectField;
	var $emailField;
	var $facultyNameField;
	var $selectBox;
	var $emailInputBox;
	var $nameInputBox;
	var selectionMade;
	var fieldsToFill;
	// TODO: Update for Summer 2017
	$(slctrSelectBox).each(function () {
		$selectField = $(this);
		$emailField = $selectField.next(slctrHiddenFields);
		if($emailField.length > 0) {
			$facultyNameField = $emailField.next(slctrHiddenFields);
			if($facultyNameField.length > 0) {
				$selectBox = $selectField.find("select").first();
				$emailInputBox = $emailField.find("input[type='hidden']").first();
				$nameInputBox = $facultyNameField.find("input[type='hidden']").first();
				$selectBox.change(function() {
					selectionMade = $(this).val();
					fieldsToFill = new FieldsToFill(selectionMade, $emailInputBox, $nameInputBox);
					fillHiddenFields(fieldsToFill);
				});			
			}
		}
	});
}

var FieldsToFill = function (selectionMade, $emailInputBox, $nameInputBox) {
	this.selectionMade = typeof selectionMade == "string" ? selectionMade : "";
	this.$emailInputBox = isJQuery($emailInputBox) ? $emailInputBox : $();
	this.$nameInputBox = isJQuery($nameInputBox) ? $nameInputBox : $();
}

FieldsToFill.prototype.isValid = function () {
	return this.selectionMade != "" && this.$emailInputBox.length > 0 && this.$nameInputBox.length > 0;
}

function fillHiddenFields(fieldsToFill) {
	// TODO: Update for Summer 2017
	if(fieldsToFill instanceof FieldsToFill && fieldsToFill.isValid()) {
		switch(fieldsToFill.selectionMade) {
			case "Atmospheric Chemistry and Climate Change: Measurements and Modeling in the Pacific Northwest (Shelley Pressley)":
				fieldsToFill.$emailInputBox.val("spressley@wsu.edu");
				fieldsToFill.$nameInputBox.val("Shelley");
				break;
			case "Biomedicine Summer Undergraduate Research Experience (Samantha Gizerian)":
				fieldsToFill.$emailInputBox.val("samantha.gizerian@wsu.edu");
				fieldsToFill.$nameInputBox.val("Samantha");
				break;
			case "Gerontechnology-focused Summer Undergraduate Research Experience (GSUR) (Diane Cook & Maureen Schmitter-Edgecombe)":
				fieldsToFill.$emailInputBox.val("djcook@wsu.edu");
				fieldsToFill.$nameInputBox.val("Diane and Maureen");
				break;
			case "Landscape Ecology and Ecosystem Dynamics in the Columbia River Basin: Integrating Terrestrial and Aquatic Perspectives (Gretchen Rollwagen-Bollens)":
				fieldsToFill.$emailInputBox.val("rollboll@wsu.edu");
				fieldsToFill.$nameInputBox.val("Gretchen");
				break;
			case "Materials Under Extreme Conditions (Y. M. Gupta)":
				fieldsToFill.$emailInputBox.val("shock@wsu.edu");
				fieldsToFill.$nameInputBox.val("Professor Gupta");
				break;
			case "New-generation Power-efficient Computer Systems Design (Partha Pande)":
				fieldsToFill.$emailInputBox.val("partha_pande@wsu.edu");
				fieldsToFill.$nameInputBox.val("Partha");
				break;
			case "Northwest Advanced Renewables Alliance (NARA) (Shelley Pressley)":
				fieldsToFill.$emailInputBox.val("spressley@wsu.edu");
				fieldsToFill.$nameInputBox.val("Shelley");
				break;
			case "Plant Genomics and Biotechnology (Amit Dhingra)":
				fieldsToFill.$emailInputBox.val("adhingra@wsu.edu");
				fieldsToFill.$nameInputBox.val("Amit");
				break;
			case "Smart Environments (Larry Holder)":
				fieldsToFill.$emailInputBox.val("holder@wsu.edu");
				fieldsToFill.$nameInputBox.val("Larry");
				break;
			case "USPRISM: U.S.-Scotland Program for Research on Integration of Renewable Energy Resources and SMart Grid (Ali Mehrizi-Sani)":
				fieldsToFill.$emailInputBox.val("mehrizi@eecs.wsu.edu");
				fieldsToFill.$nameInputBox.val("Ali");
				break;
			default:
				fieldsToFill.$emailInputBox.val("");
				fieldsToFill.$nameInputBox.val("");
		}
	}
}

})(jQuery);
