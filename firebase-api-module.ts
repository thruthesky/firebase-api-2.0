import { NgModule } from '@angular/core';
import { User } from './user';
import { UserTest } from './test/user-test';
import * as firebase from 'firebase';


var config = {
  apiKey: "AIzaSyCKGAejpeOxxSHELi_Xbo2UdRa8xQPmipU",
  authDomain: "test-ec3e3.firebaseapp.com",
  databaseURL: "https://test-ec3e3.firebaseio.com",
  storageBucket: "test-ec3e3.appspot.com",
  messagingSenderId: "55749236444"
};
firebase.initializeApp(config);


@NgModule({
  declarations : [],
  imports: [],
  providers : [ User, UserTest ]
})
export class FirebaseApiModule {}