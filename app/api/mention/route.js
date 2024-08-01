import prisma from '@/prisma/db/prisma';

export async function GET(req, res) {
    try {
        const query = req.nextUrl.searchParams.get('query');
        if (!query) {
            return res.status(400).json({ error: 'Missing query parameter' });
        }

        const users = await getMentionSuggestions(query);
        console.log(users, "user data");

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching mention suggestions:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function getMentionSuggestions(query) {
    console.log(query);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { fullName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { tag: { contains: query, mode: 'insensitive' } }
            ]
        },
        take: 5,
        select: { id: true, fullName: true, email: true, tag: true }
    });
    console.log(users, "user data");

    return users;
}
