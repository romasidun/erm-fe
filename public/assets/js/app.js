var app = angular.module('aasriApp', ['app.patch']);
app.run(['$rootScope', '$state', '$stateParams', '$location', '$http',
function ($rootScope, $state, $stateParams, $location, $http) {

    FastClick.attach(document.body);

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.app = {
        name: 'Aasri Control',
        author: 'Aasri Control',
        description: 'Aasri Control, Angular application',
        version: '2.0',
        year: ((new Date()).getFullYear()),
        isMobile: (function () {
            var check = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                check = true;
            }
            return check;
        })(),
        layout: {
            isNavbarFixed: true,
            isSidebarFixed: false,
            isSidebarClosed: false,
            isFooterFixed: false,
            theme: 'theme-1',
            logo: 'assets/img/logo.png'
        },
        IsAuthenticated: false,
        // APIPrefix: "http://54.173.94.137/api/2/",
        APIPrefix: "http://52.90.105.84/api/2/",
        // APIPrefix: "http://192.168.5.101:8080/api/2/",
        NodeApi: "http://localhost:8000/node",
        Debug: true,
        Mask: true,
        MaskLabel: null,
        CurrentModal: null
    };
    $rootScope.user = {
        name: 'Alan',
        job: 'ng-Dev',
        picture: 'app/img/user/01.jpg'
    };
}]);

app.config(['cfpLoadingBarProvider', '$qProvider', function (cfpLoadingBarProvider, $qProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;

    $qProvider.errorOnUnhandledRejections(false);
}]);
