import { DangerResults } from "../../dsl/DangerResults"
export declare const dangerIDToString: (id: string) => string
export declare const fileLineToString: (file: string, line: number) => string
/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
export declare const dangerSignaturePostfix: string
/**
 * Comment to add when updating the PR status when issues are found
 */
export declare const messageForResultWithIssues: string
/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
export declare function template(dangerID: string, results: DangerResults): string
export declare function inlineTemplate(dangerID: string, results: DangerResults, file: string, line: number): string
