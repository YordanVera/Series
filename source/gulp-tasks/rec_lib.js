var fs = require('fs');
var gulp = require('gulp');

var _path_node_modules = '';
var _path_dep_json = '';
var _add_dependency_to_list = function(_list, _dep_string){
    if(_list && _dep_string){
        var to_add_path_src = './node_modules/' + _dep_string + '/**/*'
        if(_list.indexOf(to_add_path_src) == -1){
            _list.push(to_add_path_src);
        }
    }
};


var _pushDependenciesForModuleRecursively =function(_list, isRootModule, module_name){
    var package_json = null;
    //console.log(">> Calling _pushDependenciesForModuleRecursively for "+module_name);

    if(isRootModule){
        var buffer = fs.readFileSync(_path_dep_json);
        package_json = JSON.parse(buffer.toString());
        //console.log(">> package_json >> " + JSON.stringify(package_json.dependencies));
    }
    else {
        var buffer = fs.readFileSync(_path_node_modules+'/'+module_name+'/package.json');
        var child_package_json = JSON.parse(buffer.toString());
        package_json = child_package_json;
        //console.log(">> child_package_json >> " + JSON.stringify(package_json.dependencies));
    }

    var dependencies_list = Object.keys(package_json.dependencies);
    //console.log(">> Found dependencies for module "+module_name+" >> " + JSON.stringify(dependencies_list ));

    if(dependencies_list && dependencies_list.length >0){
        for (index in dependencies_list) {
            var _dependency_mod_name = dependencies_list[index];
            if(_dependency_mod_name){
                _pushDependenciesForModuleRecursively(_list, false, _dependency_mod_name);
                _add_dependency_to_list(_list, _dependency_mod_name);
            }
        }
    }
    else {
        if(!isRootModule && module_name && typeof(module_name)==='string'){
            var to_add_path_src = _path_node_modules+'/' + module_name + '/**/*';
            _add_dependency_to_list(_list, module_name);
        }
    }
};


var listDeps = function(path_node_modules, path_dep_json) {
    var keys = [];
    var isRootModule = true;
    if(typeof path_dep_json !== 'undefined'){
        _path_node_modules = path_node_modules;
    }else{
        _path_node_modules = './node_modules';
    }

    if(typeof path_dep_json !== 'undefined'){
        _path_dep_json = path_dep_json;
    }else{
        _path_dep_json = './package.json';
    }
    _pushDependenciesForModuleRecursively(keys, isRootModule);
    return keys;
};


module.exports = function(_base, _dest, _node, _json){
    return gulp.src(listDeps(_node, _json), {base: _base}).pipe(gulp.dest(_dest));
};