import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
// You might need these icons for location/employment type if you haven't already
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {RiShareBoxFill} from 'react-icons/ri' // For the "Visit" link icon
import Header from '../Header'

import './index.css'

class JobDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      job: null,
      loading: true,
      error: false,
      similarJobs: [],
    }
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  // If the job ID changes (e.g., navigating from a similar job), refetch
  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {id} = match.params
    if (prevProps.match.params.id !== id) {
      this.fetchJobDetails()
    }
  }

  fetchJobDetails = async () => {
    this.setState({loading: true, error: false})

    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      // You should typically redirect to login here, not just set error
      this.setState({loading: false, error: true})
      return
    }

    try {
      const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })

      if (!response.ok) throw new Error('Failed to fetch job details')

      const data = await response.json()

      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url, // ✅ Added this
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        skills: data.job_details.skills.map(skill => ({
          // Map skills for unique keys
          name: skill.name,
          imageUrl: skill.image_url,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
      }

      const similarJobs = data.similar_jobs.map(job => ({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({job: jobDetails, similarJobs, loading: false})
    } catch (err) {
      console.error('Error fetching job details:', err) // Log error for debugging
      this.setState({loading: false, error: true})
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
        type="button"
        className="retry-button"
        onClick={this.fetchJobDetails}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {job, loading, error, similarJobs} = this.state

    if (loading)
      return (
        <div className="loader-container" data-testid="loader">
          {' '}
          {/* Correct data-testid here */}
          <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
        </div>
      )

    if (error) return this.renderFailureView()

    // It's good to add a check if job is null after loading, though error should cover API failure
    if (!job) return <p>No job details found.</p>

    const {
      companyLogoUrl,
      companyWebsiteUrl, // ✅ Destructured the new property
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = job

    return (
      <div className="ntg">
        <Header />
        <div className="job-details-container">
          <div className="first-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo" // ✅ Corrected alt text
              className="company-img"
            />
            <div className="title-and-rating">
              <div className="title-and-visit">
                <h3 className="title">{title}</h3>
                <a
                  href={companyWebsiteUrl} // ✅ Correct href
                  target="_blank"
                  rel="noopener noreferrer"
                  className="visit-link" // Add a class for styling if needed
                >
                  Visit <RiShareBoxFill className="visit-icon" />{' '}
                  {/* Added icon for better UX */}
                </a>
              </div>
              <p className="rating">⭐ {rating}</p>
            </div>
          </div>
          <div className="second-container">
            <div className="location-and-employment">
              <p className="location">
                <MdLocationOn className="icon" /> {location}
              </p>
              <p className="employment">
                <BsFillBriefcaseFill className="icon" /> {employmentType}
              </p>
            </div>
            <p className="package">💰 {packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-section">
            {' '}
            {/* Added a div for description grouping */}
            <h1 className="description-title">Description</h1>
            <p className="job-description">{jobDescription}</p>
          </div>
          <hr />
          <h1>Skills</h1>
          <ul className="skills-list">
            {skills.map(skill => (
              <li key={skill.name} className="skill-item">
                {' '}
                {/* Using skill.name as key; ensure it's unique */}
                <img src={skill.imageUrl} alt={skill.name} width="60" />
                <span>{skill.name}</span>
              </li>
            ))}
          </ul>
          <hr />
          <div className="life-at-company">
            <div className="life-at-description-text-content">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.imageUrl} // Use imageUrl from mapped object
              className="life-at-company-img"
              alt="Life at company"
              width="200"
            />
          </div>
        </div>
        <div>
          <h1 className="similar-jobs">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similarJobs.map(eachjob => (
              <li className="list-item" key={eachjob.id}>
                {' '}
                {/* Correct key prop */}
                <div className="first-container">
                  <img
                    src={eachjob.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-img"
                  />
                  <div>
                    <h1>{eachjob.title}</h1>
                    <p>⭐ {eachjob.rating}</p>
                  </div>
                </div>
                <hr />
                <div>
                  <h1>Description</h1>
                  <p>{eachjob.jobDescription}</p>
                </div>
                <div className="second-container">
                  <div className="location-and-employment">
                    <p className="location">
                      <MdLocationOn className="icon" /> {eachjob.location}
                    </p>
                    <p className="employment">
                      <BsFillBriefcaseFill className="icon" />{' '}
                      {eachjob.employmentType}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default withRouter(JobDetails)
