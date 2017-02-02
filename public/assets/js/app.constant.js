'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        'modernizr': ['libs/components-modernizr/modernizr.js'],
        'moment': ['libs/moment/min/moment.min.js'],
        'spin': 'libs/spin.js/spin.js',

        //*** jQuery Plugins
        'perfect-scrollbar-plugin': ['libs/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js', 'libs/perfect-scrollbar/css/perfect-scrollbar.min.css'],
        'ladda': ['libs/ladda/dist/ladda.min.js', 'libs/ladda/dist/ladda-themeless.min.css'],
        'sweet-alert': ['libs/sweetalert/lib/sweet-alert.min.js', 'libs/sweetalert/lib/sweet-alert.css'],
        'chartjs': 'libs/chartjs/Chart.min.js',
        'jquery-sparkline': 'libs/jquery.sparkline.build/dist/jquery.sparkline.min.js',
        'ckeditor-plugin': 'libs/ckeditor/ckeditor.js',
        'jquery-nestable-plugin': ['libs/jquery-nestable/jquery.nestable.js'],
        'touchspin-plugin': ['libs/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', 'libs/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
		'spectrum-plugin': ['libs/spectrum/spectrum.js', 'libs/spectrum/spectrum.css'],
		'highcharts': ['libs/highcharts-ng/dist/highcharts-ng.js'],
        'ngrtPopover': ['libs/angular-rt-popup/dist/angular-rt-popup.min.js'],


        /*
        *  Angular Application Controllers
        */
        'LoginCtrl': 'assets/js/controllers/login.signin.ctrl.js',
        'ContactusCtrl': 'assets/js/controllers/contactusCtrl.js',
        'GlossaryCtrl': 'assets/js/controllers/glossaryCtrl.js',
        'DashboardCtrl': 'assets/js/controllers/dashboard.ctrl.js',
        'DashActionFormCtrl': 'assets/js/controllers/dashboard.action.form.ctrl.js',
        'DashActionUpdateCtrl': 'assets/js/controllers/dashboard.action.update.ctrl.js',

        //Operational Risk related Controllers
        'OprIncidentCtrl':       'assets/js/controllers/operationrisk/oprisk.incident.ctrl.js',
        'OprIncidentFormCtrl':   'assets/js/controllers/operationrisk/oprisk.incident.form.ctrl.js',
        'OprIncidentUpdateCtrl': 'assets/js/controllers/operationrisk/oprisk.incident.update.ctrl.js',
        'OprAssessmentCtrl':     'assets/js/controllers/operationrisk/oprisk.assessment.ctrl.js',
        'OprAssessmentFormCtrl': 'assets/js/controllers/operationrisk/oprisk.assessment.form.ctrl.js',
        'OprAssessmentUpdateCtrl': 'assets/js/controllers/operationrisk/oprisk.assessment.update.ctrl.js',


        //IT Risk related Controllers
        'ITRiskIncCtrl':        'assets/js/controllers/itrisk/itrisk.incident.ctrl.js',
        'ITRiskIncFormCtrl':    'assets/js/controllers/itrisk/itrisk.incident.form.ctrl.js',
        'ITRiskIncUpdateCtrl':    'assets/js/controllers/itrisk/itrisk.incident.update.ctrl.js',
        'ITRiskAssCtrl':        'assets/js/controllers/itrisk/itrisk.assessment.ctrl.js',
        'ITRiskAssFormCtrl':    'assets/js/controllers/itrisk/itrisk.assessment.form.ctrl.js',
        'ITRiskAssUpdateCtrl':    'assets/js/controllers/itrisk/itrisk.assessment.update.ctrl.js',

        //Compliance Controllers
        'SOXTPCtrl':       'assets/js/controllers/compliance/soxtp.ctrl.js',
        'SOXTPFormCtrl':       'assets/js/controllers/compliance/soxtp.form.ctrl.js',
        'SOXRCMCtrl':       'assets/js/controllers/compliance/soxrcm.ctrl.js',
        'SOXRCMFormCtrl':       'assets/js/controllers/compliance/soxrcm.form.ctrl.js',
        'SOXPRACtrl':       'assets/js/controllers/compliance/soxpra.ctrl.js',
        'SOXPRAFormCtrl':       'assets/js/controllers/compliance/soxpra.form.ctrl.js',

        //Vendor Risk related Controllers
        'VendorriskStinfoCtrl': 'assets/js/controllers/vendorrisk/vendorrisk.stinfo.ctrl.js',
        'VendorriskStinfoCTCtrl': 'assets/js/controllers/vendorrisk/vendorrisk.stinfo.create.ctrl.js',
        'VendorStinfoUpdateCtrl': 'assets/js/controllers/vendorrisk/vendorrisk.stinfo.update.ctrl.js',
        'VendScoreCardCtrl':     'assets/js/controllers/vendorrisk/vendorrisk.scorecard.ctrl.js',

        //Audit Controllers
        'AuditMainCtrl':     'assets/js/controllers/audit/audit.main.ctrl.js',

        //Control related Controllers
        'RepoCtrl':             'assets/js/controllers/control/repo.ctrl.js',
        'RepoFormCtrl':         'assets/js/controllers/control/repo.form.ctrl.js',
        'RepoUpdateCtrl':       'assets/js/controllers/control/repo.update.ctrl.js',
        'TestPlanCtrl':         'assets/js/controllers/control/testplan.ctrl.js',
        'TestPlanFormCtrl':     'assets/js/controllers/control/testplan.form.ctrl.js',
        'TestPlanUpdateCtrl':   'assets/js/controllers/control/testplan.update.ctrl.js',
        'TestResultCtrl':       'assets/js/controllers/control/testresult.ctrl.js',
        'TestResultFormCtrl':   'assets/js/controllers/control/testresult.form.ctrl.js',
        'TestResultUpdateCtrl': 'assets/js/controllers/control/testresult.update.ctrl.js',
        'ControlDashboardCtrl': 'assets/js/controllers/control/dashboard.ctrl.js',
        'ControlMapCtrl':       'assets/js/controllers/control/mapping.ctrl.js',


        //Policy & Mitigate related Controllers
        'PolicyCtrl':           'assets/js/controllers/policy/policy.ctrl.js',
        'PolicyFormCtrl':       'assets/js/controllers/policy/policy.form.ctrl.js',
        'PolicyUpdateCtrl':       'assets/js/controllers/policy/policy.update.ctrl.js',
        'RemediationsCtrl':     'assets/js/controllers/mitigate/remediations.ctrl.js',

        //Measure related Controllers
        'PenetrationCtrl':      'assets/js/controllers/measure/penetration.ctrl.js',
        'VulnerabilityCtrl':    'assets/js/controllers/measure/vulnerability.ctrl.js',

        //*** Filters
        'htmlToPlaintext': 'assets/js/filters/htmlToPlaintext.js'
    },

    /*
     *  AngularJS Modules
     */
    modules: [{
        name: 'angularMoment',
        files: ['libs/angular-moment/angular-moment.min.js']
    }, {
        name: 'toaster',
        files: ['libs/angularjs-toaster/toaster.js', 'libs/angularjs-toaster/toaster.css']
    }, {
        name: 'angularBootstrapNavTree',
        files: ['libs/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', 'libs/angular-bootstrap-nav-tree/dist/abn_tree.css']
    }, {
        name: 'angular-ladda',
        files: ['libs/angular-ladda/dist/angular-ladda.min.js']
    }, {
        name: 'ngTable',
        files: ['libs/ng-table/dist/ng-table.min.js', 'libs/ng-table/dist/ng-table.min.css']
    }, {
        name: 'ui.select',
        files: ['libs/angular-ui-select/dist/select.min.js', 'libs/angular-ui-select/dist/select.min.css', 'libs/select2/dist/css/select2.min.css', 'libs/select2-bootstrap-css/select2-bootstrap.min.css', 'libs/selectize/dist/css/selectize.bootstrap3.css']
    }, {
        name: 'ui.mask',
        files: ['libs/angular-ui-utils/mask.min.js']
    }, {
        name: 'ngImgCrop',
        files: ['libs/ngImgCrop/compile/minified/ng-img-crop.js', 'libs/ngImgCrop/compile/minified/ng-img-crop.css']
    }, {
        name: 'angularFileUpload',
        files: ['libs/angular-file-upload/angular-file-upload.min.js']
    }, {
        name: 'ngAside',
        files: ['libs/angular-aside/dist/js/angular-aside.min.js', 'libs/angular-aside/dist/css/angular-aside.min.css']
    }, {
        name: 'truncate',
        files: ['libs/angular-truncate/src/truncate.js']
    }, {
        name: 'oitozero.ngSweetAlert',
        files: ['libs/angular-sweetalert-promised/SweetAlert.min.js']
    }, {
        name: 'monospaced.elastic',
        files: ['libs/angular-elastic/elastic.js']
    }, {
        name: 'ngMap',
        files: ['libs/ngmap/build/scripts/ng-map.min.js']
    }, {
        name: 'tc.chartjs',
        files: ['libs/tc-angular-chartjs/dist/tc-angular-chartjs.min.js']
    }, {
        name: 'flow',
        files: ['libs/ng-flow/dist/ng-flow-standalone.min.js']
    }, {
        name: 'uiSwitch',
        files: ['libs/angular-ui-switch/angular-ui-switch.min.js', 'libs/angular-ui-switch/angular-ui-switch.min.css']
    }, {
        name: 'ckeditor',
        files: ['libs/angular-ckeditor/angular-ckeditor.min.js']
    }, {
        name: 'mwl.calendar',
        files: ['libs/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js', 'libs/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css', 'assets/js/config/config-calendar.js']
    }, {
        name: 'ng-nestable',
        files: ['libs/ng-nestable/src/angular-nestable.js']
    }, {
        name: 'vAccordion',
        files: ['libs/v-accordion/dist/v-accordion.min.js', 'libs/v-accordion/dist/v-accordion.min.css']
    }, {
        name: 'xeditable',
        files: ['libs/angular-xeditable/dist/js/xeditable.min.js', 'libs/angular-xeditable/dist/css/xeditable.css', 'assets/js/config/config-xeditable.js']
    }, {
        name: 'checklist-model',
        files: ['libs/checklist-model/checklist-model.js']
    }, {
        name: 'angular-notification-icons',
        files: ['libs/angular-notification-icons/dist/angular-notification-icons.min.js', 'libs/angular-notification-icons/dist/angular-notification-icons.min.css']
    }, {
        name: 'angularSpectrumColorpicker',
        files: ['libs/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js']
    }]
});
