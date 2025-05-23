// src/app/components/blog-viewer/blog-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostsService, PostWithUser } from '../../services/posts.service';

@Component({
  selector: 'app-blog-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-viewer.component.html',
  styleUrls: ['./blog-viewer.component.css']
})
export class BlogViewerComponent implements OnInit {
  searchId: string | number = '';
  selectedPost: PostWithUser | null = null;
  recentPosts: PostWithUser[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;
  showRecentPosts: boolean = true;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.loadRecentPosts();
  }

  onSearchPost(): void {
    // Convert to string to handle both string and number inputs
    const searchValue = String(this.searchId);
    const id = parseInt(searchValue);
    
    if (!searchValue.trim() || isNaN(id) || id < 1 || id > 100) {
      this.errorMessage = 'Por favor, ingresa un ID válido entre 1 y 100.';
      this.selectedPost = null;
      return;
    }

    this.isLoading = true;
    this.selectedPost = null;
    this.errorMessage = null;
    this.showRecentPosts = false;

    this.postsService.getPostById(id).subscribe({
      next: (post) => {
        this.selectedPost = post;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `No se encontró el post con ID "${id}". Intenta con otro número.`;
        this.selectedPost = null;
        this.isLoading = false;
        console.error('Error fetching post:', err);
      }
    });
  }

  loadRecentPosts(): void {
    this.isLoading = true; // Indicar carga para posts recientes también
    this.postsService.getRecentPosts(6).subscribe({
      next: (posts) => {
        this.recentPosts = posts;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar posts recientes.';
        this.isLoading = false;
        console.error('Error loading recent posts:', err);
      }
    });
  }

  showRecentPostsView(): void {
    this.showRecentPosts = true;
    this.selectedPost = null;
    this.errorMessage = null;
    this.searchId = '';
    if (this.recentPosts.length === 0) { // Cargar si está vacío
        this.loadRecentPosts();
    }
  }

  clearSearch(): void {
    this.searchId = '';
    this.selectedPost = null;
    this.errorMessage = null;
    this.showRecentPosts = true;
     if (this.recentPosts.length === 0) { // Cargar si está vacío
        this.loadRecentPosts();
    }
  }
}