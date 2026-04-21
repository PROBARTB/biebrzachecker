import axios from "axios";

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
const pkpicGrmHttpClient = axios.create({
    baseURL: "https://api-gateway.intercity.pl/",
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "pl-PL,pl;q=0.9",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    }
})

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
export default {publicPost, publicGet, grmGet};