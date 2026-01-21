import { pathToFileURL } from 'node:url';
import { db } from './connection.ts';
import { users, habits, entries, tags, habitTags } from './schema.ts';

const seed = async () => {
    console.log("🌱 Starting database...");

    try {
        console.log("Clearing existing database...");
        await db.delete(users);
        await db.delete(habits);
        await db.delete(entries);
        await db.delete(tags);
        await db.delete(habitTags);

        console.log("Creating demo users...");
        const [demoUser] = await db
            .insert(users)
            .values({
                email: 'demo@app.com',
                password: 'password',
                username: 'demo',
                firstName: 'demo',
                lastName: 'person'
            })
            .returning();

        console.log("Creating tags...");
        const [healthTag] = await db
            .insert(tags)
            .values({
                name: 'Health',
                color: '#f0f0f0'
            })
            .returning();

        console.log("Creating habits...");
        const [exerciseHabit] = await db
            .insert(habits)
            .values({
                userId: demoUser.id,
                name: "Exercise",
                description: "Daily workout",
                frequency: "Daily",
                targetCount: 1,
            })
            .returning();

        
        await db.insert(habitTags).values({
            habitId: exerciseHabit.id,
            tagId: healthTag.id
        });

        console.log("Adding completion entries...");

        const today = new Date();
        today.setHours(12, 0, 0, 0);

        for (let i = 0; i < 7; ++i) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            await db.insert(entries).values({
                habitId: exerciseHabit.id,
                completionDate: date 
            });
        }

        console.log("✅ Database seeded successfully");
    } catch (e) {
        console.error("❌ Seed failed", e);
        process.exit(1);
    }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    seed()
        .then(() => process.exit(0))
        .catch(e => process.exit(1));
}

export default seed;