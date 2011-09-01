(function() {
  /*!
  JSON_Minifier
  
  Copyright 2011 Arwid Bancewicz
  Licensed under the MIT license
  http://www.opensource.org/licenses/mit-license.php
  
  @date 31 Aug 2011
  @author Arwid Bancewicz http://arwid.ca
  @version 0.2
  */
  var JSON_Minifier;
  JSON_Minifier = (function() {
    var composeKeyValues, deepKeys, deepValues, getKeys, getValues;
    getKeys = function(array) {
      return _(array).chain().map(function(obj) {
        return _.keys(obj);
      }).flatten().union().value();
    };
    deepKeys = function(object, keys) {
      var childkeys, key, val;
      if (keys == null) {
        keys = [];
      }
      if (_.isArray(object)) {
        object = object[0];
        for (key in object) {
          val = object[key];
          keys.push(key);
          if (_.isArray(val)) {
            keys.push(childkeys = []);
            deepKeys(val, childkeys);
          }
        }
      }
      return keys;
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
    deepValues = function(objects, values) {
      var childObject, childValues, key, object, val, _i, _len;
      if (values == null) {
        values = [];
      }
      if (_.isArray(objects)) {
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          values.push(childObject = []);
          for (key in object) {
            val = object[key];
            if (_.isArray(val)) {
              childObject.push(childValues = []);
              deepValues(val, childValues);
            } else {
              childObject.push(val);
            }
          }
        }
      }
      return values;
    };
    composeKeyValues = function(keys, values) {
      return _.map(values, function(row) {
        var childData, data, index, value, _i, _len;
        data = {};
        index = 0;
        for (_i = 0, _len = row.length; _i < _len; _i++) {
          value = row[_i];
          if (!_.isArray(value)) {
            data[keys[index++]] = value;
          } else {
            data[keys[index++]] = childData = composeKeyValues(keys[index++], value);
          }
        }
        return data;
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
        keys = deepKeys(jsonArray);
        data = deepValues(jsonArray);
        minified = {
          map: keys,
          data: data
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
        original = composeKeyValues(minified.map, minified.data);
        console.log(original);
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
