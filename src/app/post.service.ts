import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from "rxjs/operators";
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endPointUrl:string = 'https://projek-firebase-angular-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postUrl:string =  this.endPointUrl+'post.json'
    errorHandling = new Subject<any>();
  constructor(private http:HttpClient) { }

  createAndPost(postData : Post){
    this.http.post<{name:string}>(this.postUrl, postData,{
      observe:'response'
    }).subscribe((data) =>{
      console.log(data);
      this.errorHandling.next(null);
    },
    error=>{
      this.errorHandling.next(error);
    });
  }

  update(editPostData){
    return this.http.patch<{name:string}>(this.postUrl, editPostData);

    // this.http.patch<{name:string}>(this.postUrl, editPostData).subscribe((data:any) =>{
    //   console.log(data);
    // });
  }

  fetchPost(){
    let customParam = new HttpParams();
    customParam = customParam.append('print','pretty');
    customParam = customParam.append('custom-param','custom-param-vale=ue');
    // this.http.get(this.postUrl).
    return this.http.get<{[key:string]:Post}>(this.postUrl,{
      headers: new HttpHeaders({
        'customer-header' : 'hello from custom header'
      }),
      params:customParam
    })
    .pipe(
      map(responseData=> {
        console.log(responseData);

        const postArray : Post[] = [];
        for (const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key],id:key})
          }
        }
        console.log(postArray);
        return postArray;
      })
    )
  }

  deletePost(){
    return this.http.delete(this.postUrl,{
      observe:'events',
    }).pipe(
      tap(
        event=>{
          console.log(event);
          if(event.type === HttpEventType.Sent){

          }
          if(event.type === HttpEventType.Response){
            console.log(event.body)
          }
        }
      )
    );
  }


}
