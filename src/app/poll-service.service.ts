import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poll, PollChoice, User, ChoiceUser, PollCommentElement } from './model/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private http: HttpClient) { }

  public createPoll(p: Poll): Observable<Poll> {
    return this.http.post<Poll>('/api/poll', p);
  }


  public getPollBySlugId(slugId: string): Observable<Poll>{
    return this.http.get<Poll>('/api/poll/slug/' + slugId);
  }

  public getPollBySlugAdminId(slugId: string): Observable<Poll>{
    return this.http.get<Poll>('/api/poll/aslug/' + slugId);

  }

  public updateChoice4user( cu: ChoiceUser): Observable<void>{

    return this.http.post<void>('/api/poll/choiceuser/', cu);
  }

  public addComment4Poll( slug: string, comment: PollCommentElement ): Observable<PollCommentElement>{

    return this.http.post<PollCommentElement>('/api/poll/comment/' + slug, comment);
  }


}
