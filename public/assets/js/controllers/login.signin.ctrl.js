/**
 * Created by Hafeez on 26/12/2016.
 */

(function () {
    LoginController.$inject = ['$scope', '$rootScope', '$state', 'AuthFactory'];
    app.controller('LoginCtrl', LoginController);

    function LoginController($scope, $rootScope, $state, AuthFactory) {

        $scope.creds = {username: "", password: ""};
        $scope.invalidCreds = false;
        $scope.errs = {user: false, pass: false};
        $scope.submit = false;


        $scope.loginAction = function () {

            $scope.submit = true;
            $scope.errs.user = $scope.creds.username === "";
            $scope.errs.pass = $scope.creds.password === "";

            if ($scope.errs.user || $scope.errs.pass) return false;

            AuthFactory.login($scope.creds.username, $scope.creds.password)
                .then(function (res) {
                    $rootScope.app.IsAuthenticated = true;
                    $state.go('app.dashboard.main');
                })
                .catch(function (err) {
                    $scope.submit = false;
                    $rootScope.app.IsAuthenticated = false;
                });
        };
    }
})();