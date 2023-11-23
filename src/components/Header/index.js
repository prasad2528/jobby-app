import Cookie from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookie.remove('jwt_token')
    console.log('removed')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo"
        />
      </Link>
      <ul className="nav-links">
        <Link to="/" className="linkItem">
          <li className="link">Home</li>
        </Link>
        <Link to="/jobs" className="linkItem">
          <li className="link">Jobs</li>
        </Link>
      </ul>
      <div className="link">
        <button className="button" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
