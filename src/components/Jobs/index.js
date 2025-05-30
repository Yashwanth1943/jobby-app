import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Profile from '../Profile'
import JobsList from '../JobsList'
import NoJobs from '../NoJobs'
import Header from '../Header'

const employmentTypesList = [
  {
    employeeLabel: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    employeeLabel: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    employeeLabel: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    employeeLabel: 'Internship',
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

const locationList = [
  {
    locationId: 'HYDERABAD',
    label: 'Hyderabad',
  },
  {
    locationId: 'BANGALORE',
    label: 'Bangalore',
  },
  {
    locationId: 'CHENNAI',
    label: 'Chennai',
  },
  {
    locationId: 'DELHI',
    label: 'Delhi',
  },
  {
    locationId: 'MUMBAI',
    label: 'Mumbai',
  },
]

class Jobs extends Component {
  state = {
    isProfileLoading: true,
    isJobsLoading: true,
    isFailure: false,
    isProfileFailure: false,
    profileDetails: {},
    jobDetails: [],
    searchInput: '',
    activeSalaryRangeId: '',
    activeEmploymentTypes: [],
    activeLocationIds: [], // State to store selected location IDs
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  setActiveSalaryRange = salaryRangeId => {
    this.setState({activeSalaryRangeId: salaryRangeId}, this.getJobDetails)
  }

  // Toggles the selection of a location checkbox
  setLocationType = locationId => {
    this.setState(
      prevState => {
        const {activeLocationIds} = prevState
        const updatedLocationIds = activeLocationIds.includes(locationId)
          ? activeLocationIds.filter(id => id !== locationId) // Deselect
          : [...activeLocationIds, locationId] // Select
        return {activeLocationIds: updatedLocationIds}
      },
      this.getJobDetails, // Call getJobDetails after state update
    )
  }

  setType = employmentTypeId => {
    this.setState(prevState => {
      const {activeEmploymentTypes} = prevState
      const updatedEmploymentTypes = activeEmploymentTypes.includes(
        employmentTypeId,
      )
        ? activeEmploymentTypes.filter(type => type !== employmentTypeId)
        : [...activeEmploymentTypes, employmentTypeId]
      return {activeEmploymentTypes: updatedEmploymentTypes}
    }, this.getJobDetails)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearch = () => {
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({isProfileLoading: true, isProfileFailure: false})
    const apiUrl = `https://apis.ccbp.in/profile`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (!response.ok) throw new Error('Profile fetch failed')

      const fetchedData = await response.json()
      const {profile_details: profileDetailsData} = fetchedData

      const updatedData = {
        name: profileDetailsData.name,
        profileImageUrl: profileDetailsData.profile_image_url,
        shortBio: profileDetailsData.short_bio,
      }

      this.setState({profileDetails: updatedData, isProfileLoading: false})
    } catch (error) {
      this.setState({isProfileLoading: false, isProfileFailure: true})
    }
  }

  getJobDetails = async () => {
    this.setState({isJobsLoading: true, isFailure: false})

    const {
      searchInput,
      activeEmploymentTypes,
      activeSalaryRangeId,
      activeLocationIds, // Get the selected location IDs from state
    } = this.state

    const employmentTypesQuery = activeEmploymentTypes.join(',')

    // The API URL typically doesn't include location filters.
    // We will filter locally after fetching all jobs.
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesQuery}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    // ... inside getJobDetails ...
    try {
      const response = await fetch(apiUrl, options)
      if (!response.ok) throw new Error('Jobs fetch failed')

      const data = await response.json()
      let updatedData = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        location: job.location, // Keep original casing from API
        jobDescription: job.job_description,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
      }))

      // --- LOCAL FILTERING FOR LOCATION ---
      if (activeLocationIds.length > 0) {
        updatedData = updatedData.filter(job =>
          activeLocationIds.some(
            selectedLocationId =>
              selectedLocationId.toUpperCase() === job.location.toUpperCase(),
          ),
        )
      }
      // --- END LOCAL FILTERING ---

      this.setState({jobDetails: updatedData, isJobsLoading: false})
    } catch (error) {
      this.setState({isJobsLoading: false, isFailure: true})
    }
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {
      isJobsLoading,
      isFailure,
      jobDetails,
      isProfileLoading,
      profileDetails,
      activeSalaryRangeId,
      activeEmploymentTypes,
      searchInput,
      isProfileFailure,
      activeLocationIds, // Pass to Profile component
    } = this.state

    let profileContent
    let jobsContent

    if (isProfileLoading) {
      profileContent = (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
        </div>
      )
    } else if (isProfileFailure) {
      profileContent = this.renderFailureView() // You might want a specific profile failure view
    } else {
      profileContent = (
        <Profile
          profileDetails={profileDetails}
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          // isActiveSalary is not used in Profile, but setActiveSalaryRange is correct
          setActiveSalaryRange={this.setActiveSalaryRange}
          locationList={locationList}
          // setActiveLocation is not needed, setLocationType handles it
          setType={this.setType}
          setLocationType={this.setLocationType}
          isActiveEmployment={activeEmploymentTypes}
          activeLocationIds={activeLocationIds} // Pass activeLocationIds to Profile
        />
      )
    }

    if (isJobsLoading) {
      jobsContent = (
        <div className="loader-container" data-testid="jobs-loader">
          <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
        </div>
      )
    } else if (isFailure) {
      jobsContent = this.renderFailureView()
    } else if (jobDetails.length > 0) {
      jobsContent = (
        <ul className="jobs-list">
          {jobDetails.map(eachJob => (
            <JobsList key={eachJob.id} eachJob={eachJob} />
          ))}
        </ul>
      )
    } else {
      jobsContent = <NoJobs getJobDetails={this.getJobDetails} />
    }

    return (
      <div className="job-container">
        <Header />
        <div className="container">
          {profileContent}
          <div className="jobs-container">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search here"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                onClick={this.onSearch}
                className="search-button"
                type="button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {jobsContent}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
