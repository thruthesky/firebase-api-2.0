import { Injectable } from '@angular/core';
import { Base } from './base';
import * as firebase from 'firebase';




@Injectable()

export class Forum extends Base {
    ref = firebase.database().ref();
    constructor(){
        super();
        this.node( 'forums' );        
    }

    /**
     * @param forumname {string} this will define the category of the forum, if it's QnA, Reminder, or LevelTest.
     */
    create( forumname?, success?: ( id: string ) => void, failure?: ( error : string ) => void, complete? ){
        
        let key = this.ref.push().key;
        let data  = this.getData();
        data['key'] = key;
        
        super.create( forumname, res =>{
            this.success( res, success, complete)
        }, error =>{
            this.failure( error, failure, complete );
        }, () =>console.log('complete'))

    }


    

    delete( databaseRef:string, key:string, success : ( key: string ) => void, failure: ( error:string ) => void, complete?){
        this.ref.child( key )
        .remove().then( res =>{
            this.success( res, success, complete );
        }, error => this.failure( error, failure, complete) )
    }

    update( success?: ( data: any) => void, failure?: (error?: any) => void, complete?: () => void ) {
        super.update( success, failure, complete );
    }


}