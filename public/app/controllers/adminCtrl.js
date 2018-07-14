angular.module('adminController', [])
    .controller('adminCtrl', function(User) {

        var app = this;
        app.accessDenied = true;

        User.getUsers().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin') {
                    app.users = data.data.message;
                    app.accessDenied = false;
                } else {
                    app.errorMsg = 'Insufficient permission';
                }
            } else {
                app.errorMsg = data.data.message;
            }
        });

        User.getCodes().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin') {
                    app.codes = data.data.message;
                    app.accessDenied = false;
                    console.log(app.codes);
                } else {
                    app.errorMsg = 'Insufficient permission';
                }
            } else {
                app.errorMsg = 'Insufficient permission';
            }
        });

    });
