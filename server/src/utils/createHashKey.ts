import crypto from "crypto";

export const createHashKey = (prefix: string, params: any): string => {
    const normalized = JSON.stringify(params, Object.keys(params).sort());
    const hash = crypto.createHash("sha1").update(normalized).digest("hex");
    return `${prefix}:${hash}`;
}