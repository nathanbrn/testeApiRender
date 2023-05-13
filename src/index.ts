import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const server = fastify(
    {
        logger: true,
    }
);

server.get('/users', async () => {
    const allUsers = await prisma.user.findMany();

    return { users: allUsers };
});

server.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    });

    const { name, email } = createUserSchema.parse(request.body);

    await prisma.user.create({
        data: {
            name,
            email,
        }
    });

    reply.status(201).send();
    
});

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
}).then(() => {
    console.log('🚀 Server is running on http://localhost:3000');
})
