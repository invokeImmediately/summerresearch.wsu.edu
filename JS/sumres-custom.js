// -----------------------------------------------------------------------------
// CUSTOM JQUERY-BASED DYNAMIC CONTENT
// -----------------------------------------------------------------------------
// See [https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu]
// for a repository of source code.
( function( $ ) {

// IIFE for wrapping statements to be executed once the DOM is ready 
$( function() {

	// Tweak HTML source to work around some quirks of WordPress setup                            *
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

	initAnchorFix();
	initExpiringItems(".has-expiration", "expirationDate", "is-expired");
	initFacultyEmailAutoEntry("li.gfield.sets-faculty-email", "li.gform_hidden");
});

// Bind a function to window loaded event
$( window ).on( "load", function() {
	initDelayedNotices("p.notice", "is-delayed", 500);
});

// Binds a function to the hashchange event for applying corrections to
// scrolling position after an anchor has been navigated to. This is necessary
// because on OUE websites built using the WSU Spine framework, there are
// instances where elements end up covering the anchor at the top of the screen
function initAnchorFix() {
	window.onhashchange = adjustScrollingAfterNavToAnchor;
}

// Function to be bound to the hashchange event; applyies corrections to
// scrolling position after an anchor has been navigated to. Compensates for
// instances where elements end up covering the anchor at the top of the screen
function adjustScrollingAfterNavToAnchor() {

	var currentScrollPos;	// Uncorrected scrolling position that resulted
							// after navigating to the anchor

	var windowWidth;	// Browser window width is checked against spine header
						// width to test for mobile/tablet mode

	var scrollingAdjustment;	// Calculated number of pixels needed to move up
								// the page and bring the anchor back into view

	var $wpadminbar;	// jQuery object: WordPress admin bar that floats at top
						// or bottom of screen

	var $spineHeader;	// jQuery object: spine header element that floats at
						// top of screen on mobile/tablet.

	var $toc;	// jQuery object: fixed TOC element located toward top of page

	var tocTrigger;	// Scrolling position where, once reached, the floating
					// TOC is brought into view

	var $floatingToc;	// jQuery object: floating TOC element

	var updatedScrollPos;		// Corrected scrolling position whereat the
								// anchor is visible at top of page

	// Get the current, uncorrected scrolling position 
	currentScrollPos = ( $(window).scrollTop() || $( "body" ).scrollTop() );
	scrollingAdjustment = 0;

	// If necessary, compensate for the floating WordPress admin bar
	$wpadminbar = $( "#wpadminbar" );
	if ( $wpadminbar.length && $wpadminbar.css( "top" ) === "0px" ) {
		scrollingAdjustment += $wpadminbar.outerHeight();
	}

	// If necessary, compensate for the floating spine menu and the OUE-specific
	// floating TOC feature
	windowWidth = $( window ).width();
	$spineHeader = $( "#spine" ).find(".spine-header");
	$toc = $( ".vpue-jump-bar" ).first();
	tocTrigger = $toc.offset().top + $toc.height() + 100;
	$floatingToc = $( ".vpue-jump-bar.floating" );
	if( $spineHeader.width() != windowWidth ) {

		// We are in desktop view and the spine is positioned to the left of the
		// main content area. The only possible correction that needs to be
		// applied on OUE websites is to compensate for a floating TOC element
		// that is hovering over main content at the top of the screen
		if ( $floatingToc.length && currentScrollPos > tocTrigger ) {
			scrollingAdjustment += $floatingToc.outerHeight() + 8;
		}
	} else {

		// We are in mobile/tablet view and the spine is floating at the top of
		// the screen & covering main content area. It is also possible that a
		// correction needs to be applied for a floating TOC element that is
		// peeking out from under the spine header and is also covering main
		// content
		scrollingAdjustment += $spineHeader.outerHeight();
		if ( $floatingToc.length && currentScrollPos > tocTrigger ) {
			scrollingAdjustment += 23;
		}				
	}

	// Correct the scrolling position to bring the anchored element back into
	// view at visible top of screen
	updatedScrollPos = currentScrollPos >= scrollingAdjustment ?
		currentScrollPos - scrollingAdjustment :
		0;
	$("html, body").scrollTop( updatedScrollPos );
}

// Initialize notice elements whose display should be delayed by a set amount
// after the page has loaded.
function initDelayedNotices(slctrNotices, clssIsDelayed, noticeDelay) {

	var $delayedNotices;	// jQuery object: all delayed notice elements

	var $this;	// jQuery object: element from which active execution context
				// was invoked

	var noticeDelay;	// Number of milliseconds to wait before displaying
						//  notices after page load

	$delayedNotices = $(slctrNotices + "." + clssIsDelayed);
	$delayedNotices.each( function () {
		$this = $( this );
		setTimeout( function() {
			$this.removeClass( clssIsDelayed );
		}, noticeDelay );
	});
}

// Initialize elements for which an expiration date has been set so that the
// desired behavior is triggered once the item has expired.
function initExpiringItems(slctrExpiringElems, dataAttrExprtnDate,
		clssExpired) {

	var today;	// Date object constructed from today's date; used to determine
				// whether elements have expired

	var $expiringElems;	// jQuery object: all elements for which an expiration
						// date has been set

	var $this;	// jQuery object: element from which active execution context
				// was invoked

	var exprtnDateVal;	// The value of an element's expiration date as set
						// through jQuery data storage

	var exprtnDateObj;	// A date object constructed from the value of an
						// element's expiration date

	today = new Date();
	$expiringElems = $( slctrExpiringElems );
	$expiringElems.each( function() {
		$this = $( this );
		exprtnDateVal = $this.data( dataAttrExprtnDate );
		if ( exprtnDateVal != undefined ) {

			// TODO: use regex to enforce correct date format strings
			exprtnDateObj = new Date( exprtnDateVal );
			if ( today > exprtnDateObj ) {
				$this.addClass( clssExpired );
			}
		} 
	});
	resortListsWithExpiredItems( clssExpired );
}

// Improve user experience by resorting list elements containing expired list
// items such that upcoming, unexpired list items appear at the top of the list
// and are not obscured by already outdated items
function resortListsWithExpiredItems(clssExpired) {

	var $expiredItems;	// jQuery object: all list item elements with an
						// expiration date. Used to find all list elements
						// containing such items.

	var $listsWithExpiredItems;	// jQuery object: all lists containing elements
								// with current execution context was invoked

	var $thisList;	// jQuery object: list element from which active execution
					// context was invoked

	var $listItems;	// jQuery object: used once a list containing expiring items
					// has invoked an execution context to store all of the
					// child list items of the invoking list

	var $lastItem;	// jQuery object: used while iterating over the child list
					// items of a parent list element that contains expiring
					// items; serves as reference to the last item at the end of
					// the list

	var $curItem;	// jQuery object: used while iterating over the child list
					// items of a parent list element that contains expiring
					// items; serves as reference to the curret item being
					// considered during iteration

	var $clonedItem;	// jQuery object: used to create a clone of an expired
						// list item while it is being moved to the end of a list

	var idx;	// Iterator index

	$expiredItems = $( "li." + clssExpired );
	$listsWithExpiredItems = $expiredItems.parent( "ul" );
	$listsWithExpiredItems.each(function() {
		$thisList = $(this);
		if (!$thisList.hasClass('cascaded-layout')) {
			$listItems = $thisList.children("li");
			$lastItem = $listItems.eq($listItems.length - 1);
			for (idx = 0; idx < $listItems.length; idx++) {
				$curItem = $listItems.eq(idx);
				if ($curItem.hasClass(clssExpired)) {
					
					// This method of moving items is done intentionally to
					// result in a reverse chronological sorting of expired
					// items, where the most recently expired item is displayed
					// first in sequence
					$curItem.detach().insertAfter($lastItem);
				}
			}
		} else {
			$listItems = $thisList.children("li");
			$lastItem = $listItems.eq($listItems.length - 1);
			for (idx = 0; idx < $listItems.length; idx++) {
				$curItem = $listItems.eq(idx);
				if ($curItem.hasClass(clssExpired)) {

					// TODO: This method of moving items will result in a
					// chronological sorting, which is different from above;
					// may want to consider refactoring.
					$clonedItem = $curItem.clone();
					$thisList.append($clonedItem).masonry("appended", $clonedItem);
					$thisList.masonry("remove", $curItem).masonry("layout");
				}
			}
		}
	});
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

})( jQuery );
