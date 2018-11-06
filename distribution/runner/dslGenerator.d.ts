import { Platform } from "../platforms/platform"
import { DangerDSLJSONType } from "../dsl/DangerDSL"
import { CISource } from "../ci_source/ci_source"
export declare const jsonDSLGenerator: (platform: Platform, source: CISource) => Promise<DangerDSLJSONType>
