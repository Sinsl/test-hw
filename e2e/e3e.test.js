import puppetteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("test check", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:8087";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      if (server.connected) {
        process.send("ok");
        resolve();
      } else {
        reject();
      }
    });

    browser = await puppetteer.launch({
      //   headless: false, // show gui
      //   slowMo: 200,
      //   devtools: false, // show devTools
      //   // args: [`--window-size=1000,1000`],
      //   defaultViewport: {
      //     width: 1000,
      //     height: 1000,
      //   },
    });

    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("тест на первый клик, елемент есть на странице", async () => {
    await page.goto(baseUrl);
    const img = await page.$(".btn-pop");
    await img.click();
    expect(await page.waitForSelector(".pop-content")).toBeTruthy();
  });

  test("тест на второй клик, елемента нет на странице", async () => {
    await page.goto(baseUrl);
    const img = await page.$(".btn-pop");
    await img.click();
    await img.click();
    expect(await page.$(".pop-content")).toBeNull();
  });
});
