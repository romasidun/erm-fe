(function () {
    AuditADController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_AuditCtrl', AuditADController);

    function AuditADController($scope, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD AUDIT";

        vm.formdata = {
            auditName: "",
            auditDesc: "",
            region: "",
            department: "",
            auditStatus: "Draft",
            auditControlValidated: "",
            dateOccurance: "",
            dueDate: "",
            resUserName: "",
            priority: "",
            policies: [],
            controlDataModel: [],
            auditFileModel: []
        };

        $rootScope.app.Mask = false;
        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.Form.addAudit.$invalid) return false;
            var dtype = 'YYYY-MM-DD';
            var d1 = moment(vm.formdata.dateOccurance);
            var d2 = moment(vm.formdata.dueDate);
            vm.formdata.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            vm.formdata.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            console.log(vm.formdata);
            var fileModel = vm.formdata.auditFileModel;
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
                AuditService.AddAudits(vm.formdata).then(function (res) {
                    console.log('res',res);
                    audit_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    var confirmation = Utils.CreateConfirmModal("Confirm New Topic", "Are u sure you want to create new topic?", "Yes", "No");
                    confirmation.result.then(function () {
                        if(audit_id == '') return;
                        $rootScope.app.Mask = true;
                        $state.go('app.audit.add_topic', {audit_id : audit_id});
                    });
                });
            });
        };

        vm.addControls = function () {
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
                    vm.formdata.controlDataModel = vm.formdata.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        vm.addPolicyDocs = function () {
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
                    vm.formdata.policies = vm.formdata.policies.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        vm.removeItem = function (type, idx) {
            vm.formdata[type].splice(idx, 1);
        };

        vm.cancelAction = function () {
            if (vm.Form.addAudit.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.audit.main');
                });
                return false;
            }
            $state.go('app.audit.main');
        };

    }
})();