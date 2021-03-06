import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AngularFireAuth, AngularFireDatabase]
})
export class AppComponent {

  user: firebase.User;
  items: FirebaseListObservable<any>;
  name: any;
  msgVal: string = '';
  isLoading: boolean = true;

  constructor(public af: AngularFireDatabase, public afAuth: AngularFireAuth) {

    this.items = af.list('/messages', {
      query: {
        limitToLast: 5
      }
    });

    afAuth.authState.subscribe((user: firebase.User) => {
      this.user = (!user ? null : user);
      this.isLoading = false;
    });

  }

  signIn() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  sendChat(inputMessage: string) {

    // Fail fast: Restrict saving empty chat message
    if(inputMessage.trim() == '') {
      this.msgVal = '';
      return;
    }

    // Push | Save message to Firebase DB
    this.items.push({
      message: inputMessage,
      name: this.user.displayName,
      likes: 0,
      createdAt: (new Date).toString()
    });

    // Clear chat field
    this.msgVal = '';

  } 
}
