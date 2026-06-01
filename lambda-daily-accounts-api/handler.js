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
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const data_js_1 = require("./data.js");
const app = (0, express_1.default)();
const EXPENSES_TABLE = process.env.EXPENSES_TABLE;
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
app.use(express_1.default.json());
// GET: Retrieve expenses for a specific date (e.g., "202504" for April 2025)
app.get("/expense", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Read from req.query instead of req.params
    const { date } = req.query;
    // Validation step: Check if the query parameter was actually provided
    if (!date || typeof date !== "string") {
        res.status(400).json({ error: 'Query parameter "date" is required as a string' });
        return;
    }
    // Check if the date string is in the correct format (6 digits for YearMonth or 
    // 4 digits for Year)
    const datePattern = /^\d{6}$|^\d{4}$/; // Matches either 6 digits or 4 digits
    if (!datePattern.test(date)) {
        res.status(400).json({ error: 'Query parameter "date" must be in the format "YYYYMM" or "YYYY"' });
        return;
    }
    let responseItems;
    if (date.length === 6) {
        // Convert the string "202504" into the number 202504
        const yearMonthNumber = parseInt(date, 10);
        const params = {
            TableName: EXPENSES_TABLE,
            KeyConditionExpression: "YearMonth = :yearMonth",
            ExpressionAttributeValues: {
                ":yearMonth": yearMonthNumber,
            },
        };
        const command = new lib_dynamodb_1.QueryCommand(params);
        let response = yield docClient.send(command);
        responseItems = response.Items;
    }
    else if (date.length === 4) {
        const yearNumber = parseInt(date, 10);
        // Create an array of 12 numbers: [202501, 202502, ..., 202512]
        const targetMonths = Array.from({ length: 12 }, (_, i) => yearNumber * 100 + (i + 1));
        // Launch all 12 queries simultaneously in parallel
        const queryPromises = targetMonths.map((monthValue) => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                TableName: EXPENSES_TABLE,
                KeyConditionExpression: "YearMonth = :yearMonth",
                ExpressionAttributeValues: {
                    ":yearMonth": monthValue,
                },
            };
            try {
                const command = new lib_dynamodb_1.QueryCommand(params);
                const result = yield docClient.send(command);
                return result.Items || [];
            }
            catch (err) {
                console.error(`Failed to fetch items for month ${monthValue}:`, err);
                return []; // Return empty array for this month so it doesn't crash the whole year
            }
        }));
        // Wait for all 12 months to finish, then flatten the array of arrays into one list
        const resultsArray = yield Promise.all(queryPromises);
        responseItems = resultsArray.flat();
    }
    try {
        if (responseItems && responseItems.length > 0) {
            const parsedData = data_js_1.respExpenses.parse(responseItems);
            res.json(parsedData);
        }
        else {
            res
                .status(404)
                .json({ error: 'Could not find date with provided "date"' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not retrieve expenses' });
    }
}));
// POST: Create a expense entry for a specific date
app.post("/expense", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = data_js_1.reqExpenses.parse(req.body);
    if (!parsedData || !parsedData.in) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }
    const params = {
        TableName: EXPENSES_TABLE,
        Item: data_js_1.transformedDbExpenseIn.parse(parsedData.in),
    };
    try {
        const command = new lib_dynamodb_1.PutCommand(params);
        yield docClient.send(command);
        res.json(parsedData.in);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not create expense" });
    }
}));
// 404 Fallback Middleware
app.use((req, res, next) => {
    res.status(404).json({
        error: "Not Found",
    });
});
exports.handler = (0, serverless_http_1.default)(app);
