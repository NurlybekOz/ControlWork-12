
import express from "express";
import {Error, Types} from 'mongoose';
import {imagesUpload} from "../middleware/multer";
import Group from "../modules/Group";
import User from "../modules/User";

const groupRouter = express.Router();

groupRouter.get('/', async (req, res, next) => {
    try {
        const queryUser = req.query.user as string;
        let groups = await Group.find().populate("user", "displayName email");
        if (queryUser) {
            groups = groups.filter(group => new Types.ObjectId(group.user).toString() === queryUser);
        }
        res.send(groups);
    } catch (e) {
        next(e);
    }
});

groupRouter.get('/userGroups', async (req, res, next) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).send({ message: 'UserId is required' });
            return
        }

        const groups = await Group.find({ 'people.user': userId });
        res.status(200).send(groups);
    } catch (error) {
        next(error);
    }
});

groupRouter.get('/:id', async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id).populate("user", "displayName email") .populate({
            path: "people.user",
            select: "displayName email"
        });
        res.send(group);
    } catch (e) {
        next(e);
    }
});


groupRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).send({error: 'No token provided'});
            return;
        }

        const user = await User.findOne({token});

        if (!user) {
            res.status(401).send({error: 'Wrong token'});
            return;
        }


        const newGroup = {
            title: req.body.title,
            user: user,
            description: req.body.description,
            image: req.file ? 'images/' + req.file.filename : null,
            people: [{ user: user._id }],
        }

        const group = new Group(newGroup);
        await group.save();
        res.send(group);
    } catch (error) {
        if (error) {
            if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
                res.status(400).send(error)
                return;
            }
            next(error);
        }
    }
});

groupRouter.patch('/:id/join', async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).send({ message: 'UserId is required' });
            return;
        }

        const group = await Group.findById(req.params.id);
        if (!group) {
            res.status(404).send({ message: 'Group not found' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const userAlreadyInGroup = group.people.some(person => {
            console.log(person, userId, person.user)

            return person?.user?.toString()=== userId
        })

        if (userAlreadyInGroup) {
            res.status(400).send({ message: 'User already in this group' });
            return;
        }
        group.people.push({user});
        await group.save();

        res.status(200).send(group);
    } catch (error) {
        next(error);
    }
});

groupRouter.patch('/:id/leave', async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).send({ message: 'UserId is required' });
            return;
        }

        const group = await Group.findById(req.params.id);
        if (!group) {
            res.status(404).send({ message: 'Group not found' });
            return;
        }

        const userIndex = group.people.findIndex(person => person?.user?.toString() === userId);
        if (userIndex === -1) {
            res.status(400).send({ message: 'User is not a member of this group' });
            return;
        }

        group.people.splice(userIndex, 1);

        await group.save();

        res.status(200).send(group);
    } catch (error) {
        next(error);
    }
});


groupRouter.delete('/:id', async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findById(groupId);
        if (!group) {
             res.status(404).send({ message: 'Group not found' });
            return
        }

        const currentUser = await User.findOne({ token: req.get('Authorization') });
        if (!currentUser || group.user.toString() !== currentUser._id.toString()) {
             res.status(403).send({ message: 'You are not authorized to delete this group' });
            return
        }

        await group.deleteOne();

        res.status(200).send({ message: 'Group deleted successfully' });
    } catch (error) {
        next(error);
    }
});

groupRouter.patch('/:groupId/removeUser', async (req, res, next) => {
    try {
        const { userIdToRemove } = req.body;
        const currentUserToken = req.get('Authorization');
        if (!userIdToRemove) {
            res.status(400).send({ message: 'UserIdToRemove is required' });
            return;
        }

        const group = await Group.findById(req.params.groupId);
        if (!group) {
            res.status(404).send({ message: 'Group not found' });
            return;
        }

        const currentUser = await User.findOne({ token: currentUserToken });
        if (!currentUser || group.user.toString() !== currentUser._id.toString()) {
            res.status(403).send({ message: 'Not authorized' });
            return;
        }

        const index = group.people.findIndex(person => person?.user?.toString() === userIdToRemove);
        if (index === -1) {
            res.status(400).send({ message: 'User not in group' });
            return;
        }

        group.people.splice(index, 1);
        await group.save();

        res.status(200).send(group);
    } catch (error) {
        next(error);
    }
});

export default groupRouter;