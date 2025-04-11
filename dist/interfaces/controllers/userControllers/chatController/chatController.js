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
exports.ChatController = void 0;
class ChatController {
    constructor(chatUseCase) {
        this.chatUseCase = chatUseCase;
    }
    fetchAllContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const allContacts = yield this.chatUseCase.fetchAllContacts(userId);
                res.status(200).json({ success: true, allContacts: allContacts });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    fetchChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, contactId } = req.query;
                const chat = yield this.chatUseCase.fetchChat(userId, contactId);
                res.status(200).json({ success: true, chat: chat });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
}
exports.ChatController = ChatController;
