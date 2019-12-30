import * as repository from '@repository/mongo/panic.collection';

class PanicService {
  create(panic: any) {
    repository.registerNewPanic(panic);
  }
  fetchPanic(lat: number, lng: number, radius: number, user: any) {
    return repository.getPanic(lat, lng, radius, user);
  }
  updatePanic(panicId: string, updateBody: any) {
    return repository.updatePanic(panicId, updateBody);
  }
}

export default new PanicService();
