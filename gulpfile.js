const gulp  = require('gulp')
const babel = require('gulp-babel')
const clean = require('gulp-clean')
const fs    = require('fs')
const exec  = require('child_process').exec
const path  = require('path');

const srcDir    = path.join(__dirname, 'src')
const distDir   = path.join(__dirname, 'dist')
const relaseDir = path.join(__dirname, 'relase')
const tempDir   = path.join(__dirname, 'temp')


const serverMainFile = `${distDir}/server/main.js`

gulp.task('build', ['build_babel', 'copy'])

gulp.task('build_babel', ['clean_dist'], function(){
    return gulp.src(`${srcDir}/**/*.js`)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(distDir))
})

gulp.task('copy', ['clean_dist'], function(){
    return gulp.src([`!${srcDir}/**/*.js`, `${srcDir}/**/*`], {base: srcDir})
        .pipe(gulp.dest(distDir))
})

gulp.task('clean_dist', function () {
    return gulp.src(distDir, {read: false}).pipe(clean())
})

gulp.task('watch', ['build'], function(){
    gulp.watch(`${srcDir}/**/*`, ['build'])
})


gulp.task('relase_clean', function () {
    return gulp.src([tempDir, relaseDir], {read: false}).pipe(clean())
})

gulp.task('relase_copy', ['build', 'relase_clean'], function(cb){
    fs.mkdir(tempDir, ()=>{
        gulp.src([`./dist`, `./index.html`, './main.js', './package.json', 'style.css'])
            .pipe(gulp.dest(tempDir)).on('end', cb)
    })
})

gulp.task('relase_install_package', ['relase_copy'], function(cb){
    exec(`npm i --production`, {cwd: tempDir}, (err, stdout, stderr)=>{
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
})

gulp.task('relase_fin_clean', ['relase_packager'], function(cb){
    return gulp.src(tempDir, {read: false}).pipe(clean())
})

gulp.task('relase_packager', ['relase_install_package'], function(cb){
    fs.mkdir(relaseDir, ()=>{
        exec(`electron-packager ${tempDir} TCP_Tester --all`, {cwd: relaseDir}, (err, stdout, stderr)=>{
            console.log(stdout);
            console.log(stderr);
            cb(err);
        })
    })
})

gulp.task('relase', ['relase_fin_clean'])
