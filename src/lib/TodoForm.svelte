<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let inputText = '';
  let inputElement: HTMLInputElement;

  function handleSubmit() {
    if (inputText.trim()) {
      dispatch('addTodo', {
        text: inputText.trim()
      });
      inputText = '';
      inputElement?.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="todo-form">
  <div class="input-container">
    <input
      bind:this={inputElement}
      bind:value={inputText}
      on:keydown={handleKeyDown}
      type="text"
      placeholder="What needs to be done?"
      class="todo-input"
      autofocus
    />
    <button
      on:click={handleSubmit}
      class="add-btn"
      disabled={!inputText.trim()}
      title="Add todo"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>
</div>

<style>
  .todo-form {
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
  }

  .input-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .todo-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    background: white;
  }

  .todo-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .todo-input::placeholder {
    color: #6c757d;
  }

  .add-btn {
    padding: 0.75rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 48px;
  }

  .add-btn:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
  }

  .add-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .add-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 640px) {
    .todo-form {
      padding: 1rem;
    }

    .todo-input {
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }
</style>