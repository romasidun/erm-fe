(function () {
    AuditTopicController.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditAdd_TopicCtrl', AuditTopicController);

    function AuditTopicController($scope, $stateParams, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Add Audit Topic";
        $rootScope.app.Mask = false;


        $scope.VM = {
            auditId: $stateParams.audit_id,
            topicDesc: "",
            topicName: "",
            topicResponse: "",
            topicStatus: "",
            resUserName: "",
            topicfileModel: []
        };

        AuditService
            .GetEachAudit($stateParams.audit_id)
            .then(function(data){
                console.log('$stateParams.audit_id',data);
                $scope.auditName = data.auditName;
            });

        $scope.submitAction = function(){
            if($scope.Form.addTopic.$invalid) return false;
            console.log($scope.VM);
            // return;
            $rootScope.app.Mask = true;
            // var dtype = 'YYYY-MM-DD';
            // var d1 = moment($scope.VM.dateOccurance);
            // var d2 = moment($scope.VM.dueDate);
            // $scope.VM.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            // $scope.VM.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            // console.log($scope.VM);
            var fileModel = $scope.VM.topicfileModel;
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
                console.log('$scope.VM',$scope.VM);
                // return;
                AuditService.AddTopic($scope.VM).then(function (res) {
                    console.log('res',res);
                    topic_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    var confirmation = Utils.CreateConfirmModal("Confirm New Finding", "Are u sure you want to create new findings?", "Yes", "No");
                    confirmation.result.then(function () {
                        $rootScope.app.Mask = true;
                        $state.go('app.audit.add_findings', topic_id);
                    });
                });
            });
        };
    }
})();