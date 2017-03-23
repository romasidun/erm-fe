(function () {
    AuditActionController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_ActionCtrl', AuditActionController);

    function AuditActionController($scope, $rootScope, $state, $stateParams, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Action";

        $rootScope.app.Mask = false;
        var action_id = $stateParams.action_id;
        var finding_id = '';
        var audit_id = '';
        var topic_id = '';

        AuditService.GetAction(action_id)
            .then(function (data) {
                vm.formdata = data;
                finding_id = data.findingId;
                audit_id = data.auditId;
                topic_id = data.topicId;
                return AuditService.GetEachFinding(finding_id);
            })
            .then(function(data){
                vm.findingName = data.findingName;
                return AuditService.GetEachTopic(topic_id);
            })
            .then(function (data) {
                vm.topicName = data.topicName;
                return AuditService.GetEachAudit(audit_id);
            })
            .then(function (data) {
                vm.auditName = data.auditName;
            });

        vm.submitAction = function(){
            if(vm.Form.addAction.$invalid) return false;
            var dtype = 'YYYY-MM-DD';
            var d2 = moment(vm.formdata.dueDate);
            vm.formdata.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            console.log(vm.formdata);
            $rootScope.app.Mask = true;
            var fileModel = vm.formdata.actionfileModel;
            var d = new Date();
            var idd = 'Top' + d.getTime();
            AuditService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                var action_id = "";
                console.log('vm.formdata',vm.formdata);
                // return;
                AuditService.addAction(vm.formdata).then(function (res) {
                    console.log('res',res);
                    action_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    $state.go('app.audit.update_finding', {finding_id: finding_id});
                });
            });
        };

        vm.cancelAction = function () {
            if (vm.Form.addAction.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.audit.update_finding', {finding_id: finding_id});
                });
                return false;
            }
            $state.go('app.audit.update_finding', {finding_id: finding_id});
        };
    }
})();