"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adapter for fast using of Map when possible
 */
var MapAdapter = /** @class */ (function () {
    function MapAdapter() {
        this.map = {};
    }
    MapAdapter.prototype.get = function (key) {
        return this.map[key];
    };
    MapAdapter.prototype.set = function (key, value) {
        this.map[key] = value;
    };
    return MapAdapter;
}());
var tests = new MapAdapter();
var ignores = new MapAdapter();
var TestCase = /** @class */ (function () {
    function TestCase() {
        this.failed = 0;
    }
    TestCase.prototype.run = function () {
        var _this = this;
        var prototype = Object.getPrototypeOf(this);
        var ig = ignores.get(prototype) || [];
        var functions = tests.get(prototype) || [];
        if (ig.length != 0)
            functions = functions.filter(function (value) { return ig.indexOf(value) == -1; });
        console.log("Running " + functions.length + " tests in " + prototype.constructor.name + " " + (ig.length ? " (" + ig.length + " ignored" : ""));
        functions.forEach(function (method) {
            try {
                method.apply(_this);
            }
            catch (e) {
                _this.failed++;
                console.error("Test " + name + " failed. Message: " + e.stack);
            }
        });
        console.log(this.failed + " tests failed");
    };
    return TestCase;
}());
exports.default = TestCase;
function test(target, propertyKey, descriptor) {
    var targetTests = tests.get(target);
    if (targetTests == null) {
        targetTests = [];
        tests.set(target, targetTests);
    }
    targetTests.push(descriptor.value);
}
exports.test = test;
function ignore(target, propertyKey, descriptor) {
    var targetTests = ignores.get(target);
    if (targetTests == null) {
        targetTests = [];
        ignores.set(target, targetTests);
    }
    targetTests.push(descriptor.value);
}
exports.ignore = ignore;
function assertTrue(value) {
    if (!value)
        fail("assertTrue failed");
}
exports.assertTrue = assertTrue;
function assertFalse(value) {
    if (value)
        fail("assertFalse failed");
}
exports.assertFalse = assertFalse;
function assertEquals(expected, actual) {
    if (expected !== actual)
        fail("expected " + expected + ", but was " + actual);
}
exports.assertEquals = assertEquals;
// noinspection JSMethodCanBeStatic
function fail(message) {
    throw new Error(message);
}
exports.fail = fail;
