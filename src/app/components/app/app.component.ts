import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoLocalService } from '../../services/todo-local.service';
import { Observable } from 'rxjs';
import { TodoInterface } from '../../services/todo.interface';
import { TodoStateInterface } from '../../store/todo-state.interface';
import { onLoad } from '../../store/actions/todo.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  todos$: Observable<TodoInterface[]>;
  @ViewChild("importfile", { static: false }) importfile: ElementRef;

  constructor(private store: Store<TodoStateInterface>) {
    this.todos$ = this.store.select('todos');
  }

  onload () {
    this.store.dispatch(onLoad(TodoLocalService.loadTodos()));
    this.todos$.subscribe(todos => TodoLocalService.storeTodos(todos));
  }

  ngOnInit() {
    this.onload();
  }

  importTodos() {
    const onReaderLoad = (event) => {
      const allTodos = event.target.result
      console.log(allTodos);
      TodoLocalService.storeTodos(JSON.parse(allTodos));
      this.onload();
    }
    const importfile = this.importfile.nativeElement as HTMLInputElement;
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(importfile.files[0]);
    console.log(importfile.files[0].name);
  }

  exportTodos() {
    const allTodos = TodoLocalService.loadTodos();
    const link = document.createElement('a');

    link.href = "data:application/json;base64, " + btoa(JSON.stringify(allTodos));
    link.download = "Todos.json";
    link.click();
  }
}
