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
		InitFacultyEmailAutoEntry("li.gfield.sets-faculty-email", "li.gform_hidden");
	});

	function InitExpiringItems(slctrExpiringElems, dataAttrExprtnDate) {
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

	var FieldsToFill = function (selectionMade, $emailInputBox, $nameInputBox) {
		this.selectionMade = typeof selectionMade == "string" ? selectionMade : "";
		this.$emailInputBox = isJQuery($emailInputBox) ? $emailInputBox : $();
		this.$nameInputBox = isJQuery($nameInputBox) ? $nameInputBox : $();
	}
	
	FieldsToFill.prototype.isValid = function () {
		return this.selectionMade != "" && this.$emailInputBox.length > 0 && this.$nameInputBox.length > 0;
	}
	
    function InitFacultyEmailAutoEntry(slctrSelectBox, slctrHiddenFields) {
		$(slctrSelectBox).each(function () {
			var $selectField = $(this);
			var $emailField = $selectField.next(slctrHiddenFields);
			if($emailField.length > 0) {
				var $facultyNameField = $emailField.next(slctrHiddenFields);
				if($facultyNameField.length > 0) {
					var $selectBox = $selectField.find("select").first();
					var $emailInputBox = $emailField.find("input[type='hidden']").first();
					var $nameInputBox = $facultyNameField.find("input[type='hidden']").first();
					$selectBox.change(function() {
						var selectionMade = $(this).val();
						var fieldsToFill = new FieldsToFill(selectionMade, $emailInputBox, $nameInputBox);
						fillHiddenFields(fieldsToFill);
					});			
				}
			}
		});
    }
	
	function fillHiddenFields(fieldsToFill) {
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
