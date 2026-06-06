// pages/api/protected-route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserSession } from '@/lib/getUserSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUserSession();
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // User is authenticated, proceed with your logic.
    res.status(200).json({ message: 'Access granted', userId: user.uid });
}