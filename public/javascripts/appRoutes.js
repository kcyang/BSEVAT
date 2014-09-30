/**
 * Created by KC on 2014-09-17.
 * This is for angular routes.
 * 여기서 클라이언트에서 올라오는 요청 URL은 아래 내용을 참고하여 보이게 됨.
 */
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/vathome.html',
            controller: 'BSEVATController'
        })

        // V117 page that will use the NerdController
        .when('/V117', {
            templateUrl: 'views/V117.html',
            controller: 'V117Controller'
        });

    $locationProvider.html5Mode(true);

}]);