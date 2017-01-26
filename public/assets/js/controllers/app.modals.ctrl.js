/**
 * Created by Precision on 02/01/2017.
 */


//Application Level Modal Views

(function(){

    /*
     ----------------------------------
     Confirm Dialogue Modal Controller
     ----------------------------------
     */
    app.controller('ConfirmDialogueCtrl', function ($scope, $rootScope, $uibModalInstance, items) {

        $rootScope.app.CurrentModal = $uibModalInstance;
        $scope.vm = items;

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $('.modal-content').keyup(function (e) {
            console.log(e.keyCode);
            if (e.keyCode === 13) $scope.ok();
            if (e.keyCode === 27) $scope.cancel();
        });
    });
    //------------ End --------------


    /*
     ----------------------------------
     Template Download Modal Controller
     ----------------------------------
     */
    app.controller('TmpDlCtrl', function($scope, $rootScope, $uibModalInstance, items){
        $rootScope.app.CurrentModal = $uibModalInstance;
        $scope.vm = items;

        if(items.TempLoader){
            items.TempLoader.then(function(tmps){
                $scope.Templates = tmps;
            });
        }

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $('.modal-content').keyup(function (e) {
            console.log(e.keyCode);
            if (e.keyCode === 13) $scope.ok();
            if (e.keyCode === 27) $scope.cancel();
        });
    });

    /*
     ----------------------------------
     Template Download Modal Controller
     ----------------------------------
     */
    app.controller('SelectListCtrl', function($scope, $rootScope, $filter, $uibModalInstance, items){

        $rootScope.app.CurrentModal = $uibModalInstance;

        $scope.Title = items.Title;
        $scope.Heads = items.Headers;
        $scope.Fields = items.Columns;
        $scope.List = items.List;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.ok = function () {
            var selection = $filter('filter')($scope.List, { Selected: true });
            $uibModalInstance.close(selection);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $('.modal-content').keyup(function (e) {
            console.log(e.keyCode);
            if (e.keyCode === 13) $scope.ok();
            if (e.keyCode === 27) $scope.cancel();
        });
    });



})();