/**
 * [Angularjs]
 * Dialog 를 띄우고, 거기서 일어나는 이벤트에 대한 Control 을 하는 곳.
 */
'use strict';
/* global angular */

angular.module('dialogCtrl',[]).controller('dialogController',function($scope,$log,$location,ngDialog){
    //#자료불러오기 버튼을 눌렀을 때 실행되는 function.
    $scope.cancelDialog = function(){
        ngDialog.close('ngdialog1');
        $log.info('취소했습니다.!!!');
    };

    //#확인 버튼을 눌렀을 때 실행되는 function.
    $scope.confirmDialog = function(){
        $scope.progressValue = 20;
        ngDialog.close('ngdialog1');
        ngDialog.open({
            template:'../../views/progressDialog.html',
            controller:'V117Controller',
            scope: $scope,
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
        $scope.constants.EMPTY = 'true';
        $scope.createDocument();
    };
});