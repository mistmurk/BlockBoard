import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
      },
      /*add user info (Board List, Pages, ETC)
     username: "",
     newBoard: "", (EMPTY BOARD DATA TYPE)
     Boards: [],
     statusIndex: 0,
     isLoading: false
      */
  	};
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    return (
      !isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" />
        </div>
        <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
        {/*LIST OR DROPDOWN OF USER BOARDS (EXAMPLE BUTTON LIST BELOW)
            <div className="col-md-12 Boards">
            {this.state.isLoading && <span>Loading...</span>}
            {this.state.Boards.map((Board) => (
                <div className="Board" key={Board.id}>
                  {Board.Title} {STORE VALUE HERE FOR RENDERING ALT BOARD}
                </div>
              )
            )}
          </div>
        */}
        {/*WHITEBOARD HERE WITH STATUS HANDLERS AND SUBMIT BUTTON*/}
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
      </div> : null
    );
  }

  
  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }
  /* GET DATA VALUES ON LOAD
  componentDidMount() {
    this.fetchData()
  }*/

  /* HANDLE CHANGES IN DATA AND SUBMISSION
  handleNewBoardChange(event) {
    this.setState({newBoard: event.target.value}) 
  }
 
  handleNewStatusSubmit(event) {
    this.saveNewBoard(this.state.newBoard)
    this.setState({
      newBoard: ""
    })
  }*/

  /*SAVE BOARD FUNC
  saveNewBoard(BOARD_VALUES) {
    let Boards = this.state.Boards : GET ALL BOARDS FROM SET
 
    let board = {
      id: this.state.boardIndex++,
      drawing: IMAGEVALUES,
      created_at: Date.now()
    }
 
    Boards.unshift(Board) //add new value to parent set
    const options = { encrypt: false }
    putFile('Boards.json', JSON.stringify(Boards), options)
      .then(() => {
        this.setState({
          Boards: Boards
        })
      })
  }*/

  /*
  FetchData() {
   this.setState({ isLoading: true })
   const options = { decrypt: false }
   getFile('Boards.json', options)
     .then((file) => {
       var Boards = JSON.parse(file || '[]')
       this.setState({
         person: new Person(loadUserData().profile),
         username: loadUserData().username,
         BoardIndex: Boards.length,
         Boards: Boards,
       })
     })
     .finally(() => {
       this.setState({ isLoading: false })
     })
  }
  */
}
