'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider','$ocLazyLoadProvider', 'ScrollBarsProvider', '$base64', 'JS_REQUIRES',
function ($stateProvider, $urlRouterProvider ,$locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider,$ocLazyLoadProvider, ScrollBarsProvider, $base64, jsRequires) {

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.cache = false;

    //var user = 'user', pass = '6hf38!%DQ09736v,32/f85Ax@#';
    //console.log($base64.encode(user+':'+pass));
    // delete $httpProvider.defaults.headers['Authorization'];
    // delete $httpProvider.defaults.headers.common['Authorization'];
    // $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(user+':'+pass);

    //$httpProvider.defaults.headers.common['Authorization'] = 'Basic dXNlcjo2aGYzOCElRFEwOTczNnYsMzIvZjg1QXhAIw==';

    //$httpProvider.interceptors.push('APIInterceptor');

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        axis: 'y', // enable 2 axis scrollbars by default,
        theme: 'dark-3',
        autoHideScrollbar: false
    };

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // });
    $urlRouterProvider.otherwise("/dashboard");

    // Set up the states
    $stateProvider.state('home', {
        url: "",
        templateUrl: 'assets/views/home.html',
        controller: ''
    }).state('app', {
        url: "",
        templateUrl: "assets/views/app.html",
        resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'oitozero.ngSweetAlert', 'truncate', 'htmlToPlaintext', 'angular-notification-icons', 'ngrtPopover'),
        abstract: true
    }).state('app.dashboard', {
        url: '/dashboard',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.dashboard.main', {
        url: "",
        templateUrl: "assets/views/dashboard.html",
        controller: 'DashboardCtrl',
        resolve: loadSequence('mwl.calendar', 'DashboardCtrl'),
        title: 'Dashboard',
        ncyBreadcrumb: {
            label: 'Dashboard'
        }
    }).state('app.dashboard.action', {
        url: '/action',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.dashboard.action.form', {
        url: "/new",
        templateUrl: "assets/views/dashboard.action.form.html",
        controller: 'DashActionFormCtrl',
        resolve: loadSequence('DashActionFormCtrl'),
        title: 'Add Action',
        ncyBreadcrumb: {
            label: 'Dashboard'
        }
    }).state('app.dashboard.action.update', {
        url: "/:id/update",
        templateUrl: "assets/views/dashboard.action.form.html",
        controller: 'DashActionUpdateCtrl',
        resolve: loadSequence('DashActionUpdateCtrl'),
        title: 'Update Activity Action',
        ncyBreadcrumb: {
            label: 'Dashboard'
        }
    })

    /*
        ---- IT RISK Routes ----
    */
    .state('app.oprisk', {
        url: '/oprisk',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.oprisk.incident', {
        url: '/incident',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.oprisk.incident.main', {
        url: '',
        templateUrl: "assets/views/operationrisk/oprisk.incident.html",
        title: 'Operational Risk Incident',
        icon: 'ti-layout-media-left-alt',
        controller: 'OprIncidentCtrl',
        resolve: loadSequence('OprIncidentCtrl')
    }).state('app.oprisk.incident.form', {
        url: '/manage',
        templateUrl: "assets/views/operationrisk/oprisk.incident.form.html",
        title: 'Operational Risk Incident Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'OprIncidentFormCtrl',
        resolve: loadSequence('OprIncidentFormCtrl')
    }).state('app.oprisk.incident.update', {
        url: '/:id/update',
        templateUrl: "assets/views/operationrisk/oprisk.incident.form.html",
        title: 'Update Operational Risk Incident Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'OprIncidentUpdateCtrl',
        resolve: loadSequence('OprIncidentUpdateCtrl')
    }).state('app.oprisk.assessment', {
        url: '/assessment',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.oprisk.assessment.main', {
        url: '',
        templateUrl: "assets/views/operationrisk/oprisk.assessment.html",
        title: 'Operational Risk Assessment',
        icon: 'ti-layout-media-left-alt',
        controller: 'OprAssessmentCtrl',
        resolve: loadSequence('OprAssessmentCtrl')
    }).state('app.oprisk.assessment.form', {
        url: '/manage',
        templateUrl: "assets/views/operationrisk/oprisk.assessment.upload.html",
        title: 'Risk Control Self Assessment',
        icon: 'ti-layout-media-left-alt',
        controller: 'OprAssessmentFormCtrl',
        resolve: loadSequence('OprAssessmentFormCtrl')
    }).state('app.oprisk.assessment.update', {
        url: '/:id/update',
        templateUrl: "assets/views/operationrisk/oprisk.assessment.upload.html",
        title: 'Risk Control Self Assessment',
        icon: 'ti-layout-media-left-alt',
        controller: 'OprAssessmentUpdateCtrl',
        resolve: loadSequence('OprAssessmentUpdateCtrl')
    })


    /*
     ---- VENDOR RISK Routes ----
    */
    .state('app.vendorrisk',{
        url: '/vendorrisk',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.vendorrisk.stinfo', {
        url: '/stinfo',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.vendorrisk.stinfo.main', {
        url: '',
        templateUrl: 'assets/views/vendorrisk/vendorrisk.stinfo.html',
        title: 'Vendor Risk Standardized Info Gathering ',
        icon: 'ti-layout-media-left-alt',
        controller: 'VendorriskStinfoCtrl',
        controllerAs: 'vrStinfo',
        resolve: loadSequence('VendorriskStinfoCtrl')
    }).state('app.vendorrisk.stinfo.create', {
        url: '/stinfocreate',
        templateUrl: 'assets/views/vendorrisk/vendorrisk.stinfo.create.html',
        title: 'Creating Vendor Risk ',
        icon: 'ti-layout-media-left-alt',
        controller: 'VendorriskStinfoCTCtrl',
        controllerAs: 'vrStinfoCT',
        resolve: loadSequence('VendorriskStinfoCTCtrl')
    }).state('app.vendorrisk.stinfo.update', {
        url: '/:id/update',
        templateUrl: "assets/views/vendorrisk/vendorrisk.stinfo.form.html",
        title: 'Update Vendor Risk Stinfo',
        icon: 'ti-layout-media-left-alt',
        controller: 'VendorStinfoUpdateCtrl',
        ControllerAs: 'vrStinfoupdate',
        resolve: loadSequence('VendorStinfoUpdateCtrl')
    }).state('app.vendorrisk.assessment', {
        url: '/assessment',
        templateUrl: 'assets/views/vendorrisk/vendorrisk.stinfo.create.html',
        title: 'Vendor Risk Standardized Info Gathering ',
        icon: 'ti-layout-media-left-alt',
        controller: 'VendorriskStinfoCtrl',
        controllerAs: 'vrStinfo',
        resolve: loadSequence('VendorriskStinfoCTCtrl')
    })
    /*
        ---- IT RISK Routes ----
    */
    .state('app.itrisk', {
        url: '/itrisk',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.itrisk.incident', {
        url: '/incident',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.itrisk.incident.main', {
        url: '',
        templateUrl: "assets/views/itrisk/itrisk.incident.html",
        title: 'IT Risk Incident Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'ITRiskIncCtrl',
        resolve: loadSequence('ITRiskIncCtrl')
    }).state('app.itrisk.incident.form', {
        url: '/manage',
        templateUrl: "assets/views/itrisk/itrisk.incident.form.html",
        title: 'Add IT Risk Incident',
        icon: 'ti-layout-media-left-alt',
        controller: 'ITRiskIncFormCtrl',
        resolve: loadSequence('ITRiskIncFormCtrl')
    }).state('app.itrisk.incident.update', {
        url: '/:id/update',
        templateUrl: "assets/views/itrisk/itrisk.incident.form.html",
        title: 'Update IT Risk Incident',
        icon: 'ti-layout-media-left-alt',
        controller: 'ITRiskIncUpdateCtrl',
        resolve: loadSequence('ITRiskIncUpdateCtrl')
    }).state('app.itrisk.assessment', {
        url: '/assessment',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.itrisk.assessment.main', {
        url: '',
        templateUrl: "assets/views/itrisk/itrisk.assessment.html",
        title: 'IT Risk Assessment Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'ITRiskAssCtrl',
        resolve: loadSequence('ITRiskAssCtrl')
    }).state('app.itrisk.assessment.form', {
        url: '/manage',
        templateUrl: "assets/views/itrisk/itrisk.assessment.form.html",
        title: 'Add IT Risk Assessment',
        icon: 'ti-layout-media-left-alt',
        controller: 'ITRiskAssFormCtrl',
        resolve: loadSequence('ITRiskAssFormCtrl')
    }).state('app.itrisk.assessment.update', {
        url: '/:id/update',
        templateUrl: "assets/views/itrisk/itrisk.assessment.form.html",
        title: 'Update IT Risk Assessment',
        icon: 'ti-layout-media-left-alt',
        controller: 'ITRiskAssUpdateCtrl',
        resolve: loadSequence('ITRiskAssUpdateCtrl')
    })

    /*
        ---- IT RISK Routes ----
    */
    .state('app.control', {
        url: '/control',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.control.repo', {
        url: '/repo',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.control.repo.main', {
        url: '',
        templateUrl: "assets/views/control/control.repo.html",
        title: 'Control Repository',
        icon: 'ti-layout-media-left-alt',
        controller: 'RepoCtrl',
        resolve: loadSequence('RepoCtrl')
    }).state('app.control.repo.form', {
        url: '/manage',
        templateUrl: "assets/views/control/control.repo.form.html",
        title: 'Control Data Repository',
        icon: 'ti-layout-media-left-alt',
        controller: 'RepoFormCtrl',
        resolve: loadSequence('RepoFormCtrl')
    }).state('app.control.repo.update', {
        url: '/:id/update',
        templateUrl: "assets/views/control/control.repo.form.html",
        title: 'Update Control Data Repository',
        icon: 'ti-layout-media-left-alt',
        controller: 'RepoUpdateCtrl',
        resolve: loadSequence('RepoUpdateCtrl')
    }).state('app.control.testplan', {
        url: '/testplan',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.control.testplan.main', {
        url: '',
        templateUrl: "assets/views/control/control.testplan.html",
        title: 'CONTROL TEST PLAN',
        icon: 'ti-layout-media-left-alt',
        controller: 'TestPlanCtrl',
        resolve: loadSequence('TestPlanCtrl')
    }).state('app.control.testplan.form', {
        url: '/manage',
        templateUrl: "assets/views/control/control.testplan.form.html",
        title: 'CONTROL TEST PLAN',
        icon: 'ti-layout-media-left-alt',
        controller: 'TestPlanFormCtrl',
        resolve: loadSequence('TestPlanFormCtrl')
    }).state('app.control.testplan.update', {
        url: '/:id/update',
        templateUrl: "assets/views/control/control.testplan.form.html",
        title: 'Update CONTROL TEST PLAN',
        icon: 'ti-layout-media-left-alt',
        controller: 'TestPlanUpdateCtrl',
        resolve: loadSequence('TestPlanUpdateCtrl')
    }).state('app.control.testresult', {
        url: '/testresult',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.control.testresult.main', {
        url: '',
        templateUrl: "assets/views/control/control.testresult.html",
        title: 'CONTROL TEST RESULT',
        icon: 'ti-layout-media-left-alt',
        controller: 'TestResultCtrl',
        resolve: loadSequence('TestResultCtrl')
    }).state('app.control.testresult.form', {
        url: '/manage',
        templateUrl: "assets/views/control/control.testresult.form.html",
        title: 'CONTROL TEST RESULT',
        icon: 'ti-layout-media-left-alt',
        controller: 'TestResultFormCtrl',
        resolve: loadSequence('TestResultFormCtrl')
    }).state('app.control.testresult.update', {
        url: '/:id/update',
        templateUrl: "assets/views/control/control.testresult.form.html",
        title: 'Update CONTROL TEST RESULT',
        icon: 'ti-layout-media-left-alt',
        controller: 'TestResultUpdateCtrl',
        resolve: loadSequence('TestResultUpdateCtrl')
    }).state('app.control.mapping', {
        url: '/mapping',
        templateUrl: "assets/views/control/control.mapping.html",
        title: 'Control Mapping',
        icon: 'ti-layout-media-left-alt',
        controller: 'ControlMapCtrl',
        resolve: loadSequence('ControlMapCtrl')
    }).state('app.control.dashboard', {
        url: '/dashboard',
        templateUrl: "assets/views/control/control.dashboard.html",
        title: 'CONTROL Dashboard',
        icon: 'ti-layout-media-left-alt',
        controller: 'ControlDashboardCtrl',
        resolve: loadSequence('ControlDashboardCtrl')
    })



      /*
        ---- Compliance Routes ----
    */
    .state('app.compliance', {
        url: '/compliance',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.compliance.soxtp', {
        url: '/soxtp',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.compliance.soxtp.main', {
        url: '',
        templateUrl: "assets/views/compliance/soxtp.html",
        title: 'SOX Test Plan Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXTPCtrl',
        resolve: loadSequence('SOXTPCtrl')
    }).state('app.compliance.soxtp.form', {
        url: '/manage',
        templateUrl: "assets/views/compliance/soxtp.form.html",
        title: 'SOX Test Plan ',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXTPFormCtrl',
        resolve: loadSequence('SOXTPFormCtrl')
    }).state('app.compliance.soxtp.update', {
        url: '/:id/update',
        templateUrl: "assets/views/compliance/soxtp.form.html",
        title: 'Update SOX Test Plan',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXTPFormmCtrl',
        resolve: loadSequence('SOXTPFormCtrl')

    }).state('app.compliance.soxpra', {
        url: '/soxpra',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.compliance.soxpra.main', {
        url: '',
        templateUrl: "assets/views/compliance/soxpra.html",
        title: 'SOX Process Risk Analysis',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXPRACtrl',
        resolve: loadSequence('SOXPRACtrl')
    }).state('app.compliance.soxpra.form', {
        url: '/manage',
        templateUrl: "assets/views/compliance/soxpra.form.html",
        title: 'SOX Process Risk Analysis',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXPRAFormCtrl',
        resolve: loadSequence('SOXPRAFormCtrl')
    }).state('app.compliance.soxpra.update', {
        url: '/:id/update',
        templateUrl: "assets/views/compliance/soxpra.form.html",
        title: 'Update SOX Process Risk Analysis',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXPRAFormCtrl',
        resolve: loadSequence('SOXPRAFormCtrl')

    }).state('app.compliance.soxrcm', {
        url: '/soxrcm',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.compliance.soxrcm.main', {
        url: '',
        templateUrl: "assets/views/compliance/soxrcm.html",
        title: 'SOX Process Risk Analysis',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXRCMCtrl',
        resolve: loadSequence('SOXRCMCtrl')
    }).state('app.compliance.soxrcm.form', {
        url: '/manage',
        templateUrl: "assets/views/compliance/soxrcm.form.html",
        title: 'SOX Process Risk Analysis',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXRCMFormCtrl',
        resolve: loadSequence('SOXRCMFormCtrl')
    }).state('app.compliance.soxrcm.update', {
        url: '/:id/update',
        templateUrl: "assets/views/compliance/soxrcm.form.html",
        title: 'Update SOX Process Risk Analysis',
        icon: 'ti-layout-media-left-alt',
        controller: 'SOXRCMFormCtrl',
        resolve: loadSequence('SOXRCMFormCtrl')

    })



    /*
        ---- Policy Route ----
    */
    .state('app.policy', {
        url: '/policy',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.policy.main', {
        url: '',
        templateUrl: "assets/views/policy/policy.html",
        title: 'Procedures and Policies Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'PolicyCtrl',
        resolve: loadSequence('PolicyCtrl')
    }).state('app.policy.form', {
        url: '/manage',
        templateUrl: "assets/views/policy/policy.form.html",
        title: 'Procedures and Policies Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'PolicyFormCtrl',
        resolve: loadSequence('PolicyFormCtrl')
    }).state('app.policy.update', {
        url: '/:id/manage',
        templateUrl: "assets/views/policy/policy.form.html",
        title: 'Update Procedures and Policies Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'PolicyUpdateCtrl',
        resolve: loadSequence('PolicyUpdateCtrl')
    })

    /*
     ---- Remediations Routes ----
     */
    .state('app.mitigate', {
        url: '/mitigate',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    })
    .state('app.mitigate.remediations', {
        url: '/remediations',
        templateUrl: "assets/views/mitigate/remediations.html",
        title: 'Remediations Management',
        icon: 'ti-layout-media-left-alt',
        controller: 'RemediationsCtrl',
        resolve: loadSequence('RemediationsCtrl')
    })

    /*
     ---- IT RISK Routes ----
     */
    .state('app.measure', {
        url: '/measure',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.measure.pentest', {
        url: '/penetration',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.measure.pentest.main', {
        url: '',
        templateUrl: "assets/views/measure/penetration.html",
        title: 'Penetration Testing',
        icon: 'ti-layout-media-left-alt',
        controller: 'PenetrationCtrl',
        resolve: loadSequence('PenetrationCtrl')
    }).state('app.measure.vluner', {
        url: '/vulnerability',
        template: '<div ui-view class="fade-in-up"></div>',
        abstract: true
    }).state('app.measure.vulner.main', {
        url: '',
        templateUrl: "assets/views/control/control.repo.html",
        title: 'Control Repository',
        icon: 'ti-layout-media-left-alt',
        controller: 'VulnerabilityCtrl',
        resolve: loadSequence('RepoCtrl')
    })


    .state('app.contact', {
        url: '/contact',
        templateUrl: "assets/views/contactus.html",
        title: 'Contact Us',
        icon: 'ti-layout-media-left-alt',
        controller: 'ContactusCtrl',
        resolve: loadSequence('ContactusCtrl')
    }).state('app.glossary', {
        url: '/glossary',
        templateUrl: "assets/views/glossary.html",
        title: 'Glossary',
        icon: 'ti-layout-media-left-alt',
        controller: 'GlossaryCtrl',
        resolve: loadSequence('GlossaryCtrl')
    })

    /*
    *   ---- App Utility Page Routes ----
    */
    .state('error', {
        url: '/error',
        template: '<div ui-view class="fade-in-up"></div>'
    }).state('error.404', {
        url: '/404',
        templateUrl: "assets/views/utility_404.html",
    }).state('error.500', {
        url: '/500',
        templateUrl: "assets/views/utility_500.html",
    })

    /* Login Page Routes */
	.state('login', {
	    url: '/login',
	    template: '<div ui-view class="fade-in-right-big smooth"></div>',
	    abstract: true
	}).state('login.signin', {
	    url: '',
        templateUrl: "assets/views/login.signin.html",
        controller: 'LoginCtrl',
        resolve: loadSequence('LoginCtrl')
	}).state('login.forgot', {
	    url: '/forgot',
	    templateUrl: "assets/views/login_forgot.html"
	}).state('login.registration', {
	    url: '/registration',
	    templateUrl: "assets/views/login_registration.html"
	}).state('login.lockscreen', {
	    url: '/lock',
	    templateUrl: "assets/views/login_lock_screen.html"
	});

    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);
