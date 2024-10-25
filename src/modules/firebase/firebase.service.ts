import { ConflictException, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { DeviceTokensService } from '../device_tokens/device_token.service';

@Injectable()
export class FirebaseService {

    constructor(
        private deviceTokenService: DeviceTokensService,
    ) { }

    async sendMessage(notification: { title: string, body: string }, userIds?: number | number[], data?: { type: string, body?}, topic?: string) {
        try {
            const newData = {
                type: data.type,
                ...data.body,
            };

            if (!userIds) {
                if (!topic) {
                    return await firebase.messaging().send({
                        topic: "/topics/all",
                        notification,
                        data: newData,
                    });
                }
                else {
                    return await firebase.messaging().send({
                        topic: `/topics/${topic}`,
                        notification,
                        data: newData,
                    });
                }
            } else {
                const fcmTokens = await this.deviceTokenService.getFcmTokens(userIds);
                if (!fcmTokens || fcmTokens.length === 0) {
                    console.log('No device token found');
                }

                return await firebase.messaging().sendToDevice(
                    fcmTokens,
                    {
                        notification,
                        data: newData,
                    }
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}
