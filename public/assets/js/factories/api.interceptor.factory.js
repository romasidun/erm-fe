
/**
 * Created by Hafeez on 03/01/2017.
 */

app.factory('APIInterceptor', function($rootScope, $base64){

    var _interceptor = {};
    _interceptor.request = function(req){
        req.headers.Authorization = getAuth();
        return req;
    };

    _interceptor.requestError = function(response){
        if(response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };

    return _interceptor;

    function getAuth() {
        this.user = "user";
        this.pass = "6hf38!%DQ09736v,32/f85Ax@#";

        return 'Basic ' + $base64.encode(this.user + ":" + this.pass);
    }
});

