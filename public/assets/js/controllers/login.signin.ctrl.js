/**
 * Created by Hafeez on 26/12/2016.
 */

(function () {
    LoginController.$inject = ['$rootScope', '$state', 'AuthFactory'];
    app.controller('LoginCtrl', LoginController);

    function LoginController($rootScope, $state, AuthFactory) {
        var vm = this;
        vm.creds = {username: "", password: ""};
        vm.invalidCreds = false;
        vm.errs = {user: false, pass: false};
        vm.submit = false;


        vm.loginAction = function () {

            vm.submit = true;
            vm.errs.user = vm.creds.username === "";
            vm.errs.pass = vm.creds.password === "";

            if (vm.errs.user || vm.errs.pass) return false;

            AuthFactory.login(vm.creds.username, vm.creds.password)
                .then(function (res) {
                    $rootScope.app.IsAuthenticated = true;
                    $state.go('app.dashboard.main');
                })
                .catch(function (err) {
                    vm.submit = false;
                    $rootScope.app.IsAuthenticated = false;
                });
        };
    }
})();