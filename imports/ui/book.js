// Import templating
import { Meteor } from 'meteor/meteor';

// Import templating
import { Template } from 'meteor/templating';

// Import books collection from API
import { Books } from '../api/books.js';

// Import the HTML view
import './book.html';

// Returns the user id for owner
Template.book.helpers({
	isOwner(){
		return this.owner === Meteor.userId();
	},
});

// We add event handlers
Template.book.events({
    'click .toggle-checked'(event) {
        // Set the checked property to the opposite of its value
        Meteor.call('books.setChecked', this._id, !this.checked);
    },
    'click .delete'(e) {
        // Remove clicked book
         Meteor.call('books.remove', this._id);
    },
    'click .toggle-private'() {
        // Sets private state of the book
         Meteor.call('books.setPrivate', this._id, !this.private);
    },
});