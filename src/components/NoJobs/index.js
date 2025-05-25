import './index.css'

const NoJobs = ({getJobDetails}) => (
  <div className="no-jobs-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      alt="no jobs"
      className="no-jobs-image"
    />
    <h1 className="no-jobs-found-text">No Jobs Found</h1>
    <p className="no-jobs-message">
      We could not find any jobs. Try other filters
    </p>
    <button type="button" onClick={getJobDetails} className="retry-btn">
      Retry
    </button>
  </div>
)

export default NoJobs
