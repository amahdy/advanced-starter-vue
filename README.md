# Vaadin components with Vue.js

> NOTE: This project will continue on the [Vaadin with Vue Starter App](https://vaadin.com/start/v10-vue). Please download the starter before reading this tutorial.

### Instructions

We will use some extra Vaadin components and iron elements, to install them:

```bash
  yarn add @polymer/iron-pages
  yarn add @polymer/iron-form
  yarn add @vaadin/vaadin-core
```

Now we need to include all the dependencies. In `src/App.vue` add those imports right after the opening of the '<script>` tag:

```js
  import '@polymer/iron-pages';
  import '@polymer/iron-form';
  import '@vaadin/vaadin-core';
```

We will also make a slight change in the main app style, in the `index.html`, add this custom style in the `<head>` section:

```html
  <custom-style>
    <style include="lumo-color lumo-typography">
      html {
        background-color: hsla(214, 57%, 24%, 0.1);
      }
    </style>
  </custom-style>
```

And a component specific style with few `lumo` theme variables, in `src/App.vue`, in the `<style>` section add:

```css
  .card {
    width: 70%;
    margin: var(--lumo-space-m);
    padding: var(--lumo-space-m);
    border-radius: var(--lumo-border-radius);
    background-color: var(--lumo-base-color);
    box-shadow: var(--lumo-box-shadow-s);
  }
```

Let's also create some data types to be used by the application:

Create `Address.js` as following:

```js
  import { Component } from 'react';

  class Address extends Component {
    constructor(props) {
      super(props);

      this.street = '';
      this.city = '';
      this.state = '';
      this.zip = '';
      this.country = '';
      this.phone = '';
    }
  }

  export default Address;
```

And create `Person.js` as:

```js
  import { Component } from 'react';
  import Address from './Address';

  class Person extends Component {
    constructor(props) {
      super(props);

      this.firstName = '';
      this.LastName = '';
      this.address = new Address();
      this.email = '';
    }
  }

  export default Person;
```

Now inside `App.vue` we will construct the html responsible about rendering the app. Delete the content of `<div id="app">` and replace it by:

A tabbed component to display two tabs:

```html
  <vaadin-tabs :selected="selectedPage" v-on:selected-changed="selectedPage=$event.detail.value">
    <vaadin-tab>All Contacts</vaadin-tab>
    <vaadin-tab>Add New</vaadin-tab>
  </vaadin-tabs>
```

A component to render multiple pages for tabs:

```html
  <iron-pages :selected="selectedPage">

  <div class="card">
  …
  </div>
  <div class="card">
  …
  </div>

  </iron-pages>
```

Here we note that the `selected` page is associated with the same variable as `vaadin-tabs`, so changing `selectedPage` value is enough to change the page.
We have two `div` holding cards, those are going to be the two pages of our component as following:

A grid to hold the data:

```html
  <vaadin-grid ref="grid" v-html="gridHtml" :items="users"></vaadin-grid>
```

Note the usage of `v-html`, which is a workaround that helps rendering `<template>` and should be defined in the `data()` section as:

```js
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
```

Second card is a responsive form for data entry with validation:

```html
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
```

We also place a notification components to notify the user about the status of the data entry:

```html
  <vaadin-notification ref="formSubmitted" duration="4000" v-html="successNotificationHtml">
  </vaadin-notification>

  <vaadin-notification ref="formInvalid" duration="4000" v-html="errorNotificationHtml">
  </vaadin-notification>
```

And a dialog component to pop up when clicked on the `terms and conditions` link:

```html
  <vaadin-dialog :opened="dialogOpen" v-html="dialogHtml">
  </vaadin-dialog>
```

Note the usage of `v-html` in the notifications and the dialog. The templates can be definied again in the `data()` section as:

```js
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
  `,
```

Now to update the application logic:

First define few variables in the `data()` section, that we will use:

```js
  users: JSON.stringify([]),
  selectedUsers: [],
  newUser: new Person(),

  langauges: JSON.stringify(['Dutch', 'English', 'French']),
  selectedPage: 0,
  dialogOpen: false,
```

We also need to fetch data from the server to be displayed in the grid, we can do that in the `create` life cycle by placing this:

```js
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
```

Finally in the `methods` section, we define this method toggles the dialog when the link is clicked:

```js
  toggleDialog() {
    this.dialogOpen = !this.dialogOpen;
  },
```

And this function will process the form submission. First make sure that it’s valid, if so then inserts the new item in the grid, select it, and switch back to the grid view with a success notification. Otherwise error notification is shown and validation errors are hilighted:

```js
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
```
