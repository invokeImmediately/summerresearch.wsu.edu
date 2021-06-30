/*!*************************************************************************************************
 * ▄▀▀▀ █  █ ▐▀▄▀▌█▀▀▄ █▀▀▀ ▄▀▀▀    ▄▀▀▀ █  █ ▄▀▀▀▐▀█▀▌▄▀▀▄ ▐▀▄▀▌      █ ▄▀▀▀
 * ▀▀▀█ █  █ █ ▀ ▌█▄▄▀ █▀▀  ▀▀▀█ ▀▀ █    █  █ ▀▀▀█  █  █  █ █ ▀ ▌   ▄  █ ▀▀▀█
 * ▀▀▀   ▀▀  █   ▀▀  ▀▄▀▀▀▀ ▀▀▀      ▀▀▀  ▀▀  ▀▀▀   █   ▀▀  █   ▀ ▀ ▀▄▄█ ▀▀▀
 * 
 * Custom JS code written specifically for the WSUWP website of the [Summer Undergraduate Research
 * program](https://summerresearch.wsu.edu).
 *
 * @version 1.0.0
 * 
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/surca.wsu.edu/blob/master/JS/sumres-custom.js
 * @license MIT - Copyright (c) 2021 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
 *     the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//  §1: Main execution.........................................................................58
//    §1.1: DOM-ready Execution Block..........................................................61
//    §1.2: Window Loaded Event Binding........................................................73
//  §2: Function Definitions...................................................................84
//    §2.1: addPageHeaderToNews................................................................88
//    §2.2: adjustScrollingAfterNavToAnchor...................................................106
//    §2.3: fillHiddenFields..................................................................185
//    §2.4: initAnchorVisibilityFix...........................................................212
//    §2.5: initDelayedNotices................................................................226
//    §2.6: initExpiringItems.................................................................248
//    §2.7: resortListsWithExpiredItems.......................................................285
//    §2.8: initFacultyEmailAutoEntry.........................................................357
//  §3: Class Definition Section..............................................................432
//    §3.1: FieldsToFill......................................................................435
//    §3.2: FieldsToFill.prototype.isValid....................................................460
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An IIFE that contains custom JS code specific to summerresearch.wsu.edu.
 * 
 * @param {object} $: Alias for the jQuery interface.
 */
( function( $ ) {

'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: MAIN EXECUTION

////////
// §1.1: DOM-ready Execution

/**
 * Uses the jQuery interface to execute a block of statements once the DOM is ready.
 */
$( function() {
  addPageHeaderToNews();
  initAnchorVisibilityFix();
  initExpiringItems(".has-expiration", "expirationDate", "is-expired");
} );

////////
// §1.2: Window Loaded Event Binding

/**
 * Binds a series of execution statements to window loaded event.
 */
$( window ).on( "load", function() {
  initDelayedNotices("p.notice", "is-delayed", 500);
  initFacultyEmailAutoEntry("li.gfield.sets-faculty-email", "li.gform_hidden");
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: FUNCTION DEFINITIONS


////////
// §2.1: addPageHeaderToNews

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

////////
// §2.2: adjustScrollingAfterNavToAnchor

/**
 * Applies corrections to window scrolling position to keep an anchor that the user has navigated to
 * in view.
 */
function adjustScrollingAfterNavToAnchor() {
  var currentScrollPos;     // Uncorrected scrolling position that resulted after navigating to the
                            //   anchor.

  var windowWidth;          // Browser window width is checked against spine header width to test
                            //   for mobile/tablet mode.

  var scrollingAdjustment;  // Calculated number of pixels needed to move up the page and bring the
                            //   anchor back into view.

  var $wpadminbar;          // jQuery object: WordPress admin bar that floats at top or bottom of
                            //   screen.

  var $spineHeader;         // jQuery object: spine header element that floats at top of screen
                            //   on mobile/tablet.

  var $toc;                 // jQuery object: fixed table of contents element located toward top
                            //   of page.

  var tocTrigger;           // Scrolling position where, once reached, the floating table of
                            //   contents is brought into view.

  var $floatingToc;         // The jQuery object for the floating table of contents element.

  var updatedScrollPos;     // Corrected scrolling position whereat the anchor is visible at top of
                            //   page.

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

////////
// §2.3: fillHiddenFields

/**
 * Fills hidden fields on the gravity form for abstract submission.
 *
 * @param {Object}  fieldsToFill  A properly constructed FieldsToFill object.
 */
function fillHiddenFields(fieldsToFill) {
  if( fieldsToFill instanceof FieldsToFill && fieldsToFill.isValid() ) {
    switch( fieldsToFill.selectionMade ) {
      case "Multidisciplinary Undergraduate Research Training in Wearable Computing " +
          "(Hassan Ghasemzadeh)":
        fieldsToFill.$emailInputBox.val( "hassan.ghasemzadeh@wsu.edu" );
        fieldsToFill.$nameInputBox.val( "Hassan" );
        break;
      case "Undergraduate Research in Smart Environments (Larry Holder)":
        fieldsToFill.$emailInputBox.val( "holder@wsu.edu" );
        fieldsToFill.$nameInputBox.val( "Larry" );
        break;
      default:
        fieldsToFill.$emailInputBox.val("");
        fieldsToFill.$nameInputBox.val("");
    }
  }
}

////////
// §2.4: initAnchorVisibilityFix

/**
 * Binds a callback to the window's hashchange event that will keep an anchor that the user has
 * navigated to in view.
 * 
 * @todo Consider moving to DAESA custom JS file.
 */
function initAnchorVisibilityFix() {
  // TODO: Change approach to depend on jQuery(window).on(…)
  window.onhashchange = adjustScrollingAfterNavToAnchor;
}

////////
// §2.5: initDelayedNotices

/**
 * Initializes notice elements, which are initially hidden but come into view after a set amount
 * of time after the page has loaded.
 */
function initDelayedNotices(slctrNotices, clssIsDelayed, noticeDelay) {

  var $delayedNotices;  // jQuery object: all delayed notice elements
  var $this;            // jQuery object: element from which active execution context was invoked
  var noticeDelay;      // Number of milliseconds to wait before displaying notices after page load

  $delayedNotices = $(slctrNotices + "." + clssIsDelayed);
  $delayedNotices.each( function () {
    $this = $( this );
    setTimeout( function() {
      $this.removeClass( clssIsDelayed );
    }, noticeDelay );
  });
}

////////
// §2.6: initExpiringItems

/* Initializes elements for which an expiration date has been set so that the desired behavior is
 * triggered once the item has expired.
 */
function initExpiringItems(slctrExpiringElems, dataAttrExprtnDate, clssExpired) {

  var today;          // Date object constructed from today's date; used to determine whether
                      //   elements have expired

  var $expiringElems; // jQuery object: all elements for which an expiration date has been set

  var $this;          // jQuery object: element from which active execution context was invoked

  var exprtnDateVal;  // The value of an element's expiration date as set through jQuery data
                      //   storage

  var exprtnDateObj;  // A date object constructed from the value of an element's expiration date

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

////////
// §2.7: resortListsWithExpiredItems

/**
 * Improves user experience by sorting lists with chronologically expired elements.
 *
 * After sorting, upcoming/unexpired list items will appear at the top of the list. Expired items
 * will be moved to the bottom of the list and will appear in reverse chronological order. This
 * sorting process will automatically recognize when a Masonry JS list is in use and trigger its
 * layout function after sorting.
 */
function resortListsWithExpiredItems(clssExpired) {
  var $expiredItems;          // jQuery object: all list item elements with an expiration date. Used
                              //   to find all list elements containing such items.

  var $listsWithExpiredItems; // jQuery object: all lists containing elements with current execution
                              //   context was invoked.

  var $thisList;              // jQuery object: list element from which active execution context was
                              //   invoked.

  var $listItems;             // jQuery object: used once a list containing expiring items has
                              //   invoked an execution context to store all of the child list items
                              //   of the invoking list.

  var $lastItem;              // jQuery object: used while iterating over the child list items of a
                              //   parent list element that contains expiring items; serves as
                              //   reference to the last item at the end of the list.

  var $curItem;               // jQuery object: used while iterating over the child list items of a
                              //   parent list element that contains expiring items; serves as
                              //   reference to the curret item being considered during iteration.

  var $clonedItem;            // jQuery object: used to create a clone of an expired list item while
                              //   it is being moved to the end of a list.

  var idx;                    // Iterator index

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
          // This method of moving items is done intentionally to result in a reverse chronological
          //   sorting of expired items, where the most recently expired item is displayed first in
          //   sequence
          $curItem.detach().insertAfter($lastItem);
        }
      }
    } else {
      $listItems = $thisList.children("li");
      $lastItem = $listItems.eq($listItems.length - 1);
      for (idx = 0; idx < $listItems.length; idx++) {
        $curItem = $listItems.eq(idx);
        if ($curItem.hasClass(clssExpired)) {
          // This method of moving items will result in a chronological sorting, which is different
          //   from above; may want to consider refactoring.
          $clonedItem = $curItem.clone();
          $thisList.append($clonedItem).masonry("appended",
            $clonedItem);
          $thisList.masonry("remove", $curItem).masonry("layout");
        }
      }
    }
  });
}

////////
// §2.8: initFacultyEmailAutoEntry

/**
 * Minimizes user input errors by automatically filling in hidden fields for a research mentor's
 * name and email.
 *
 * @param {string}  slctrSelectBox    Selector string for matching the mentor/project selection
 *                    box on the form.
 * @param {string}  slctrHiddenFields Selector string for matching the hidden fields for the
 *                    mentor's name and email address.
 */
function initFacultyEmailAutoEntry(slctrSelectBox, slctrHiddenFields) {
  var $selectField;       // jQuery object: the drop-down selection field through which the user
                          //   chooses their project.

  var $emailField;        // jQuery object: a hidden email field that is the immediate sibling
                          //   following the visible selection field in the DOM.

  var $facultyNameField;  // jQuery object: a hidden text input field that is the immediate sibling
                          //   following the hidden email field in the DOM; stores mentor's name.

  var $selectBox;         // jQuery object: the input element within the project selection field
                          //   that is visible to the user.

  var $emailInputBox;     // jQuery object: the input element within the mentor's email field which
                          //   is hidden from the user.

  var $nameInputBox;      // jQuery object: the input element within the mentor's name field which
                          //   is hidden from the user.

  var selectionMade;      // Holds the value of the project selected by the user.

  var fieldsToFill;       // Object representing the form fields to be automatically filled by JS.

  // If it exists on the page, find the project selection field and bind its change event to a
  //   function that automatically populates hidden fields that store the mentor's contact email and
  //   name.
  $( slctrSelectBox ).each( function () {
    $selectField = $( this) ;
    $emailField = $selectField.next( slctrHiddenFields );
    if ( $emailField.length > 0 ) {
      $facultyNameField = $emailField.next( slctrHiddenFields );
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
          selectionMade = $( this ).val();
          fieldsToFill = new FieldsToFill(
            selectionMade,
            $emailInputBox,
            $nameInputBox
          );
          fillHiddenFields( fieldsToFill );
        } );     
      }
    }
  } );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: CLASS DEFINITIONS

////////
// §3.1: FieldsToFill

/**
 * Stores jQuery objects for gravity form fields to be autofileld with a mentor's correct name
 * and email.
 *
 * @class
 *
 * @param {string} selectionMade:   The mentor/project selected by the user.
 * @param {Object} $emailInputBox:  jQuery object for the mentor's hidden email field on the form.
 * @param {Object} $nameInputBox:   jQuery object for the mentor's hidden name field on the form.
 */
var FieldsToFill = function ( selectionMade, $emailInputBox, $nameInputBox ) {
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

////////
// §3.2: FieldsToFill.prototype.isValid

/**
 * Indicates whether the instance of FieldsToFill has been properly constructed with valid
 * references to jQuery objects.
 * 
 * @returns {boolean}
 */
FieldsToFill.prototype.isValid = function () {
  return this.$emailInputBox.length > 0 && this.$nameInputBox.length > 0;
}

})( jQuery );
