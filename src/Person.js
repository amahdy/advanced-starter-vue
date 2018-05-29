import Address from './Address';

class Person {
  constructor(props) {
    this.firstName = '';
    this.LastName = '';
    this.address = new Address();
    this.email = '';
  }
}

export default Person;