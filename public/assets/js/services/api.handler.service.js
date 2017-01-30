  "use strict";

  app.service('APIHandler', function($rootScope, $http, $q, $base64, Utils){

    var baseUrl = $rootScope.app.APIPrefix;
    var isDebug = $rootScope.app.Debug;

    function APIHandler (){
      this.name = "API Handler";
    }

    APIHandler.prototype.Get = function get(url) {
      url = baseUrl + url;
      if(isDebug) console.info("Get: " + url);
      var promise = $http.get(url), deferred = $q.defer();
      promise.then(function (res) {
              if(isDebug) console.log(res.data);
              deferred.resolve(res.data);
          }, function (err) {
              if(isDebug) console.error(err);
              $rootScope.app.Mask = false;
              deferred.reject(err);
          });
      return deferred.promise;
    };

    APIHandler.prototype.Post = function get(url, params) {
      url = baseUrl + url;
        console.log(baseUrl);
      if(isDebug) console.info("POST: " + url);
      if(isDebug) console.info("with body: ", params);
      var promise = $http.post(url, params), deferred = $q.defer();
      promise.then(function (res) {
          if(isDebug) console.log(res);
          deferred.resolve(res);
      }, function (err) {
          if(isDebug) console.error(err);
          deferred.reject(err);
      });
      return deferred.promise;
    };

    APIHandler.prototype.PostWithFile = function get(url, params) {
          url = baseUrl + url;
          if(isDebug) console.info("POST: " + url);
          if(isDebug) console.info("with body: ", params);

          var promise = $http({
              method: 'POST',
              url: url,
              data: params,
              headers: {
                  'Content-Type': undefined
              }
          });
          var deferred = $q.defer();
          promise.then(function (res) {
              if(isDebug) console.log(res);
              deferred.resolve(res);
          }, function (err) {
              if(isDebug) console.error(err);
              deferred.reject(err);
          });
          return deferred.promise;
      };

    APIHandler.prototype.Put = function get(url, params) {
      url = baseUrl + url;
      if(isDebug) console.info("PUT: " + url);
      if(isDebug) console.info("with body: ", params);
      var promise = $http.put(url, params), deferred = $q.defer();
      promise.then(function (res) {
          if(isDebug) console.log(res);
          deferred.resolve(res);
      }, function (error) {
          if(isDebug) console.error("Request failed" + error);
          deferred.reject(error);
      });
      return deferred.promise;
    };

    APIHandler.prototype.Delete = function get(url) {
      url = baseUrl + url;
      console.log(url);
      if(isDebug) console.info("DELETE: " + url);
      var promise = $http.delete(url), deferred = $q.defer();
          promise.then(function (res) {
              if(isDebug) console.log(res);
              deferred.resolve(res);
          }, function (error) {
              if(isDebug) console.error("Request failed" + error);
              deferred.reject(error);
          });
      return deferred.promise;
    };

    APIHandler.prototype.Excel = function get(url, params) {
        if(isDebug) console.info("POST: " + url);
        if(isDebug) console.info("with body: ", params);
        var promise = $http.post(url, params), deferred = $q.defer();
        promise.then(function (res) {
            if(isDebug) console.log(res);
            deferred.resolve(res);
        }, function (err) {
            if(isDebug) console.error(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    return new APIHandler();
  });
