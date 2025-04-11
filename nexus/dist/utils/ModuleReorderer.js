"use strict";
exports.__esModule = true;
exports.reorderModules = void 0;
var reorderModules = function (idOrderUnparsed, moduleList) {
    if (idOrderUnparsed === '') { // no order set, return the original list
        return moduleList;
    }
    var idOrder = idOrderUnparsed.split("|");
    var reorderedModules = [];
    var moduleMap = moduleList.reduce(function (map, module) {
        if (map.has(module.getID())) { // duplicate module found, ignore both of them
            console.error("WARNING: Modules with duplicate IDs have been found.");
            console.error("ID: ".concat(module.getID(), " | Registered Module: ").concat(map.get(module.getID()).getName(), " | New Module: ").concat(module.getName()));
            map["delete"](module.getID());
        }
        else {
            map.set(module.getID(), module);
        }
        return map;
    }, new Map());
    for (var _i = 0, idOrder_1 = idOrder; _i < idOrder_1.length; _i++) {
        var moduleID = idOrder_1[_i];
        if (moduleMap.has(moduleID)) {
            reorderedModules.push(moduleMap.get(moduleID));
            moduleMap["delete"](moduleID);
        }
    }
    for (var _a = 0, _b = Array.from(moduleMap.values()); _a < _b.length; _a++) {
        var leftoverModule = _b[_a];
        reorderedModules.push(leftoverModule);
    }
    return reorderedModules;
};
exports.reorderModules = reorderModules;
//# sourceMappingURL=ModuleReorderer.js.map