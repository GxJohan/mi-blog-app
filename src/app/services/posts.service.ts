// src/app/services/posts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Interfaces para las respuestas de la API
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface PostWithUser {
  id: number;
  title: string;
  body: string;
  author: {
    name: string;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  getPostById(id: number): Observable<PostWithUser> {
    const post$ = this.http.get<Post>(`${this.postsUrl}/${id}`);
    
    return post$.pipe(
      switchMap(post => {
        const user$ = this.http.get<User>(`${this.usersUrl}/${post.userId}`);
        return forkJoin([user$]).pipe( // forkJoin espera un array de Observables
          map(([user]) => ({ // Desestructura el resultado del array
            id: post.id,
            title: post.title,
            body: post.body,
            author: {
              name: user.name,
              username: user.username,
              email: user.email
            }
          }))
        );
      })
    );
  }

  getRecentPosts(limit: number = 10): Observable<PostWithUser[]> {
    return this.http.get<Post[]>(`${this.postsUrl}?_limit=${limit}`).pipe(
      switchMap(posts => {
        if (posts.length === 0) {
          return forkJoin([]); // Devuelve un observable vacío si no hay posts
        }
        const userRequests = posts.map(post => 
          this.http.get<User>(`${this.usersUrl}/${post.userId}`)
        );
        
        return forkJoin(userRequests).pipe(
          map(users => posts.map((post, index) => ({
            id: post.id,
            title: post.title,
            body: post.body,
            author: {
              name: users[index].name,
              username: users[index].username,
              email: users[index].email
            }
          })))
        );
      })
    );
  }
}