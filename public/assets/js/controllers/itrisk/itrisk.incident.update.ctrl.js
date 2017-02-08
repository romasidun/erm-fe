(function(){
    ITRiskIncFormController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ITRiskService', 'OPRiskService', 'Utils'];
    app.controller('ITRiskIncUpdateCtrl', ITRiskIncFormController);

    function ITRiskIncFormController ($scope, $rootScope, $state, $stateParams, ITRiskService, OPRiskService, Utils){
       $scope.mainTitle = $state.current.title;
       $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

        $scope.RiskCategories = { List: [], SelCount: 0 };
        $scope.Lookups = {};

        $scope.setOpt = function(op){
            op.Selected = !op.Selected;
            if(op.Selected){
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }
        };

        $scope.setAll = function(val) {
            $scope.RiskCategories.List.forEach(function(op){
                op.Selected = val;
            });
            $scope.RiskCategories.SelCount = val? $scope.RiskCategories.List.length : 0;
        };

        $scope.addControls = function(){
            var headers= ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols =["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            OPRiskService.GetControlData().then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function(list){
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.addPolicyDocs = function(){
            var headers= ["Document Name", "Description", "Type", "File Name"],
                cols = ["docName", "docDesc", "docType", "fileName"];

            $rootScope.app.Mask = true;
            OPRiskService.GetPolicyDocs(10, 1).then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.docType = c.assessmentType[0]? c.assessmentType[0].asTypeDesc : "";
                    c.fileName = c.fileModel[0]? c.fileModel[0].fileName : "";
                });
                var polModal = Utils.CreateSelectListView("Select Policy Documents", data, headers, cols);
                polModal.result.then(function(list){
                    $scope.VM.policiesData = $scope.VM.policiesData.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.removeItem = function(type, idx) {
            $scope.VM[type].splice(idx, 1);
        };


        $scope.submitAction = function(){
            if($scope.Form.ITRisk.$pristine || $scope.Form.ITRisk.$invalid) return false;
            if($scope.RiskCategories.SelCount < 1){
                alert("Please select Risk Category.");
                return false;
            }
            ITRiskService.UpdateRim($stateParams.id, $scope.VM).then(function(res){
                if(res.status === 200) {
                    var fileModel = $scope.VM.auditFileModel;
                    ITRiskService.FileUpload($stateParams.id, fileModel).then(function (res) {
                        console.log(res);
                    });
                    $state.go('app.itrisk.incident.main');
                }
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.ITRisk.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.itrisk.incident.main');
                });
                return false;
            }
            $state.go('app.itrisk.incident.main');
        };

        $scope.addNewAction = function () {
            console.clear();
            console.log($scope.VM.id);
            return false;
        };

        ITRiskService.GetRimById($stateParams.id).then(function(data){
            data.identifiedDate = new Date(data.identifiedDate);
            $scope.identifiedDate = Utils.GetDPDate(data.identifiedDate);
            $scope.VM = data;
            return ITRiskService.GetRimRiskCategory()
        }).then(function(data){
            Object.keys(data.categories).forEach(function(c){
               $scope.RiskCategories.List.push({  Key: c, Label: data.categories[c], Selected: false });
            });
            $rootScope.app.Mask = false;
        });
    }
})();