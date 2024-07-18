import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IChatRoom } from '../models';
import { Imessage } from '../models';
import { collectionSnapshots } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore) { }

  getRooms(): Observable<IChatRoom[]> {
    const roomsRef = collection(this.firestore, 'rooms');
    return collectionSnapshots(roomsRef).pipe(
      map(snaps => snaps.map(snap => {
        const id = snap.id;
        const data = snap.data() as IChatRoom;
        return { ...data, id } as IChatRoom;
      }))
    );
  }

  // Add a new room
  addRoom(roomName: string, userId: string): Promise<void> {
    const roomsRef = collection(this.firestore, 'rooms');
    return addDoc(roomsRef, {
      roomName,
      userId
    }).then(() => {
      console.log('Room added successfully');
    }).catch(error => {
      console.error('Error adding room: ', error);
    });
  }

  // Get messages for a specific room
  getRoomMessages(roomId: string): Observable<Imessage[]> {
    const messagesRef = collection(this.firestore, `rooms/${roomId}/messages`);
    return collectionData(messagesRef, { idField: 'id' }).pipe(
      map(messages => {
        return messages.map(message => {
          const data = message as Imessage;
          return {
            ...data,
            id: message['id']
          };
        });
      })
    );
  }

  // Send a new message to a specific room
  sendMessage(userId: string, roomId: string, message: Imessage): Promise<void> {
    const id = doc(collection(this.firestore, `rooms/${roomId}/messages`)).id;
    const messageRef = doc(this.firestore, `rooms/${roomId}/messages/${id}`);
    return setDoc(messageRef, message);
  }

  // Delete a specific room
  deleteRoom(roomId: string): Promise<void> {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    return deleteDoc(roomRef);
  }
}
