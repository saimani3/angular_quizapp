import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface Section {
  title: string;
  questions: Question[];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = '../assets/data.json'; // Path to your JSON file

  constructor(private http: HttpClient) {}

  getSections(): Observable<{ sections: Section[] }> {
    return this.http.get<{ sections: Section[] }>(this.dataUrl);
  }
}
