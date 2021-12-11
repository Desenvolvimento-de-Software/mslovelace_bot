/**
 * Ada Lovelace Telegram Bot
 *
 * This file is part of Ada Lovelace Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  mslovelace_bot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import DefaultController from "@controller/controller";

class App {
  /**
   * Express application instance.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   *
   * @var {express.Application}
   */
  private app: express.Application;

  /**
   * Application port.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   *
   * @var {number}
   */
  private port: number;

  /**
   * The constructor.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   */
  constructor(controllers: Array<DefaultController>) {
    dotenv.config({
      path: __dirname + "/.env",
    });

    this.app = express();
    this.port = (process.env.PORT || 8000) as number;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  /**
   * Starts to listen in the specified port.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   *
   * @return {void}
   */
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  /**
   * Initializes the middlewares.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   *
   * @return {void}
   */
  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
  }

  /**
   * Initializes the controllers.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   *
   * @return {void}
   */
  private initializeControllers(controllers: Array<DefaultController>): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.getRoutes());
    });
  }
}

export default App;
