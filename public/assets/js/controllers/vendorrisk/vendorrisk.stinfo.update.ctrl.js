(function(){
    VendorStinfoUpdateController.inject = ['$scope','$rootScope','$state', '$stateParams', 'VendorService', 'Utils'];
    app.controller('VendorStinfoUpdateCtrl',VendorStinfoUpdateController);
    function VendorStinfoUpdateController($scope, $rootScope, $state, $stateParams, VendorService, Utils){
        console.log($scope);
        $rootScope.app.Mask = false;
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "VENDOR CONTROL SELF ASSESSMENTS";


    }

})();

