/*!*************************************************************************************************
 * █▀▀▀ █  █ █    █▀▀▄ █▀▀▀ ▀█▀ █    █▀▀▀      █ ▄▀▀▀
 * █ ▀▄ █  █ █  ▄ █▄▄▀ █▀▀▀  █  █  ▄ █▀▀    ▄  █ ▀▀▀█
 * ▀▀▀▀  ▀▀  ▀▀▀  █    ▀    ▀▀▀ ▀▀▀  ▀▀▀▀ ▀ ▀▄▄█ ▀▀▀ 
 *
 * Gulp automation task definition file for setting up tasks that build CSS and JS files for use on
 *   the WSUWP website of the WSU Summer Research Program.
 *
 * @version 1.0.0-rc0.0.1
 *
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/summerresearch.wsu.edu/blob/master/gulpfile.js
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
// §1: Gulp task dependencies..................................................................44
// §2: Specification of build settings ........................................................49
//   §2.1: getCssBuildSettings()...............................................................52
//   §2.2: getJsBuildSettings()...............................................................129
// §3: Entry point: Set up of build task......................................................160
////////////////////////////////////////////////////////////////////////////////////////////////////

( function() {

'use strict';


////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Gulp task dependencies

var gulpBuilder = require( './WSU-DAESA-JS/gulpCssJsBuilder.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Specification of build settings

////////
// §2.1: getCssBuildSettings()

/**
 * Get the settings for a gulp-mediated custom CSS build from Less source files.
 *
 * @return {object} - Instance of gulpBuilder.CssBuildSettings.
 */
function getCssBuildSettings() {
	return new gulpBuilder.CssBuildSettings( {
		commentRemovalNeedle: /^(?:[ \t]*)?\/\*[^!].*$\n(?:^\*\*?[^/].*$\n)*\*\*?\/\n\n?/gm,
		dependenciesPath: './WSU-DAESA-CSS/',
		destFolder: './CSS/',
		fontImportStr: '@import url(\'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,' +
			'400i,600,600i,700,700i|Roboto+Condensed:400,400i,700,700i|PT+Serif:400,400i,700,700i|Robot' +
			'o+Mono:400,400i,700,700i&display=swap\');\r\n',
		insertingMediaQuerySectionHeader: {
			'before': /^@media/,
				lineBefore: '/*! ========================================================================' +
						'========================\r\n' +
					'*** ▐▀▄▀▌█▀▀▀ █▀▀▄ ▀█▀ ▄▀▀▄   ▄▀▀▄ █  █ █▀▀▀ █▀▀▄ ▀█▀ █▀▀▀ ▄▀▀▀   ▄▀▀▀ █▀▀▀ ▄▀▀▀▐▀█▀▌' +
						'▀█▀ ▄▀▀▄ ▐▀▀▄\r\n' +
					'*** █ ▀ ▌█▀▀  █  █  █  █▄▄█   █  █ █  █ █▀▀  █▄▄▀  █  █▀▀  ▀▀▀█   ▀▀▀█ █▀▀  █     █  ' +
						' █  █  █ █  ▐\r\n' +
					'*** █   ▀▀▀▀▀ ▀▀▀  ▀▀▀ █  ▀    ▀█▄  ▀▀  ▀▀▀▀ ▀  ▀▄▀▀▀ ▀▀▀▀ ▀▀▀    ▀▀▀  ▀▀▀▀  ▀▀▀  █  ' +
						'▀▀▀  ▀▀  ▀  ▐\r\n' +
					'*** ==================================================================================' +
						'==============\r\n' +
					'*** Media queries built from precompiled CSS written in the Less language extension' +
					  ' of CSS. Queries\r\n' +
					'***   in this section are a combination of those designed for use on DAESA websites' +
						' and those\r\n' +
					'***   intended specifically for use on the Summer Research Program website.\r\n' +
					'***\r\n' +
					'*** Fully documented, precompiled source code from which this section of stylesheet' +
						' was developed\r\n' +
					'***   is maintained on the following two GitHub projects:\r\n' +
					'***   - https://github.com/invokeImmediately/WSU-DAESA-CSS/\r\n' +
					'***   - https://github.com/invokeImmediately/summerresearch.wsu.edu/\r\n' +
					'***\r\n' +
					'*** @author Daniel Rieck [daniel.rieck@wsu.edu]' +
						' (https://github.com/invokeImmediately)\r\n' +
					'*** @license: MIT - Copyright (c) 2021 Washington State University\r\n' +
					'***   Permission is hereby granted, free of charge, to any person obtaining a copy of' +
						' this software\r\n' +
					'***     and associated documentation files (the "Software"), to deal in the Software' +
						' without\r\n' +
					'***     restriction, including without limitation the rights to use, copy, modify,' +
						' merge, publish,\r\n' +
					'***     distribute, sublicense, and/or sell copies of the Software, and to permit' +
						' persons to whom\r\n' +
					'***     the Software is furnished to do so, subject to the following conditions:\r\n' +
					'***   The above copyright notice and this permission notice shall be included in all' +
						' copies or\r\n' +
					'***     substantial portions of the Software.\r\n' +
					'***   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR' +
						' IMPLIED, INCLUDING\r\n' +
					'***     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR' +
						' PURPOSE AND\r\n' +
					'***     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE' +
						' FOR ANY\r\n' +
					'***     CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR' +
						' OTHERWISE,\r\n' +
					'***     ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER' +
						' DEALINGS IN THE\r\n' +
					'***     SOFTWARE.\r\n' +
					'*** ==================================================================================' +
						'==============\r\n' +
					'**/',
			'stopAfterFirstMatch': true
		},
		minCssFileExtension: '.min.css',
		minCssFileHeaderStr: '',
		sourceFile: './CSS/summerresearch-custom.less'
	} );
}

////////
// §2.2: getJsBuildSettings()

/**
 * Get the settings for a gulp-mediated custom JS build.
 *
 * @return {object} - Simple collection of settings for JS builds.
 */
function getJsBuildSettings() {
	return {
		buildDependenciesList: [
			'./WSU-DAESA-JS/jQuery.daesa-custom.js',
			'./WSU-DAESA-JS/jQuery.autoScrollingImages.js',
			'./WSU-DAESA-JS/jQuery.cookieObjs.js',
			'./WSU-DAESA-JS/jQuery.forms.js',
			'../jQuery.AreYouSure/jquery.are-you-sure.js',
			'./WSU-DAESA-JS/jQuery.are-you-sure.js',
			'./WSU-DAESA-JS/jquery.media.js',
			'../qTip2/dist/jquery.qtip.min.js',
			'./WSU-DAESA-JS/jQuery.qTip.js',
			'./WSU-DAESA-JS/jQuery.masonry-custom.js',
			'./JS/sumres-custom.js'
		],
		commentNeedle: /^(\/\*)(?!!)/g,
		compiledJsFileName: 'sumres-build.js',
		destFolder: './JS/',
		minJsFileExtension: '.min.js',
		replaceCallback: gulpBuilder.fixFileHeaderComments
	};
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: Entry point: Set up of build task

gulpBuilder.setUpCssBuildTask( getCssBuildSettings() );
gulpBuilder.setUpJsBuildTask( getJsBuildSettings() );

} )();
