import React from 'react';
import ReactDOM from 'react-dom';

export default class PollForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {inputCount: 3};
    this.inputarr = [];
    for (var i = 0; i < this.state.inputCount; i++) {
      this.inputarr.push(1);
    }
  }

  inputChange() {
    var inputs = document.getElementsByClassName('poll-input');
    var counter = 0;
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value) {
        counter++;
      }
    }
    if (counter === this.state.inputCount) {
      this.inputarr.push(1);
      this.setState({ inputCount: this.state.inputCount+1 });
    }
  }

  render() {
    return(
      <div>
        <form action="/poll/create" method="post" acceptCharset="UTF-8" role="form">
          <div className="form-group">
            <input className="form-control poll-input" placeholder="Poll name ..." name="name" type="text" />
            <hr/>
          </div>
          {
            this.inputarr.map(function(key, i) {
              return (
                <div key={i} className="form-group">
                  <input className="form-control poll-input" placeholder="Option ..." name="option[]" type="text" onChange={() => { this.inputChange() }} />
                </div>
              );
            }, this)
          }
          <div className="form-group">
            <button className="btn btn-lg btn-default" type="submit" name="button">Create a new Poll</button>
          </div>
        </form>
      </div>
    );
  }

}

var target = document.getElementById('public-pollForm');
if (target) {
  ReactDOM.render(<PollForm />,  document.getElementById('public-pollForm'));
}
