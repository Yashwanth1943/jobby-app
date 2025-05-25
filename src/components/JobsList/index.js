import {Link} from 'react-router-dom'
import './index.css'

const JobsList = ({eachJob}) => {
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob

  return (
    <li className="bg-container">
      <Link to={`/jobs/${id}`} className="job-card">
        <div className="first-container">
          <img
            src={companyLogoUrl}
            alt={`${title} company logo`}
            className="company-img"
          />
          <div className="title-and-rating">
            <h3 className="title">{title}</h3>
            <p className="rating">⭐ {rating}</p>
          </div>
        </div>
        <div className="second-container">
          <div className="location-and-employment">
            <p className="location">📍 {location}</p>
            <p className="employment">🛠 {employmentType}</p>
          </div>
          <p className="package">💰 {packagePerAnnum}</p>
        </div>
        <hr />
        <h4 className="description-title">Job Description</h4>
        <p className="job-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobsList
