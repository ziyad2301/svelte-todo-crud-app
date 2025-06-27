<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from './stores/todoStore';

  export let todos: Todo[] = [];

  const dispatch = createEventDispatcher();

  $: totalTodos = todos.length;
  $: completedTodos = todos.filter(todo => todo.completed).length;
  $: activeTodos = totalTodos - completedTodos;
  $: completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  function handleClearCompleted() {
    dispatch('clearCompleted');
  }
</script>

{#if totalTodos > 0}
  <div class="todo-stats">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">{totalTodos}</div>
        <div class="stat-label">Total</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-number active">{activeTodos}</div>
        <div class="stat-label">Active</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-number completed">{completedTodos}</div>
        <div class="stat-label">Completed</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-number percentage">{completionPercentage}%</div>
        <div class="stat-label">Progress</div>
      </div>
    </div>

    <div class="progress-bar">
      <div 
        class="progress-fill" 
        style="width: {completionPercentage}%"
      ></div>
    </div>

    {#if completedTodos > 0}
      <div class="actions">
        <button
          class="clear-completed-btn"
          on:click={handleClearCompleted}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
          </svg>
          Clear Completed ({completedTodos})
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .todo-stats {
    padding: 1.5rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #495057;
  }

  .stat-number.active {
    color: #007bff;
  }

  .stat-number.completed {
    color: #28a745;
  }

  .stat-number.percentage {
    color: #6f42c1;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .progress-bar {
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .actions {
    display: flex;
    justify-content: center;
  }

  .clear-completed-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .clear-completed-btn:hover {
    background: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  }

  .clear-completed-btn:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .todo-stats {
      padding: 1rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .stat-item {
      padding: 0.5rem;
    }

    .stat-number {
      font-size: 1.25rem;
    }

    .clear-completed-btn {
      font-size: 0.8rem;
      padding: 0.5rem 0.75rem;
    }
  }
</style>