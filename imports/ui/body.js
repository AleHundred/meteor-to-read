// Import templating
import { Meteor } from 'meteor/meteor';

// Import templating
import { Template } from 'meteor/templating';

// Import ReactiveDict
import { ReactiveDict } from 'meteor/reactive-dict'

// Import books collection from API
import { Books } from '../api/books.js';

// Import UI elements
import './book.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    // Subscribes to books publications when template is created
    Meteor.subscribe('books');
})

// Get the Book collection for the template
Template.body.helpers({
    books() {
        const instance = Template.instance();
        if (instance.state.get('hideRead')) {
            return Books.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Otherwise, see all books
        return Books.find({}, { sort: { createdAt: -1 } });
    },
    unreadCount() {
        return Books.find({ checked: { $ne: true } }).count();
    }
});

// We add event handlers
Template.body.events({
    'submit .new-book'(event) {
        // Prevent default submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const title = target.title.value;
        const author = target.author.value;
        // Insert a book into our bookish collection
        Meteor.call('books.insert', title, author);

        // Clear form
        target.title.value = '';
        target.author.value = '';
    },
    'change .hide-read input'(event, instance) {
        instance.state.set('hideRead', event.target.checked);
    },
});