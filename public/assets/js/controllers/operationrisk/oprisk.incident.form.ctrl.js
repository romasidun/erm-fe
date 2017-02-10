(function () {

    "use strict";

    OprIncFormController.$inject = ['$scope', '$rootScope', '$state', 'OPRiskService', 'Utils'];
    app.controller('OprIncidentFormCtrl', OprIncFormController);


    function OprIncFormController($scope, $rootScope, $state, OPRiskService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Add new operational risk incident";

        $scope.Form = {};
        $scope.RiskCategories = {List: [], SelCount: 0};

        $scope.dpOptions = {
            format: 'dd-mm-yyyy',
            autoclose: true
        };

        $scope.Lookups = {};

        $scope.Lookups.Status = [
            {key: "Submitted", val: "Submitted"},
            {key: "In Progress", val: "In Progress"},
            {key: "Ready to Approve", val: "Ready to Approve"},
            {key: "To Approve", val: "To Approve"},
            {key: "Approved", val: "Approved"},
            {key: "Completed", val: "Completed"}
        ];

        $scope.Lookups.SecondaryRisk = [
            {key: 101, val: "Compliance"},
            {key: 102, val: "Credit"},
            {key: 103, val: "Market"},
            {key: 104, val: "Strategic"},
            {key: 105, val: "Reputational"},
            {key: 106, val: "Branch"}
        ];

        $scope.Lookups.GeoImpactOpts = [
            {key: 201, val: "Asia Pacific"},
            {key: 202, val: "EMEA"},
            {key: 203, val: "North America"},
            {key: 204, val: "Europe"},
            {key: 205, val: "All"}
        ];

        $scope.Lookups.InherentImpact = [
            {key: 301, val: 1},
            {key: 302, val: 2},
            {key: 303, val: 3},
            {key: 304, val: 4},
            {key: 305, val: 5}
        ];

        $scope.VM = {
            asTypeCode: "",
            auditFileModel: [],
            baselLevel1: "",
            baselLevel2: "",
            causalCategory: "",
            controlDataModel: [],
            controlDescription: "",
            controlName: "",
            controlStatus: "",
            createdBy: "",
            createdOn: "",
            geographicImpact: "",
            identifiedDate: "",
            impactedProcName: "",
            inherentImpact: "",
            inherentRiskRating: "",
            issueOutstanding: "",
            legalEntTier1Impact: "",
            legalEntTier2Impact: "",
            modifiedBy: "",
            modifiedOn: "",
            operationalLoss: "",
            policiesData: [],
            potentialImpact: "",
            processDescription: "",
            rcsaName: "",
            rcsaStatus: "",
            remeDate: "",
            remeOwner: "",
            remePlan: "",
            remeStatus: "",
            reportFrequency: "",
            reportRecipients: "",
            residualRisk: "",
            riskAccepted: "",
            riskCategory: "",
            riskDescription: "",
            riskDirection: "",
            riskMonitor: "",
            riskSeverity: "",
            secondaryRiskImpact: ""
        };

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }
        };

        $scope.addControls = function () {
            var headers = ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols = ["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            OPRiskService.GetControlData().then(function (data) {
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
            var headers = ["Document Name", "Description", "Type", "File Name"],
                cols = ["docName", "docDesc", "docType", "fileName"];

            $rootScope.app.Mask = true;
            OPRiskService.GetPolicyDocs(10, 1).then(function (data) {
                data.forEach(function (c, i) {
                    c.Selected = false;
                    c.docType = c.assessmentType[0] ? c.assessmentType[0].asTypeDesc : "";
                    c.fileName = c.fileModel[0] ? c.fileModel[0].fileName : "";
                });
                var polModal = Utils.CreateSelectListView("Select Policy Documents", data, headers, cols);
                polModal.result.then(function (list) {
                    $scope.VM.policiesData = $scope.VM.policiesData.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.setAll = function (val) {
            $scope.RiskCategories.List.forEach(function (op) {
                op.Selected = val;
            });
            $scope.RiskCategories.SelCount = val ? $scope.RiskCategories.List.length : 0;
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.submitAction = function () {
            if ($scope.Form.OpIncident.$invalid || $scope.Form.OpIncident.pristine) return false;
            /*console.log(moment($scope.VM.identifiedDate).format('MM-DD-YYYY'));*/
            if ($scope.RiskCategories.SelCount < 1) {
                alert("Please select Risk Category.");
                return false;
            }

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.identifiedDate);
            var d2 = moment($scope.VM.remeDate);
            $scope.VM.identifiedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.remeDate = (d2.isValid()) ? d2.format(dtype) : '';

            OPRiskService.PostRisk($scope.VM).then(function (res) {
                if (res.status === 200){
                    var fileModel = $scope.VM.auditFileModel;
                    OPRiskService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(res);
                    }).finally(function () {
                        $state.go('app.oprisk.incident.main');
                    });
                }
            });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.OpIncident.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.oprisk.incident.main');
                });
                return false;
            }
            $state.go('app.oprisk.incident.main');
        };


        OPRiskService.GetRiskCategories()
            .then(function (data) {
                Object.keys(data.categories).forEach(function (c) {
                    $scope.RiskCategories.List.push({Key: c, Label: data.categories[c], Selected: false});
                });
                $rootScope.app.Mask = false;
            });

    }
})();