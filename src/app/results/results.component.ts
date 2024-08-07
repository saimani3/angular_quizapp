import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  score : number = 0;
  totalQuestions: number = 0;
  incorrectAnswers: { question: string; correctAnswer: string }[] = [];
  ngOnInit(): void {
    const results = JSON.parse(localStorage.getItem('quizResults') || '{}');
    this.score = results.score || 0;
    this.totalQuestions = results.totalQuestions || 0;
    this.incorrectAnswers = results.incorrectAnswers || [];
}

constructor(private router: Router){}
goBack(): void {
  this.router.navigate(['/home']); // Adjust the route as necessary
}
}