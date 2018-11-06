"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var GitHubAPI_1 = require("../github/GitHubAPI");
var diffToGitJSONDSL_1 = require("../git/diffToGitJSONDSL");
var gitJSONToGitDSL_1 = require("../git/gitJSONToGitDSL");
var debug_1 = require("../../debug");
var d = debug_1.debug("GitHubGit");
/**
 * Returns the response for the new comment
 *
 * @param {GitHubCommit} ghCommit A GitHub based commit
 * @returns {GitCommit} a Git commit representation without GH metadata
 */
function githubCommitToGitCommit(ghCommit) {
    return {
        sha: ghCommit.sha,
        parents: ghCommit.parents.map(function (p) { return p.sha; }),
        author: ghCommit.commit.author,
        committer: ghCommit.commit.committer,
        message: ghCommit.commit.message,
        tree: ghCommit.commit.tree,
        url: ghCommit.url,
    };
}
function gitDSLForGitHub(api) {
    return __awaiter(this, void 0, void 0, function () {
        var diff, getCommits, commits;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getPullRequestDiff()];
                case 1:
                    diff = _a.sent();
                    return [4 /*yield*/, api.getPullRequestCommits()];
                case 2:
                    getCommits = _a.sent();
                    commits = getCommits.map(githubCommitToGitCommit);
                    return [2 /*return*/, diffToGitJSONDSL_1.diffToGitJSONDSL(diff, commits)];
            }
        });
    });
}
exports.default = gitDSLForGitHub;
exports.gitHubGitDSL = function (github, json, githubAPI) {
    // TODO: Remove the GitHubAPI
    // This is blocked by https://github.com/octokit/node-github/issues/602
    var ghAPI = githubAPI ||
        new GitHubAPI_1.GitHubAPI({ repoSlug: github.pr.base.repo.full_name, pullRequestID: String(github.pr.number) }, process.env["DANGER_GITHUB_API_TOKEN"] || process.env["GITHUB_TOKEN"]);
    if (!githubAPI) {
        d("Got no GH API, had to make it");
    }
    var config = {
        repo: github.pr.head.repo.full_name,
        baseSHA: github.pr.base.sha,
        headSHA: github.pr.head.sha,
        getFileContents: github.utils.fileContents,
        getFullDiff: ghAPI.getPullRequestDiff,
    };
    d("Setting up git DSL with: ", config);
    return gitJSONToGitDSL_1.gitJSONToGitDSL(json, config);
};
exports.emptyGitJSON = function () { return ({
    commits: [],
    created_files: [],
    deleted_files: [],
    modified_files: [],
}); };
//# sourceMappingURL=GitHubGit.js.map