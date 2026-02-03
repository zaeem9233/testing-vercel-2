import { getToken } from '@auth/core/jwt';
import { getContext } from 'hono/context-storage';

export default function CreateAuth() {
    const auth = async () => {
        try {
            const c = getContext();
            if (!c) {
                return null;
            }
            const resolvedAuthUrl =
                process.env.AUTH_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
            const secureCookie =
                process.env.NODE_ENV === 'production' ||
                (resolvedAuthUrl ? resolvedAuthUrl.startsWith('https') : false);
            const token = await getToken({
                req: c.req.raw,
                secret: process.env.AUTH_SECRET,
                secureCookie,
            });
            if (token) {
                return {
                    user: {
                        id: token.sub,
                        email: token.email,
                        name: token.name,
                        image: token.picture,
                    },
                    expires: token.exp.toString(),
                };
            }
        } catch (error) {
            console.error('Auth error:', error);
            return null;
        }
    };
    return {
        auth,
    };
}
