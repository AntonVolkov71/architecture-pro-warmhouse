import {Injectable} from "@nestjs/common";

@Injectable()
export class DatabaseConfigService {
  type(): "postgres" {
    return (process["env"]["DB_TYPE"] as "postgres") || "postgres";
  }

  host(): string {
    return process["env"]["DB_HOST"] || "localhost";
  }

  port(): number {
    const port = process["env"]["DB_PORT"];
    return port ? Number(port) : 5432;
  }

  database(): string {
    return process["env"]["DB_NAME"] || "smarthome";
  }

  username(): string {
    return process["env"]["DB_USER"] || "postgres";
  }

  password(): string {
    return process["env"]["DB_PASSWORD"] || "postgres";
  }
}
