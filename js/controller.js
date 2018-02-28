var app = angular.module('myapp',['ngRoute','angularFileUpload']);
app.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'html/subForm.html',
        controller:'myhdtjFromController'
    });
}]);

//表单提交控制器
app.controller('myhdtjFromController',function($scope,$http,FileUploader){
    //上传图片并预览展示
    $scope.picsty = true;
    var uploader = $scope.uploader = new FileUploader({
        url: 'a.txt',
        queueLimit: 1,     //文件个数
        removeAfterUpload: true   //上传后删除文件
    });
    $scope.clearItems = function(){    //重新选择文件时，清空队列，达到覆盖文件的效果
        uploader.clearQueue();
    }
    //上传文件成功
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
        console.log($scope.fileItem);
    };

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
    //输入框最大字数限制
    $scope.hdjj = "";
    $scope.hdnr = "";
    $scope.left = function(){ return 500-$scope.hdjj.length;}
    $scope.left1 = function(){ return 500-$scope.hdnr.length;}

    //todolist
    $scope.todoList = [];
    $scope.add = function(){
        $scope.todoList.push({
           text:$scope.text
        });
        $scope.text="";
    };

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
                hdnr:$scope.hdnr,  //内容
                selectName:$scope.selectName, //下拉框值
                // filepic:$scope.picsty,      //图片
                startTime1:$scope.startTime1, //报名时间1
                startTime2:$scope.startTime2, //报名时间2
                endTime:$scope.endTime, //结束时间
                todoList:angular.toJson($scope.todoList)  //将todoList值转化成json数据传递
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
            $scope.hdnr="";

        }),function(){
            swal('系统错误，请稍后再试！',{
                icon: "error",
                buttons: false,
                timer:2000,
            });
        }
    }

    $http({
        method:'GET',
        url:'json/serviceCenter.json',
        params:{
            columnId:4
        }
    }).then(function(data){
        $scope.picList = data.data.photos;
        for(var i=0;i<$scope.picList.length;i++){
            $scope.picList[i].url = 'json/serviceCenter.json?docId='+$scope.picList[i].id;
        }
    });
    //轮播图
    setTimeout(function(){$('#sliderBox').bxSlider({
        mode:'horizontal', //默认的是水平
        displaySlideQty:1,//显示li的个数
        moveSlideQty: 1,//移动li的个数
        captions: true,//自动控制
        auto: true,
        controls: false,//隐藏左右按钮
        pager:true,
        pause:2000,
    });},0)
});

//轮播图控制器
// app.controller("lunboController",function($scope,$http){
//
// });

// 自定义指令封装日期
app.directive('ngcLayDate', function($timeout) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            ngModel: '='
            // maxDate:'@',
            // minDate:'@'
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
                    calendar: true,
                    done: function(value, date, endDate){
                        ngModel.$setViewValue(value); //得到日期生成的值，如：2017-08-18
                    },
                    choose: function(data) {
                        scope.$apply(setViewValue);
                    },
                    clear:function(){
                        ngModel.$setViewValue(null);
                    },
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
