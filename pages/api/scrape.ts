// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

type Data = {
  targetUrl: string;
  pageContent: Record<string, string>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req;
  const { targetUrl } = query ;

  let browser;
  const pageContent: Record<string, string> = {};
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(targetUrl as string);
    
    pageContent.title = await page.evaluate(() => document.title);
    pageContent.text = await page.evaluate(() => document.querySelector("main")?.innerText ?? document.body.innerText);
  } catch (e) {

  } finally {
    await browser?.close();
  }
  res.status(200).json({ targetUrl: targetUrl as string, pageContent });
}
