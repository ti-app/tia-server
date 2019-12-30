import * as repository from '@repository/mongo/panic.collection';

class PanicService {
  create(panic: any) {
    repository.registerNewPanic(panic);
  }
  fetchPanic(lat: number, lng: number, radius: number, user: any) {
    return repository.getPanic(lat, lng, radius, user);
  }
  findUserFcmTokensForPanicNotification(lat: number, lng: number, radius: number) {
    return repository.findUserFcmTokensForPanicNotification(lat, lng, radius);
  }
}

export default new PanicService();
