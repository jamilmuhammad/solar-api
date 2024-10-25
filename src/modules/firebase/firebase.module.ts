import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { DeviceTokensModule } from '../device_tokens/device_token.module';

@Module({
  providers: [
    FirebaseService,
  ],
  exports: [
    FirebaseService,
  ],
  imports: [
    DeviceTokensModule,
  ]
})
export class FirebaseModule { }
