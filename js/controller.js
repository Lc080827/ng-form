var app = angular.module('myapp',['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'html/subForm.html',
        controller:'myhdtjFromController'
    });
}]);

//表单提交控制器
app.controller('myhdtjFromController',function($scope,$http){
    //获取下拉框json数据
    $http({
        method:'GET',
        url:'json/serviceCenter.json'
    }).then(function(data){
        $scope.selectList = data.data.ratings;
        console.log($scope.selectList);
    }),function(error){
        console.log(error);
    }
    // $scope.hdtjName = "jack";
    //输入框最大字数限制
    $scope.hdjj = "";
    $scope.left = function(){ return 500-$scope.hdjj.length;}
    //活动日期

    $scope.submit = function(){
        $http({
            method:'get',
            url:'a.txt',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            params:{
                hdtjName:$scope.hdtjName, //申请人
                hdtjPwd:$scope.hdtjName,   //密码
                hdtjPhone:$scope.hdtjPhone, //电话
                hdtjEmail:$scope.hdtjEmail, //邮箱
                hdjj:$scope.hdjj,  //描述
                selectName:$scope.selectName, //下拉框值
                startTime1:$scope.startTime1 //报名时间1
                // startTime2:$scope.startTime2, //报名时间2
                // endTime:$scope.endTime //结束时间
            }
        }).then(function(){
            swal('提交成功',{
                icon: "success",
                buttons: false,
                timer:2000,
            });
            //清空数据
            $scope.hdtjName=""; //申请人
            $scope.hdtjPwd="";  //密码
            $scope.hdtjPhone=""; //电话
            $scope.hdtjEmail=""; //邮箱
            $scope.hdjj="";  //描述

        }),function(){
            swal('系统错误，请稍后再试！',{
                icon: "error",
                buttons: false,
                timer:2000,
            });
        }
    }
});
//自定义指令封装日期
app.directive('ngcLayDate', function($timeout) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            ngModel: '=',
            maxDate:'@',
            minDate:'@'
        },
        link: function(scope, element, attr, ngModel) {
            var _date = null,_config={};
            // 渲染模板完成后执行
            $timeout(function(){
                // 初始化参数
                _config = {
                    elem: '#' + attr.id,
                    format: attr.format != undefined && attr.format != '' ? attr.format : 'yyyy/MM/dd HH:mm:ss',
                    type:attr.datetime,
                    // range:attr.range,
                    // max:attr.hasOwnProperty('maxDate')?attr.maxDate:'',
                    // min:attr.hasOwnProperty('minDate')?attr.minDate:'',
                    choose: function(data) {
                        scope.$apply(setViewValue);

                    },
                    clear:function(){
                        ngModel.$setViewValue(null);
                    }
                };
                // 初始化
                _date= laydate.render(_config);

                // 模型值同步到视图上
                ngModel.$render = function() {
                    element.val(ngModel.$viewValue || '');
                };

                // 监听元素上的事件
                element.on('blur keyup change', function() {
                    scope.$apply(setViewValue);
                });

                setViewValue();

                // 更新模型上的视图值
                function setViewValue() {
                    var val = element.val();
                    ngModel.$setViewValue(val);
                }
            },0);
        }
    };
});