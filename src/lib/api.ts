/**
 * Central API helper for the landing page.
 *
 * Single source of truth for the backend base URL with a safe production
 * fallback, plus fetch with timeout (AbortController) and one retry for
 * idempotent requests. All public pages should use this instead of building
 * `process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000"` inline.
 */

const RAILWAY_API = 'https://dever-backend-production.up.railway.app';
const LOCAL_API = 'http://localhost:5000';

export const getApiServer = (): string => {
    const env = process.env.NEXT_PUBLIC_API_SERVER;
    if (env && env.trim()) {
        return env.trim();
    }
    // Production builds missing the env var must never call localhost.
    if (typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1)/.test(window.location.hostname)) {
        return RAILWAY_API;
    }
    return LOCAL_API;
};

export class ApiError extends Error {
    status?: number;
    url: string;
    constructor(message: string, url: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.url = url;
        this.status = status;
    }
}

type ApiFetchOptions = {
    /** Abort timeout per attempt. Default 8000ms. */
    timeoutMs?: number;
    /** Extra retries after the first attempt (idempotent GET/HEAD only). Default 1. */
    retries?: number;
    /** Delay between attempts. Default 400ms. */
    retryDelayMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiFetch(
    path: string,
    init: RequestInit = {},
    options: ApiFetchOptions = {},
): Promise<Response> {
    const { timeoutMs = 8000, retries = 1, retryDelayMs = 400 } = options;
    const url = /^https?:\/\//i.test(path) ? path : `${getApiServer()}${path}`;
    const method = (init.method || 'GET').toUpperCase();
    const idempotent = method === 'GET' || method === 'HEAD';
    const attempts = idempotent ? retries + 1 : 1;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...init, signal: controller.signal });
            // Retry server errors on later attempts; surface client errors immediately.
            if (response.status >= 500 && attempt < attempts - 1) {
                await sleep(retryDelayMs);
                continue;
            }
            return response;
        } catch (error) {
            lastError = error;
            if (attempt < attempts - 1) {
                await sleep(retryDelayMs);
                continue;
            }
            const reason = error instanceof Error && error.name === 'AbortError' ? 'timed out' : 'failed to reach';
            throw new ApiError(`Request ${reason}: ${url}`, url);
        } finally {
            clearTimeout(timer);
        }
    }
    throw lastError instanceof Error ? lastError : new ApiError(`Request failed: ${url}`, url);
}

/** GET JSON with timeout+retry. Throws ApiError when the status is not ok. */
export async function fetchJson<T>(path: string, init: RequestInit = {}, options: ApiFetchOptions = {}): Promise<T> {
    const response = await apiFetch(path, init, options);
    if (!response.ok) {
        throw new ApiError(`Request failed with status ${response.status}: ${response.url}`, response.url, response.status);
    }
    return (await response.json()) as T;
}
