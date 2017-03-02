/**
 * Created by Roma on 03/01/2017.
 */

app.factory('AuthFactory', function ($q, $timeout, $http) {
    // create user variable
    var user = null;

    // return available functions for use in the controllers
    function isLoggedIn() {
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    function getUserStatus() {
        return user;
    }

    function login(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        if(username === 'Alan' && password === 'Alan1234'){
            user = true;
            deferred.resolve(user);
        } else {
            user = false;
            deferred.reject();
        }

        /*
        // send a post request to the server
        $http.post('/user/login',{username: username, password: password})
            .success(function (data, status) {
                if(status === 200 && data.status){
                    user = true;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            })
            .error(function (data) {
                user = false;
                deferred.reject();
            });
        // return promise object
        */
        return deferred.promise;
    }

    function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
        // handle success
            .success(function (data) {
                user = false;
                deferred.resolve();
            })
            // handle error
            .error(function (data) {
                user = false;
                deferred.reject();
            });

        // return promise object
        return deferred.promise;

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
        login: login,
        logout: logout,
        register: register
    });
});

