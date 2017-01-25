import { NgModule } from '@angular/core';
import { User } from './user';
import { UserTest } from './test/user-test';
import { Forum } from '../firebase-api-2.0/forum';
import * as firebase from 'firebase';


  const config = {
    
    apiKey: "AIzaSyCKGAejpeOxxSHELi_Xbo2UdRa8xQPmipU",
    authDomain: "test-ec3e3.firebaseapp.com",
    databaseURL: "https://test-ec3e3.firebaseio.com",
    storageBucket: "test-ec3e3.appspot.com",
    messagingSenderId: "55749236444"
  };
  


// Steven's code
// var config = {
//     apiKey: "AIzaSyBHmEZGD1GKTgYKJql1e13LzPUN2JrTVYw",
//     authDomain: "english-c26df.firebaseapp.com",
//     databaseURL: "https://english-c26df.firebaseio.com",
//     storageBucket: "english-c26df.appspot.com",
//     messagingSenderId: "629815580059"
// };

firebase.initializeApp( config );


@NgModule({
  declarations : [],
  imports: [],
  providers : [ User, UserTest, Forum ]
})
export class FirebaseApiModule {}