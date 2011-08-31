(function() {
  /*!
  JSON_Minifier
  
  Copyright 2011 Arwid Bancewicz
  Licensed under the MIT license
  http://www.opensource.org/licenses/mit-license.php
  
  @date 31 Aug 2011
  @author Arwid Bancewicz http://arwid.ca
  @version 0.1
  */
  var JSON_Minifier;
  JSON_Minifier = (function() {
    var getKeys, getValues;
    getKeys = function(array) {
      return _(array).chain().map(function(obj) {
        return _.keys(obj);
      }).flatten().union().value();
    };
    getValues = function(array, keys) {
      if (keys == null) {
        keys = getKeys(array);
      }
      return _(array).map(function(obj) {
        return _(keys).map(function(b) {
          return obj[b];
        });
      });
    };
    return {
      minify: function(jsonArray, stringify) {
        var data, keys, minified;
        if (stringify == null) {
          stringify = false;
        }
        if (_(jsonArray).isString()) {
          jsonArray = JSON.parse(jsonArray);
        }
        keys = getKeys(jsonArray);
        data = getValues(jsonArray, keys);
        minified = {
          data: data,
          map: keys
        };
        if (stringify) {
          return JSON.stringify(minified);
        } else {
          return minified;
        }
      },
      revert: function(minified, stringify) {
        var original;
        if (stringify == null) {
          stringify = false;
        }
        if (_(minified).isString()) {
          minified = JSON.parse(minified);
        }
        original = _.map(minified.data, function(datum) {
          var row;
          row = {};
          _(minified.map).each(function(key, index) {
            return row[key] = datum[index];
          });
          return row;
        });
        if (stringify) {
          return JSON.stringify(original);
        } else {
          return original;
        }
      }
    };
  })();
  _.mixin({
    JSON_minify: JSON_Minifier.minify,
    JSON_revert: JSON_Minifier.revert
  });
}).call(this);
