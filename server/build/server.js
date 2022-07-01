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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const util_1 = require("./util");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Initialize middleware clients
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: process.env.ENVIRONMENT == "dev" ? "cross-origin" : "same-origin",
    },
}));
// Apply rate limiting
const postLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.POST_LIMIT_WINDOW_SECONDS) * 1000,
    max: parseInt(process.env.POST_LIMIT),
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// start the Express server
app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);
});
// Post new encrypted note
app.post("/note/", postLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = req.body;
        const savedNote = yield prisma.encryptedNote.create({
            data: Object.assign(Object.assign({}, note), { expire_time: (0, util_1.addDays)(new Date(), 30) }),
        });
        console.log(`[POST] Saved note <${savedNote.id}> for <${req.ip}>`);
        res.json({
            view_url: `${process.env.FRONTEND_URL}/note/${savedNote.id}`,
            expire_time: savedNote.expire_time,
        });
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).send("Something went wrong.");
    }
}));
// Get encrypted note
app.get("/note/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield prisma.encryptedNote.findUnique({
        where: { id: req.params.id },
    });
    if (note != null) {
        res.send(note);
        console.log(`[GET] Retrieved note <${note.id}> for <${req.ip}>`);
    }
    res.status(404).send();
}));
// Default response for any other request
app.use((req, res, next) => {
    res.status(500).send();
});
// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });
// Clean up expired notes periodically
const interval = Math.max(parseInt(process.env.CLEANUP_INTERVAL_SECONDS) || 1, 1) *
    1000;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("[Cleanup] Cleaning up expired notes...");
        const deleted = yield prisma.encryptedNote.deleteMany({
            where: {
                expire_time: {
                    lte: new Date(),
                },
            },
        });
        console.log(`[Cleanup] Deleted ${deleted.count} expired notes.`);
    }
    catch (err) {
        console.error(`[Cleanup] Error cleaning expired notes:`);
        console.error(err);
    }
}), interval);
//# sourceMappingURL=server.js.map