(function () {
    'use strict';
    VendorriskStinfoFormController.$inject = ['$scope','$rootScope', '$state', 'VendorService','Utils'];
    app.controller('VendorriskStinfoFormCtrl', VendorriskStinfoFormController);
    function VendorriskStinfoFormController($scope, $rootScope, $state, VendorService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Manage VendorRisk Form";
        $rootScope.app.Mask = false;
        $scope.showExcelButton = false;

        $scope.VM = {
            actualName: "",
            aggregatedRiskScore: "",
            approval: "",
            approvalStatus: "",
            approvedDate: "",
            approvedDtStr: "",
            approver: "",
            asmntType: "",
            asmntTypeName: "",
            asmntType_name: "",
            assessDesc: "",
            // assessId: 0,
            assessName: "",
            assessmentBy: "",
            assessmentDtStr: "",
            assessmentsDate: "",
            business: "",
            createdBy: "",
            createdOn: "",
            docType: "",
            dueDtStr: "",
            due_date: "",
            emailOrLink: "",
            filemodel: [],
            filename: "",
            frequency: "",
            // id: "",
            modifiedBy: "",
            modifiedOn: "",
            riskScore: null,
            period: "",
            priority: "",
            region: "",
            resPerson: "",
            status: {},
            title: "",
            vendorContact: "",
            vendorName: "",
            vendorRiskType: "",
            version: ""
        };


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

        $scope.submitAction = function () {
            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.assessmentsDate);
            var d2 = moment($scope.VM.approvedDate);
            $scope.VM.assessmentsDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.identifiedDtStr = $scope.VM.assessmentsDate;
            $scope.VM.approvedDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.remediationDtStr = $scope.VM.approvedDate;

            if ($scope.Form.VendorRisk.$pristine || $scope.Form.VendorRisk.$invalid) return false;
            VendorService.AddRim($scope.VM).then(function (res) {
                if (res.status === 200) {
                    $state.go('app.vendorrisk.stinfo.main');
                }
            });
        };

        VendorService.GerUserList().then(function(user){
            $scope.userList = user;
        });

        VendorService.GetRiskType().then(function(risktype){
            $scope.riskTypeList = risktype;
        });

        $scope.Grid1 = {
            Column: 'vendorName',
            IsAsc: true,
            Data: [],
            SortMe: function (col) {
                if ($scope.Grid1.Column === col)
                    $scope.Grid1.IsAsc = !$scope.Grid1.IsAsc;
                else
                    $scope.Grid1.Column = col;
            },
            GetIco: function (col) {
                if ($scope.Grid1.Column === col) {
                    return $scope.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        VendorService.GetVendor().then(function (vendor) {
            $scope.Grid1.Data = vendor;
        });

        $scope.sendMail = function () {
            var checkedRow = $filter('filter')($scope.Grid1.Data, {checked: true});
            if(checkedRow < 1) {
                alert("Please select at least one vendor contact!");
                return;
            }
            angular.forEach(checkedRow, function (value, key) {
                var to = value.email;
                if(to == '' || to == null) return;
                var message = 'Dear Ms Lalitha, '+
                    'You are receiving this email, because you are the vendor contact for Oracle in our system. '+
                    'Please enter the responses Y or N for the questions and enter if you have any findings or comments'+
                    'https://cwt.aasricontrols.com/#!/vendorrisk/assess.create/589e5cd51e2417e3e4415b11'+
                    'Regards' +
                    'CWT_testuser';
                var params = {
                    from: 'cwt_testuser@aasricontrols.com',
                    message: message,
                    subject: 'Please fill out the assessment',
                    to: to
                };
                VendorService.SendMail(params).then(function (res) {

                });
            });
        }

    }

})();