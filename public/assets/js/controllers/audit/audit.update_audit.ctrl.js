(function () {
    AuditUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditUpdate_AuditCtrl', AuditUpdateController);

    function AuditUpdateController($scope, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD AUDIT";

        var audit_id = $state.params.audit_id;
        vm.audit_id = audit_id;

        vm.OpList = [5, 10, 25, 50, 100];
        vm.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'topioName',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
            SortMe: function (col) {
                if (vm.Grid1.Column === col)
                    vm.Grid1.IsAsc = !vm.Grid1.IsAsc;
                else
                    vm.Grid1.Column = col;
            },
            GetIco: function (col) {
                if (vm.Grid1.Column === col) {
                    return vm.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('vm.Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')(vm.Grid1.Data, vm.Grid1.Filter);
            vm.Grid1.Total = searchedData.length;
        });


        AuditService.GetEachAudit(audit_id).then(function (res) {
            var dtype = 'MM-DD-YYYY';
            var d1 = moment(res.dateOccurance);
            var d2 = moment(res.dueDate);
            res.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            res.dateOccuranceDtStr = res.dateOccurance;
            res.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            res.dueDtStr = res.dueDate;

            vm.formdata = res;

            return AuditService.GetTopicByAudit(audit_id);
        }).then(function (data) {
            vm.Grid1.Total = data.length;
            vm.Grid1.Data = data;

            $rootScope.app.Mask = false;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.Form.addAudit.$invalid) return false;
            var dtype = 'YYYY-MM-DD';
            var d1 = moment(vm.formdata.dateOccurance);
            var d2 = moment(vm.formdata.dueDate);
            vm.formdata.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            vm.formdata.dueDate = (d2.isValid()) ? d2.format(dtype) : '';

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
                    var confirmation = Utils.CreateConfirmModal("Confirm New Topic", "Are u sure you want to create new topic", "Yes", "No");
                    confirmation.result.then(function () {
                        if(audit_id == '') return;
                        $rootScope.app.Mask = true;
                        $state.go('app.audit.add_topic', {audit_id : audit_id});
                    });
                });
            });
        };

        vm.cancelAction = function () {
            if (vm.Form.addAudit.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.audit.main');
                });
                return false;
            }
            $state.go('app.audit.main');
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

    }
})();