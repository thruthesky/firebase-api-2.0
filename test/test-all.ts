import { Injectable } from '@angular/core';
//import * as firebase from 'firebase';
import { UserTest } from './user-test';
@Injectable()
export class TestAll {


    constructor( private userTest: UserTest ) {
    }

    run() {
 
        this.userTest.run();
        
    }



}