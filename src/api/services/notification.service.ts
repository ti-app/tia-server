import { getAllDeviceTokens, getDeviceTokensOfUser } from '@repository/mongo/user.collection';
import { sendNotification, sendMulticastNotification } from '@utils/firebase.utils';

class NotificationService {
  async sendNotificationMessage() {
    const sampleToken =
      'd51244egSaQ:APA91bH68Eamu1cyCUDug87dauwnJGOtnor1NUEiburm8i8F0LLBPc_eHQaBG9k2kO6hMNF_aStVsIZhXHZkMEhSmYqCbagLUT7BH0e2GyY5_IzR_sRqK_Kj80OQ84sG8FPHFQsZvX_9';
    sendNotification(
      {
        title: 'A message from TIA',
        body: 'This message is sent from TIA backend',
        version: '1',
        app: 'TIA',
      },
      sampleToken
    );
  }

  async _sendMulticastNotificationMessage() {
    const tokens = await getAllDeviceTokens();
    sendMulticastNotification(
      {
        title: 'A message from TIA',
        body: 'This message is sent from TIA backend',
        version: '1',
        app: 'TIA',
      },
      tokens
    );
  }
  async sendMulticastNotificationMessage(data: any, tokens: string[]) {
    // const tokens = await getAllDeviceTokens();
    sendMulticastNotification(
      {
        title: 'A message from TIA',
        body: 'This message is sent from TIA backend',
        ...data,
      },
      tokens
    );
  }
}

export default new NotificationService();
