import { NgModule } from '@angular/core';
import { User } from './user';
import { UserTest } from './test/user-test';
import { Forum } from '../firebase-api-2.0/forum';
import * as firebase from 'firebase';








var config = {
    apiKey: "AIzaSyBHmEZGD1GKTgYKJql1e13LzPUN2JrTVYw",
    authDomain: "english-c26df.firebaseapp.com",
    databaseURL: "https://english-c26df.firebaseio.com",
    storageBucket: "english-c26df.appspot.com",
    messagingSenderId: "629815580059"
};
firebase.initializeApp(config);


@NgModule({
  declarations : [],
  imports: [],
  providers : [ User, UserTest, Forum ]
})
export class FirebaseApiModule {}