import { Accounts } from 'meteor/accounts-base';
 
// User accounts configuration
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});