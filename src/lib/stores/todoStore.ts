import { writable } from 'svelte/store';

// Check if we're in a browser environment
const browser = typeof window !== 'undefined';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create a writable store for todos
function createTodoStore() {
  const { subscribe, set, update } = writable<Todo[]>([]);

  return {
    subscribe,
    
    // Load todos from localStorage
    loadTodos: () => {
      if (browser) {
        try {
          const stored = localStorage.getItem('svelte-todos');
          if (stored) {
            const todos = JSON.parse(stored);
            // Convert date strings back to Date objects
            const parsedTodos = todos.map((todo: any) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
              updatedAt: new Date(todo.updatedAt)
            }));
            set(parsedTodos);
          }
        } catch (error) {
          console.error('Error loading todos from localStorage:', error);
          set([]);
        }
      }
    },

    // Save todos to localStorage
    saveTodos: (todos: Todo[]) => {
      if (browser) {
        try {
          localStorage.setItem('svelte-todos', JSON.stringify(todos));
        } catch (error) {
          console.error('Error saving todos to localStorage:', error);
        }
      }
    },

    // Add a new todo
    addTodo: (text: string) => {
      if (!text.trim()) return;
      
      // Generate ID with fallback for older browsers
      const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      };
      
      const newTodo: Todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      update(todos => {
        const updatedTodos = [newTodo, ...todos];
        todoStore.saveTodos(updatedTodos);
        return updatedTodos;
      });
    },

    // Update todo text
    updateTodo: (id: string, text: string) => {
      if (!text.trim()) return;
      
      update(todos => {
        const updatedTodos = todos.map(todo =>
          todo.id === id
            ? { ...todo, text: text.trim(), updatedAt: new Date() }
            : todo
        );
        todoStore.saveTodos(updatedTodos);
        return updatedTodos;
      });
    },

    // Toggle todo completion status
    toggleTodo: (id: string) => {
      update(todos => {
        const updatedTodos = todos.map(todo =>
          todo.id === id
            ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
            : todo
        );
        todoStore.saveTodos(updatedTodos);
        return updatedTodos;
      });
    },

    // Delete a todo
    deleteTodo: (id: string) => {
      update(todos => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        todoStore.saveTodos(updatedTodos);
        return updatedTodos;
      });
    },

    // Clear all completed todos
    clearCompleted: () => {
      update(todos => {
        const updatedTodos = todos.filter(todo => !todo.completed);
        todoStore.saveTodos(updatedTodos);
        return updatedTodos;
      });
    },

    // Clear all todos
    clearAll: () => {
      set([]);
      if (browser) {
        localStorage.removeItem('svelte-todos');
      }
    }
  };
}

export const todoStore = createTodoStore();