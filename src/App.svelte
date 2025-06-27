<script lang="ts">
  import { onMount } from 'svelte';
  import TodoForm from './lib/TodoForm.svelte';
  import TodoList from './lib/TodoList.svelte';
  import TodoStats from './lib/TodoStats.svelte';
  import { todoStore } from './lib/stores/todoStore';

  let todos = [];
  let filter = 'all'; // 'all', 'active', 'completed'

  // Subscribe to the todo store
  const unsubscribe = todoStore.subscribe(value => {
    todos = value;
  });

  // Load todos from localStorage on component mount
  onMount(() => {
    todoStore.loadTodos();
    
    // Cleanup subscription on component destroy
    return unsubscribe;
  });

  // Filter todos based on current filter
  $: filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Handle adding new todo
  function handleAddTodo(event) {
    const { text } = event.detail;
    todoStore.addTodo(text);
  }

  // Handle editing todo
  function handleEditTodo(event) {
    const { id, text } = event.detail;
    todoStore.updateTodo(id, text);
  }

  // Handle toggling todo completion
  function handleToggleTodo(event) {
    const { id } = event.detail;
    todoStore.toggleTodo(id);
  }

  // Handle deleting todo
  function handleDeleteTodo(event) {
    const { id } = event.detail;
    todoStore.deleteTodo(id);
  }

  // Handle clearing completed todos
  function handleClearCompleted() {
    todoStore.clearCompleted();
  }

  // Handle filter change
  function setFilter(newFilter) {
    filter = newFilter;
  }
</script>

<main class="container">
  <header class="header">
    <h1 class="title">Todo App</h1>
    <p class="subtitle">Stay organized and productive</p>
  </header>

  <div class="todo-container">
    <TodoForm on:addTodo={handleAddTodo} />
    
    <div class="filters">
      <button 
        class="filter-btn {filter === 'all' ? 'active' : ''}"
        on:click={() => setFilter('all')}
      >
        All
      </button>
      <button 
        class="filter-btn {filter === 'active' ? 'active' : ''}"
        on:click={() => setFilter('active')}
      >
        Active
      </button>
      <button 
        class="filter-btn {filter === 'completed' ? 'active' : ''}"
        on:click={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>

    <TodoList 
      todos={filteredTodos} 
      on:editTodo={handleEditTodo}
      on:toggleTodo={handleToggleTodo}
      on:deleteTodo={handleDeleteTodo}
    />

    <TodoStats 
      {todos} 
      on:clearCompleted={handleClearCompleted}
    />
  </div>
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .title {
    font-size: 3rem;
    font-weight: 300;
    color: white;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  .todo-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .filters {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    background: white;
    color: #6c757d;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .filter-btn:hover {
    background: #e9ecef;
    color: #495057;
  }

  .filter-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem 0.5rem;
    }

    .title {
      font-size: 2rem;
    }

    .filters {
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .filter-btn {
      flex: 1;
      min-width: 80px;
    }
  }
</style>