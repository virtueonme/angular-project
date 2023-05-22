import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest,HttpEventType} from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  implements HttpInterceptor{
  intercept(req: HttpRequest<any>, forward: HttpHandler){
    console.log(req);
    const clonedRequest = req.clone({
      headers:req.headers.append('Basic','xxxx')
    });

    return forward.handle(clonedRequest).pipe(
      tap(
        event=>{
          if(event.type=== HttpEventType.Response){
            console.log('tes masuk sini')
            console.log(event.body);
          }
        }
      )
    )
  }
}
