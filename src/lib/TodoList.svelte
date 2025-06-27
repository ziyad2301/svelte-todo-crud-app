<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TodoItem from './TodoItem.svelte';
  import type { Todo } from './stores/todoStore';

  export let todos: Todo[] = [];

  const dispatch = createEventDispatcher();

  function handleEditTodo(event:any) {
    dispatch('editTodo', event.detail);
  }

  function handleToggleTodo(event:any) {
    dispatch('toggleTodo', event.detail);
  }

  function handleDeleteTodo(event:any) {
    dispatch('deleteTodo', event.detail);
  }
</script>

<div class="todo-list">
  {#if todos.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>No todos yet</h3>
      <p>Add a todo above to get started!</p>
    </div>
  {:else}
    <div class="todos">
      {#each todos as todo (todo.id)}
        <TodoItem
          {todo}
          on:editTodo={handleEditTodo}
          on:toggleTodo={handleToggleTodo}
          on:deleteTodo={handleDeleteTodo}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .todo-list {
    min-height: 200px;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: #6c757d;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
    color: #495057;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.9rem;
  }

  .todos {
    padding: 0;
  }

  @media (max-width: 640px) {
    .empty-state {
      padding: 2rem 1rem;
    }
  }
</style>