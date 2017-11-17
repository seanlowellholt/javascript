var todoList = {
  todos: [],

  displayTodos: function() {
    if (this.todos.length === 0) {
    console.log('Array is empty');
    } else {
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].completed === true) {
          console.log('(x)', this.todos[i].textTodo);
        } else {
          console.log('( )', this.todos[i].textTodo);
        }
      }
    }
  },

    addTodo: function() {
      this.todos.push({
        textTodo: textTodo,
        completed: false
      });
    },

    changeTodo: function(position, textTodo) {
      this.todos[position].textTodo = textTodo;
      this.displayTodo();
    },

    deleteTodo: function(position) {
      this.todos[position, 1];
      this.displayTodo();
    },

    toggleCompleted: function(position) {
      var todo = this.todos[position];
      todo.completed = !todo.completed;
    },

    toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0

      for (var i = 0; i < totalTodos; i++)
        if (this.todos[i].completed = true) {
          completedTodos++
        }
    // setup condition
    if (completedTodos === totalTodos) {
    // case 1. set to false
      for (var i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false
      } else {
      // case 2. set to true
        for (var i = 0; i < totalTodos; i++) {
          this.todos[i].completed = true;
        }
      }
      this.displayTodo();
    }
    }




}
