/**
 * Created by Roma on 03/01/2017.
 */

app.factory('AuthFactory', function ($q, $timeout, $http, $localStorage, APIHandler, $filter, $rootScope) {
    // create user variable
    var user = null;

    // return available functions for use in the controllers
    function isLoggedIn() {
        var user = $localStorage.user;
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    function getUserInfo() {
        var userinfo = $localStorage.currentUserInfo;
        return userinfo;
    }

    function getUserStatus() {
        var user = $localStorage.user;
        return user;
    }

    function login(username, password, pincode) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        var senddata = {username: username, password: password, pincode: pincode};
        APIHandler.Post('users/authenticate', senddata)
            .then(function (data) {
                if(data.status === 200 && data.data){
                    $localStorage.user = senddata;
                    user = true;

                    APIHandler.Get('users')
                        .then(function (res) {
                            var tmpary = $filter('filter')(res, {username: senddata.username}, true);
                            $localStorage.currentUserInfo = tmpary[0];
                            $rootScope.currentUserInfo = tmpary[0];
                        });
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            })
            .catch(function (data) {
                delete $localStorage.user;
                delete $localStorage.currentUserInfo;
                user = false;
                deferred.reject();
            });
        // return promise object

        return deferred.promise;
    }

    function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        delete $localStorage.user;
        delete $localStorage.currentUserInfo;
        delete $localStorage.UserState;
        $rootScope.currentUserInfo = [];
        return;

    }

    function register(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register',
            {username: username, password: password})
        // handle success
            .success(function (data, status) {
                if(status === 200 && data.status){
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                deferred.reject();
            });

        // return promise object
        return deferred.promise;

    }

    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        getUserInfo: getUserInfo,
        login: login,
        logout: logout,
        register: register
    });
});

