<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from './stores/todoStore';

  export let todo: Todo;

  const dispatch = createEventDispatcher();

  let isEditing = false;
  let editText = todo.text;
  let editInput: HTMLInputElement;

  function startEdit() {
    isEditing = true;
    editText = todo.text;
    setTimeout(() => {
      editInput?.focus();
      editInput?.select();
    }, 0);
  }

  function saveEdit() {
    if (editText.trim() && editText.trim() !== todo.text) {
      dispatch('editTodo', {
        id: todo.id,
        text: editText.trim()
      });
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
    editText = todo.text;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }

  function handleToggle() {
    dispatch('toggleTodo', { id: todo.id });
  }

  function handleDelete() {
    dispatch('deleteTodo', { id: todo.id });
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<div class="todo-item {todo.completed ? 'completed' : ''}">
  <div class="todo-content">
    <button
      class="toggle-btn"
      on:click={handleToggle}
      title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        {#if todo.completed}
          <polyline points="20,6 9,17 4,12"></polyline>
        {:else}
          <circle cx="12" cy="12" r="10"></circle>
        {/if}
      </svg>
    </button>

    <div class="todo-text-container">
      {#if isEditing}
        <input
          bind:this={editInput}
          bind:value={editText}
          on:keydown={handleKeyDown}
          on:blur={saveEdit}
          class="edit-input"
          type="text"
        />
      {:else}
        <span class="todo-text" on:dblclick={startEdit}>
          {todo.text}
        </span>
        <div class="todo-meta">
          <span class="todo-date">
            {formatDate(todo.createdAt)}
            {#if todo.updatedAt.getTime() !== todo.createdAt.getTime()}
              (edited)
            {/if}
          </span>
        </div>
      {/if}
    </div>
  </div>

  <div class="todo-actions">
    {#if !isEditing}
      <button
        class="action-btn edit-btn"
        on:click={startEdit}
        title="Edit todo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
    {/if}
    
    <button
      class="action-btn delete-btn"
      on:click={handleDelete}
      title="Delete todo"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3,6 5,6 21,6"></polyline>
        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  </div>
</div>

<style>
  .todo-item {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f3f4;
    transition: all 0.2s ease;
    position: relative;
    background: white;
  }

  .todo-item:hover {
    background: #f8f9fa;
  }

  .todo-item.completed {
    opacity: 0.7;
  }

  .todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #6c757d;
  }

  .todo-content {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 0.75rem;
  }

  .toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-btn:hover {
    background: #e9ecef;
    color: #28a745;
  }

  .todo-item.completed .toggle-btn {
    color: #28a745;
  }

  .todo-text-container {
    flex: 1;
    min-width: 0;
  }

  .todo-text {
    display: block;
    font-size: 1rem;
    line-height: 1.4;
    word-wrap: break-word;
    cursor: pointer;
    padding: 0.25rem 0;
  }

  .todo-text:hover {
    color: #007bff;
  }

  .todo-meta {
    margin-top: 0.25rem;
  }

  .todo-date {
    font-size: 0.75rem;
    color: #6c757d;
  }

  .edit-input {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #007bff;
    border-radius: 4px;
    font-size: 1rem;
    background: white;
  }

  .edit-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .todo-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .todo-item:hover .todo-actions {
    opacity: 1;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-btn {
    color: #6c757d;
  }

  .edit-btn:hover {
    background: #e9ecef;
    color: #007bff;
  }

  .delete-btn {
    color: #6c757d;
  }

  .delete-btn:hover {
    background: #f8d7da;
    color: #dc3545;
  }

  @media (max-width: 640px) {
    .todo-item {
      padding: 1rem;
    }

    .todo-actions {
      opacity: 1;
    }

    .todo-text {
      font-size: 0.9rem;
    }
  }
</style>