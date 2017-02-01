import { Injectable } from '@angular/core';
//import * as firebase from 'firebase';
import { Base } from '../base';

@Injectable()
export class BaseTest {
    constructor( private base: Base ) {
    }

    run() {
        this.BaseTest( );
    }


    BaseTest( ) {
        this.nodeTest();
        this.createRefTest();
        this.createPushTest();

        // // node test 
        // this.nodeTest( data, res =>{
        //     console.info(' node test success 1' );
        //     // push test
        //     this.createPushTest( data, pushRes =>{
        //         console.info( ' create push test success 2' + pushRes);
        //         // update push test
        //         this.updateTest( data, pushRes, s =>{
        //             console.info( ' update push post test success 3')
        //             // delete push test
        //             this.deteletTest( this.base.ref( this.base.getNode() ).key + '/' + pushRes , s=>{
        //                 console.info( ' delete push post test success 4')
        //             }, error => console.error( ' FAILED deleting push post ' ) )
        //         }, error => console.error( 'FAILED updating pushed data ' ) )
        //     }, err => console.error( ' error on create push test ' + err ) );
        //     // ref test
        //     this.createRefTest( data, refRes =>{
        //         console.info( ' create ref test success 5' );
        //         // update ref post test
        //         this.updateTest( data, 'refTest', updateRes =>{
        //             console.info(' update ref post test success 6' );
        //             //delete ref post test
        //             this.deteletTest( this.base.ref( this.base.getNode() ).key + '/'+'/refTest', s =>{
        //                 console.info( 'delete ref post Test success 7' );
        //             }, error => console.error( ' delete failed ' ) )
        //         }, error => console.error( 'error on updating ' ) )
        //     }, error => console.error( ' error on create ref test ' +  error) );
        // }, error => console.error( ' fail on Node Test ' ) )
    }



    getRandomString() : string {
        return  ( new Date ).getMinutes() + ( new Date ).getSeconds() + '';
    }


    nodeTest() {
        let key = this.getRandomString();
        this.base.node( 'testNode' +  key );
        if ( this.base.ref( this.base.getNode() ).key != 'testNode' + key ) console.error("FAIL: testnode ");
        else console.info('PASSED: testnode ');
    }






    deteletTest( node, string? ) {
        this.base.delete( node, res =>{
            console.log( 'delete success :: ' + string );
        } , error => console.error( 'failed to delete ' +  string ), 
        () =>{} );
    }

    createRefTest() {
        let key = this.getRandomString();
        let data = {
            content: 'ref content'
        };
        this.base.create( key, data, s => {       
            this.base.get( key, success => {
                if ( JSON.stringify(success) == JSON.stringify(data) ) {
                    console.log('success create with ref');
                    this.updateTest( s );
                }
                else {
                    console.log("ERROR: create with ref");
                }
            }, error => console.log("ERROR: BaseTest::createTest() => get() ", error), () => {} );
        }, error => {
            console.log("ERROR: ... ", error);
        }, () => {

        })
    }

    createPushTest(){
        let data ={
            content: 'push test : '
        };
        this.base.create( null, data,  res =>{
      
            this.base.get( res, success =>{
                if ( JSON.stringify( data ) == JSON.stringify( success ) ) {
                    console.log('success  create with push');
                    this.updateTest( res );
                }
                else {
                    console.log("ERROR: create with push");
                }
            }, error =>{})
        }, err => console.error( ' error on push test ' ), 
        () => {} );
    }
    
    updateTest( key ) {
        console.log( 'update ' + key );
        let data = {
            content: 'new updated data '
        }
        this.base.update( key, data, res =>{
            this.base.get( this.base.ref( this.base.getNode() ).key+'/'+ key, s =>{
                if( JSON.stringify( data ) == JSON.stringify( s ) ){
                    console.log( ' success: update ' );
                }
                else console.error( ' error: update ' );
            })
        }, error =>console.error( 'error : update : ' + error), 
        () => this.deteletTest( this.base.ref( this.base.getNode() ).key + '/' + key, key ) )
    }


}