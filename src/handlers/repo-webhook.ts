import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { Logger } from "../helpers/Logger";
import { ConfigProvider } from "../providers";
import { CONFIG_TABLE_NAME } from "../constants";
import crypto from "crypto";
import fetch from "node-fetch";

const logger = new Logger("REPO WEBHOOK");
const configProvider = new ConfigProvider(new DynamoDB(), CONFIG_TABLE_NAME);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.log("Event", JSON.stringify(event));

    const sig = Buffer.from(event.headers["X-Hub-Signature-256"]!, "utf8");
    const hmac = crypto.createHmac("sha256", "secret");
    const digest = Buffer.from(
      "sha256" + "=" + hmac.update(event.body!).digest("hex"),
      "utf8"
    );

    if (!crypto.timingSafeEqual(digest, sig))
      return HttpResponse.badRequest("Invalid signature");

    // @ts-ignore
    const { encoding, content } = await fetch(
      JSON.parse(event.body!).repository.contents_url.replace(
        "{+path}",
        "config.json"
      )
    ).then((res) => res.json());
    const json = JSON.parse(Buffer.from(content, encoding).toString());

    await configProvider.update({ id: "project", json: JSON.stringify(json) });

    return HttpResponse.success(json);
  } catch (e) {
    logger.err("Error", e);
    return HttpResponse.serverError(e);
  }
};
