import { NgModule } from '@angular/core';
import { User } from './user';
import { TestAll } from './test/test-all';
import { UserTest } from './test/user-test';
import { BaseTest } from './test/base-test';
import { Forum } from '../firebase-api-2.0/forum';
import { Base } from './base';
import * as firebase from 'firebase';





// Initialize Firebase
const firebase_config = {
    apiKey: "AIzaSyBnvok5OR77tFUl1yk0-ZeyeVkYgMWGrcE",
    authDomain: "english-588f2.firebaseapp.com",
    databaseURL: "https://english-588f2.firebaseio.com",
    storageBucket: "english-588f2.appspot.com",
    messagingSenderId: "663067398311"
};
  
firebase.initializeApp( firebase_config );


@NgModule({
  declarations : [],
  imports: [],
  providers : [ User, UserTest, TestAll, Forum, BaseTest, Base ]
})
export class FirebaseApiModule {}