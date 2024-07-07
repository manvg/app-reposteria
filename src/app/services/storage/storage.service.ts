import { Injectable } from '@angular/core';
import { Database, ref, get, child } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private db: Database) {}

  getJsonData(): Observable<any> {
    const dbRef = ref(this.db);
    return from(get(child(dbRef, 'productos'))).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return [];
        }
      })
    );
  }
}
