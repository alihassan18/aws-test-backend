import {
    BadRequestException,
    // Inject,
    Injectable,
    NotFoundException
    // forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Group } from './entities/group.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { Invitation } from './entities/invitation.entity';
// import { PublicChatGateway } from '../gateways/public/public-chat.gateway';
import { PrivateChatGateway } from '../gateways/private/private-chat.gateway';
import {
    CreateGroupMessageInput,
    CreatePrivateMessageInput
} from './dto/create-chat.input';
import { User } from '../users/entities/user.entity';
import { GroupPrivacyInput, GroupSettingInput } from './dto/update-group.input';
import { extractMentionsAndHashtags } from 'src/helpers/common.helpers';
import { HashtagsService } from '../feeds/hashtags.service';
import { Chat } from './entities/chat.entity';
import { MessagePrivacy } from 'src/enums/messageprivacy.enum';

type Typing = {
    sender: string;
    firstName: string;
};

interface TypingStatus {
    [id: string]: Typing[];
}

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        @InjectModel(Group.name) private groupModel: Model<Group>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Invitation.name)
        private invitationModel: Model<Invitation>,
        // @Inject(forwardRef(() => PublicChatGateway))
        public hashtagsService: HashtagsService,
        // private publicChatGateway: PublicChatGateway,
        private privateChatGateway: PrivateChatGateway
    ) {}

    private typingStatus: TypingStatus = {};
    // Message-related methods

    async createMessage(createMessageData: Partial<Message>): Promise<Message> {
        const message = new this.messageModel(createMessageData);
        return await message.save();
    }

    async findAllMessages(): Promise<Message[]> {
        return await this.messageModel.find().exec();
    }

    async findMessage(id: string): Promise<Message> {
        return await this.messageModel.findById(id).exec();
    }

    async findByUserOrGroup(
        userId: string,
        groupId: string
    ): Promise<Message[]> {
        return await this.messageModel
            .find({
                $or: [{ receiverUser: userId }, { receiverGroup: groupId }]
            })
            .populate('sender')
            .exec();
    }

    async updateMessageStatus(
        id: string,
        status: {
            pinned?: boolean;
            sent?: boolean;
            delivered?: boolean;
            read?: boolean;
        }
    ): Promise<Message> {
        const message = await this.messageModel
            .findByIdAndUpdate(id, { $set: { ...status } }, { new: true })
            .exec();
        this.handleEmitMessageUpdated(message);
        return message;
    }

    async deleteMessage(
        id: string,
        userId: Types.ObjectId,
        toAll: boolean
    ): Promise<Message> {
        const message = await this.messageModel.findById(id).exec();

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        if (!toAll) {
            message.hiddenUsers.push(userId);
            await message.save();
            this.privateChatGateway.emitMessageDeleted(
                userId.toString(),
                message._id.toString()
            );
            return message;
        }
        await this.messageModel.findByIdAndDelete(id).exec();
        const { receiverGroup } = message;
        if (receiverGroup) {
            const group = await this.groupModel
                .findById(message.receiverGroup)
                .exec();
            for (let i = 0; i < group.admins.length; i++) {
                this.privateChatGateway.emitMessageDeleted(
                    group.admins[i].toString(),
                    message._id.toString()
                );
            }
            for (let i = 0; i < group.members.length; i++) {
                this.privateChatGateway.emitMessageDeleted(
                    group.members[i].member.toString(),
                    message._id.toString()
                );
            }
        } else {
            this.privateChatGateway.emitMessageDeleted(
                message.sender.toString(),
                message._id.toString()
            );
            this.privateChatGateway.emitMessageDeleted(
                message.receiverUser.toString(),
                message._id.toString()
            );
        }
        return message;
    }

    // Group-related methods

    async createGroup(createGroupData: Partial<Group>): Promise<Group> {
        const group = new this.groupModel(createGroupData);
        group.admins.push(createGroupData?.createdBy);
        this.privateChatGateway.emitGroupUpdated(
            createGroupData?.createdBy.toString(),
            { group, message: 'New group is created successfully.' }
        );
        return await group.save();
    }

    async updateGroupSetting(
        userId: Types.ObjectId,
        groupId: string,
        setting: GroupSettingInput
    ): Promise<Group> {
        const group = await this.groupModel.findById(groupId);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        if (!group.admins.includes(userId)) {
            throw new BadRequestException(
                'You are not the admin of this group.'
            );
        }
        group.setting = setting;
        await group.save();

        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i].toString(),
                { group, message: 'Group setting is updated.' }
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                { group, message: 'Group setting is updated.' }
            );
        }
        return group;
    }

    async updateGroupPrivacy(
        userId: Types.ObjectId,
        groupId: string,
        privacy: GroupPrivacyInput
    ): Promise<Group> {
        const group = await this.groupModel.findById(groupId);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        if (!group.admins.includes(userId)) {
            throw new BadRequestException(
                'You are not the admin of this group.'
            );
        }
        group.privacy = privacy;
        await group.save();

        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i].toString(),
                { group, message: 'Group privacy is updated.' }
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                { group, message: 'Group privacy is updated.' }
            );
        }
        return group;
    }

    async findAllGroups(userId: Types.ObjectId): Promise<Group[]> {
        const groups = await this.groupModel.find({
            $or: [
                {
                    members: { $elemMatch: { member: userId } }
                },
                {
                    admins: { $elemMatch: { $eq: userId } }
                }
            ]
        });

        // if (!groups || groups.length === 0) {
        //     throw new NotFoundException('No groups found for this user');
        // }

        return groups;
    }

    async findGroup(id: Types.ObjectId): Promise<Group> {
        return await this.groupModel.findById(id).exec();
    }

    async findUserGroup(
        groupId: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<Group> {
        const group = await this.groupModel.findById(groupId).exec();

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        // Check if the user is already a member
        if (
            !group.members.some((entry) => entry.member.equals(userId)) &&
            !group.admins.some((entry) => entry.equals(userId))
        ) {
            throw new BadRequestException('User is not a member of the group');
        }
        return group;
    }

    async updateGroup(
        from: Types.ObjectId,
        id: string,
        updateGroupData: Partial<Group>
    ): Promise<Group> {
        let group = await this.groupModel.findById(id);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        if (!group.admins.includes(from)) {
            throw new BadRequestException(
                'You are not the admin of this group.'
            );
        }
        group.name = updateGroupData.name;
        group.description = updateGroupData.description;
        group.avatar = updateGroupData.avatar;
        await group.save();

        group = await group.populate({
            path: 'admins',
            model: 'User',
            select: '_id'
        });
        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i]._id.toString(),
                { group, message: 'Group information is updated.' }
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                { group, message: 'Group information is updated.' }
            );
        }
        return group;
    }

    async joinGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
        return await this.groupModel
            .findByIdAndUpdate(
                groupId,
                { $addToSet: { members: userId } },
                { new: true }
            )
            .exec();
    }

    async addNewMember(
        groupId: string,
        userId: Types.ObjectId,
        addedBy: Types.ObjectId
    ): Promise<Group> {
        const group = await this.groupModel.findById(groupId).exec();

        if (!group) {
            throw new NotFoundException('Group not found');
        }
        if (!group.admins.includes(addedBy)) {
            throw new BadRequestException(
                'You are not the admin of this group.'
            );
        }
        // Check if the user is already a member
        if (group.members.some((entry) => entry.member.equals(userId))) {
            throw new BadRequestException(
                'User is already a member of the group'
            );
        }
        group.members.push({ member: userId, addedBy });
        await group.save();

        return group;
    }

    async findAllInvitations(userId: Types.ObjectId): Promise<Invitation[]> {
        const invitations = await this.invitationModel.find({
            to: userId
        });

        if (!invitations) {
            throw new NotFoundException('No invitations found for this user');
        }

        return invitations;
    }

    async inviteMember(
        from: Types.ObjectId,
        to: Types.ObjectId,
        groupId?: Types.ObjectId,
        type?: string
    ): Promise<Invitation> {
        let invitation, data;
        if (groupId) {
            const group = await this.groupModel.findById(groupId).exec();

            const existed = await this.invitationModel
                .findOne({ from, to, groupId })
                .exec();
            if (existed) {
                throw new NotFoundException(
                    'This user was already invited to the group.'
                );
            }
            if (!group) {
                throw new NotFoundException('Group not found');
            }

            if (!group.admins.includes(from)) {
                throw new BadRequestException(
                    'You are not the admin of this group.'
                );
            }

            invitation = new this.invitationModel({
                from,
                to,
                groupId
            });
            data = await invitation.populate({
                path: 'from',
                select: '_id firstName lastName userName avatar isVerified'
            });
            data = await data.populate({
                path: 'groupId',
                select: '_id name'
            });
        } else {
            const existed = await this.invitationModel
                .findOne({ from, to, type })
                .exec();
            if (existed) {
                throw new NotFoundException('You already sent the request.');
            }

            invitation = new this.invitationModel({
                from,
                to,
                type
            });
            data = await invitation.populate({
                path: 'from',
                select: '_id firstName lastName userName avatar isVerified'
            });
        }

        this.privateChatGateway.emitGetInvitation(to?.toString(), data);
        return await invitation.save();
    }

    async acceptInvitation(
        invitationId: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<Invitation> {
        const invitation = await this.invitationModel
            .findById(invitationId)
            .exec();
        const from = await this.userModel.findById(invitation.from);
        const to = await this.userModel.findById(invitation.to);
        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (!invitation.to.equals(userId)) {
            throw new BadRequestException(
                'This invitation is invalid for you.'
            );
        }

        if (invitation.type === 'private') {
            const message = new this.messageModel({
                sender: invitation.from,
                receiverUser: invitation.to,
                content: `${from.userName} accepted the request.`,
                type: 'event'
            });
            await message.save();
            let chat = new this.chatModel({
                user1: from._id,
                user2: to._id,
                messagesCount: 0
            });
            chat = await chat.populate({
                path: 'lastMessage',
                select: '_id content sender attachment createdAt delivered',
                populate: [
                    {
                        path: 'sender',
                        select: '_id userName'
                    }
                ]
            });
            chat = await chat.populate({
                path: 'user1',
                select: '_id firstName lastName userName avatar isVerified'
            });
            chat = await chat.populate({
                path: 'user2',
                select: '_id firstName lastName userName avatar isVerified'
            });
            this.privateChatGateway.emitChatUpdated(from._id.toString(), {
                chat,
                message: 'New chat is created successfully.'
            });
            this.privateChatGateway.emitChatUpdated(to._id.toString(), {
                chat,
                message: 'New chat is created successfully.'
            });
        } else {
            const message = new this.messageModel({
                sender: userId,
                receiverGroup: invitation.groupId,
                content: `${to.userName} joined the group by ${from.userName}`,
                type: 'event'
            });
            await message.save();
            const group = await this.addNewMember(
                invitation.groupId.toString(),
                userId,
                invitation.from
            );
            for (let i = 0; i < group.admins.length; i++) {
                this.privateChatGateway.emitGroupUpdated(
                    group.admins[i].toString(),
                    {
                        group,
                        message: `${to.firstName}  ${from.firstName}.`
                    }
                );
                this.privateChatGateway.emitGroupMessage(
                    group.admins[i].toString(),
                    message
                );
            }
            for (let i = 0; i < group.members.length; i++) {
                this.privateChatGateway.emitGroupUpdated(
                    group.members[i].member.toString(),
                    {
                        group,
                        message: `${to.userName} was invited by ${from.userName}.`
                    }
                );
                this.privateChatGateway.emitGroupMessage(
                    group.members[i].member.toString(),
                    message
                );
            }
            // this.privateChatGateway.emitAcceptInvitation(
            //     invitation.from.toString(),
            //     userId.toString()
            // );
        }
        await this.invitationModel.findByIdAndDelete(invitationId);

        return invitation;
    }

    async rejectInvitation(
        invitationId: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<Invitation> {
        const invitation = await this.invitationModel
            .findById(invitationId)
            .exec();

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (!invitation.to.equals(userId)) {
            throw new BadRequestException(
                'This invitation is invalid for you.'
            );
        }

        await this.invitationModel.findByIdAndDelete(invitationId);

        return invitation;
    }

    async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
        const group = await this.groupModel.findById(groupId);
        const user = await this.userModel.findById(userId);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        // Check if the user is a member of the group
        const memberIndex = group.members.findIndex((entry) =>
            entry.member.equals(userId)
        );
        const adminIndex = group.admins.findIndex((entry) =>
            entry.equals(userId)
        );
        if (memberIndex === -1 && adminIndex === -1) {
            throw new BadRequestException('User is not a member of the group');
        }

        // Remove the user from the group
        if (adminIndex === -1) {
            group.members.splice(memberIndex, 1);
        } else {
            group.admins.splice(adminIndex, 1);
        }
        await group.save();

        const message = new this.messageModel({
            sender: userId,
            receiverGroup: group._id,
            content: `${user.userName} left the group.`,
            type: 'event'
        });
        await message.save();
        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i].toString(),
                {
                    group,
                    message: `${user.firstName} ${user.lastName} left the ${group.name} group.`
                }
            );
            this.privateChatGateway.emitGroupMessage(
                group.admins[i].toString(),
                message
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                {
                    group,
                    message: `${user.firstName} ${user.lastName} left the ${group.name} group.`
                }
            );
            this.privateChatGateway.emitGroupMessage(
                group.members[i].member.toString(),
                message
            );
        }
        this.privateChatGateway.emitLeaveGroup(userId.toString(), groupId);
        return group;
    }

    async makeRemoveAdminUser(
        groupId: string,
        userId: Types.ObjectId,
        adminId: Types.ObjectId
    ): Promise<Group> {
        const group = await this.groupModel.findById(groupId);
        const user = await this.userModel.findById(userId);
        const admin = await this.userModel.findById(adminId);
        let message = '';
        if (!group) {
            throw new NotFoundException('Group not found');
        }
        if (!group.admins.includes(adminId)) {
            throw new BadRequestException(
                'You are not the admin of this group. Only admin can make/remove a admin.'
            );
        }
        // Check if the user is a member of the group
        const memberIndex = group.members.findIndex((entry) =>
            entry.member.equals(userId)
        );
        const adminIndex = group.admins.findIndex((entry) =>
            entry.equals(userId)
        );
        if (memberIndex === -1 && adminIndex === -1) {
            throw new BadRequestException('User is not a member of the group');
        }

        // Remove the user from the group
        if (adminIndex === -1) {
            group.admins.push(userId);
            group.members.splice(memberIndex, 1);
            message = `${admin.userName} made ${user.userName} an admin.`;
        } else {
            group.members.push({ member: userId, addedBy: adminId });
            group.admins.splice(adminIndex, 1);
            message = `${admin.userName} removed ${user.userName} an admin.`;
        }
        await group.save();

        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i].toString(),
                {
                    group,
                    message
                }
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                {
                    group,
                    message
                }
            );
        }

        return group;
    }

    async deleteGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
        const group = await this.groupModel.findById(groupId);

        const user = await this.userModel.findById(userId);
        if (!group) {
            throw new NotFoundException('Group not found');
        }

        // Check if the user is an admin of the group
        const isAdmin = group.admins.some((admin) => admin.equals(userId));
        if (!isAdmin) {
            throw new BadRequestException(
                'You do not have permission to delete the group'
            );
        }

        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitCloseGroup(group.admins[i].toString(), {
                groupId: group._id,
                message: `${user.firstName} closed ${group.name} group.`
            });
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitCloseGroup(
                group.members[i].member.toString(),
                {
                    groupId: group._id,
                    message: `${user.firstName} closed ${group.name} group.`
                }
            );
        }
        // Delete the group
        await this.groupModel.deleteOne({ _id: groupId });

        return group;
    }

    async findAllGroupMessages(
        userId: Types.ObjectId,
        groupId: string,
        cursor?: Types.ObjectId,
        limit = 10
    ): Promise<{
        records: MessageDocument[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        totalMessagesCount: number;
    }> {
        const group = await this.groupModel.findById(groupId).exec();

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        const isMember = group.members.some(
            (member) => member.member.toString() === userId.toString()
        );

        const isAdmin = group.admins.some(
            (admin) => admin.toString() == userId.toString()
        );
        if (!isMember && !isAdmin) {
            throw new NotFoundException('User is not a member of the group');
        }

        const query = cursor
            ? {
                  receiverGroup: new Types.ObjectId(groupId),
                  _id: { $lt: cursor },
                  hiddenUsers: {
                      $not: {
                          $elemMatch: {
                              $eq: userId
                          }
                      }
                  }
              }
            : {
                  receiverGroup: new Types.ObjectId(groupId),
                  hiddenUsers: {
                      $not: {
                          $elemMatch: {
                              $eq: userId
                          }
                      }
                  }
              };

        const messages = await this.messageModel
            .aggregate([
                {
                    $match: query
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'reactions',
                        localField: '_id',
                        foreignField: 'message',
                        as: 'emotions'
                    }
                },
                {
                    $unset: [
                        'emotions._id',
                        'emotions.post',
                        'emotions.message',
                        'emotions.createdAt',
                        'emotions.updatedAt'
                    ]
                }
            ])
            .exec();
        const hasNextPage = messages.length === limit;
        const totalMessagesCount = await this.messageModel.count(query);
        const endCursor = hasNextPage
            ? messages[messages.length - 1]._id.toString()
            : null;

        this.setGroupMessagesSeen(groupId, messages, userId);
        return {
            records: messages.reverse(),
            pageInfo: {
                hasNextPage,
                endCursor
            },
            totalMessagesCount
        };
    }
    async setGroupMessagesSeen(
        groupId: string,
        messages: Message[],
        viewer: Types.ObjectId
    ) {
        for (let i = 0; i < messages.length; i++) {
            if (!messages[i].seenUsers.includes(viewer)) {
                await this.messageModel.findByIdAndUpdate(
                    messages[i]._id,
                    {
                        $push: { seenUsers: viewer }
                    },
                    { new: true }
                );
            }
        }
        const unseenMsgCount = await this.getUnseenMsgCount(
            true,
            groupId,
            viewer
        );
        this.privateChatGateway.emitMessageSeen(viewer.toString(), {
            groupId: groupId,
            count: unseenMsgCount
        });
    }
    async removeMemberFromGroup(
        groupId: string,
        userId: string,
        removedBy: Types.ObjectId
    ): Promise<Group> {
        const group = await this.groupModel.findById(groupId);
        const user = await this.userModel.findById(userId);
        const remover = await this.userModel.findById(removedBy);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        // Check if the user is a member of the group
        const memberIndex = group.members.findIndex((entry) =>
            entry.member.equals(userId)
        );
        const adminIndex = group.admins.findIndex((entry) =>
            entry.equals(userId)
        );
        if (memberIndex === -1 && adminIndex === -1) {
            throw new BadRequestException('User is not a member of the group');
        }

        // Optional: Check if the user who is removing the member has permission to do so (e.g., group admin)
        if (!group.admins.some((admin) => admin.equals(removedBy))) {
            throw new BadRequestException(
                'You do not have permission to remove a member from the group'
            );
        }

        // Remove the member from the group
        group.members.splice(memberIndex, 1);
        const message = new this.messageModel({
            sender: remover._id,
            receiverGroup: group._id,
            content: `${remover.userName} removed ${user.userName} in the group.`,
            type: 'event'
        });
        await message.save();
        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i].toString(),
                {
                    group,
                    message: `${user.userName} was removed by ${remover.userName}.`
                }
            );
            this.privateChatGateway.emitGroupMessage(
                group.admins[i].toString(),
                message
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                {
                    group,
                    message: `${user.userName} was removed by ${remover.userName}.`
                }
            );
            this.privateChatGateway.emitGroupMessage(
                group.members[i].member.toString(),
                message
            );
        }
        this.privateChatGateway.emitRemoveUserFromGroup(userId, groupId);
        await group.save();

        return group;
    }

    async findAllPrivateMessages(
        userId1: Types.ObjectId,
        userId2: Types.ObjectId,
        cursor?: Types.ObjectId,
        limit = 10
    ): Promise<{
        records: MessageDocument[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        totalMessagesCount: number;
    }> {
        const query = cursor
            ? {
                  _id: { $lt: cursor }
              }
            : {};
        const messages = await this.messageModel
            .aggregate([
                {
                    $match: {
                        $or: [
                            { sender: userId1, receiverUser: userId2 },
                            { sender: userId2, receiverUser: userId1 }
                        ],
                        ...query,
                        hiddenUsers: {
                            $not: {
                                $elemMatch: {
                                    $eq: userId1
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'reactions',
                        localField: '_id',
                        foreignField: 'message',
                        as: 'emotions'
                    }
                },
                {
                    $unset: [
                        'emotions._id',
                        'emotions.post',
                        'emotions.message',
                        'emotions.createdAt',
                        'emotions.updatedAt'
                    ]
                }
            ])
            .exec();

        const hasNextPage = messages.length === limit;
        const totalMessagesCount = await this.messageModel.count(query);
        const endCursor = hasNextPage
            ? messages[messages.length - 1]._id.toString()
            : null;

        this.setPrivateMessagesSeen(messages[0].chatId, messages, userId1);
        return {
            records: messages.reverse(),
            pageInfo: {
                hasNextPage,
                endCursor
            },
            totalMessagesCount
        };
    }

    async setPrivateMessagesSeen(
        chatId: string,
        messages: Message[],
        viewer: Types.ObjectId
    ) {
        for (let i = 0; i < messages.length; i++) {
            if (!messages[i].sent && messages[i].sender !== viewer) {
                await this.messageModel.findByIdAndUpdate(
                    messages[i]._id,
                    {
                        $set: { sent: true }
                    },
                    { new: true }
                );
            }
        }
        const unseenMsgCount = await this.getUnseenMsgCount(
            true,
            chatId,
            viewer
        );
        this.privateChatGateway.emitMessageSeen(viewer.toString(), {
            chatId,
            count: unseenMsgCount
        });
    }
    async findAllSupportMessages(userId1: Types.ObjectId): Promise<Message[]> {
        const messages = await this.messageModel
            .aggregate([
                {
                    $match: {
                        sender: userId1,
                        type: 'support',
                        hiddenUsers: {
                            $not: {
                                $elemMatch: {
                                    $eq: userId1
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: 10
                }
            ])
            .exec();
        return messages.reverse();
    }
    async deleteChat(
        user1: Types.ObjectId,
        user2: Types.ObjectId,
        toAll: boolean
    ): Promise<boolean> {
        const chat = await this.chatModel
            .findOne({
                $or: [
                    {
                        user1,
                        user2
                    },
                    {
                        user1: user2,
                        user2: user1
                    }
                ]
            })
            .exec();
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }
        if (!toAll) {
            await this.messageModel.updateMany(
                { chatId: chat._id },
                { $push: { hiddenUsers: user2 } }
            );
        } else {
            await this.messageModel.deleteMany({ chatId: chat._id });
            await this.chatModel.findByIdAndDelete(chat._id);
            this.privateChatGateway.emitChatDeleted(
                user1.toString(),
                chat._id.toString()
            );
        }
        this.privateChatGateway.emitChatDeleted(
            user2.toString(),
            chat._id.toString()
        );
        return true;
    }

    async findAllChats(userId1: Types.ObjectId): Promise<Chat[]> {
        return await this.chatModel
            .find({
                $or: [{ user1: userId1 }, { user2: userId1 }]
            })
            .sort({ updatedAt: -1 })
            .exec();
    }

    async handleEmitGroupUpdated(group: Group, message?: string) {
        for (let i = 0; i < group.admins.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.admins[i].toString(),
                { group, message: message || 'Group is updated.' }
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            this.privateChatGateway.emitGroupUpdated(
                group.members[i].member.toString(),
                { group, message: message || 'Group is updated.' }
            );
        }
    }

    async createGroupMessage(
        sender: Types.ObjectId,
        createGroupMessageInput: CreateGroupMessageInput
    ): Promise<Message> {
        let message: Message;
        const { content, attachment, createdAt } = createGroupMessageInput;
        const { hashtags } = extractMentionsAndHashtags(content);
        if (hashtags?.length > 0) {
            await this.hashtagsService.findOrCreateMany(
                hashtags.map((item) => item.tag)
            );
        }
        if (createGroupMessageInput._id) {
            message = await this.messageModel.findById(
                createGroupMessageInput._id
            );
            message.content = content;
            message.edited = true;
            // if (attachment) {
            //     message.attacontentchment = attachment;
            // }
        } else {
            const receiverGroup = new Types.ObjectId(
                createGroupMessageInput.receiverGroup
            );
            const inReplyToMessage = createGroupMessageInput.inReplyToMessage
                ? new Types.ObjectId(createGroupMessageInput.inReplyToMessage)
                : null;
            message = new this.messageModel({
                sender,
                receiverGroup,
                content: content ? content : '',
                inReplyToMessage,
                attachment: attachment ? attachment : null,
                type: 'group',
                createdAt
            });
        }
        await message.save();

        let group = await this.groupModel.findById(message.receiverGroup);

        group.lastMessage = new Types.ObjectId(message._id);
        await group.save();
        group = await group.populate({
            path: 'lastMessage',
            select: '_id content attachment updatedAt sender',
            populate: [
                {
                    path: 'sender',
                    select: '_id userName'
                }
            ]
        });
        // this.handleEmitGroupUpdated(group, 'newMessage');
        await this.handleEmitMessageUpdated(message);
        return message;
    }
    async handleEmitMessageUpdated(message: Message) {
        let data: Message = await message.populate({
            path: 'sender',
            select: '_id firstName lastName userName avatar isVerified'
        });
        const reactions = await this.reactionModel
            .find({ message: new Types.ObjectId(message._id) })
            .exec();
        const promiseReactions = reactions.map((reaction) => {
            data.emotions = [
                ...data.emotions,
                {
                    user: reaction.user,
                    emoji: reaction.emoji,
                    messageId: new Types.ObjectId(message._id)
                }
            ];
        });
        await Promise.all(promiseReactions);
        data = await data.populate({
            path: 'emotions.user',
            model: 'User',
            select: '_id firstName lastName userName avatar isVerified'
        });
        if (message.inReplyToMessage) {
            data = await data.populate({
                path: 'inReplyToMessage',
                populate: [
                    {
                        path: 'sender',
                        select: '_id firstName lastName userName avatar isVerified'
                    }
                ]
            });
        }
        if (message.type === 'private') {
            this.privateChatGateway.emitPrivateMessage(
                message.receiverUser.toString(),
                data
            );
            this.privateChatGateway.emitPrivateMessage(
                message.sender._id.toString(),
                data
            );
        } else {
            const group = await this.groupModel
                .findById(message.receiverGroup)
                .exec();
            for (let i = 0; i < group.admins.length; i++) {
                this.privateChatGateway.emitGroupMessage(
                    group.admins[i].toString(),
                    data
                );
            }
            for (let i = 0; i < group.members.length; i++) {
                this.privateChatGateway.emitGroupMessage(
                    group.members[i].member.toString(),
                    data
                );
            }
        }
        return data;
    }
    async handleEmitChatUpdated(chatId: string) {
        let chat = await this.chatModel.findById(chatId);
        chat = await chat.populate({
            path: 'lastMessage',
            select: '_id content sender attachment createdAt delivered',
            populate: [
                {
                    path: 'sender',
                    select: '_id userName'
                }
            ]
        });
        chat = await chat.populate({
            path: 'user1',
            select: '_id firstName lastName userName avatar isVerified'
        });
        chat = await chat.populate({
            path: 'user2',
            select: '_id firstName lastName userName avatar isVerified'
        });
        this.privateChatGateway.emitChatUpdated(chat.user1._id.toString(), {
            chat,
            message: 'New chat is created successfully.'
        });
        this.privateChatGateway.emitChatUpdated(chat.user2._id.toString(), {
            chat,
            message: 'New chat is created successfully.'
        });
    }

    async createPrivateMessage(
        senderId: Types.ObjectId,
        createPrivateMessageInput: CreatePrivateMessageInput
    ): Promise<Message> {
        let message: Message;
        const { content, attachment, createdAt } = createPrivateMessageInput;
        const { hashtags } = extractMentionsAndHashtags(content);
        if (hashtags?.length > 0) {
            await this.hashtagsService.findOrCreateMany(
                hashtags.map((item) => item.tag)
            );
        }
        if (createPrivateMessageInput._id) {
            message = await this.messageModel.findById(
                createPrivateMessageInput._id
            );
            message.content = content;
            message.edited = true;
            // if (attachment) {
            //     message.attacontentchment = attachment;
            // }
        } else {
            const receiverUser = await this.userModel.findById(
                createPrivateMessageInput.receiverUser
            );
            const sender = await this.userModel.findById(senderId);
            if (receiverUser.blockedUsers.includes(senderId)) {
                throw new NotFoundException('You are blocked by receiver.');
            }
            if (
                sender.blockedUsers.includes(
                    new Types.ObjectId(receiverUser._id)
                )
            ) {
                throw new NotFoundException('You blocked the receiver.');
            }

            let chat = await this.chatModel
                .findOne({
                    $or: [
                        { user1: senderId, user2: receiverUser._id },
                        { user2: senderId, user1: receiverUser._id }
                    ]
                })
                .exec();

            if (!chat) {
                if (
                    receiverUser.settings.messagePrivacy ===
                    MessagePrivacy.FOLLOW
                ) {
                    const isFollow = !!(
                        receiverUser.followers.filter(
                            (follower) => follower === senderId
                        ).length +
                        receiverUser.following.filter(
                            (following) => following === senderId
                        ).length
                    );
                    if (!isFollow) {
                        await this.inviteMember(
                            senderId,
                            new Types.ObjectId(receiverUser._id),
                            null,
                            'private'
                        );
                        throw new NotFoundException(
                            'You are not allowed to send message.'
                        );
                    }
                }
                if (
                    receiverUser.settings.messagePrivacy ===
                    MessagePrivacy.NOONE
                ) {
                    await this.inviteMember(
                        senderId,
                        new Types.ObjectId(receiverUser._id),
                        null,
                        'private'
                    );
                    throw new NotFoundException(
                        'You are not allowed to send message.'
                    );
                }
            }
            const inReplyToMessage = createPrivateMessageInput.inReplyToMessage
                ? new Types.ObjectId(createPrivateMessageInput.inReplyToMessage)
                : null;

            if (!chat) {
                chat = new this.chatModel({
                    user1: senderId,
                    user2: receiverUser._id,
                    unseenMsgCount: 1
                });
            }
            message = new this.messageModel({
                sender: senderId,
                receiverUser: receiverUser._id,
                content: content ? content : '',
                chatId: chat._id,
                inReplyToMessage,
                attachment: attachment ? attachment : null,
                type: 'private',
                createdAt
            });
            await message.save();

            chat.lastMessage = new Types.ObjectId(message._id);
            await chat.save();
            // this.handleEmitChatUpdated(chat._id);
        }
        this.handleEmitMessageUpdated(message);
        return message;
    }
    async createSupportMessage(
        sender: Types.ObjectId,
        createPrivateMessageInput: CreatePrivateMessageInput
    ): Promise<Message> {
        let message: Message;
        const { content, attachment, createdAt } = createPrivateMessageInput;
        const { hashtags } = extractMentionsAndHashtags(content);
        if (hashtags?.length > 0) {
            await this.hashtagsService.findOrCreateMany(
                hashtags.map((item) => item.tag)
            );
        }
        if (createPrivateMessageInput._id) {
            message = await this.messageModel.findById(
                createPrivateMessageInput._id
            );
            message.content = content;
            message.edited = true;
            // if (attachment) {
            //     message.attacontentchment = attachment;
            // }
        } else {
            const inReplyToMessage = createPrivateMessageInput.inReplyToMessage
                ? new Types.ObjectId(createPrivateMessageInput.inReplyToMessage)
                : null;

            message = new this.messageModel({
                sender,
                content: content ? content : '',
                inReplyToMessage,
                attachment: attachment ? attachment : null,
                type: 'support',
                createdAt
            });
            await message.save();
        }
        return message;
    }
    async setEmotion(
        messageId: Types.ObjectId,
        emoji: string,
        sender: Types.ObjectId
    ): Promise<boolean> {
        const message = await this.messageModel.findById(messageId).exec();
        const reaction = await this.reactionModel
            .findOne({
                message: messageId,
                user: sender,
                emoji: emoji
            })
            .exec();

        if (!reaction) {
            const newReaction = new this.reactionModel({
                user: sender,
                emoji: emoji,
                message: messageId
            });

            await newReaction.save();
        } else {
            await this.reactionModel.deleteOne({
                user: sender,
                emoji: emoji,
                message: messageId
            });
        }

        this.handleEmitMessageUpdated(message);
        return true;
    }

    async emitTypingEvent(
        groupId: Types.ObjectId,
        sender: string,
        firstName: string
    ) {
        const group = await this.groupModel.findById(groupId).exec();
        const _id = groupId.valueOf().toString();

        if (this.typingStatus[_id] === undefined) this.typingStatus[_id] = [];
        if (
            this.typingStatus[_id].findIndex(
                (e) => e.sender.toString() === sender.toString()
            ) === -1
        )
            this.typingStatus[_id].push({
                sender,
                firstName
            });
        for (let i = 0; i < group.admins.length; i++) {
            if (group.admins[i].toString() === sender.toString()) continue;

            this.privateChatGateway.emitTypingMessage(
                group.admins[i].toString(),
                {
                    groupId: _id,
                    statuses: this.typingStatus[_id]
                }
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            if (group.members[i].member.toString() === sender.toString())
                continue;

            this.privateChatGateway.emitTypingMessage(
                group.members[i].member.toString(),
                {
                    groupId: _id,
                    statuses: this.typingStatus[_id]
                }
            );
        }

        return true;
    }

    async removeTypingEvent(groupId: Types.ObjectId, sender: string) {
        const group = await this.groupModel.findById(groupId).exec();
        const _id = groupId.valueOf().toString();
        if (!this.typingStatus[_id]) return;
        const index = this.typingStatus[_id].findIndex(
            (e) => e.sender.toString() === sender.toString()
        );
        this.typingStatus[_id].splice(index, 1);

        for (let i = 0; i < group.admins.length; i++) {
            if (group.admins[i].toString() === sender.toString()) continue;

            this.privateChatGateway.emitTypingMessage(
                group.admins[i].toString(),
                this.typingStatus[_id]
            );
        }
        for (let i = 0; i < group.members.length; i++) {
            if (group.members[i].member.toString() === sender.toString())
                continue;

            this.privateChatGateway.emitTypingMessage(
                group.members[i].member.toString(),
                this.typingStatus[_id]
            );
        }

        return true;
    }

    async setMessageSeen(messageId: string, viewer: Types.ObjectId) {
        console.log(viewer);
        const message = await this.messageModel.findById(messageId).exec();
        if (!message) return false;
        // if (message.receiverGroup) {
        //     if (message.seenUsers.includes(viewer)) return false;
        //     message.seenUsers.push(viewer);
        //     this.privateChatGateway.emitMessageSeen(viewer.toString(), {
        //         groupId: message.receiverGroup.toString(),
        //         msgId: message._id.toString()
        //     });
        // } else {
        //     if (message.sent) return false;
        //     const chat = await this.chatModel.findById(message.chatId).exec();

        //     chat.unseenMsgCount = chat.unseenMsgCount - 1;
        //     await chat.save();
        //     message.sent = true;
        //     this.handleEmitChatUpdated(chat._id);
        //     this.privateChatGateway.emitMessageSeen(message.sender.toString(), {
        //         opponent: message.receiverUser.toString(),
        //         msgId: message._id.toString()
        //     });
        //     this.privateChatGateway.emitMessageSeen(
        //         message.receiverUser.toString(),
        //         {
        //             opponent: message.sender.toString(),
        //             msgId: message._id.toString()
        //         }
        //     );
        // }
        await message.save();
        return true;
    }
    async getUnseenMsgCount(
        isGroup: boolean,
        id: string,
        user: Types.ObjectId
    ): Promise<number> {
        let messages;
        if (isGroup) {
            messages = await this.messageModel.find({
                receiverGroup: id,
                sender: { $ne: user },
                type: 'group',
                seenUsers: {
                    $not: {
                        $elemMatch: {
                            $eq: user
                        }
                    }
                }
            });
        } else {
            messages = await this.messageModel.find({
                chatId: id,
                sender: { $ne: user },
                type: 'private',
                sent: false
            });
        }
        return messages.length;
    }
    // Add more service methods as needed
}
