import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SimilarJobs extends Component {
  state = {uniqueJobData: [], similarJobs: [], apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getJobsById()
  }

  getJobsById = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    this.setState({apiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = [data.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          skillImageUrl: eachSkill.image_url,
          skillName: eachSkill.name,
        })),
        title: eachItem.title,
      }))
      const updatedSimilarJobs = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(updatedData)
      this.setState({
        uniqueJobData: updatedData,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderUniqueJobSuccessView = () => {
    const {uniqueJobData} = this.state
    if (uniqueJobData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = uniqueJobData[0]
      return (
        <div className="unique-job">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-logo"
            />
            <div className="title-container">
              <h2 className="jobTitle">{title}</h2>
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
                <p className="employment">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr color="#7e858e" />
          <div className="description-container">
            <div className="description-detail">
              <h2 className="description-heading">Description</h2>
              <a className="external-link" href={companyWebsiteUrl}>
                Visit <HiExternalLink />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h2 className="skill-heading">Skills</h2>
            <ul className="skills">
              {skills.map(eachItem => (
                <li className="skill-item" key={eachItem.skillName}>
                  <img
                    src={eachItem.skillImageUrl}
                    alt={eachItem.skillName}
                    className="skill-logo"
                  />
                  <h2 className="skill-name">{eachItem.skillName}</h2>
                </li>
              ))}
            </ul>
          </div>
          <h2 className="company-heading">Life at Company</h2>
          <div className="company">
            <p className="company-description">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="company-logo"
            />
          </div>
        </div>
      )
    }
    return null
  }

  renderSimilarJobsView = () => {
    const {similarJobs} = this.state
    if (similarJobs.length >= 1) {
      return (
        <div className="similar-jobs-container">
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(eachJob => (
              <li className="similar-job-item" key={eachJob.id}>
                <div className="logo-container">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="similar job company logo"
                    className="job-logo"
                  />
                  <div className="title-container">
                    <h2 className="job-title">{eachJob.title}</h2>
                    <div className="rating-container">
                      <BsStarFill color="#fbbf24" />
                      <p className="rating">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <h3 className="description-heading">Description</h3>
                <p className="similar-description">{eachJob.jobDescription}</p>
                <div className="locations">
                  <div className="location-container">
                    <MdLocationOn color="#cbd5e1" />
                    <p className="location">{eachJob.location}</p>
                  </div>
                  <div className="location-container">
                    <BsBriefcaseFill color="#cbd5e1" />
                    <p className="employment">{eachJob.employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  onClickButton = () => {
    this.getJobsById()
  }

  renderJobsFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-job"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <div className="failure-profile">
        <button className="button" type="button" onClick={this.onClickButton}>
          Retry
        </button>
      </div>
    </div>
  )

  renderLoader = () => (
    <div className="jobs-loader" data-testid="loader">
      <Loader type="ThreeDots" height={80} width={80} color="#ffffff" />
    </div>
  )

  renderJobDetailsSuccessView = () => (
    <div className="similar-card-container">
      {this.renderUniqueJobSuccessView()}
      {this.renderSimilarJobsView()}
    </div>
  )

  renderJobDetailsFinalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiConstants.failure:
        return this.renderJobsFailureView()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="similar-bg-container">
          {this.renderJobDetailsFinalView()}
        </div>
      </>
    )
  }
}
export default SimilarJobs
