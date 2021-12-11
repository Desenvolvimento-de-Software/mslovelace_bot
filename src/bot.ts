import localtunnel from "localtunnel";
import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";

interface MyContext extends Context {
  myProp?: string;
  myOtherProp?: number;
}

class Bot {
  private bot: Telegraf<MyContext>;
  private secretPath: string;
  private app: any;

  constructor(app: any) {
    dotenv.config({
      path: __dirname + "/.env",
    });

    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.secretPath = `/telegraf/${this.bot.secretPathComponent()}`;
    this.app = app;
  }

  private async localUrl(): Promise<string> {
    const result = await localtunnel({ port: 3000 });
    return result.url;
  }

  public async launch(): Promise<void> {
    this.bot.telegram.setWebhook(
      `${process.env.url || (await this.localUrl())}${this.secretPath}`
    );

    this.app.use(this.bot.webhookCallback(this.secretPath));
  }
}

export default Bot;
