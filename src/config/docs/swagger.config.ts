import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class SwaggerConfig {

    static config(app) {
        if (process.env.NODE_ENV === 'production') {
            return;
        }

        const config = new DocumentBuilder()
            .setTitle('Xollet API')
            .setDescription('Xollet API Documentations')
            .setVersion('1.0')
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            })
            .addBasicAuth({
                type: 'http',
                scheme: 'basic',
            })
            .build();

        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            }
        });
    }
}