(function () {

    "use strict";

    OprIncFormController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$filter', 'OPRiskService', 'Utils'];
    app.controller('OprIncidentUpdateCtrl', OprIncFormController);


    function OprIncFormController($scope, $rootScope, $state, $stateParams, $filter, OPRiskService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Update operational risk incident";
        $scope.isAction = true;

        $scope.Form = {};
        $scope.RiskCategories = {List: [], SelCount: 0};

        $scope.dpOptions = {
            format: 'MM-DD-YYYY',
            autoclose: true
        };

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }
        };

        $scope.addControls = function () {
            var headers = ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols = ["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            OPRiskService.GetControlData().then(function (data) {
                data.forEach(function (c, i) {
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function (list) {
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.addPolicyDocs = function () {
            var headers = ["Document Name", "Description", "Type", "File Name"],
                cols = ["docName", "docDesc", "docType", "fileName"];

            $rootScope.app.Mask = true;
            OPRiskService.GetPolicyDocs(10, 1).then(function (data) {
                data.forEach(function (c, i) {
                    c.Selected = false;
                    c.docType = c.assessmentType[0] ? c.assessmentType[0].asTypeDesc : "";
                    c.fileName = c.fileModel[0] ? c.fileModel[0].fileName : "";
                });
                var polModal = Utils.CreateSelectListView("Select Policy Documents", data, headers, cols);
                polModal.result.then(function (list) {
                    $scope.VM.policiesData = $scope.VM.policiesData.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.setAll = function (val) {
            $scope.RiskCategories.List.forEach(function (op) {
                op.Selected = val;
            });
            $scope.RiskCategories.SelCount = val ? $scope.RiskCategories.List.length : 0;
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.submitAction = function () {
            if ($scope.Form.OpIncident.$invalid || $scope.Form.OpIncident.pristine) return false;
            if ($scope.RiskCategories.SelCount < 1) {
                alert("Please select Risk Category.");
                return false;
            }
            //console.log($scope.RiskCategories);
            var selectedCategories = $filter('filter')($scope.RiskCategories.List, {Selected: true});

            var categoriesStr = '';
            angular.forEach(selectedCategories, function (item, key) {
                categoriesStr += ',' + item.Key;
            });
            categoriesStr = categoriesStr.substr(1);
            $scope.VM.riskCategory = categoriesStr;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.identifiedDate);
            var d2 = moment($scope.VM.remeDate);
            $scope.VM.identifiedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.identifiedDtStr = $scope.VM.identifiedDate;
            $scope.VM.remeDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.remediationDtStr = $scope.VM.remeDate;

            var fileModel = $scope.VM.auditFileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            OPRiskService.FileUpload(idd, fileModel)
                .then(function (res) {
                    if (res.status === 200) {
                        for (var i in fileModel) {
                            fileModel[i].id = res.data.fileId;
                            fileModel[i].filePath = res.data.path;
                        }
                    }
                })
                .finally(function () {
                    OPRiskService.UpdateIncident($stateParams.id, $scope.VM).then(function (res) {
                        console.log('res', res);
                    }).finally(function () {
                        $state.go('app.oprisk.incident.main');
                    });
                });
        };

        OPRiskService.GetRiskIncident($stateParams.id).then(function (data) {
            //console.log(data);
            $scope.VM = data;

            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.identifiedDate);
            var d2 = moment($scope.VM.remeDate);
            $scope.VM.identifiedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.identifiedDtStr = $scope.VM.identifiedDate;
            $scope.VM.remeDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.remediationDtStr = $scope.VM.remeDate;

            return OPRiskService.GetRiskCategories()
        }).then(function (data) {
            var categories = $scope.VM.riskCategory.split(',');
            $scope.RiskCategories.SelCount = categories.length;
            Object.keys(data.categories).forEach(function (c) {
                var sel = (categories.indexOf(c) < 0) ? false : true;
                $scope.RiskCategories.List.push({Key: c, Label: data.categories[c], Selected: sel});
            });
            $rootScope.app.Mask = false;
        });


        $scope.addAction = function () {
            $state.go('app.oprisk.incident.addaction', {pid: $stateParams.id});
        };

    }
})();
