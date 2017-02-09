(function(){
    VendorStinfoUpdateController.inject = ['$scope','$rootScope','$state', '$stateParams', 'VendorService', 'Utils'];
    app.controller('VendorStinfoUpdateCtrl',VendorStinfoUpdateController);
    function VendorStinfoUpdateController($scope, $rootScope, $state, $stateParams, VendorService, Utils){
        $rootScope.app.Mask = false;
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "VENDOR UPDATE PAGE";

        $scope.cancelAction = function(){
            if($scope.Form.VendorRisk.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.vendorrisk.stinfo.main');
                });
                return false;
            }
            $state.go('app.vendorrisk.stinfo.main');
        };

        console.log('app.Lookup.Users',app);



        // var vm = this;
        // vm.submitAction = submitAction;
        //
        // function getVendorName(){
        //     var vendorname = "";
        //     vm.vendornamelist = [];
        //     VendorService.GetRimById($stateParams.id).then(function(data){
        //         vm.data = data;
        //         vendorname = data.vendorName + "";
        //         VendorService.GetVendorNameList().then(function (response) {
        //             var re = angular.fromJson(response);
        //             for(var i in re){
        //                 vm.vendornamelist.push(re[i].vendorName);
        //             }
        //             var index = vm.vendornamelist.indexOf(vendorname);
        //             vm.selectVendorNameOption = vm.vendornamelist[index];
        //
        //         });
        //     });
        // }
        //
        // function getVendorType() {
        //     var vendortype = "";
        //     vm.vendortypelist = [];
        //     VendorService.GetRimById($stateParams.id).then(function(data){
        //         vendortype = data.vendorRiskType + "";
        //         VendorService.GetRiskAssessmentTypeList().then(function (response) {
        //             var re = angular.fromJson(response);
        //             for(var i in re){
        //                 vm.vendortypelist.push(re[i].riskType);
        //             }
        //             var index = vm.vendortypelist.indexOf(vendortype);
        //             vm.selectVendorTypeOption = vm.vendortypelist[index];
        //         });
        //     });
        // }
        //
        // vm.cancelAction = cancelAction;
        //
        // function cancelAction(){
        //     $state.go('app.vendorrisk.stinfo.main');
        // };
        //
        // function submitAction(){
        //     vm.data.vendorName = vm.selectVendorNameOption;
        //     vm.data.vendorRiskType = vm.selectVendorTypeOption;
        //     // if($scope.Form.VendorRisk.$invalid) return false;
        //
        //     VendorService.PostVendorData(vm.data).then(function(res){
        //         if(res.status === 200) $state.go('app.vendorrisk.stinfo.main');
        //     });
        //     // VendorService.UpdateRam($stateParams.id, vm.data).then(function(res){
        //     //     if(res.status === 200) $state.go('app.vendorrisk.stinfo.main');
        //     // });
        // }
        //
        // function init(){
        //     getVendorName();
        //     getVendorType();
        // }
        //
        // init();
    }

})();

