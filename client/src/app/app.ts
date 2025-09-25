import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = 'Dating app';
  protected members = signal<any>([]);

  async ngOnInit() {
    this.members.set(await this.getMembers())
    // this.http.get('http://localhost:5001/api/members').subscribe(
    //   {
    //     next: resp => this.members.set(resp),
    //     error: error range=> console.log(error),
    //     complete: () => console.log('Completed the http request')
    //   }
    // )
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get('http://localhost:5001/api/members'));
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}
