(function(){

    "use strict";

    OprAssFormController.$inject = ['$scope','$rootScope','$state', 'OPRiskService', 'Utils'];
    app.controller('OprAssessmentFormCtrl', OprAssFormController);


    function OprAssFormController($scope, $rootScope, $state, OPRiskService, Utils){

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload an Operational Risk Assessment";

        $scope.Form = {};
        $scope.Lookups = {};
        $scope.Lookups.Region = [
            { key: 101, val: "Asia Pacific" },
            { key: 102, val: "EMEA" },
            { key: 103, val: "North America" },
            { key: 104, val: "Europe" },
            { key: 105, val: "All" }
        ];
        $scope.Lookups.Department = [
            { key: 201, val: "Equities" },
            { key: 202, val: "Fixed Income" },
            { key: 203, val: "Investment Banking" },
            { key: 204, val: "Asset Management" },
            { key: 205, val: "IT" },
            { key: 206, val: "Tax" },
            { key: 207, val: "Treasury" },
            { key: 208, val: "Controllers" },
            { key: 209, val: "HR" },
            { key: 210, val: "Legal" },
            { key: 211, val: "Operations" },
            { key: 212, val: "Risk Management" },
            { key: 213, val: "Compliance" }
        ];
        $scope.Lookups.Frequency = [
            { key: 101, val: "Monthly" },
            { key: 102, val: "Bi-Monthly" },
            { key: 103, val: "Quaterly" },
            { key: 104, val: "Half Yearly" },
            { key: 105, val: "Yearly" }
        ];
        $scope.Lookups.Status = [
            { key: 101, val: "Submitted" },
            { key: 102, val: "In Progress" },
            { key: 103, val: "Ready to Approve" },
            { key: 104, val: "To Approve" },
            { key: 104, val: "Approved" },
            { key: 105, val: "Completed" }
        ];
        $scope.Lookups.Priority = [
            { key: 101, val: "Low" },
            { key: 102, val: "Medium" },
            { key: 103, val: "High" }
        ];
        $scope.Lookups.Responsible = [
            { key: 101, val: "Admin" },
            { key: 102, val: "Admin1" },
            { key: 103, val: "Alan" },
            { key: 104, val: "Alan1" },
            { key: 104, val: "Rohit" }
        ];
        $scope.Lookups.Period = [
            { key: 2012, val: 2012 },
            { key: 2013, val: 2013 },
            { key: 2014, val: 2014 },
            { key: 2015, val: 2015 },
            { key: 2016, val: 2016 },
            { key: 2017, val: 2017 },
            { key: 2018, val: 2018 },
            { key: 2019, val: 2019 },
            { key: 2020, val: 2020 },
            { key: 2021, val: 2021 },
            { key: 2022, val: 2022 },
            { key: 2023, val: 2023 },
            { key: 2024, val: 2024 },
            { key: 2025, val: 2025 }
        ];


        $scope.setOpt = function(op){
            op.Selected = !op.Selected;
            if(op.Selected){
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }

            console.log($scope.RiskCategories.SelCount);
        };

        OPRiskService.LoadOpRiskList().then(function(data) {
            $rootScope.app.Mask = false;
        });


    }
})();