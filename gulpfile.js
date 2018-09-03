var gulp = require('gulp');
var sass = require('gulp-sass'); //编译sass
var mincss = require('gulp-clean-css');
var minjs = require('gulp-uglify');
var json = require('./src/data/data.json')

//启服务
var server = require('gulp-webserver');
var url = require('url');
var path = require('path');
var fs = require('fs')
    //压缩css
gulp.task('devsass', function() {
        return gulp.src('./src/sass/*.scss')
            .pipe(sass())
            .pipe(mincss())
            .pipe(gulp.dest('src/css'))
    })
    //压缩js
gulp.task('minjs', function() {
        return gulp.src('./src/**/*.js')
            .pipe(minjs())
            .pipe(gulp.dest('bulid'))
    })
    //watch自动刷新
gulp.task('watch', function() {
        return gulp.watch('./src/**/*.scss', gulp.series('devsass'))
    })
    //启服务
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8585,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == '/favicon.ico') {
                    return res.end();
                } else if (pathname == '/api/inputjson') {
                    var key = url.parse(req.url).query.key;
                    console.log(key)
                    var arr = [];
                    json.forEach(function(item) {
                        if (item.title.match(key)) {
                            arr.push(item.title)
                        }
                    })
                    console.log(arr)
                    res.end(JSON.stringify({
                        code: 0,
                        data: arr
                    }))
                } else {
                    pathname = pathname === '/' ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))

                }

            }
        }))
})
gulp.task('dev', gulp.series('devsass', 'server', 'minjs', 'watch'))