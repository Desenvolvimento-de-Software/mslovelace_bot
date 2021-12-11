import localtunnel from "localtunnel";
import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";

interface MyContext extends Context {
  myProp?: string;
  myOtherProp?: number;
}

class Bot {
  /**
   * Bot Application.
   *
   * @author Luiz Henrik
   * @since  1.0.0
   *
   * @var {Telegraf<MyContext>}
   */
  private bot: Telegraf<MyContext>;

  /**
   * Bot Secret Path.
   *
   * @author Luiz Henrik
   * @since  1.0.0
   *
   * @var {string}
   */
  private secretPath: string;

  /**
   * Application.
   *
   * @author Luiz Henrik
   * @since  1.0.0
   *
   * @var {any}
   */
  private app: any;

  /**
   * The Constructor
   *
   * @author Luiz Henrik
   * @since 1.0.0
   *
   * @param app <any>
   */
  constructor(app: any) {
    dotenv.config({
      path: __dirname + "/.env",
    });

    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.secretPath = `/telegraf/${this.bot.secretPathComponent()}`;
    this.app = app;
  }

  /**
   * Create url in https to localhost
   *
   * @author Luiz Henrik
   * @since 1.0.0
   *
   * @returns Promise<string>
   */
  private async localUrl(): Promise<string> {
    const result = await localtunnel({ port: 3000 });
    return result.url;
  }

  /**
   * Start Bot
   *
   * @author Luiz Henrik
   * @since 1.0.0
   *
   */
  public async init(): Promise<void> {
    this.bot.telegram.setWebhook(
      `${process.env.url || (await this.localUrl())}${this.secretPath}`
    );

    this.app.use(this.bot.webhookCallback(this.secretPath));
  }
}

export default Bot;
