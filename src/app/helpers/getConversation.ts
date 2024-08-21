import Conversation from '../models/conversation.model';

export const getConversation = async (crntUserId: string) => {
  if (crntUserId) {
    const currentUserConversation = await Conversation.find({
      $or: [{ sender: crntUserId }, { receiver: crntUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'messages',
        model: 'Message',
      })
      .populate('sender')
      .populate('receiver');
    // console.log('currentUserConversation', currentUserConversation);
    const conversation = currentUserConversation?.map((conv) => {
      const countUnseenMessage = conv.messages?.reduce(
        (prev, curr) => prev + (curr.seen ? 0 : 1),
        0,
      );
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMessage,
        lastMsg: conv?.messages[conv?.messages?.length - 1],
      };
    });
    // console.log(conversation);
    // socket.emit('conversation', conversation);
    return conversation;
  } else {
    return [];
  }
};
