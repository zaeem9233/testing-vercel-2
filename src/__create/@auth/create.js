import { getToken } from '@auth/core/jwt';
import { getContext } from 'hono/context-storage';

export default function CreateAuth() {
    const auth = async () => {
        try {
            const c = getContext();
            if (!c) {
                return null;
            }
            const token = await getToken({
                req: c.req.raw,
                secret: process.env.AUTH_SECRET,
                secureCookie: process.env.AUTH_URL?.startsWith('https'),
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
