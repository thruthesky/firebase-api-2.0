import { Injectable } from '@angular/core';
//import * as firebase from 'firebase';
import { Base } from '../base';

@Injectable()
export class BaseTest {

    constructor( private base: Base ) {
    }

    run() {
        // node test 
        this.nodeTest( res =>{
            console.info(' node test success 1');
            // push test
            this.createPushTest( rpushRes =>{
                console.info( ' create push test success 2' + rpushRes );
            }, err => console.error( ' error on create push test ' + err ) );
            // ref test
            this.createRefTest( refRes =>{
                console.info( ' create ref test success 3' + refRes );
                this.updateTest( 'refTest', updateRes =>{
                    console.info(' update test success 3' + updateRes );
                }, error => console.error( 'error on updating ' ) )
            }, error => console.error( ' error on create ref test ' +  error) );
        })
        

        
        
        
        // test on success callback.
        // test on failure callback
        // test on complete callback
        // create test
        // update test
        // delete test
        // get test
        
        
    }




    nodeTest( success ) {
        this.base.node( 'testNode' );

        if ( this.base.ref( this.base.getNode() ).key == 'testNode' ) console.info("OK: setting testNode");
        else console.error("FAIL: setting testNode");

        success();
    }

    refTest( success ) {
        this.base.ref( 'testkey' )
        success();
    }

    pushTest( success ) {
        this.base.push();
        this.base.success( null, success );
    }
    createPushTest( success, failure, complete? ) {
        let data ={
            content: 'push test'
        }
         
        this.base.create( null, data,  res =>{
            console.log('push test res ' + res );
            this.base.success( res, success, complete );
        }, err => this.base.failure( err, failure , complete ), 
        () => console.info('create post push test complete') )
    }


    createRefTest( success, failure, complete? ) {
        let data ={
            content : 'ref test'
        }

        this.base.create( 'refTest', data, res =>{
            console.info('checking ref res ' +  res);
            this.base.success( res, success, complete );
        }, error => this.base.failure( error, failure, complete ),
        () => console.info( ' create post ref test complete ') )
    }

    updateTest( key, success, failure, complete? ) {
        let data = {
            content: 'new updated data'
        }
        this.base.update( key, data, res =>{

        } )
    }


    




}