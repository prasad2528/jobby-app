import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsSection extends Component {
  state = {
    profileDetails: [],
    apiStatus: apiConstants.initial,
    jobsData: [],
    jobsApiStatus: apiConstants.initial,
    searchInput: '',
    checkboxList: [],
    activeSalaryRange: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getAllJobs()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = [await response.json()]
      const updatedData = data.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileDetails: updatedData,
        responseSuccess: true,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  onGetProfileSuccessView = () => {
    const {profileDetails, responseSuccess} = this.state
    if (responseSuccess && profileDetails.length > 0) {
      const {name, profileImageUrl, shortBio} = profileDetails[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile" />
          <h1 className="name">{name}</h1>
          <p className="bio">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  getRetryButton = () => {
    this.getProfileDetails()
  }

  onGetFailureProfile = () => (
    <div className="failure-profile">
      <button className="button" type="button" onClick={this.getRetryButton}>
        Retry
      </button>
    </div>
  )

  renderProfileLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" height={80} width={80} color="#ffffff" />
    </div>
  )

  renderFinalProfileDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.onGetProfileSuccessView()
      case apiConstants.failure:
        return this.onGetFailureProfile()
      case apiConstants.inProgress:
        return this.renderProfileLoader()
      default:
        return null
    }
  }

  getAllJobs = async () => {
    const {searchInput, checkboxList, activeSalaryRange} = this.state
    const type = checkboxList.join(',')
    this.setState({jobsApiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        id: eachJob.id,
        employmentItem: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsData: updatedData,
        jobsApiStatus: apiConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiConstants.failure})
    }
  }

  renderJobsSuccessView = () => {
    const {jobsData} = this.state
    const jobsLength = jobsData.length > 0
    return jobsLength ? (
      <ul className="jobs-container">
        {jobsData.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    ) : (
      this.renderNoJobsFound()
    )
  }

  renderNoJobsFound = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-job"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  onClickButton = () => {
    this.getAllJobs()
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

  renderFinalJobsView = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiConstants.success:
        return this.renderJobsSuccessView()
      case apiConstants.failure:
        return this.renderJobsFailureView()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getAllJobs()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  onChangeSalaryRange = event => {
    const {activeSalaryRange} = this.state
    console.log(activeSalaryRange)
    this.setState({activeSalaryRange: event.target.id}, this.getAllJobs)
  }

  onChangeCheckbox = event => {
    const {checkboxList} = this.state
    if (checkboxList.includes(event.target.id)) {
      const updateList = checkboxList.filter(each => each !== event.target.id)
      console.log(updateList)
      this.setState({checkboxList: updateList}, this.getAllJobs)
    } else {
      this.setState(
        prevState => ({
          checkboxList: [...prevState.checkboxList, event.target.id],
        }),
        this.getAllJobs,
      )
    }
  }

  renderCheckboxView = () => (
    <ul className="checkbox-container">
      <h2>Type of Employment</h2>
      {employmentTypesList.map(each => (
        <li className="item" key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            className="checkbox"
            onChange={this.onChangeCheckbox}
          />
          <label htmlFor={each.employmentTypeId} className="label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderRadioView = () => (
    <ul className="checkbox-container">
      <h2>Salary Range</h2>
      {salaryRangesList.map(each => (
        <li className="item" key={each.salaryRangeId}>
          <input
            type="radio"
            id={each.salaryRangeId}
            className="checkbox"
            name="option"
            onChange={this.onChangeSalaryRange}
          />
          <label htmlFor={each.salaryRangeId} className="label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="jobs-card-container">
            <div className="details-card-container">
              <div className="profile-details-container">
                {this.renderFinalProfileDetails()}
                {this.renderCheckboxView()}
                {this.renderRadioView()}
              </div>
              <div className="jobs-details-container">
                <div className="search-container">
                  <input
                    type="search"
                    className="inputs"
                    placeholder="Search"
                    onChange={this.onChangeSearchInput}
                    value={searchInput}
                    onKeyDown={this.onEnterSearchInput}
                  />
                  <button
                    className="search"
                    type="button"
                    onClick={this.onSubmitSearchInput}
                    data-testid="searchButton"
                    aria-label="search"
                  >
                    <BsSearch className="icon" />
                  </button>
                </div>
                {this.renderFinalJobsView()}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default JobsSection
