(function () {
    AuditActionController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_ActionCtrl', AuditActionController);

    function AuditActionController($scope, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Action";

        $rootScope.app.Mask = false;

        var finding_id = $stateParams.finding_id;
        var audit_id = '';
        var topic_id = '';
        vm.formdata = {
            auditId: audit_id,
            topicId: topic_id,
            findingId: finding_id,
            actionsName: "",
            actionsDesc: "",
            actionStatus: "",
            deptId: "",
            userName: '',
            dueDate: "",
            actionfileModel: []
        };

        AuditService.GetEachFinding(finding_id)
            .then(function(data){
                vm.findingName = data.findingName;
                audit_id = data.auditId;
                topicId = data.topicId;
                vm.formdata.auditId = audit_id;
                vm.formdata.topicId = topicId;
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
                    /*var confirmation = Utils.CreateConfirmModal("Confirm New Action", "Are u sure you want to create new Action?", "Yes", "No");
                    confirmation.result.then(function () {
                        if(action_id === '') return;
                        $rootScope.app.Mask = true;
                        $state.go('app.audit.add_action', {finding_id: action_id});
                    });*/
                });
            });
        };
    }
})();