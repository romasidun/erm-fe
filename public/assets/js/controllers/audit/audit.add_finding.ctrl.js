(function () {
    AuditFindingController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_FindingCtrl', AuditFindingController);

    function AuditFindingController($scope, $rootScope, $state, $stateParams, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD AUDIT";

        $rootScope.app.Mask = true;

        var audit_id = '';
        var topic_id = $stateParams.topic_id;
        vm.formdata = {
            auditId: audit_id,
            topicId: topic_id,
            findDesc: "",
            findStatus: "",
            findingName: "",
            findingfileModel: []
        };

        AuditService.GetEachTopic(topic_id)
            .then(function(data){
                vm.topicName = data.topicName;
                audit_id = data.auditId;
                return AuditService.GetEachAudit(audit_id);
            })
            .then(function (data) {
                vm.auditName = data.auditName;
                $rootScope.app.Mask = false;
            });

        vm.submitAction = function(){
            if(vm.Form.addFinding.$invalid) return false;
            console.log(vm.formdata);
            $rootScope.app.Mask = true;
            var fileModel = vm.formdata.findingfileModel;
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
                var finding_id = "";
                console.log('vm.formdata',vm.formdata);
                // return;
                AuditService.AddFinding(vm.formdata).then(function (res) {
                    console.log('res',res);
                    finding_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    $state.go('app.audit.update_topic', {topic_id: topic_id});
                });
            });
        };

        vm.cancelAction = function () {
            if (vm.Form.addFinding.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.audit.main');
                });
                return false;
            }
            $state.go('app.audit.main');
        };
    }
})();