var pool = require('./config/passport/db');

var login = function(req, res){
    console.log('/process/login 에서 받음');

    var paramId = req.body.id;
    var paramPassword = req.body.password;
    console.log('요청 파리마터 : ' + paramId + ', ' + paramPassword);

    authUser(paramId, paramPassword, function(err, rows){
        if (err) {
            console.log('에러 발생');
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>에러 발생<h1>');
            res.end();
            return;
        }

        if (rows) {
            console.log(rows);
            res.redirect('http://localhost:3000/home.html');
        } else {
            console.log('에러 발생');
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>사용자 데이터 조회 안됨<h1>');
            res.end();
        }
    });
};

var adduser = function(req, res){
    console.log('/process/adduser 호출됨');

    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramAge = req.body.age;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', '
    + paramName + ', ' + paramAge);

    var age = Number(paramAge);

    addUser(paramId, paramName, paramAge, paramPassword, function(err, addedUser){
        if (err) {
            console.log('에러 발생');
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>에러 발생<h1>');
            res.end();
            return;
        }

        if (addedUser) {
            console.dir(addedUser);
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>사용자 추가 성공<h1>');
            res.write('<br><br><a href="/login.html">로그인하러 가기</a>');
            res.end();
        } else {
            console.log('에러 발생2');
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>사용자 추가 실패<h1>');
            res.end();
        }

    })
};

var authUser = function(id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    pool.getConnection(function(err, conn){
        if (err) {
            if (conn) {
                conn.release();
            }

            callback(err, null);
            return;
        }
        
        var columns = ['id', 'name', 'age'];
        var exec = conn.query("select ?? from users where id = ? and password = ?", 
        [columns, id, password],function(err, rows){
            conn.release();
            console.log('실행된 SQL : ' + exec.sql);

            if (err) {
                callback(err, null);
                return;
            }

            if (rows.length > 0) {
                console.log('사용자 찾음');
                callback(null, rows);
            } else {
                console.log('사용자 찾지 못함');
                callback(null, null);
            }
        });

    })
};

var addUser = function(id, name, age, password, callback) {
    console.log('addUser 호출됨');

    pool.getConnection(function(err, conn){
        if (err) {
            if (conn) {
                conn.release();
            }

            callback(err, null);
            return;
        }

        var data = {id:id, name:name, age:age, password:password};
        var exec = conn.query('insert into users set ?', data, function(err, result){
            conn.release();
            console.log('실행된 SQL : ' + exec.sql);

            if (err) {
                console.log('SQL 실행 시 에러 발생');
                callback(err, null);
                return;
            }

            callback(null,result);
        });

    });
};

module.exports.login = login;
module.exports.adduser = adduser;