import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  PutCommand,
  PutCommandInput,
  BatchGetCommandInput, 
  BatchGetCommand
} from "@aws-sdk/lib-dynamodb";
import express, { NextFunction, Request, Response } from "express";
import serverless from "serverless-http";
import { z } from 'zod';
import { respExpenses, reqExpenses, transformedDbExpenseIn } from "./data.js";

const app = express();

const EXPENSES_TABLE = process.env.EXPENSES_TABLE;
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// GET: Retrieve expenses for a specific date (e.g., "202504" for April 2025)
app.get("/expense", async (req: Request, res: Response): Promise<void> => {
  
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
  let responseItems: any;

  if (date.length === 6) {
    // Convert the string "202504" into the number 202504
    const yearMonthNumber = parseInt(date, 10);
  
    const params: QueryCommandInput = {
      TableName: EXPENSES_TABLE,
      KeyConditionExpression: "YearMonth = :yearMonth",
      ExpressionAttributeValues: {
        ":yearMonth": yearMonthNumber,
      },
    };
    const command = new QueryCommand(params);
    let response = await docClient.send(command);
    responseItems = response.Items;
  }

  else if (date.length === 4) {
  
  const yearNumber = parseInt(date, 10);
  
  // Create an array of 12 numbers: [202501, 202502, ..., 202512]
  const targetMonths = Array.from({ length: 12 }, (_, i) => yearNumber * 100 + (i + 1));

  // Launch all 12 queries simultaneously in parallel
  const queryPromises = targetMonths.map(async (monthValue) => {
    const params: QueryCommandInput = {
      TableName: EXPENSES_TABLE,
      KeyConditionExpression: "YearMonth = :yearMonth",
      ExpressionAttributeValues: {
        ":yearMonth": monthValue,
      },
    };
    
    try {
      const command = new QueryCommand(params);
      const result = await docClient.send(command);
      return result.Items || [];
    } catch (err) {
      console.error(`Failed to fetch items for month ${monthValue}:`, err);
      return []; // Return empty array for this month so it doesn't crash the whole year
    }
  });

  // Wait for all 12 months to finish, then flatten the array of arrays into one list
  const resultsArray = await Promise.all(queryPromises);
  responseItems = resultsArray.flat();
}

  try {
    if (responseItems && responseItems.length > 0) {
      const parsedData = respExpenses.parse(responseItems);
      res.json(parsedData);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find date with provided "date"' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve expenses'});
  }
});

// POST: Create a expense entry for a specific date
app.post("/expense", async (req: Request, res: Response): Promise<void> => {
  const parsedData = reqExpenses.parse(req.body);
  
  if (!parsedData || !parsedData.in) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const params: PutCommandInput = {
    TableName: EXPENSES_TABLE,
    Item: transformedDbExpenseIn.parse(parsedData.in),
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json(parsedData.in);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create expense" });
  }
});

// 404 Fallback Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);