import axios, { AxiosError } from "axios";
import { ExternalServiceError } from "../utils/errors.js";

const DEFAULT_DEVICENR = 956;
const DEFAULT_VERSION = "1.4.2_desktop";
const DEFAULT_LANGUAGE = "PL";

const pkpicPublicHttpClient = axios.create({
    baseURL: "https://api-gateway.intercity.pl/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Origin": "https://www.intercity.pl",
        "Referer": "https://www.intercity.pl/",
        "Accept-Language": "pl-PL,pl;q=0.9",
    }
});
attachInterceptors(pkpicPublicHttpClient);

const pkpicGrmHttpClient = axios.create({
    baseURL: "https://api-gateway.intercity.pl/",
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "pl-PL,pl;q=0.9",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    }
});
attachInterceptors(pkpicGrmHttpClient);

const publicPost = async <T>(endpoint: string, body: any): Promise<T> => {
    const payload = {
      urzadzenieNr: DEFAULT_DEVICENR,
      wersja: DEFAULT_VERSION,
      jezyk: body.jezyk ?? DEFAULT_LANGUAGE,
      ...body,
    };
    const res = await pkpicPublicHttpClient.post<T>(endpoint, payload);
    return res.data;
}
const publicGet = async <T>(url: string): Promise<T> => {
    const res = await pkpicPublicHttpClient.get<T>(url);
    return res.data;
}
const grmGet = async <T>(url: string): Promise<T> => {
    const res = await pkpicGrmHttpClient.get<T>(url);
    return res.data;
}

function mapAxiosError(err: AxiosError): never {
    if (err.response) {
        const status = err.response.status;
        const statusText = err.response.statusText;

        const data = err.response.data;
        let message = `PKPIC returned ${status} ${statusText}`;

        if (typeof data === "string") {
            if (data.includes("<html")) message = `PKPIC returned HTML error page (${status})`;
            else message = `PKPIC returned ${data.slice(0, 200)} (${status})`;
        } else if (typeof data === "object" && data !== null) {
            const maybeError = data as Record<string, unknown>;
            if (Array.isArray(maybeError.bledy) && typeof maybeError.bledy[0] === "string") message = `PKPIC returned bledy[0]: ${maybeError.bledy[0]} (${status})`;
        }

        throw new ExternalServiceError(message);
    }

    if (err.request) throw new ExternalServiceError("PKPIC did not respond or connection failed");

    throw err;
}
function attachInterceptors(client: ReturnType<typeof axios.create>) {
    client.interceptors.response.use(
        res => res,
        err => {
            if (axios.isAxiosError(err)) {
                mapAxiosError(err);
            }
            throw err;
        }
    );
}

export default {publicPost, publicGet, grmGet};