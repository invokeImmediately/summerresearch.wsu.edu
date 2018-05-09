/* NODE.JS - Build Production JavaScript File */
var concat = require('../../../../AppData/Roaming/npm/node_modules/concat-files');
concat([
 '../WSU-UE---JS/jQuery.oue-custom.js',
 '../WSU-UE---JS/jQuery.textResize.js',
 '../WSU-UE---JS/jQuery.forms.js',
 '../../qTip2/dist/jquery.qtip.min.js',
 '../WSU-UE---JS/jQuery.qTip.js',
 '../WSU-UE---JS/jQuery.autoScrollingImages.js',
 '../../imagesloaded/imagesloaded.pkgd.min.js',
 '../../masonry/dist/masonry.pkgd.min.js',
 '../WSU-UE---JS/jQuery.masonry-custom.js',
 '../../jQuery.countdown/dist/jquery.countdown.min.js',
 '../WSU-UE---JS/jQuery.countdown-custom.js',
 './sumres-custom.js'
 ], './wp-custom-js-source.js', function() {
    console.log('Concatenation complete.');     
 });
