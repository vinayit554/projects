import { Component, HostListener, OnInit } from '@angular/core';
import { MovieRecommendationService } from '../services/movie-recommendation.service';
import { AuthServiceService } from '../services/auth-service.service';
import { UserServiceService } from '../services/user-service.service';
import { RouterServiceService } from '../services/router-service.service';

@Component({
  selector: 'app-landing-view',
  templateUrl: './landing-view.component.html',
  styleUrls: ['./landing-view.component.css'],
})
export class LandingViewComponent implements OnInit {
  mov: any;
  movies: any[] = [];
  newMovies: any[] = [];
  genres: any[] = [];
  movieSearch: string = '';
  langByChip: string = '';
  currentPage: number = 0;
  nextPage: number = 0;
  prevPage: number = 0;
  totalPage: number = 0;
  genreSelection: string = '';
  isScrolledDown: boolean = false;
  trendingMovies: any[] = [];
  now_playingMovies: any[] = [];
  searchedMovies: any[] = [];

  constructor(
    private movieService: MovieRecommendationService,
    private authService: AuthServiceService,
    private userService: UserServiceService,
    private routerService: RouterServiceService
  ) {}

  ngOnInit(): void {
    this.getAllMovies();
    this.getTrendingMovies();
    this.getNow_playingMovies();
    if (this.authService.isLoggedIn) {
      this.routerService.navigateToHome();
    } else {
      this.routerService.navigateToLandingView();
    }
  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   // Logic to check if the user has scrolled down
  //   if (window.scrollY > 0) {
  //     this.isScrolledDown = true;
  //   } else {
  //     this.isScrolledDown = false;
  //   }
  // }

  scrollToTop() {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sortByGenre() {
    console.log('Genre Selection::' + this.genreSelection.length);
    if (this.langByChip.length) {
      if (this.genreSelection.length) {
        //for specific genres and Lang
        this.movieService
          .getMoviesByGenreAndLang(this.langByChip, this.genreSelection)
          .subscribe({
            next: (data) => {
              console.log(data.results);
              this.movies = data.results;
              this.currentPage = data.page;
              this.nextPage = this.currentPage + 1;
              // this.prevPage=this.currentPage-1;
              this.totalPage = data.total_pages;
            },
          });
      } else {
        //for ALL Genres
        this.movieService.getMoviesByLang(this.langByChip).subscribe({
          next: (data) => {
            console.log(data);
            this.movies = data.results;
            this.currentPage = data.page;
            this.nextPage = this.currentPage + 1;
            // this.prevPage=this.currentPage-1;
            this.totalPage = data.total_pages;
            console.log('totalPage lang ::' + this.totalPage);
            console.log('page lang::' + this.currentPage);
            console.log('nextPage lang::' + this.nextPage);
            console.log('prevPage lang::' + this.prevPage);
          },
        });
      }
    } else if (this.genreSelection.length) {
      //for All languages it sorts by genre
      this.movieService.getMoviesByGenre(this.genreSelection).subscribe({
        next: (data) => {
          console.log(data.results);
          this.movies = data.results;
          this.currentPage = data.page;
          this.nextPage = this.currentPage + 1;
          // this.prevPage=this.currentPage-1;
          this.totalPage = data.total_pages;
        },
      });
    } else {
      this.getAllMovies();
    }
  }

  getAllMovies() {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        console.log(data);
        this.mov = data;
        console.log('RESUL::' + this.mov.results);
        this.movies = this.mov.results;
        this.currentPage = this.mov.page;
        this.nextPage = this.currentPage + 1;
        //  this.prevPage=this.currentPage-1;
        this.totalPage = this.mov.total_pages;
        console.log('totalPage ::' + this.totalPage);
        console.log('page ::' + this.currentPage);
        console.log('nextPage ::' + this.nextPage);
        console.log('prevPage ::' + this.prevPage);
      },
      error: (error) => {
        alert('Failed to Fetch Movies Due to Server Error!');
      },
    });
    this.getAllGenres();
  }

  getAllGenres() {
    this.movieService.getGenres().subscribe({
      next: (data) => {
        this.genres = data;
        //  console.log(this.genres);
      },
      error: (error) => {
        alert('Failed to Fetch Movies Due to Server Error!');
      },
    });
  }

  searchMovie($event: string) {
    this.movieSearch = $event;
    // console.log('MovieSearch');
    console.log(this.movieSearch, 'reached landing');
    if (this.movieSearch.length) {
      this.movieService.getSearchedMovies(this.movieSearch).subscribe({
        //page
        next: (data) => {
          this.mov = data;
          // console.log(this.mov.results);
          // this.movies=this.mov.results
          // this.userService.searchResult=this.mov.results;
          //  console.log( this.userService.searchResult);
          //  this.routerService.navigateToSearchResult();

          this.searchedMovies = this.mov.results;
          console.log(this.searchedMovies, 'Searched data in landing');
        },
      });
    } else {
      this.getAllMovies();
    }
  }

  filterByLang($event: string) {
    this.langByChip = $event;
    console.log(this.langByChip);
    if (this.langByChip.length) {
      if (this.genreSelection.length) {
        console.log('HERE IS IT ' + this.genreSelection);
        this.movieService
          .getMoviesByGenreAndLang(this.langByChip, this.genreSelection)
          .subscribe({
            next: (data) => {
              console.log(data.results);
              this.movies = data.results;
              this.currentPage = data.page;
              this.nextPage = this.currentPage + 1;
              // this.prevPage=this.currentPage-1;
              this.totalPage = data.total_pages;
            },
          });
      } else {
        this.movieService.getMoviesByLang(this.langByChip).subscribe({
          next: (data) => {
            console.log(data);
            this.movies = data.results;
            this.currentPage = data.page;
            this.nextPage = this.currentPage + 1;
            // this.prevPage=this.currentPage-1;
            this.totalPage = data.total_pages;
            console.log('totalPage lang ::' + this.totalPage);
            console.log('page lang::' + this.currentPage);
            console.log('nextPage lang::' + this.nextPage);
            console.log('prevPage lang::' + this.prevPage);
          },
        });
      }
    } else {
      this.getAllMovies();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= documentHeight - 200) {
      this.next();
    }
    if (window.scrollY > 0) {
      this.isScrolledDown = true;
    } else {
      this.isScrolledDown = false;
    }
  }

  next() {
    if (this.nextPage <= this.totalPage) {
      if (this.langByChip.length) {
        if (this.genreSelection.length) {
          this.movieService
            .getMoviesByGenreAndLangWithPage(
              this.langByChip,
              this.genreSelection,
              this.nextPage
            )
            .subscribe({
              next: (data) => {
                this.currentPage = data.page;

                this.newMovies = data.results.filter(
                  (newMovie: any) =>
                    !this.movies.some(
                      (existingMovie) => existingMovie.id === newMovie.id
                    )
                );
                console.log('new Movie::' + this.newMovies);
                console.log(this.newMovies);
                this.movies = [...this.movies, ...this.newMovies];
                this.nextPage = this.currentPage + 1;
                // this.prevPage=this.currentPage-1;
                this.totalPage = data.total_pages;
              },
            });
        } else {
          this.loadMoviesByLangAndPage();
        }
      } else if (this.genreSelection.length) {
        this.movieService
          .getMoviesByGenreWithPage(this.genreSelection, this.nextPage)
          .subscribe({
            next: (data) => {
              this.currentPage = data.page;
              this.newMovies = data.results.filter(
                (newMovie: any) =>
                  !this.movies.some(
                    (existingMovie) => existingMovie.id === newMovie.id
                  )
              );
              console.log('new Movie::' + this.newMovies);
              console.log(this.newMovies);
              this.movies = [...this.movies, ...this.newMovies];
              this.nextPage = this.currentPage + 1;
              // this.prevPage=this.currentPage-1;
              this.totalPage = data.total_pages;
            },
          });
      } else {
        this.movieService.getMoviesBypage(this.nextPage).subscribe({
          next: (data) => {
            console.log(data.results);
            this.currentPage = data.page;
            this.newMovies = data.results.filter(
              (newMovie: any) =>
                !this.movies.some(
                  (existingMovie) => existingMovie.id === newMovie.id
                )
            );
            console.log('new Movie::' + this.newMovies);
            this.movies = [...this.movies, ...this.newMovies];
            this.nextPage = this.currentPage + 1;
            // this.prevPage=this.currentPage-1;
            this.totalPage = data.total_pages;
            console.log('totalPage in else ::' + this.totalPage);
            console.log('page in else::' + this.currentPage);
            console.log('nextPage in else::' + this.nextPage);
            console.log('prevPage in else::' + this.prevPage);
          },
        });
      }
    }
  }

  // getAllMoviesByGenres(){

  // }

  loadMoviesByLangAndPage() {
    this.movieService
      .getMoviesByLangAndPage(this.langByChip, this.nextPage)
      .subscribe({
        next: (data) => {
          console.log(data.results);
          this.newMovies = data.results.filter(
            (newMovie: any) =>
              !this.movies.some(
                (existingMovie) => existingMovie.id === newMovie.id
              )
          );
          console.log('new Movie::');
          console.log(this.newMovies);
          this.movies = [...this.movies, ...this.newMovies];
          this.currentPage = data.page;
          this.nextPage = this.currentPage + 1;
          // this.prevPage=this.currentPage-1;
          this.totalPage = data.total_pages;
          console.log('totalPage in next ::' + this.totalPage);
          console.log('page in next::' + this.currentPage);
          console.log('nextPage in next::' + this.nextPage);
          // console.log("prevPage in next::"+this.prevPage)
        },
      });
  }

  getTrendingMovies() {
    this.movieService.getTrendingMovies().subscribe({
      next: (data) => {
        this.trendingMovies = data.results;
        console.log(this.trendingMovies, 'trendingMOv');
      },
    });
  }

  getNow_playingMovies() {
    this.movieService.getNow_playingMovies().subscribe({
      next: (data) => {
        this.now_playingMovies = data.results;
        console.log(this.now_playingMovies, 'NowMOv');
      },
    });
  }
}
