(function () {
    AuditTopicController.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditAdd_TopicCtrl', AuditTopicController);

    function AuditTopicController($scope, $stateParams, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Add Audit Topic";
        var audit_id = $stateParams.audit_id;

        $rootScope.app.Mask = false;

        vm.formdata = {
            auditId: audit_id,
            topicDesc: "",
            topicName: "",
            topicResponse: "",
            topicStatus: "",
            resUserName: "",
            topicfileModel: []
        };

        AuditService.GetEachAudit(audit_id)
            .then(function(data){
                vm.auditName = data.auditName;
            });

        vm.submitAction = function(){
            if(vm.Form.addTopic.$invalid) return false;
            console.log(vm.formdata);
            // return;
            $rootScope.app.Mask = true;
            // var dtype = 'YYYY-MM-DD';
            // var d1 = moment(vm.formdata.dateOccurance);
            // var d2 = moment(vm.formdata.dueDate);
            // vm.formdata.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            // vm.formdata.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            // console.log(vm.formdata);
            var fileModel = vm.formdata.topicfileModel;
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
                var topic_id = "";
                console.log('vm.formdata',vm.formdata);
                // return;
                AuditService.AddTopic(vm.formdata).then(function (res) {
                    console.log('res',res);
                    topic_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    $state.go('app.audit.update_audit', {audit_id: audit_id});
                });
            });
        };

        vm.cancelAction = function () {
            if (vm.Form.addTopic.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.audit.update_audit', {audit_id: audit_id});
                });
                return false;
            }
            $state.go('app.audit.update_audit', {audit_id: audit_id});
        };
    }
})();