import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'helloworld';
  todoArr = [];
  addVal(val) { this.todoArr.push(val) };
  deleteItem(val) { 
    for(let i=0;i < this.todoArr.length;i++) {
      if(this.todoArr[i] == val) {
        this.todoArr.splice(i,1);
      }
    }
  };
}
