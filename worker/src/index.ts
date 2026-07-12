export interface Env {
    GITHUB_TOKEN: string;
    TURNSTILE_SECRET_KEY: string;
    GITHUB_OWNER: string;
    GITHUB_REPO: string;
    ISSUE_LABEL?: string;
    ALLOWED_ORIGIN: string;
    RATE_LIMIT_KV?: KVNamespace;
}

const MAX_TITLE_LENGTH = 200;
const MAX_BODY_LENGTH = 4000;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 3;

function corsHeaders(origin: string): HeadersInit {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

function jsonResponse(origin: string, status: number, data: unknown): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    const data = await result.json<{ success: boolean }>();
    return data.success === true;
}

async function isRateLimited(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
    if (!kv) return false;
    const key = `rl:${ip}`;
    const current = parseInt((await kv.get(key)) ?? '0', 10);
    if (current >= RATE_LIMIT_MAX_REQUESTS) return true;
    await kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
    return false;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const origin = env.ALLOWED_ORIGIN;

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders(origin) });
        }

        if (request.method !== 'POST') {
            return jsonResponse(origin, 405, { ok: false, error: 'method_not_allowed' });
        }

        const ip = request.headers.get('cf-connecting-ip');

        if (ip && (await isRateLimited(env.RATE_LIMIT_KV, ip))) {
            return jsonResponse(origin, 429, { ok: false, error: 'rate_limited' });
        }

        let payload: { title?: unknown; body?: unknown; turnstileToken?: unknown };
        try {
            payload = await request.json();
        } catch {
            return jsonResponse(origin, 400, { ok: false, error: 'invalid_json' });
        }

        const title = typeof payload.title === 'string' ? payload.title.trim().slice(0, MAX_TITLE_LENGTH) : '';
        const body = typeof payload.body === 'string' ? payload.body.trim().slice(0, MAX_BODY_LENGTH) : '';
        const turnstileToken = typeof payload.turnstileToken === 'string' ? payload.turnstileToken : '';

        if (!title || !body || !turnstileToken) {
            return jsonResponse(origin, 400, { ok: false, error: 'missing_fields' });
        }

        const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
        if (!verified) {
            return jsonResponse(origin, 403, { ok: false, error: 'captcha_failed' });
        }

        const issueResponse = await fetch(
            `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github+json',
                    'User-Agent': 'block-dodge-parry-srd-report-widget',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    body,
                    labels: env.ISSUE_LABEL ? [env.ISSUE_LABEL] : undefined,
                }),
            }
        );

        if (!issueResponse.ok) {
            return jsonResponse(origin, 502, { ok: false, error: 'github_error' });
        }

        const issue = await issueResponse.json<{ html_url: string }>();

        return jsonResponse(origin, 201, { ok: true, issueUrl: issue.html_url });
    },
};
