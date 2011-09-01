###!
JSON_Minifier

Copyright 2011 Arwid Bancewicz
Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php

@date 31 Aug 2011
@author Arwid Bancewicz http://arwid.ca
@version 0.2
###


JSON_Minifier = (->
  
  # PRIVATE Members
  
  # DEPRECATED by deepKeys()
  getKeys = (array) ->
    _(array)
      .chain()
      .map((obj) -> _.keys obj)
      .flatten()
      .union()
      .value()
      
  # {a:0,b:[{c:1,d:[{e:2}]}],f:3} becomes [a,b,[c,d,[e]],f]
  deepKeys: (object, keys = []) ->
    if _.isArray object
      # always get the schema from the first element
      object = object[0]

      for key, val of object
        keys.push key
        if _.isArray val
          keys.push childkeys = []
          _.deepKeys val, childkeys
    keys
      
  # DEPRECATED by deepValues()
  getValues = (array, keys = getKeys(array)) ->
    _(array)
      .map (obj) -> 
        _(keys).map (b) -> 
          obj[b]
          
  # {a:0,b:[{c:1,d:[{e:2}]}],f:3} becomes [0,[1,[2]],3]
  deepValues: (objects, values = []) ->
    if _.isArray objects
      for object in objects
        values.push childObject = []
        for key, val of object
          if _.isArray val
            childObject.push childValues = []
            _.deepValues val, childValues
          else
            childObject.push val
    values
  
  # Put key and value arraws together
  composeKeyValues = (keys, values) ->
    _.map values, (row) ->
      data = {}
      
      index = 0
      for value in row
        if not _.isArray value
          data[keys[index++]] = value
        else   
          data[keys[index++]] = childData = composeKeyValues keys[index++], value
      data
  
  # PUBLIC Members
  
  # take a jsonArray and return a minified version
  minify: (jsonArray, stringify = no) ->
    
    # if it's a JSON string then convert it into an object by parsing it
    if _(jsonArray).isString() then jsonArray = JSON.parse jsonArray
    
    # do the magic
    keys = _.deepKeys jsonArray
    data = _.deepValues jsonArray
    minified = { map: keys, data: data }
    
    # return the minified, stringified if asked
    if stringify then JSON.stringify minified else minified 
  
  # take a minified object or JSONString and return the original object
  revert: (minified, stringify = no) ->
    
    # if it's a JSON string then convert it into an object by parsing it
    if _(minified).isString() then minified = JSON.parse minified
    
    # do the magic
    original = composeKeyValues minified.map, minified.data
    console.log original
    
    # return the original, stringified if asked
    if stringify then JSON.stringify original else original 
)()
  
  
# Have this utility accessible via Underscore mixins
_.mixin 
  JSON_minify : JSON_Minifier.minify
  JSON_revert : JSON_Minifier.revert
  