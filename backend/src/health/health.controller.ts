import { Controller, Get } from "@nestjs/common";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  ok() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? 'dev',
    };
  }
}
