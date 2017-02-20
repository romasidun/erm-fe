(function () {
    VendorStinfoUpdateController.inject = ['$scope', '$rootScope', '$state', 'VendorService', 'Utils', '$filter'];
    app.controller('VendorStinfoUpdateCtrl', VendorStinfoUpdateController);
    function VendorStinfoUpdateController($scope, $rootScope, $state, VendorService, Utils, $filter) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "VENDOR UPDATE PAGE";
        $scope.showExcelButton = true;

        $scope.cancelAction = function () {
            if ($scope.Form.VendorRisk.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
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
            // $scope.VM.assessmentsDate = $scope.VM.assessmentsDate;
            $scope.VM.approvedDate = (d2.isValid()) ? d2.format(dtype) : '';
            // $scope.VM.approvedDate = $scope.VM.approvedDate;

            if ($scope.Form.VendorRisk.$invalid) return false;
            VendorService.UpdateRam($state.params.id, $scope.VM).then(function (res) {
                if (res.status === 200) {
                    $rootScope.app.Mask = false;
                    $state.go('app.vendorrisk.stinfo.main');
                }
            });
        };

        $scope.createAssessmentAction = function () {
            $state.go('app.vendorrisk.assessment', {id: $state.params.id, page: 'update'});
        };

        VendorService.GetRimById($state.params.id).then(function (data) {
            data.approvedDate = new Date(data.approvedDate);
            $scope.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            $scope.VM = data;
            console.clear();
            console.log(data);
            $rootScope.app.Mask = false;
        });

        VendorService.GetRiskType().then(function (risktype) {
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

        $scope.sendMailOne = function (vendor) {
                var to = vendor.email;
                if(to == '' || to == null) return;
                var message = '<p>Dear Ms. '+vendor.primaryContact+',</p><br/>' +
                    '<p style=\"text-indent: 40px\">' +
                    'You are receiving this email, because you are the vendor contact for '+vendor.vendorName+' in our system. <br/>' +
                    'Please enter the responses Y or N for the questions and enter if you have any findings or comments: <br/><br/>' +
                    '<a href=\"https://cwt.aasricontrols.com/#!/vendorrisk/assess.create/589e5cd51e2417e3e4415b11\">Link to Assessment</a><br/><br/>' +
                    '</p>' +
                    '<p>Regards,</p><br/>' +
                    '<p>CWT_testuser</p>';
                var params = {
                    from: 'cwt_testuser@aasricontrols.com',
                    message: message,
                    subject: 'Please fill out the assessment',
                    to: to
                };
                VendorService.SendMail(params).then(function (res) {

                });
        };
        $scope.viewAssessment = function(){

        };
    }

})();

