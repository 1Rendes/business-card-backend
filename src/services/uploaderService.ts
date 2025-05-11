import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "fs/promises";
import path from "path";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const TEMP_UPLOAD_DIR = path.join(process.cwd(), "temp");

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

async function docUploader() {
  const loaders: DocxLoader[] = [];

  try {
    const files = await fs.readdir(TEMP_UPLOAD_DIR);
    files.map((file) => {
      const pathToFile = path.join(TEMP_UPLOAD_DIR, file);
      loaders.push(new DocxLoader(pathToFile, { type: "doc" }));
    });
    loaders.map(async (loader) => {
      const doc = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });
      const splittedDoc = await splitter.createDocuments([doc[0].pageContent]);
      await vectorStore.addDocuments(splittedDoc);
    });
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

async function pdfUploader() {
  const loaders: PDFLoader[] = [];
  try {
    const files = await fs.readdir(TEMP_UPLOAD_DIR);
    files.map((file) => {
      const pathToFile = path.join(TEMP_UPLOAD_DIR, file);
      loaders.push(new PDFLoader(pathToFile, { splitPages: true }));
    });
    loaders.map(async (loader) => {
      const doc = await loader.load();
      // const splitter = new RecursiveCharacterTextSplitter({
      //   chunkSize: 1000,
      //   chunkOverlap: 50,
      // });
      // const splittedDoc = await splitter.createDocuments([doc[0].pageContent]);
      await vectorStore.addDocuments(doc);
    });
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

async function urlUploader(url: string) {
  try {
    const content = await scrapPage(url);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 50,
    });
    const splittedDoc = await splitter.createDocuments([content]);
    await vectorStore.addDocuments(splittedDoc);
  } catch (error) {
    console.error("Error reading url:", error);
    throw error;
  }
}

async function scrapPage(url: string) {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: { headless: true },
    gotoOptions: { waitUntil: "domcontentloaded" },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape()).replace(/<[^>]*>?/gm, "");
}

async function mainUploader(fileType: string, url: string | null) {
  switch (fileType) {
    case "doc":
      await docUploader();
      break;
    case "pdf":
      await pdfUploader();
      break;
    case "url":
      if (url) await urlUploader(url);
      break;
    default:
      break;
  }
  console.log(`Data added sucessfully.`);
}

export default mainUploader;
