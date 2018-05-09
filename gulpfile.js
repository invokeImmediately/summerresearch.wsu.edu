var compiledCssSrcFileName = 'summerresearch-custom.css';
var minCssFileHeaderStr = '/* Built with the LESS CSS preprocessor [http://lesscss.org/]. Please see [https://github.com/invokeImmediately/summerresearch.wsu.edu] for a repository of source code. */\r\n';
var gulp = require( 'gulp' );
var lessc = require( 'gulp-less' );
var gcmq = require( 'gulp-group-css-media-queries' );
var insertLines = require( 'gulp-insert-lines' );
var cleanCss = require( 'gulp-clean-css' );
var insert = require( 'gulp-insert' );
var extName = require( 'gulp-extname' );
var compiledJsBuildName = 'dsp-custom-build.js';
var replace = require( 'gulp-replace' );
var concat = require( 'gulp-concat' );

gulp.task( 'buildMinCss', function () {
	gulp.src( './CSS/*.less' )
		.pipe( lessc( {
			paths: ['./WSU-UE---CSS/']
		} ) )
		.pipe( replace( /^ (?! )/gm, '' ) )
		.pipe( gulp.dest( './CSS/' ) )
		.pipe( gcmq() )
		.pipe( insertLines( {
			'before': /^@media/,
			'lineBefore': '/*! ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗\r\n*   ║ MEDIA QUERIES ####################################################################################################### ║\r\n*   ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝\r\n*/',
			'stopAfterFirstMatch': true
		} ) )
		.pipe( cleanCss() )
		.pipe( insert.prepend( minCssFileHeaderStr ) )
		.pipe( extName( '.min.css' ) )
		.pipe( gulp.dest( './CSS/' ) );
} );

// TODO: Copied from distinguishedscholarships.wsu.edu; update for this site
gulp.task( 'buildMinJs', function () {
	gulp.src( [
			'./JS/dsp-custom.js',
			'./WSU-UE---JS/jQuery.oue-custom.js',
			'./WSU-UE---JS/jQuery.animatedCalendar.js',
			'./WSU-UE---JS/jQuery.autoScrollingImages.js',
			'./WSU-UE---JS/jQuery.cookieObjs.js',
			'./WSU-UE---JS/jQuery.cycle2.js',
			'./WSU-UE---JS/jQuery.forms.js',
			'../jQuery.AreYouSure/jquery.are-you-sure.js',
			'./WSU-UE---JS/jQuery.are-you-sure.js',
			'./WSU-UE---JS/jquery.media.js',
			'../qTip2/dist/jquery.qtip.min.js',
			'./WSU-UE---JS/jQuery.qTip.js',
			'./WSU-UE---JS/jQuery.textResize.js',
			'../imagesloaded/imagesloaded.pkgd.min.js',
			'../masonry/dist/masonry.pkgd.min.js',
			'./WSU-UE---JS/jQuery.masonry-custom.js'
		] )
		.pipe( replace( /^(\/\*)(?!!)/g, fixFileHeaderComments ) )
		.pipe( concat( compiledJsBuildName ) )
		.pipe( gulp.dest( './JS/' ) );
} );

function fixFileHeaderComments ( match, p1, offset, string ) {
	var replacementStr = match;
	if ( offset == 0 ) {
		replacementStr = '/*!';
	}
	return replacementStr;
}
