(function(){
    "use strict";

    OprAssessmentCtrl.$inject = ['$scope','$rootScope','$state', '$filter', '$uibModal', 'OPRiskService', 'ChartFactory', 'Utils'];
    app.controller('OprAssessmentCtrl', OprAssessmentCtrl);

    function OprAssessmentCtrl ($scope, $rootScope, $state, $filter, $uibModal, OPRiskService, ChartFactory, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'assessName',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
            SortMe: function(col){
                if($scope.Grid1.Column === col)
                    $scope.Grid1.IsAsc = !$scope.Grid1.IsAsc;
                else
                    $scope.Grid1.Column = col;
            },
            GetIco: function(col){
                if($scope.Grid1.Column === col){
                    return $scope.Grid1.IsAsc? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('Grid1.Filter', function(n, o){
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });

        $scope.downloadTemp = function(){
            var dlTmpModal = $uibModal.open({
                templateUrl: 'tmpdownload.tpl.html',
                controller: 'TmpDlCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            TempLoader: OPRiskService.GetRSATemplates()
                        };
                    }
                }
            });

            dlTmpModal.result.then(function (updEquip) {
                console.log("Done");
            });
        };

        OPRiskService.GetRSAStatus().then(function(data){
            $rootScope.app.Mask = true;
            ChartFactory.CreatePieChart('Risk Type Severity', 'Risk Type Severity', data, 'rcsaStatus');
            console.log(data);
            return OPRiskService.GetRSAPeriod();
        }).then(function(data){
            ChartFactory.CreateMultiColChart('By Period', data, 'periodChart');
            // setupPeriodChart(data);
            return OPRiskService.GetRSARegion();
        }).then(function(data){
            ChartFactory.SetupStackedChart(data, 'regionstacked', $filter);
            return OPRiskService.GetRSADept();
        }).then(function(data){
            ChartFactory.CreatePieChart('By Department', 'Risk Type Severity', data, 'deptstacked');
            $rootScope.app.Mask = false;
        });

        $scope.$watch('PerPage', function(n, o) {
            $rootScope.app.Mask = true;
            loadAssessments();
        });

        $scope.deleteAction = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                OPRiskService.DeleteAssessment(r.id).then(function(data){
                    if(data.status===200) loadAssessments();
                });
            });
        };

        $scope.editAction = function(r){

        };

        function loadAssessments() {
            OPRiskService.GetAssessments().then(function (data) {

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }
    }
})();
