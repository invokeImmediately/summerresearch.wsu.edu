/*! This custom JavaScript code has been minified with gulp-uglify. Please see [https://github.com/i
**  nvokeImmediately/summerresearch.wsu.edu] for a repository of fully documented source code.
*/

/*  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
**  │ FILENAME: sumres-custom.less                                                                 │
**  │                                                                                              │
**  │ AUTHOR: Daniel Rieck <daniel.rieck@wsu.edu> (https://github.com/invokeImmediately)           │
**  │                                                                                              │
**  │ SUMMARY: Custom JS code specific to the WSU Summer Undergraduate Research program website.   │
**  └──────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/*  ────────────────────────────────────────────────────────────────────────────────────────────────
**  Table of Contents
**  ─────────────────────────────────────────────────────────────────────────────────────────────
**  Main execution section.....................................................................42
**    DOM-ready execution block................................................................47
**    Execution block bound to window load event...............................................56
**  Function definition section................................................................62
**    addPageHeaderToNews......................................................................67
**    adjustScrollingAfterNavToAnchor..........................................................89
**    fillHiddenFields........................................................................166
**    initAnchorVisibilityFix.................................................................243
**    initDelayedNotices......................................................................252
**    resortListsWithExpiredItems.............................................................316
**    initFacultyEmailAutoEntry...............................................................390
**  Class definition section..................................................................455
**    FieldsToFill............................................................................467
**    FieldsToFill.prototype.isValid..........................................................485
**  ────────────────────────────────────────────────────────────────────────────────────────────────
*/

/**
 * An IIFE that contains custom JS code specific to summerresearch.wsu.edu.
 *
 * @link	https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu
 * 
 * @param	{object}	$	Alias for the jQuery interface.
 */
( function( $ ) {

'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN EXECUTION ↓↓↓

/**
 * Uses the jQuery interface to execute a block of statements once the DOM is ready.
 */
$( function() {
	addPageHeaderToNews();
	initAnchorVisibilityFix();
	initExpiringItems(".has-expiration", "expirationDate", "is-expired");
} );

/**
 * Binds a series of execution statements to window loaded event.
 */
$( window ).on( "load", function() {
	initDelayedNotices("p.notice", "is-delayed", 500);
	initFacultyEmailAutoEntry("li.gfield.sets-faculty-email", "li.gform_hidden");
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION DEFINITIONS ↓↓↓

/**
 * Adds a page header containing navigational context to the news section of the website.
 */
function addPageHeaderToNews() {
	// Tweak HTML source to work around some quirks of WordPress setup.
	var siteURL = window.location.pathname;
	switch (siteURL) {
		case '/news/':
			$('div.column.one').first().parent('section').before('<section class="row page-header p\
age-header--news"><div class="column one page-header__column-1"><h1 class="page-header__text-title"\
>News</h1></div></section>');
			break;
	}
}

/**
 * Applies corrections to window scrolling position to keep an anchor that the user has navigated to
 * in view.
 */
function adjustScrollingAfterNavToAnchor() {
	var currentScrollPos;		// Uncorrected scrolling position that resulted after navigating to
								// the anchor.

	var windowWidth;			// Browser window width is checked against spine header width to
								// test for mobile/tablet mode.

	var scrollingAdjustment;	// Calculated number of pixels needed to move up the page and bring
								// the anchor back into view.

	var $wpadminbar;			// jQuery object: WordPress admin bar that floats at top or bottom
								// of screen.

	var $spineHeader;			// jQuery object: spine header element that floats at top of screen
								// on mobile/tablet.

	var $toc;					// jQuery object: fixed table of contents element located toward top
								// of page.

	var tocTrigger;				// Scrolling position where, once reached, the floating table of
								// contents is brought into view.

	var $floatingToc;			// The jQuery object for the floating table of contents element.

	var updatedScrollPos;		// Corrected scrolling position whereat the anchor is visible at top
								// of page.

	// Get the current, uncorrected scrolling position 
	currentScrollPos = ( $(window).scrollTop() || $( "body" ).scrollTop() );
	scrollingAdjustment = 0;

	// If necessary, compensate for the floating WordPress admin bar
	$wpadminbar = $( "#wpadminbar" );
	if ( $wpadminbar.length && $wpadminbar.css( "top" ) === "0px" ) {
		scrollingAdjustment += $wpadminbar.outerHeight();
	}

	// If necessary, compensate for the floating spine menu and the OUE-specific floating
	// table of contents feature.
	windowWidth = $( window ).width();
	$spineHeader = $( "#spine" ).find(".spine-header");
	$toc = $( ".vpue-jump-bar" ).first();
	tocTrigger = $toc.offset().top + $toc.height() + 100;
	$floatingToc = $( ".vpue-jump-bar.floating" );
	if( $spineHeader.width() != windowWidth ) {

		// We are in desktop view and the spine is positioned to the left of the main content area.
		// The only possible correction that needs to be applied on OUE websites is to compensate
		// for a floating TOC element that is hovering over main content at the top of the screen.
		if ( $floatingToc.length && currentScrollPos > tocTrigger ) {
			scrollingAdjustment += $floatingToc.outerHeight() + 8;
		}
	} else {

		// We are in mobile/tablet view and the spine is floating at the top of the screen and
		// covering main content area. It is also possible that a correction needs to be applied for
		// a floating TOC element that is peeking out from under the spine header and is also
		// covering main content.
		scrollingAdjustment += $spineHeader.outerHeight();
		if ( $floatingToc.length && currentScrollPos > tocTrigger ) {
			scrollingAdjustment += 23;
		}				
	}

	// Correct the scrolling position to bring the anchored element back into view at visible top
	// of screen.
	updatedScrollPos = currentScrollPos >= scrollingAdjustment ?
		currentScrollPos - scrollingAdjustment :
		0;
	$("html, body").scrollTop( updatedScrollPos );
}

/**
 * Fills hidden fields on the gravity form for abstract submission.
 *
 * @param {Object}	fieldsToFill	A properly constructed FieldsToFill object.
 */
function fillHiddenFields(fieldsToFill) {
	if(fieldsToFill instanceof FieldsToFill && fieldsToFill.isValid()) {
		switch(fieldsToFill.selectionMade) {
			case "Bioplastics & Biocomposites (Vikram Yadama)":
				fieldsToFill.$emailInputBox.val("vyadama@wsu.edu");
				fieldsToFill.$nameInputBox.val("Vikram");
				break;
			case "Engineering Tools for Disease Diagnostics and Treatment (Neil Ivory)":
				fieldsToFill.$emailInputBox.val("cfivory@wsu.edu");
				fieldsToFill.$nameInputBox.val("Neil");
				break;
			case "Gerontechnology-focused Summer Undergraduate Research Experience (GSUR) (Diane Co\
ok & Maureen Schmitter-Edgecombe)":
				fieldsToFill.$emailInputBox.val("djcook@wsu.edu");
				fieldsToFill.$nameInputBox.val("Diane and Maureen");
				break;
			case "IRES/USPRISM: U.S.-Scotland Program for Research on Integration of Renewable Ener\
gy Resources and SMart Grid (Ali Mehrizi-Sani)":
				fieldsToFill.$emailInputBox.val("mehrizi@eecs.wsu.edu");
				fieldsToFill.$nameInputBox.val("Ali");
				break;
			case "Multidisciplinary Undergraduate Research Training in Wearable Computing (Hassan G\
hasemzadeh)":
				fieldsToFill.$emailInputBox.val("hassan.ghasemzadeh@wsu.edu");
				fieldsToFill.$nameInputBox.val("Hassan");
				break;
			case "Northwest Advanced Renewables Alliance (NARA) (Shelley Pressley)":
				fieldsToFill.$emailInputBox.val("spressley@wsu.edu");
				fieldsToFill.$nameInputBox.val("Shelley");
				break;
			case "Plant Genomics and Biotechnology (Amit Dhingra)":
				fieldsToFill.$emailInputBox.val("adhingra@wsu.edu");
				fieldsToFill.$nameInputBox.val("Amit");
				break;
			case "Research Opportunities for Native Undergraduate Students (Amit Dhingra & Lori Car\
ris)":
				fieldsToFill.$emailInputBox.val("adhingra@wsu.edu");
				fieldsToFill.$nameInputBox.val("Amit and Lori");
				break;
			case "Summer Undergraduate Research Fellowship, or SURF (Kay Meier)":
				fieldsToFill.$emailInputBox.val("kmeier@wsu.edu");
				fieldsToFill.$nameInputBox.val("Kay");
				break;
			case "Sustainable High-value Horticulture & Processing Systems in Washington State (Dou\
g Collins)":
				fieldsToFill.$emailInputBox.val("dpcollins@wsu.edu");
				fieldsToFill.$nameInputBox.val("Doug");
				break;
			case "Undergraduate Research in Smart Environments (Larry Holder)":
				fieldsToFill.$emailInputBox.val("holder@wsu.edu");
				fieldsToFill.$nameInputBox.val("Larry");
				break;
			default:
				fieldsToFill.$emailInputBox.val("");
				fieldsToFill.$nameInputBox.val("");
		}
	}
}

/**
 * Binds a callback to the window's hashchange event that will keep an anchor that the user has
 * navigated to in view.
 */
function initAnchorVisibilityFix() {
	// TODO: Change approach to depend on jQuery(window).on(…)
	window.onhashchange = adjustScrollingAfterNavToAnchor;
}

/**
 * Initializes notice elements, which are initially hidden but come into view after a set amount
 * of time after the page has loaded.
 */
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

/* Initializes elements for which an expiration date has been set so that the desired behavior is
 * triggered once the item has expired.
 */
function initExpiringItems(slctrExpiringElems, dataAttrExprtnDate, clssExpired) {

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

/**
 * Improves user experience by sorting lists with chronologically expired elements.
 *
 * After sorting, upcoming/unexpired list items will appear at the top of the list. Expired items
 * will be moved to the bottom of the list and will appear in reverse chronological order. This
 * sorting process will automatically recognize when a Masonry JS list is in use and trigger its
 * layout function after sorting.
 */
function resortListsWithExpiredItems(clssExpired) {
	var $expiredItems;			// jQuery object: all list item elements with an expiration date.
								// Used to find all list elements containing such items.

	var $listsWithExpiredItems;	// jQuery object: all lists containing elements with current
								// execution context was invoked.

	var $thisList;				// jQuery object: list element from which active execution context
								// was invoked.

	var $listItems;				// jQuery object: used once a list containing expiring items has
								// invoked an execution context to store all of the child list items
								// of the invoking list.

	var $lastItem;				// jQuery object: used while iterating over the child list items of
								// a parent list element that contains expiring items; serves as
								// reference to the last item at the end of the list.

	var $curItem;				// jQuery object: used while iterating over the child list items of
								// a parent list element that contains expiring items; serves as
								// reference to the curret item being considered during iteration.

	var $clonedItem;			// jQuery object: used to create a clone of an expired
								// list item while it is being moved to the end of a list.

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
					$thisList.append($clonedItem).masonry("appended",
						$clonedItem);
					$thisList.masonry("remove", $curItem).masonry("layout");
				}
			}
		}
	});
}

/**
 * Minimizes user input errors by automatically filling in hidden fields for a research mentor's
 * name and email.
 *
 * @param {string}	slctrSelectBox		Selector string for matching the mentor/project selection
 *										box on the form.
 * @param {string}	slctrHiddenFields	Selector string for matching the hidden fields for the
 *										mentor's name and email address.
 */
function initFacultyEmailAutoEntry(slctrSelectBox, slctrHiddenFields) {
	var $selectField;		// jQuery object: the drop-down selection field through which the user
							// chooses their project.

	var $emailField;		// jQuery object: a hidden email field that is the immediate sibling
							// following the visible selection field in the DOM.

	var $facultyNameField;	// jQuery object: a hidden text input field that is the immediate
							// sibling following the hidden email field in the DOM; stores mentor's
							// name.

	var $selectBox;			// jQuery object: the input element within the project selection field
							// that is visible to the user.

	var $emailInputBox;		// jQuery object: the input element within the mentor's email field
							// which is hidden from the user.

	var $nameInputBox;		// jQuery object: the input element within the mentor's name field which
							// is hidden from the user.

	var selectionMade;		// Holds the value of the project selectied by the user.

	var fieldsToFill;		// Object representing the form fields to be automatically filled by JS.

	// If it exists on the page, find the project selection field and bind its change event to a
	// function that automatically populates hidden fields that store the mentor's contact email
	// and name.
	$( slctrSelectBox ).each(function () {
		$selectField = $(this);
		$emailField = $selectField.next(slctrHiddenFields);
		if ( $emailField.length > 0 ) {
			$facultyNameField = $emailField.next(slctrHiddenFields);
			if ( $facultyNameField.length > 0 ) {
				$selectBox = $selectField.find( "select" ).first();
				$emailInputBox = $emailField.
					find( "input[type='hidden']" ).
					first();
				$nameInputBox = $facultyNameField.
					find( "input[type='hidden']" ).
					first();

				// Initialize the field just in case.
				fieldsToFill = new FieldsToFill(
					$selectBox.val(),
					$emailInputBox,
					$nameInputBox
				);
				fillHiddenFields( fieldsToFill );

				// Setup an event handler for when the user changes the selection.
				$selectBox.change( function() {
					selectionMade = $(this).val();
					fieldsToFill = new FieldsToFill(
						selectionMade,
						$emailInputBox,
						$nameInputBox
					);
					fillHiddenFields( fieldsToFill );
				});			
			}
		}
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS DEFINITIONS ↓↓↓

/**
 * Stores jQuery objects for gravity form fields to be autofileld with a mentor's correct name
 * and email.
 *
 * @class
 *
 * @param {string}	selectionMade	The mentor/project selected by the user.
 * @param {Object}	$emailInputBox	jQuery object for the mentor's hidden email field on the form.
 * @param {Object}	$nameInputBox	jQuery object for the mentor's hidden name field on the form.
 */
var FieldsToFill = function (selectionMade, $emailInputBox, $nameInputBox) {
	this.selectionMade = typeof selectionMade === "string" ?
		selectionMade :
		"";
	this.$emailInputBox = $.isJQueryObj($emailInputBox) ?
		$emailInputBox :
		$();
	this.$nameInputBox = $.isJQueryObj($nameInputBox) ?
		$nameInputBox :
		$();
}

/**
 * Indicates whether the instance of FieldsToFill has been properly constructed with valid
 * references to jQuery objects.
 * 
 * @returns {boolean}
 */
FieldsToFill.prototype.isValid = function () {
	return this.selectionMade != "" && this.$emailInputBox.length > 0 &&
		this.$nameInputBox.length > 0;
}

})( jQuery );
