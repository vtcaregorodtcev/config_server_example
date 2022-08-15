import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { Logger } from "../helpers/Logger";
import { ConfigProvider } from "../providers";
import { CONFIG_TABLE_NAME } from "../constants";

const logger = new Logger("GET CONFIG");
const configProvider = new ConfigProvider(new DynamoDB(), CONFIG_TABLE_NAME);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.log("Event", JSON.stringify(event));

    const id = event.queryStringParameters!.id!;

    const json = (await configProvider.scan()).find((i) => i.id == id);

    return HttpResponse.success(json);
  } catch (e) {
    logger.err("Error", e);
    return HttpResponse.serverError(e);
  }
};
