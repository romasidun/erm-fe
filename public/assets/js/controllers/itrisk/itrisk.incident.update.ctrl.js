(function () {
    ITRiskIncFormController.$inject = ['$filter', '$scope', '$rootScope', '$state', '$stateParams', 'ITRiskService', 'OPRiskService', 'Utils'];
    app.controller('ITRiskIncUpdateCtrl', ITRiskIncFormController);

    function ITRiskIncFormController($filter, $scope, $rootScope, $state, $stateParams, ITRiskService, OPRiskService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";
        $scope.isAction = true;

        $scope.RiskCategories = {List: [], SelCount: 0};
        $scope.Lookups = {};

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }
        };

        $scope.setAll = function (val) {
            $scope.RiskCategories.List.forEach(function (op) {
                op.Selected = val;
            });
            $scope.RiskCategories.SelCount = val ? $scope.RiskCategories.List.length : 0;
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

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };


        $scope.submitAction = function () {
            if ($scope.Form.ITRisk.$pristine || $scope.Form.ITRisk.$invalid) return false;
            if ($scope.RiskCategories.SelCount < 1) {
                alert("Please select Risk Category.");
                return false;
            }

            $rootScope.app.Mask = true;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.identifiedDate);
            var d2 = moment($scope.VM.remeDate);
            $scope.VM.identifiedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.remeDate = (d2.isValid()) ? d2.format(dtype) : '';

            var selectedCategories = $filter('filter')($scope.RiskCategories.List, {Selected: true});
            var categoriesStr = '';
            for (var i in selectedCategories) {
                categoriesStr = categoriesStr + selectedCategories[i].Label + ",";
            }
            categoriesStr = categoriesStr.substr(0, categoriesStr.length - 1);
            $scope.VM.riskCategory = categoriesStr;

            var fileModel = $scope.VM.auditFileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            ITRiskService.FileUpload(idd, fileModel).then(function (res) {
                if (res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                ITRiskService.UpdateRim($stateParams.id, $scope.VM).then(function (res) {
                    // console.log('res', res);
                }).finally(function () {
                    $state.go('app.itrisk.incident.main');
                });
            });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.ITRisk.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.itrisk.incident.main');
                });
                return false;
            }
            $state.go('app.itrisk.incident.main');
        };

        $scope.addNewAction = function () {
            return false;
        };


        $scope.addAction = function () {
            $state.go('app.itrisk.incident.addaction', {pid: $stateParams.id});
        };

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'actionsName',
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
        $scope.deleteAction = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                ITRiskService.DeleteAction(r.id).then(function(data){
                    if(data.status===200) loadActions($stateParams.id);
                });
            });
        };


        ITRiskService.GetRimById($stateParams.id).then(function (data) {
            $scope.VM = data;
            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.identifiedDate);
            var d2 = moment($scope.VM.remeDate);
            $scope.VM.identifiedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.identifiedDtStr = $scope.VM.identifiedDate;
            $scope.VM.remeDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.remediationDtStr = $scope.VM.remeDate;
            return ITRiskService.GetRimRiskCategory()
        }).then(function (data) {
            var categories = $scope.VM.riskCategory.split(',');
            $scope.RiskCategories.SelCount = categories.length;
            angular.forEach(data.categories, function (val, key) {
                var sel = false;
                for (var i in categories) {
                    if (categories[i] == val) {
                        sel = true;
                    }
                }
                $scope.RiskCategories.List.push({Key: key, Label: data.categories[key], Selected: sel});
            });
            loadActions($stateParams.id);
        })

        function loadActions(id) {
            ITRiskService.GetActionsByRiskId(id).then(function (data) {
                $rootScope.app.Mask = true;
                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;
                $rootScope.app.Mask = false;
            });
        }
    }
})();