(function () {

/* Imports */
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var EJSON = Package.ejson.EJSON;
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var HttpConnection, HttpSubscription, SimpleRest, paths, pathInfo;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/http-connection.js                                      //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// Simulate a DDP connection from HTTP request
HttpConnection = function () {
  // no-op now
};

//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/http-subscription.js                                    //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
var EventEmitter = Npm.require('events').EventEmitter;

// This file describes something like Subscription in
// meteor/meteor/packages/ddp/livedata_server.js, but instead of sending
// over a socket it puts together an HTTP response
HttpSubscription = function (options) {
  // Object where the keys are collection names, and then the keys are _ids
  this.responseData = {};

  this.connection = new HttpConnection(options.request);
  this.userId = options.userId;
};

// So that we can listen to ready event in a reasonable way
Meteor._inherits(HttpSubscription, EventEmitter);

_.extend(HttpSubscription.prototype, {
  added: function (collection, id, fields) {
    var self = this;

    check(collection, String);
    if (id instanceof Mongo.Collection.ObjectID) id = id + '';
    check(id, String);

    self._ensureCollectionInRes(collection);

    // Make sure to ignore the _id in fields
    var addedDocument = _.extend({_id: id}, _.omit(fields, '_id'));
    self.responseData[collection][id] = addedDocument;
  },

  changed: function (collection, id, fields) {
    var self = this;

    check(collection, String);
    if (id instanceof Mongo.Collection.ObjectID) id = id + '';
    check(id, String);

    self._ensureCollectionInRes(collection);

    var existingDocument = this.responseData[collection][id];
    var fieldsNoId = _.omit(fields, '_id');
    _.extend(existingDocument, fieldsNoId);

    // Delete all keys that were undefined in fields (except _id)
    _.each(fields, function (value, key) {
      if (value === undefined) {
        delete existingDocument[key];
      }
    });
  },

  removed: function (collection, id) {
    var self = this;

    check(collection, String);
    if (id instanceof Mongo.Collection.ObjectID) id = id + '';
    check(id, String);

    self._ensureCollectionInRes(collection);

    delete self.responseData[collection][id];

    if (_.isEmpty(self.responseData[collection])) {
      delete self.responseData[collection];
    }
  },

  ready: function () {
    this.emit('ready', this._generateResponse());
  },

  onStop: function () {
    // no-op in HTTP
  },

  error: function (error) {
    throw error;
  },

  _ensureCollectionInRes: function (collection) {
    this.responseData[collection] = this.responseData[collection] || {};
  },

  _generateResponse: function () {
    var output = {};

    _.each(this.responseData, function (documents, collectionName) {
      output[collectionName] = _.values(documents);
    });

    return output;
  },
});

//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/rest.js                                                 //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
SimpleRest = {};

// Can be used to limit which collections get endpoints:
// {
//   collections: ['widgets', 'doodles']
// }
// By default all do. Use empty array for none.
//
// Also:
//    objectIdCollections: ['widgets', 'doodles']
SimpleRest._config = {};
SimpleRest.configure = function (config) {
  return _.extend(SimpleRest._config, config);
};

SimpleRest._methodOptions = {};

// Set options for a particular DDP method that will later be defined
SimpleRest.setMethodOptions = function (name, options) {
  check(name, String);

  // Throw an error if the Method is already defined - too late to pass
  // options
  if (_.has(Meteor.server.method_handlers, name)) {
    throw new Error('Must pass options before Method is defined: ' +
      name);
  }

  options = options || {};

  _.defaults(options, {
    url: 'methods/' + name,
    getArgsFromRequest: defaultGetArgsFromRequest,
    httpMethod: 'post',
  });

  SimpleRest._methodOptions[name] = options;
};

var oldPublish = Meteor.publish;
Meteor.publish = function (name, handler, options) {
  options = options || {};

  var httpOptionKeys = [
    'url',
    'getArgsFromRequest',
    'httpMethod',
  ];

  var httpOptions = _.pick(options, httpOptionKeys);
  var ddpOptions = _.omit(options, httpOptionKeys);

  // Register DDP publication
  oldPublish(name, handler, ddpOptions);

  _.defaults(httpOptions, {
    url: 'publications/' + name,
    getArgsFromRequest: defaultGetArgsFromRequest,
    httpMethod: 'get',
  });

  JsonRoutes.add(httpOptions.httpMethod, httpOptions.url, function (req, res) {
    var userId = req.userId || null;

    var httpSubscription = new HttpSubscription({
      request: req,
      userId: userId,
    });

    httpSubscription.on('ready', function (response) {
      JsonRoutes.sendResult(res, {data: response});
    });

    var handlerArgs = httpOptions.getArgsFromRequest(req);

    var handlerReturn = handler.apply(httpSubscription, handlerArgs);

    // Fast track for publishing cursors - we don't even need livequery here,
    // just making a normal DB query
    if (handlerReturn && handlerReturn._publishCursor) {
      httpPublishCursor(handlerReturn, httpSubscription);
      httpSubscription.ready();
    } else if (handlerReturn && _.isArray(handlerReturn)) {
      // We don't need to run the checks to see if
      // the cursors overlap and stuff
      // because calling Meteor.publish will do that for us :]
      _.each(handlerReturn, function (cursor) {
        httpPublishCursor(cursor, httpSubscription);
      });

      httpSubscription.ready();
    }
  });
};

var oldMethods = Object.getPrototypeOf(Meteor.server).methods;
Meteor.method = function (name, handler, options) {
  if (!SimpleRest._methodOptions[name]) {
    SimpleRest.setMethodOptions(name, options);
  } else if (options) {
    throw Error('Options already passed via setMethodOptions.');
  }

  var methodMap = {};
  methodMap[name] = handler;
  oldMethods.call(Meteor.server, methodMap);

  // This is a default collection mutation method, do some special things to
  // make it more RESTful
  if (insideDefineMutationMethods) {
    var collectionName = name.split('/')[1];

    if (_.isArray(SimpleRest._config.collections) &&
       !_.contains(SimpleRest._config.collections, collectionName)) return;

    var isObjectId = false;
    if (_.isArray(SimpleRest._config.objectIdCollections) &&
       _.contains(SimpleRest._config.objectIdCollections, collectionName)) {
      isObjectId = true;
    }

    var modifier = name.split('/')[2];

    var collectionUrl = '/' + collectionName;
    var itemUrl = '/' + collectionName + '/:_id';

    if (modifier === 'insert') {
      // Post the entire new document
      addHTTPMethod(name, handler, {
        httpMethod: 'post',
        url: collectionUrl,
      });
    } else if (modifier === 'update') {
      // PATCH means you submit an incomplete document, to update the fields
      // you have passed
      addHTTPMethod(name, handler, {
        url: itemUrl,
        httpMethod: 'patch',
        getArgsFromRequest: function (req) {
          var id = req.params._id;
          if (isObjectId) id = new Mongo.ObjectID(id);
          return [{ _id: id }, { $set: req.body }];
        },
      });

      // We don't have PUT because allow/deny doesn't let you replace documents
      // you can define it manually if you want
    } else if (modifier === 'remove') {
      // Can only remove a single document by the _id
      addHTTPMethod(name, handler, {
        url: itemUrl,
        httpMethod: 'delete',
        getArgsFromRequest: function (req) {
          var id = req.params._id;
          if (isObjectId) id = new Mongo.ObjectID(id);
          return [{ _id: id }];
        },
      });
    }

    return;
  }

  addHTTPMethod(name, handler, options);
};

// Monkey patch _defineMutationMethods so that we can treat them specially
// inside Meteor.method
var insideDefineMutationMethods = false;
var oldDMM = Mongo.Collection.prototype._defineMutationMethods;
Mongo.Collection.prototype._defineMutationMethods = function () {
  insideDefineMutationMethods = true;
  oldDMM.apply(this, arguments);
  insideDefineMutationMethods = false;
};

Meteor.methods = Object.getPrototypeOf(Meteor.server).methods =
  function (methodMap) {
    _.each(methodMap, function (handler, name) {
      Meteor.method(name, handler);
    });
  };

function addHTTPMethod(methodName, handler, options) {
  options = options || SimpleRest._methodOptions[methodName] || {};

  options = _.defaults(options, {
    getArgsFromRequest: defaultGetArgsFromRequest,
  });

  JsonRoutes.add('options', options.url, function (req, res) {
    JsonRoutes.sendResult(res);
  });

  JsonRoutes.add(options.httpMethod, options.url, function (req, res) {
    var userId = req.userId || null;
    var statusCode = 200;

    // XXX replace with a real one?
    var methodInvocation = {
      userId: userId,
      setUserId: function () {
        throw Error('setUserId not implemented in this ' +
                      'version of simple:rest');
      },

      isSimulation: false,
      unblock: function () {
        // no-op
      },

      setHttpStatusCode: function (code) {
        statusCode = code;
      },
    };

    var handlerArgs = options.getArgsFromRequest(req);
    var handlerReturn = handler.apply(methodInvocation, handlerArgs);
    JsonRoutes.sendResult(res, {
      code: statusCode,
      data: handlerReturn,
    });
  });
}

function httpPublishCursor(cursor, subscription) {
  _.each(cursor.fetch(), function (document) {
    subscription.added(cursor._cursorDescription.collectionName,
      document._id, document);
  });
}

function defaultGetArgsFromRequest(req) {
  var args = [];
  if (req.method === 'POST') {
    // by default, the request body is an array which is the arguments
    args = EJSON.fromJSONValue(req.body);

    // If it's an object, pass the entire object as the only argument
    if (!_.isArray(args)) {
      args = [args];
    }
  }

  _.each(req.params, function (value, name) {
    var parsed = parseInt(name, 10);

    if (_.isNaN(parsed)) {
      throw new Error('REST publish doesn\'t support parameters ' +
                      'whose names aren\'t integers.');
    }

    args[parsed] = value;
  });

  return args;
}

//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/list-api.js                                             //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/* global JsonRoutes:false - from simple:json-routes package */
/* global paths:true */
/* global pathInfo:true */

// publish all API methods
Meteor.publish('api-routes', function () {
  var self = this;

  // Deduplicate routes across paths
  paths = {};

  _.each(JsonRoutes.routes, function (route) {
    pathInfo = paths[route.path] || { methods: [], path: route.path };

    pathInfo.methods.push(route.method);

    paths[route.path] = pathInfo;
  });

  _.each(paths, function (pathInfo, path) {
    self.added('api-routes', path, pathInfo);
  });

  self.ready();
});

//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['simple:rest'] = {}, {
  SimpleRest: SimpleRest
});

})();
