import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DataService, Section } from '../data.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  sections: Section[] = [];
  currentSectionIndex: number = 0;
  answers: { [key: string]: string } = {}; // To store user answers
  totalTime: number = 7200; // 120 minutes in seconds
  timeLeft: number = this.totalTime;
  timerSubscription: Subscription | undefined;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadSections();
    this.startTimer();
  }

  loadSections(): void {
    this.dataService.getSections().subscribe(
      (data) => {
        this.sections = data.sections;
      },
      (error) => {
        console.error('Error fetching sections', error);
      }
    );
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        alert('Time is up! Submitting your answers.');
        this.submitAnswers(); // Automatically submit answers when time is up
      }
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get formattedTime(): string {
    const minutes: number = Math.floor(this.timeLeft / 60);
    const seconds: number = this.timeLeft % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  nextSection(): void {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
    }
  }

  previousSection(): void {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
    }
  }

  submitAnswers(): void {
    const userAnswers = this.answers; 
    // console.log('User Answers:', userAnswers); 

    let score = 0;
    const incorrectAnswers: { question: string; correctAnswer: string }[] = [];

    // Iterate through each section and its questions
    this.sections.forEach(section => {
        section.questions.forEach(question => {
            const userAnswer = userAnswers[question.question];
            // console.log(`Question: ${question.question}, User Answer: ${userAnswer}, Correct Answer: ${question.answer}`);
            
            // Compare user answer with the correct answer
            if (userAnswer === question.answer) {
                score++;
            } else {
                incorrectAnswers.push({ question: question.question, correctAnswer: question.answer });
            }
        });
    });
    let totalQuestions = this.sections.reduce((total, section) => total + section.questions.length, 0);
    console.log(`Score: ${score}, Total Questions: ${totalQuestions}`);

    localStorage.setItem('quizResults', JSON.stringify({ score, totalQuestions, incorrectAnswers }));

   // Navigate to the results page with state
   this.router.navigate(['/results']);
}

}