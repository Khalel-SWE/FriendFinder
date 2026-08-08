// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { ContactRequest } from '../models/contact-request';
// import { ContactResponse } from '../models/contact-response';

// @Injectable({
//   providedIn: 'root'
// })
// export class ContactService {

//   private api = 'http://localhost:9090/friend-finder';

//   constructor(private http: HttpClient) {}

//   sendMessage(request: ContactRequest): Observable<void> {

//     return this.http.post<void>(
//       `${this.api}/contact`,
//       request
//     );

//   }

//   getMyMessages(): Observable<ContactResponse[]> {

//     return this.http.get<ContactResponse[]>(
//       `${this.api}/contact/my-messages`
//     );

//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ContactRequest } from '../models/contact-request';
import { ContactResponse } from '../models/contact-response';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private api = 'http://localhost:9090/friend-finder';

  constructor(private http: HttpClient) {}

  sendMessage(request: ContactRequest): Observable<void> {

    return this.http.post<void>(
      `${this.api}/contact`,
      request
    );

  }

  getMyMessages(): Observable<ContactResponse[]> {

    return this.http.get<ContactResponse[]>(
      `${this.api}/contact/my-messages`
    );

  }

}