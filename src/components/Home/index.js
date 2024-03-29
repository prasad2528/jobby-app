import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="bg-container">
      <div className="details-container">
        <h1 className="heading">Find The JOb That Fits Your Life</h1>
        <p className="description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="button" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)
export default Home
