import * as React from 'react';
import NavBar from 'core/navbar';
import Footer from 'core/footer';
import receiveUSER from 'core/navbar/actions';
declare var $;
declare var window;

interface Props {
  children: any;
  receiveUser: any;
}

interface State {
  userFB: number;
  accessToken: string;
  status: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.checkFbStatus = this.checkFbStatus.bind(this);

    FB.Event.subscribe('auth.logout', this.logout)
    FB.Event.subscribe('auth.login', this.login)
    FB.Event.subscribe('auth.statusChange ', this.checkFbStatus)
  }

  public checkFbStatus() {
    let that = this;
    FB.getLoginStatus(function(response) {
      if (response.status === "connected") {
        FB.api('/me?fields=email,name,link,picture', function(otherResponse: any) {
          const auth = response.authResponse;
          that.props.receiveUser({ auth, userFB: otherResponse, status: "connected" });
        });
      } else {
        that.props.receiveUser(null);
      }
    });
  }

  public logout(response: any) {
    this.props.receiveUser(null);
    window.location.replace("/");
  }

  public login(response: any) {
    let that = this;
    if (response.authResponse === null) return null;
    FB.api('/me?fields=email,name,link,picture', function(otherResponse: any) {
      const auth = response.authResponse;
      that.props.receiveUser({ auth, userFB: otherResponse, status: "connected" });
    });
    const accessToken = response.authResponse.accessToken;
    $.ajax({
      method: "POST",
      url: 'api/users/',
      data: { accessToken }
    }).then(obj => {
      if (obj.edu_email === null) {
        $('#logInModal').modal('hide')
        $('#emailInputModal').modal('show')
      } else if (obj.edu_email_confirmed === false) {
        $('#logInModal').modal('hide')
        $('#emailInputModal').modal('hide')
        $('#emailVerificationModal').modal('show')
      } else {
        $('#logInModal').modal('hide')
      }
    })
  }

  public render() {
    return (
      <div className='home'>
        <NavBar />
          {this.props.children}
        <Footer />
      </div>
    )
  }
}


export default App;