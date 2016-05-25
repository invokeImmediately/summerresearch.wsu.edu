/* NODE.JS - Build Production JavaScript File */
var concat = require('../../../../AppData/Roaming/npm/node_modules/concat-files');
concat([
 './sumres-custom.js',
 '../WSU-UE---JS/jQuery.oue-custom.js',
 '../WSU-UE---JS/jQuery.qTip.js',
 '../WSU-UE---JS/jQuery.masonry.js'
 ], './wp-custom-js-source.js', function() {
    console.log('Concatenation complete.');     
 });