<template>
  <v-container fluid>
    <div class="todolist">
      <div class="header">
        <h1>ToDo List</h1>
      </div>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            v-model="newTask.name"
            label="Add task"
            @keyup.enter="addTask"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <div class="list-tasks">
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-list>
              <div v-for="task in showList"
                v-bind:key="task.id">
                <v-list-tile
                  v-if="task.id !== activeTaskId"
                  v-on:dblclick="onEdit(task)">
                  <v-list-tile-action>
                    <v-checkbox
                      v-model="task.completed"
                    ></v-checkbox>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <div class="flex-display width100">
                    <v-list-tile-title
                      v-text="task.name"
                      class="flex-1"
                      v-bind:class="{ completed: task.completed }"
                    ></v-list-tile-title>
                    <v-btn fab dark small color="primary" v-on:click="removeFromList(task)">
                      <v-icon dark>clear</v-icon>
                    </v-btn>
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
                <v-card v-else>
                  <v-list-tile >
                    <v-list-tile-content>
                        <v-text-field autofocus
                          v-on:blur="onBlur"
                          v-model="activeTaskText"
                          @keyup.esc="onBlur"
                          @keyup.enter="editTask(task)"
                        ></v-text-field>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-card>
              </div>
            </v-list>
          </v-flex>
        </v-layout>
      </div>
      <div class="filters">
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3 class="flex-display center-align">
            <div v-for="filter in filters"
                v-bind:key="filter">
              <v-btn v-if="activeFilter === filter" round dark
                color="primary"
                v-on:click="filterList(filter)">
                {{filter}}
              </v-btn>
              <v-btn v-if="activeFilter !== filter" round outline
                color="primary"
                v-on:click="filterList(filter)">
                {{filter}}
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script>
import short from 'short-uuid';
export default {
  name: 'ToDoList',

  // Component data
  data () {
    return {
      newTask: {},
      todolist: [],
      activeFilter: 'all',
      filters: ['all', 'completed', 'active'],
      activeTaskId: -1,
      activeTaskText: ""
    }
  },

  // Component methods
  methods: {
    fetchList: function() {
      this.todolist = JSON.parse(localStorage.getItem('todolist') || '[]');
    },
    persistList: function() {
      const listString = JSON.stringify(this.todolist);
      localStorage.setItem('todolist', listString);
    },
    addTask: function(e) {
      e.preventDefault();
      if (this.newTask.name) {
        this.todolist.push({
          id: short.uuid(),
          name: this.newTask.name,
          completed: false
        });
        this.persistList();
        this.newTask = {}
      }
    },
    editTask: function(task) {
      var index = this.todolist.findIndex(todo => todo.id === task.id);
      this.todolist[index].name = this.activeTaskText;
      this.activeTaskId = -1;
      this.activeTaskText = "";
      this.persistList();
    },
    removeFromList: function(task) {
      var index = this.todolist.findIndex(todo => todo.id === task.id);
      this.todolist.splice(index, 1);
      this.persistList();
    },
    onEdit: function(task) {
      this.activeTaskId = task.id;
      this.activeTaskText = task.name;
    },
    filterList: function(filter) {
      this.activeFilter = filter;
    },
    onBlur: function(e) {
      e.preventDefault();
      this.activeTaskId = -1;
      this.activeTaskText = "";
    }
  },

  // Fetch List On Load
  created: function() {
    this.fetchList();
  },

  // Computed Properties
  computed: {
    showList: function() {
      switch(this.activeFilter) {
        case 'all':
          return this.todolist;

        case 'completed':
          return this.todolist.filter(task => task.completed);

        case 'active':
          return this.todolist.filter(task => !task.completed);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .flex-display {
    display: flex;
    align-items: center;
  }
  .flex-1 {
    flex: 1;
  }
  .center-align {
    justify-content: center;
  }
  .width100 {
    width: 100%;
  }
  .completed {
    text-decoration: line-through;
  }
</style>
