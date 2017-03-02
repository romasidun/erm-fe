/**
 * Created by Roma on 28/2/2017.
 * Email Link Login Controller
 */

(function(){
    VendorLoginController.$inject = ['$scope', '$rootScope', '$state' , 'AuthFactory'];
    app.controller('VendorLoginCtrl', VendorLoginController);

    function VendorLoginController($scope, $rootScope, $state , AuthFactory){

        $scope.password = '';
        $scope.submit = false;

        $scope.loginAction = function(){
            $scope.submit = true;
            if($scope.password === '') return false;
            //var res = AuthFactory.Authenticate($scope.creds);
            if($scope.password === 'test123$') {
                $scope.submit = false;
                //$rootScope.app.IsAuthenticated = true;
                $state.go('vr.assessment',{asId: $state.params.asId, vrId: $state.params.vrId, page: $state.params.page});
            }
        };
    }
})();