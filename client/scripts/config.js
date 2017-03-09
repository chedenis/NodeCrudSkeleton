"use strict";

angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:{facesheet:'http://localhost:8011',facility:'http://localhost:8013',resident:'http://localhost:8012',packet:'http://localhost:8050',marketing:'http://localhost:8099',auth:'http://localhost:8055/:action',groupPlus:'http://localhost:8040',offset:'http://localhost:8087'}})

;