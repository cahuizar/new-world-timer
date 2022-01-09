<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="mt-10 mx-auto" max-width="800">
          <v-card-title>
            Time Tracker
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="timers"
            :search="search"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar
                flat
              >
                <v-toolbar-title>All Items</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog
                  v-model="dialog"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      New Timer
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              counter
                              outlined
                              v-model="editedItem.name"
                              label="Name *"
                              maxlength="20"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              counter
                              outlined
                              v-model="editedItem.category"
                              label="Category *"
                              maxlength="10"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              label="Remaining *"
                              outlined
                              v-mask="'##:##:##'"
                              v-model="editedItem.timer.timeRemaining"
                              placeholder="DD:HH:MM"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-textarea counter maxlength="30" label="Notes" v-model="editedItem.notes" auto-grow outlined rows="1" row-height="15"></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="cancel"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.timer="{ item }">
              <vue-countdown-timer
                :start-time="item.timer.start"
                :end-time="item.timer.end"
                :interval="1000"
                :start-label="'Until start'"
                label-position="begin"
                :end-text="'Available'"
                :seconds-txt="''">
                <template slot="end-text" slot-scope="scope">
                  <span style="color: green">{{ scope.props.endText}}</span>
                </template>
                <template slot="countdown" slot-scope="scope">
                  <span style="color: red">
                    <span>{{scope.props.days}} : </span>
                    <span>{{scope.props.hours}} : </span>
                    <span>{{scope.props.minutes}} : </span>
                    <span>{{scope.props.seconds}}</span>
                  </span>
                </template>
              </vue-countdown-timer>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <p>There are no timers set.</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Category', value: 'category' },
      { text: 'CD Timer', value: 'timer' },
      { text: 'Notes', value: 'notes', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    timers: [
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      category: '',
      timer: {
        start: '',
        end: '',
        timeRemaining: ''
      },
      notes: ''
    },
    defaultItem: {
      name: '',
      category: '',
      timer: {
        start: '',
        end: '',
        timeRemaining: ''
      },
      notes: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Timer' : 'Edit Timer'
    },
  },


  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    const convertToDate = a => new Date(a);
    let timers = JSON.parse(localStorage.timers);
    this.timers = timers.map(time => (
      { ...time,
        timer:
          {
            start: convertToDate(time.timer.start),
            end: convertToDate(time.timer.end),
            timeRemaining: time.timer.timeRemaining
          }
      }));
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.timers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.timers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.timers.splice(this.editedIndex, 1)
      localStorage.timers = JSON.stringify(this.timers.map(time => (
        { ...time,
          timer:
            {
              start: time.timer.start.getTime(),
              end: time.timer.end.getTime(),
              timeRemaining: time.timer.timeRemaining
            }
        })));
      this.closeDelete()
    },
    cancel() {
      const convertToDate = a => new Date(a);
      let timers = JSON.parse(localStorage.timers);
      this.timers = timers.map(time => (
        { ...time,
          timer:
          {
            start: convertToDate(time.timer.start),
            end: convertToDate(time.timer.end),
            timeRemaining: time.timer.timeRemaining
          }
        }));
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {
          name: '',
          category: '',
          timer: {
            start: '',
            end: '',
            timeRemaining: ''
          },
          notes: ''
        };
        this.editedIndex = -1
      })
    },
    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {
          name: '',
          category: '',
          timer: {
            start: '',
            end: '',
            timeRemaining: ''
          },
          notes: ''
        };
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false;
      this.editedItem = this.editedItem = {
        name: '',
        category: '',
        timer: {
          start: '',
          end: '',
          timeRemaining: ''
        },
        notes: ''
      };
      this.$nextTick(() => {
        this.editedItem = this.editedItem = {
          name: '',
          category: '',
          timer: {
            start: '',
            end: '',
            timeRemaining: ''
          },
          notes: ''
        };
        this.editedIndex = -1
      })
    },

    save () {
      this.editedItem.timer.start = new Date();
      let endDate = new Date();
      let timeSplit = this.editedItem.timer.timeRemaining.split(":").map(Number);
      endDate.setDate(endDate.getDate() + timeSplit[0]);
      endDate.setHours(endDate.getHours() + timeSplit[1]);
      endDate.setMinutes(endDate.getMinutes() + timeSplit[2]);
      this.editedItem.timer.end = endDate;
      if (this.editedIndex > -1) {
        Object.assign(this.timers[this.editedIndex], this.editedItem);
      } else {
        this.timers.push(this.editedItem)
      }
      localStorage.timers = JSON.stringify(this.timers.map(time => (
        { ...time,
          timer:
            {
              start: time.timer.start.getTime(),
              end: time.timer.end.getTime(),
              timeRemaining: time.timer.timeRemaining
            }
        })));
      this.close()
    },
  },
}
</script>
