import { Component, OnInit } from '@angular/core';
import { MovieRecommendationService } from '../services/movie-recommendation.service';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { AuthServiceService } from '../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterServiceService } from '../services/router-service.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  movieRecommendation: any[] = [];
  currentPage: number = 1;
  favoriteMovies: any[] = [];
  response: boolean = false;
  videoKey: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieRecommendationService,
    private userService: UserServiceService,
    private authService: AuthServiceService,
    private snackBar: MatSnackBar,
    private routerService: RouterServiceService
  ) {}
  //need to bring genre
  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id') ?? '0';
      this.movieService.getMoviesById(id).subscribe({
        next: async (data) => {
          this.movie = data;
          this.videoKey = await this.userService.getVideo(this.movie.id);
          console.log(this.movie);
        },
      });

      this.movieService.getMoviesRecommendation(id).subscribe({
        next: (data) => {
          this.movieRecommendation = data;
          // this.getVideo(id);
        },
      });
    });
    if (this.authService.isLoggedIn) {
      if (this.userService.favoriteMovies) {
        this.favoriteMovies = this.userService.favoriteMovies;
      }
    }
  }

  // getVideo(id: any) {
  //   this.movieService.getMovieViedosById(id).subscribe({
  //     next: (data) => {
  //       let trailers: any[] = [];
  //       data.forEach((element: any) => {
  //         if (element.type == 'Trailer') {
  //           console.log(element, 'Trailer object');
  //           trailers.push(element);
  //           this.videoKey = trailers[0].key;
  //           console.log(this.videoKey, 'Movie Key');
  //         }
  //       });
  //     },
  //   });
  // }

  playVideo() {
    this.movieService.openVideo(this.videoKey);
  }

  addToFavorites(movie: any) {
    if (!this.authService.isLoggedIn) {
      this.response = confirm('You need to first to login to add favorites');
      if (this.response) {
        this.routerService.navigateToLogin();
      } else {
        this.routerService.navigateToLandingView();
      }
    } else {
      this.userService.addToFavoriteMovies(movie).subscribe({
        next: (data) => {
          console.log(data);
          this.snackBar.open('Added to favorites', 'success', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary'],
          });
        },
        error: (error) => {
          alert(error.error);
        },
      });
    }
  }
  isAFavoriteMovie(movie: any): boolean {
    return this.favoriteMovies.some((favMovie) => favMovie.id === movie.id);
  }
}
