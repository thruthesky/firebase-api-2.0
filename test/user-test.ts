import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../user';
export const TEST_NEW_NAME = "This-is-new-name!";
export const TEST_PASSWORD = 'Wc~,123a*';
@Injectable()
export class UserTest {
    constructor( private user: User ) {

        this.singleUserTest_CRUD_logInOut();
        

    }

    singleUserTest_CRUD_logInOut() {
        let id = 'user-' + (new Date).getMinutes() + (new Date).getSeconds();
        this.createUser( id, ( uid: string ) => {
            console.log('uid : ', uid);
            this.getUser( uid, ( uid ) =>
                this.updateUser( uid, () => 
                    this.logout( () => 
                        this.login( id, () => 
                            this.deleteUser( () => 
                                console.log("TEST COMPLETE !")
                            )
                        )
                    )
                )
            )
        });
    }

    createUser( id, success ) {
        console.log("Going to create user : " + id);
        this.user.data('key', id)
            .data('email', id + '@gmail.com')
            .data('password', TEST_PASSWORD )
            .data('name', id + '-name')
            .create(
                ( uid ) => { console.log(`create ${id} : success`); success( uid ); },
                (e) => console.error(`create ${id}: failure:`, e),
                () => console.log(`create ${id} : complete`) );
    }
    getUser( uid, success ) {
        this.user.get( uid, user => {
            console.log('getUser: success: ', user );
            success( user.uid );
        },
        e => console.error("get user-abc: failure: ", e ),
        () => console.log("get user-abc: complete") );
    }
    updateUser( uid, success ) {
        this.user.clear()
            .data('key', uid)
            .data('name', TEST_NEW_NAME)
            .update(
                () => { console.log(`user update: ${uid} : success.`); success(); },
                e => console.error( `user update: ${uid} : failure: `, e ),
                () => {}
            );
    }
    logout( success ) {
        this.user.logout( () => {
            console.log('logout ok');
            success();
         }, () => console.error('logout failed') );
    }
    login( id, success ) {
        let email = id + '@gmail.com';
        let password = TEST_PASSWORD;
        this.user.login( email, password, uid => {
            console.log("Login ok: ", uid);
            success( uid );
        },
        error => {
            console.error("Login error: ", error );
        });
    }
    deleteUser( success ) {
        this.user.delete( () => {
            console.log("user delete ok");
            success();
        }, e => console.log('deleteuser() error ', e) );
    }
}