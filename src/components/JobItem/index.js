import {Link} from 'react-router-dom'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentItem,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="navigation">
      <li className="job">
        <div className="logo-container">
          <img src={companyLogoUrl} alt="company logo" className="job-logo" />
          <div className="title-container">
            <h2 className="job-title">{title}</h2>
            <div className="rating-container">
              <BsStarFill color="#fbbf24" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-details-container">
          <div className="locations">
            <div className="location-container">
              <MdLocationOn color="#cbd5e1" />
              <p className="location">{location}</p>
            </div>
            <div className="location-container">
              <BsBriefcaseFill color="#cbd5e1" />
              <p className="employment">{employmentItem}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr color="#7e858e" />
        <div className="description-container">
          <h2 className="description-heading">Description</h2>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobItem
