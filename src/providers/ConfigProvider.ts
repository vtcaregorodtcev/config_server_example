import { DynamoDB } from "aws-sdk";
import { ConfigItem } from "../types/config-item";

export class ConfigProvider {
  constructor(private readonly db: DynamoDB, private readonly table: string) {}

  async create(config: ConfigItem): Promise<ConfigItem> {
    const item = { ...config };

    await this.db
      .putItem({
        TableName: this.table,
        Item: DynamoDB.Converter.marshall(item),
        ConditionExpression: "attribute_not_exists(id)",
      })
      .promise();

    return item as ConfigItem;
  }

  async update(config: ConfigItem): Promise<ConfigItem> {
    await this.db
      .putItem({
        TableName: this.table,
        Item: DynamoDB.Converter.marshall(config),
      })
      .promise();

    return config;
  }

  async scan(): Promise<ConfigItem[]> {
    const { Items = [] } = await this.db
      .scan({
        TableName: this.table,
      })
      .promise();

    return (Items || []).map(ConfigProvider.unmarshall) as ConfigItem[];
  }

  private static unmarshall(
    item?: AWS.DynamoDB.AttributeMap | null
  ): ConfigItem | null {
    if (item == null) {
      return null;
    }
    return DynamoDB.Converter.unmarshall(item) as ConfigItem;
  }
}
