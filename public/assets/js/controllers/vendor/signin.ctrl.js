/**
 * Created by Roma on 28/2/2017.
 * Email Link Login Controller
 */

(function(){
    VendorLoginController.$inject = ['$scope', '$rootScope', '$state' , 'AuthFactory'];
    app.controller('VendorLoginCtrl', VendorLoginController);

    function VendorLoginController($scope, $rootScope, $state , AuthFactory){

        $scope.creds = { username: "", password: "" };
        $scope.invalidCreds = false;
        $scope.errs = { user: false, pass: false };
        $scope.submit = false;


        $scope.loginAction = function(){
            $scope.submit = true;
            $scope.errs.user = $scope.creds.username === "";
            $scope.errs.pass = $scope.creds.password === "";

            if($scope.errs.user || $scope.errs.pass) return false;

            var res = AuthFactory.Authenticate($scope.creds);
            console.log(res);
            if(res.user && res.pass) {
                $scope.submit = false;
                $rootScope.app.IsAuthenticated = true;
                $state.go('app.vendorrisk.assessment',{asId: $state.params.asId, vrId: $state.params.vrId, page: $state.params.page});
            } else
                $scope.invalidCreds = true;
        };
    }
})();