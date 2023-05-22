import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './post.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('postEditForm') postEditForm:FormGroup;

  showCreateForm:boolean =true;
  loadedPosts = [];
  showLoading = false;
  editId:string ='';
  editTitle:string = '';
  editContent:string = '';
  error = '';
  errorSub : Subscription;

  constructor(private http: HttpClient, private postService : PostService) {}

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe((error)=>{
      this.error = error;
    });

    this.onFetchPosts();  
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log('balikan post');
    console.log(postData);
    this.postService.createAndPost(postData);
  }

  onFetchPosts() {
    this.showLoading = true;
    this.postService.fetchPost()
    .subscribe(posts=>{
      console.log(posts)
      this.showLoading = false;
      this.loadedPosts =posts;
    },
    error =>{
      console.log(error);
      this.error = error;
    })
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.deletePost().subscribe((data)=>{
        this.showLoading = false;
        this.loadedPosts = [];
    })
  }

  onEditPost(postData: Post) {
    // Send Http request 
    this.showLoading = true;
    const data = {
      [this.editId] :{
        title : postData.title,
        content : postData.content
      }
    };

    this.postService.update(data).subscribe(data=>{
      this.showCreateForm = true;
      this.onFetchPosts();
    });
    // this.postService.(postData);
  }

  displayValue(post:Post){
    this.showCreateForm = false;
    this.editId = post.id;
    this.editContent = post.content;
    this.editTitle = post.title;
  }

}
