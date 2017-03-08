(function () {
    AuditFindingController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_FindingCtrl', AuditFindingController);

    function AuditFindingController($scope, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD AUDIT";

        $rootScope.app.Mask = false;

        var audit_id = $stateParams.audit_id;
        var topic_id = $stateParams.topic_id;
        vm.formdata = {
            auditId: audit_id,
            topicId: topic_id,
            findDesc: "",
            findStatus: "",
            findingName: "",
            findingfileModel: []
        };

        AuditService.GetEachAudit(audit_id)
            .then(function(data){
                vm.auditName = data.auditName;
                return AuditService.GetEachTopic(topic_id);
            })
            .then(function (data) {
                vm.topicName = data.topicName;
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
                    var confirmation = Utils.CreateConfirmModal("Confirm New Action", "Are u sure you want to create new Action?", "Yes", "No");
                    confirmation.result.then(function () {
                        if(finding_id === '') return;
                        $rootScope.app.Mask = true;
                        $state.go('app.audit.add_action', {audit_id: audit_id, topic_id: topic_id, finding_id: finding_id});
                    });
                });
            });
        };
    }
})();