(function () {
    AuditADController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_AuditCtrl', AuditADController);

    function AuditADController($scope, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "ADD AUDIT";

        $scope.VM = {
            auditName: "",
            auditDesc: "",
            region: "",
            department: "",
            auditStatus: "",
            auditControlValidated: "",
            dateOccurance: "",
            dueDate: "",
            resUserName: "",
            priority: "",
            policies: [],
            controlDataModel: [],
            auditFileModel: []
        };

        $scope.asdf = function(){
            var audit_id = "58b98ddc3679e70f3c4e2bd4";
            $state.go('app.audit.add_topic', {audit_id: audit_id});
        };

        $rootScope.app.Mask = false;
        $scope.submitAction = function(){
            $rootScope.app.Mask = true;
            if($scope.Form.addAudit.$invalid) return false;
            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.dateOccurance);
            var d2 = moment($scope.VM.dueDate);
            $scope.VM.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            console.log($scope.VM);
            var fileModel = $scope.VM.auditFileModel;
            var d = new Date();
            var idd = 'Aud' + d.getTime();
            AuditService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                var audit_id = "";
                console.log('$scope.VM',$scope.VM);
                // return;
                AuditService.AddAudits($scope.VM).then(function (res) {
                    console.log('res',res);
                    audit_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    var confirmation = Utils.CreateConfirmModal("Confirm New Topic", "Are u sure you want to create new topic?", "Yes", "No");
                    confirmation.result.then(function () {
                        $rootScope.app.Mask = true;
                        $state.go('app.audit.add_topic', audit_id);
                    });
                });
            });
        };

        $scope.addControls = function () {
            $rootScope.app.Mask = true;
            var headers = ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols = ["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            AuditService.GetControlData().then(function (data) {
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
            $rootScope.app.Mask = true;
            var headers = ["Document Name", "Description", "Type", "File Name"],
                cols = ["docName", "docDesc", "docType", "fileName"];

            AuditService.GetPolicyDocs(10, 1).then(function (data) {
                data.forEach(function (c, i) {
                    c.Selected = false;
                    c.docType = c.assessmentType[0] ? c.assessmentType[0].asTypeDesc : "";
                    c.fileName = c.fileModel[0] ? c.fileModel[0].fileName : "";
                });
                var polModal = Utils.CreateSelectListView("Select Policy Documents", data, headers, cols);
                polModal.result.then(function (list) {
                    $scope.VM.policies = $scope.VM.policies.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

    }
})();