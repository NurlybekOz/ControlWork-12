import express from "express";
import {Error} from "mongoose";
import Group from "../../modules/Group";

const adminGroupRouter = express.Router();


adminGroupRouter.delete('/:id', async (req, res, next) => {

    try {
        const groupId = req.params.id;
        const group = await Group.findOne({_id: groupId})
        if (!group) {
            res.send("Group not found");
        }
        await Group.deleteOne({_id: groupId});
        res.send('Group deleted successfully')
    } catch (e) {
        next(e)
    }

})

adminGroupRouter.patch('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).send({error: 'Group id must be in req params'});
            return;
        }

        const group = await Group.findById(id)

        if (!group) {
            res.status(404).send({error: 'group not found'});
            return;
        }

        if (group.isPublished === true) {
            res.status(400).send({error: 'Group is already published'});
            return
        }

        group.isPublished = !group.isPublished

        await group.save();
        res.send(group);
    } catch (error) {
        if (error instanceof Error.ValidationError  || error instanceof Error.CastError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
})
export default adminGroupRouter;