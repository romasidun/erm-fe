(function () {
    VendorStinfoUpdateController.inject = ['$scope', '$rootScope', '$state', 'VendorService', 'Utils', '$filter', 'UniqueID'];
    app.controller('VendorStinfoUpdateCtrl', VendorStinfoUpdateController);
    function VendorStinfoUpdateController($scope, $rootScope, $state, VendorService, Utils, $filter, $location, UniqueID) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "VENDOR UPDATE PAGE";
        $scope.currPage = 'update';

        $scope.Grid1 = {
            Column: 'vendorName',
            Filter: '',
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

        $scope.submitAction = function () {
            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.assessmentsDate);
            var d2 = moment($scope.VM.approvedDate);
            $scope.VM.assessmentsDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.approvedDate = (d2.isValid()) ? d2.format(dtype) : '';

            if ($scope.Form.VendorRisk.$invalid) return false;

            VendorService.UpdateRam($state.params.id, $scope.VM).then(function (res) {
                if (res.status === 200) {
                    $rootScope.app.Mask = false;
                    $state.go('app.vendorrisk.stinfo.main');
                }
            });
        };

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

        $scope.sendMailOne = function (vendor) {
            $rootScope.app.Mask = true;

            var baseUrl = $location.$$absUrl.substr(0, $location.$$absUrl.length - $location.$$url.length);
            var to = vendor.email;

            if(to == '' || to == null) return;
            var message = '<p>Dear '+vendor.primaryContact+',</p><br/>' +
                '<p style=\"text-indent: 40px\">' +
                'You are receiving this email, because you are the vendor contact for ' + vendor.vendorName + ' in our system. <br/>' +
                'Please enter the responses Y or N for the questions and enter if you have any findings or comments: <br/><br/>' +
                '<a href=\"' + baseUrl + '/vr/' + $state.params.id + '/' + vendor.id + '/email\">Link to Assessment</a><br/><br/>' +
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

                vendor.statusMsg = "Email Send successfully";
                if(vendor.vendorId == null || vendor.vendorId == '')
                    vendor.vendorId = $scope.generateId();

                var arr = $filter('filter')($scope.VM.vendors, {id: vendor.id});
                if(angular.isArray(arr) && arr.length > 0){
                    arr[0].statusMsg = vendor.statusMsg;
                    arr[0].vendorId = $scope.generateId();
                } else {
                    $scope.VM.vendors.push(vendor);
                }

                var params = {
                    vendors: $scope.VM.vendors
                };
                return VendorService.PutAseessmentList($state.params.id, params);
            }).then(function (re) {
                $rootScope.app.Mask = false;
            });
        };

        $scope.createAssessment = function(vendor){
            $state.go('app.vendorrisk.assessment',{asId: $state.params.id, vrId: vendor.id, page: 'create'});
        };

        $scope.viewAssessment = function(vendor){
            $state.go('app.vendorrisk.assessment',{asId: $state.params.id, vrId: vendor.id, page: 'view'});
            /*var baseUrl = $location.$$absUrl.substr(0, $location.$$absUrl.length - $location.$$url.length);
            window.open(baseUrl + '/vr/' + $state.params.id + '/' + vendor.id, "_blank");*/
        };

        $scope.completeAssessment = function(vendor){
            completeAssessment(vendor);
        };

        VendorService.GetRiskType().then(function (risktype) {
            $scope.riskTypeList = risktype;
            return VendorService.GetRimById($state.params.id);
        }).then(function (data) {
            data.approvedDate = new Date(data.approvedDate);
            $scope.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            $scope.VM = data;
            return VendorService.GetVendor();
        }).then(function (vendor) {

            $scope.Grid1.Data = vendor;
            angular.forEach($scope.Grid1.Data, function (obj, ind) {
                var tmpObj = $filter('filter')($scope.VM.vendors, {id: obj.id});
                if (angular.isArray(tmpObj) && tmpObj.length > 0){
                    obj.vendorId = tmpObj[0].vendorId;
                    obj.statusMsg = tmpObj[0].statusMsg;
                }
                //setStatus(obj);
            });

            $rootScope.app.Mask = false;
        });

        $scope.generateId = function () {
            var uid = UniqueID.new();
            return uid;
        };

        function completeAssessment(vendor){
            vendor.statusMsg = "Completed";
            if(vendor.vendorId == null || vendor.vendorId == '')
                vendor.vendorId = $scope.generateId();

            var arr = $filter('filter')($scope.VM.vendors, {id: vendor.id});
            if(angular.isArray(arr) && arr.length > 0){
                arr[0].statusMsg = vendor.statusMsg;
                arr[0].vendorId = $scope.generateId();
            } else {
                $scope.VM.vendors.push(vendor);
            }

            var params = {
                vendors: $scope.VM.vendors
            };
            VendorService.PutAseessmentList($state.params.id, params).then(function () {

            });
        }
    }

})();

