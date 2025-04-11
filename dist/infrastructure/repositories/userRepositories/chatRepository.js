"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatrepository = void 0;
class Chatrepository {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    fetchAllContacts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.messageModel.find({
                    $or: [{ senderId: userId }, { recipientId: userId }],
                })
                    .populate('senderId', 'name')
                    .populate('recipientId', 'name')
                    .lean();
                // Extract unique contacts
                const contactMap = new Map();
                messages.forEach((message) => {
                    // Normalize senderId and recipientId
                    const sender = typeof message.senderId === 'string'
                        ? { _id: message.senderId, name: null }
                        : message.senderId;
                    const recipient = typeof message.recipientId === 'string'
                        ? { _id: message.recipientId, name: null }
                        : message.recipientId;
                    // Add sender to the map
                    if (sender._id !== userId) {
                        contactMap.set(sender._id.toString(), {
                            id: sender._id.toString(),
                            name: sender.name,
                        });
                    }
                    // Add recipient to the map
                    if (recipient._id !== userId) {
                        contactMap.set(recipient._id.toString(), {
                            id: recipient._id.toString(),
                            name: recipient.name,
                        });
                    }
                });
                // Convert Map to Array
                const contacts = Array.from(contactMap.values());
                console.log(contacts);
                return contacts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchChat(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield this.messageModel.find({
                    $or: [
                        { senderId: userId, recipientId: contactId },
                        { senderId: contactId, recipientId: userId },
                    ],
                }).sort({ createdAt: 1 });
                return chat;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.Chatrepository = Chatrepository;
