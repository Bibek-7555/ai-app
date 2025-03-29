import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import dotenv from 'dotenv';
import path from "path";
import {} from '../pdfFolder/resume1234.pdf';

dotenv.config(
    {
        path: '../.env'
    }
);
console.log(process.env.GOOGLE_API_KEY);


const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

async function pdf_function() {
    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(fs.readFileSync("../pdfFolder/resume1234.pdf")).toString("base64"),
                mimeType: "application/pdf",
            },
        },
        'Summarize this document',
    ]);
    console.log(result.response.text());
}

async function call_pdf_function() {
    await pdf_function();
}
call_pdf_function();