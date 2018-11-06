"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var voca_1 = __importDefault(require("voca"));
var Violation_1 = require("../../dsl/Violation");
/**
 * Converts a set of violations into a HTML table
 *
 * @param {string} name User facing title of table
 * @param {string} emoji Emoji name to show next to each item
 * @param {Violation[]} violations for table
 * @returns {string} HTML
 */
function table(name, emoji, violations) {
    if (violations.length === 0 || violations.every(function (violation) { return !violation.message; })) {
        return "";
    }
    return "\n<table>\n  <thead>\n    <tr>\n      <th width=\"50\"></th>\n      <th width=\"100%\" data-danger-table=\"true\">" + name + "</th>\n    </tr>\n  </thead>\n  <tbody>" + violations
        .map(function (v) {
        var message = Violation_1.isInline(v) ? "**" + v.file + "#L" + v.line + "** - " + v.message : v.message;
        return "<tr>\n      <td>:" + emoji + ":</td>\n      <td>" + message + "</td>\n    </tr>\n  ";
    })
        .join("\n") + "</tbody>\n</table>\n";
}
function getSummary(label, violations) {
    return violations
        .map(function (x) { return voca_1.default.truncate(x.message, 20); })
        .reduce(function (acc, value, idx) { return acc + " " + value + (idx === violations.length - 1 ? "" : ","); }, violations.length + " " + label + ": ");
}
function buildSummaryMessage(dangerID, results) {
    var fails = results.fails, warnings = results.warnings, messages = results.messages, markdowns = results.markdowns;
    var summary = "  " + getSummary("failure", fails) + "\n  " + getSummary("warning", warnings) + "\n  " + (messages.length > 0 ? messages.length + " messages" : "") + "\n  " + (markdowns.length > 0 ? markdowns.length + " markdown notices" : "") + "\n  " + exports.dangerIDToString(dangerID);
    return summary;
}
exports.dangerIDToString = function (id) { return "DangerID: danger-id-" + id + ";"; };
exports.fileLineToString = function (file, line) { return "  File: " + file + ";\n  Line: " + line + ";"; };
/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
exports.dangerSignaturePostfix = "Generated by :no_entry_sign: <a href=\"http://github.com/danger/danger-js/\">dangerJS</a>";
/**
 * Comment to add when updating the PR status when issues are found
 */
exports.messageForResultWithIssues = ":warning: Danger found some issues. Don't worry, everything is fixable.";
/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
function template(dangerID, results) {
    return "\n<!--\n" + buildSummaryMessage(dangerID, results) + "\n-->\n" + table("Fails", "no_entry_sign", results.fails) + "\n" + table("Warnings", "warning", results.warnings) + "\n" + table("Messages", "book", results.messages) + "\n" + results.markdowns.map(function (v) { return v.message; }).join("\n\n") + "\n<p align=\"right\">\n  " + exports.dangerSignaturePostfix + "\n</p>\n";
}
exports.template = template;
function inlineTemplate(dangerID, results, file, line) {
    var printViolation = function (emoji) { return function (violation) {
        return "- :" + emoji + ": " + violation.message;
    }; };
    return "\n<!--\n" + buildSummaryMessage(dangerID, results) + "\n" + exports.fileLineToString(file, line) + "\n-->\n" + results.fails.map(printViolation("no_entry_sign")).join("\n") + "\n" + results.warnings.map(printViolation("warning")).join("\n") + "\n" + results.messages.map(printViolation("book")).join("\n") + "\n" + results.markdowns.map(function (v) { return v.message; }).join("\n\n") + "\n  ";
}
exports.inlineTemplate = inlineTemplate;
//# sourceMappingURL=githubIssueTemplate.js.map