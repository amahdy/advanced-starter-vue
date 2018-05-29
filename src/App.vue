<template>
<div id="app">

<vaadin-tabs :selected="selectedPage" v-on:selected-changed="selectedPage=$event.detail.value">
  <vaadin-tab>All Contacts</vaadin-tab>
  <vaadin-tab>Add New</vaadin-tab>
</vaadin-tabs>

<iron-pages :selected="selectedPage">
<div class="card">
  <vaadin-grid ref="grid" v-html="gridHtml" :items="users"></vaadin-grid>
</div>

<div class="card">
<iron-form ref="form">
  <form>
    <vaadin-form-layout>

      <vaadin-form-item>
        <label slot="label">First Name</label>
        <vaadin-text-field
          :value="newUser.firstName"
          @input="newUser.firstName=$event.target.value"
          required
          error-message="Please enter first name"
          class="full-width">
        </vaadin-text-field>
      </vaadin-form-item>

      <vaadin-form-item>
        <label slot="label">Last Name</label>
        <vaadin-text-field
          :value="newUser.lastName"
          @input="newUser.lastName=$event.target.value"
          required
          error-message="Please enter last name"
          class="full-width">
        </vaadin-text-field>
      </vaadin-form-item>

      <vaadin-form-item>
        <label slot="label">Birth date</label>
        <vaadin-date-picker class="full-width"></vaadin-date-picker>
      </vaadin-form-item>

      <vaadin-form-item>
        <label slot="label">Language</label>
        <vaadin-combo-box class="full-width" :items="langauges"></vaadin-combo-box>
      </vaadin-form-item>

      <vaadin-form-item colspan="2">
        <label slot="label">Notes</label>
        <vaadin-text-area class="full-width"></vaadin-text-area>
      </vaadin-form-item>

      <vaadin-form-item colspan="2">
        <vaadin-checkbox>I have read the <a href @click="toggleDialog">terms and conditions</a></vaadin-checkbox>
      </vaadin-form-item>

      <vaadin-form-item colspan="2">
        <vaadin-button @click="submitForm">Submit</vaadin-button>
      </vaadin-form-item>

    </vaadin-form-layout>
  </form>
</iron-form>
</div>

</iron-pages>

<vaadin-notification ref="formSubmitted" duration="4000" v-html="successNotificationHtml">
</vaadin-notification>

<vaadin-notification ref="formInvalid" duration="4000" v-html="errorNotificationHtml">
</vaadin-notification>

<vaadin-dialog :opened="dialogOpen" v-html="dialogHtml">
</vaadin-dialog>
</div>
</template>

<script>
import '@polymer/iron-pages';
import '@polymer/iron-form';
import '@vaadin/vaadin-core';
import Person from './Person';

export default {
  name: 'app',

  data () {
    return {
      users: JSON.stringify([]),
      selectedUsers: [],
      newUser: new Person(),

      langauges: JSON.stringify(['Dutch', 'English', 'French']),
      selectedPage: 0,
      dialogOpen: false,

      gridHtml: `
  <vaadin-grid-column width="60px" flex-grow="0">
    <template class="header">#</template>
    <template>{{index}}</template>
  </vaadin-grid-column>

  <vaadin-grid-column>
    <template class="header">
      <vaadin-grid-filter aria-label="First Name" path="firstName" value="{{_filterFirstName}}">
        <vaadin-text-field slot="filter" placeholder="First Name" value="{{_filterFirstName}}" focus-target></vaadin-text-field>
      </vaadin-grid-filter>
    </template>
    <template>{{item.firstName}}</template>
  </vaadin-grid-column>

  <vaadin-grid-column>
    <template class="header">
      <vaadin-grid-filter aria-label="Last Name" path="lastName" value="[[_filterLastName]]">
        <vaadin-text-field slot="filter" placeholder="Last Name" value="{{_filterLastName}}" focus-target></vaadin-text-field>
      </vaadin-grid-filter>
    </template>
    <template>{{item.lastName}}</template>
  </vaadin-grid-column>

  <vaadin-grid-column width="8em">
    <template class="header">Address</template>
    <template>
      <div style="white-space: normal">{{item.address.street}}, {{item.address.city}}</div>
    </template>
  </vaadin-grid-column>
      `,
      successNotificationHtml: `
  <template>
    A new contact has been added successfully.
  </template>
      `,
      errorNotificationHtml: `
  <template>
    Some fields are missing or invalid.
  </template>
      `,
      dialogHtml: `
  <template>
    <vaadin-vertical-layout theme="spacing">
      <div>
        <h1>The content of dialog</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin maximus magna et orci lacinia maximus. Fusce ut tincidunt ex. Morbi sed vehicula metus. Phasellus vel leo a elit viverra congue. Donec finibus iaculis eros vel vestibulum. Cras vehicula neque enim, eget faucibus ligula tempus vel. Integer felis nisi, sollicitudin at lectus at, bibendum vulputate risus. In ut massa et massa scelerisque viverra.</p>
      </div>
      <vaadin-button @click="toggleDialog">OK</vaadin-button>
    </vaadin-vertical-layout>
  </template>
      `
    }
  },

  created() {
    fetch("https://demo.vaadin.com/demo-data/1.0/people?count=200")
      .then(res => res.json())
      .then(
        (result) => {
          this.users = JSON.stringify(result.result);
        },
        (error) => {
          // Handle Error
        }
      );
  },

  methods: {
    toggleDialog() {
      this.dialogOpen = !this.dialogOpen;
    },

    submitForm(form) {
      if (this.$refs.form.validate()) {
        this.$refs.formSubmitted.open();

        let grid = this.$refs.grid;
        grid.items.unshift(this.newUser);
        grid.selectedItems = [];
        grid.selectItem(this.newUser);
        grid.clearCache();

        this.newUser = new Person();
        this.selectedPage = 0; // Go back
      } else {
        this.$refs.formInvalid.open();
      }
    }
  }
}
</script>

<style>
.card {
  width: 70%;
  margin: var(--lumo-space-m);
  padding: var(--lumo-space-m);
  border-radius: var(--lumo-border-radius);
  background-color: var(--lumo-base-color);
  box-shadow: var(--lumo-box-shadow-s);
}
</style>
