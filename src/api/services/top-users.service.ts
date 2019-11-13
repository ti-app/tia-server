import * as repository from '@repository/mongo/top-users.collection';
import Context from '@services/context.service';

class TopUsersService {
  getTopUsers(limit: number) {
    console.log('TCL: TopUsersService -> getTopUsers', limit);
    return repository.getTopUsers(limit);
  }
}

export default new TopUsersService();
