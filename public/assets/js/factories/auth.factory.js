
/**
 * Created by Hafeez on 03/01/2017.
 */

app.factory('AuthFactory', function($rootScope, $http, $base64){
    function AuthHandler(){}
    AuthHandler.prototype.constructor = AuthHandler;

    AuthHandler.prototype.Authenticate = function(cred){
        var report =  { user: false, pass: false };
        report.user = cred.username === 'Alan';
        report.pass = cred.password === 'Alan1234';

        return report;
    };

    return new AuthHandler();
});

