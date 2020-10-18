import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TaskDto } from '@edirect/api-interfaces';

@Component({
  selector: 'edirect-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {

  @Input() task: TaskDto;

  @Output() OnComplete = new EventEmitter<boolean>();
  @Output() OnDelete = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {

  }

  deleteTask(): void {

    this.OnDelete.emit();
  }

  toggleComplete(): void {

    this.OnComplete.emit(!this.task.completed);
  }

}
