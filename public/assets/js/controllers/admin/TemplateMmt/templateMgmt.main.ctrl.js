(function(){
    TemplateManagementController.$inject = ['$scope', '$rootScope'];
    app.controller('tmpUpldsCtrl', TemplateManagementController);

    function TemplateManagementController($scope, $rootScope){
        $rootScope.app.Mask =  false;
    }
})();