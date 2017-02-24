(function(){
    AdminDashBoard.$inject = ['$scope', '$rootScope'];
    app.controller('adminDashboardCtrl', AdminDashBoard);

    function AdminDashBoard($scope, $rootScope){
        $rootScope.app.Mask =  false;
    }
})();