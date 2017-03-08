/**
 * Created by Roma on 26/2/2016.
 */

(function () {
    app.controller('LoginCtrl', LoginController);

    function LoginController($scope, $rootScope, $state, AuthFactory, $sce) {
        var vm = this;
        vm.creds = {username: "", password: ""};
        vm.invalidCreds = false;
        vm.errs = {user: false, pass: false};
        vm.submit = false;
        vm.signin = true;


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




        vm.regs = {password: ''};

        var lowerRegex = new RegExp("^(?=.*[a-z])");
        var upperRegex = new RegExp("(?=.*[A-Z])");
        var numberRegex = new RegExp("(?=.*[0-9])");
        var specialRegex = new RegExp("(?=.*[!@#\$%\^&\*])");
        var lengthRegex = new RegExp("(?=.{8,})");
        vm.pwd_validations = [];
        $scope.$watch('vm.regs.password', function (n, o) {
            vm.pwd_validations = [];
            if(!lowerRegex.test(n) || typeof n === 'undefined'){
                vm.pwd_validations.push('lowercase characters');
            }
            if(!upperRegex.test(n) || typeof n === 'undefined'){
                vm.pwd_validations.push('uppercase characters');
            }
            if(!numberRegex.test(n) || typeof n === 'undefined'){
                vm.pwd_validations.push('numeric characters');
            }
            if(!specialRegex.test(n) || typeof n === 'undefined'){
                vm.pwd_validations.push('special character');
            }
            if(!lengthRegex.test(n) || typeof n === 'undefined'){
                vm.pwd_validations.push('eight characters or longer');
            }

            if(vm.pwd_validations.length > 0){
                vm.showPwdValidation = true;
            } else {
                vm.showPwdValidation = false;
            }
        });

        vm.registAction = function () {

        }

        vm.isPwdFocus = false;
        vm.showPwdValidation = true;
        vm.pwdFocus = function () {
            vm.isPwdFocus = true;
        }

        vm.pwdBlur = function () {
            vm.isPwdFocus = false;
        }
    }
})();