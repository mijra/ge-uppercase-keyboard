'use strict'
require('normalize-css')
require('animate.css')
require('./style.css')
document.body.style.display = 'block'

require('./node_modules/medium-editor/dist/css/medium-editor.css')
require('./node_modules/medium-editor/dist/css/themes/default.css')
const MediumEditor = require('medium-editor')

require('./keyboard')

var editor = new MediumEditor('.textarea');
