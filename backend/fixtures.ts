import mongoose from "mongoose";
import config from "./config";
import User from "./modules/User";
import Group from "./modules/Group";


const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('groups');
        await db.dropCollection('users');
    } catch (error) {
        console.log('Collections were not present, skipping drop');
    }

    const john = new User({
        email: "John@gmail.com",
        displayName: "John",
        password: "123",
        role: "user",
    });

    john.generateToken();
    await john.save();

    const jane = new User({
        email: "Jane@gmail.com",
        displayName: "Jane",
        password: "123",
        role: "admin",
    });

    jane.generateToken();
    await jane.save();

    await Group.create(
        {
            user: john,
            title: "Aerobic class",
            image: 'fixtures/aerobic.jpeg',
            description: 'A variety of choreographed dance steps performed to music, focusing on cardio and endurance.',
            people: [{ user: john._id }],
            isPublished: true
        },
        {
            user: jane,
            title: "Yoga class",
            image: 'fixtures/yoga.jpeg',
            description: 'Yoga: A mind-body practice that combines physical postures, breathing techniques, and meditation to improve flexibility, strength, and balance. ',
            people: [{ user: jane._id }],
            isPublished: true
        }
    );


    await db.close();
};

run().catch(console.error);