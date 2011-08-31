###!
JSON_Minifier

Copyright 2011 Arwid Bancewicz
Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php

@date 31 Aug 2011
@author Arwid Bancewicz http://arwid.ca
@version 0.1
###


JSON_Minifier = (->
  
  # PRIVATE Members
  
  getKeys = (array) ->
    _(array)
      .chain()
      .map((obj) -> _.keys obj)
      .flatten()
      .union()
      .value()
      
  getValues = (array, keys = getKeys(array)) ->
    _(array)
      .map (obj) -> 
        _(keys).map (b) -> obj[b]
  
  
  # PUBLIC Members
  
  # take a jsonArray and return a minified version
  minify: (jsonArray, stringify = no) ->
    
    # if it's a JSON string then convert it into an object by parsing it
    if _(jsonArray).isString() then jsonArray = JSON.parse jsonArray
    
    # do the magic
    keys = getKeys jsonArray
    data = getValues jsonArray, keys
    minified = { data: data, map: keys }
    
    # return the minified, stringified if asked
    if stringify then JSON.stringify minified else minified 
  
  # take a minified object or JSONString and return the original object
  revert: (minified, stringify = no) ->
    
    # if it's a JSON string then convert it into an object by parsing it
    if _(minified).isString() then minified = JSON.parse minified
    
    # do the magic
    original = _.map minified.data, (datum) ->
      row = {}
      _(minified.map).each (key, index) -> row[key] = datum[index]
      row
    
    # return the original, stringified if asked
    if stringify then JSON.stringify original else original 
)()
  
  
# Have this utility accessible via Underscore mixins
_.mixin 
  JSON_minify : JSON_Minifier.minify
  JSON_revert : JSON_Minifier.revert