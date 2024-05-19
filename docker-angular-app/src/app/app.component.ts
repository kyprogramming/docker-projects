import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FetchDataService } from './services/fetch-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'docker-angular-app';

  userDetails: any;
  redisData:any;

  constructor(private fetchDataService: FetchDataService) { }
  
  ngOnInit() {
    this.fetchDataService.fetchData().subscribe(data => {
      this.userDetails = data;
      console.log(data);
    });
    this.fetchDataService.redisData().subscribe(data => {
      this.redisData = data;
      console.log(data);
    });
  }
}
