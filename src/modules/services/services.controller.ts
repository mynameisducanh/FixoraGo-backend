import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Services')
@Controller('services')
export class ServicesController {
    @Get()
    async getServices() {
        return 'Services';
    }
}