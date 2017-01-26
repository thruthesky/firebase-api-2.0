import { Injectable } from '@angular/core';
//import * as firebase from 'firebase';
import { UserTest } from './user-test';
import { BaseTest } from './base-test';
@Injectable()
export class TestAll {


    constructor( private userTest: UserTest, private baseTest: BaseTest ) {

    }

    run() {
 
        this.baseTest.run();
        // this.userTest.run();

        
    }



}