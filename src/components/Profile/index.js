import './index.css'

const Profile = props => {
  const {
    profileDetails,
    employmentTypesList,
    salaryRangesList,
    setType,
    setActiveSalaryRange,
    activeLocationIds, // Received from Jobs component
    setLocationType,
    locationList,
  } = props

  const {name, profileImageUrl, shortBio} = profileDetails

  return (
    <div className="prfl-container">
      <div className="prfl-card">
        <img src={profileImageUrl} className="prfl-img" alt="profile" />
        <h1 className="prfl-name">{name}</h1>
        <p className="prfl-description">{shortBio}</p>
      </div>
      <hr />

      <div>
        <h1 className="type-of-employment-text">Type of Employment</h1>
        <ul className="type-of-employment">
          {employmentTypesList.map(empType => (
            <li key={empType.employmentTypeId}>
              <input
                type="checkbox"
                id={empType.employmentTypeId}
                onChange={() => setType(empType.employmentTypeId)}
                // Add checked prop if you want them to be controlled by state
                // checked={isActiveEmployment.includes(empType.employmentTypeId)}
              />
              <label htmlFor={empType.employmentTypeId}>
                {empType.employeeLabel}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <hr />

      <div>
        <h1 className="type-of-employment-text">Salary Range</h1>
        <ul className="type-of-employment">
          {salaryRangesList.map(salary => (
            <li key={salary.salaryRangeId}>
              <input
                type="radio"
                id={salary.salaryRangeId}
                name="salary"
                onChange={() => setActiveSalaryRange(salary.salaryRangeId)}
                // Add checked prop if you want them to be controlled by state
                // checked={isActiveSalary === salary.salaryRangeId}
              />
              <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
            </li>
          ))}
        </ul>
      </div>
      <hr />

      <div>
        <h1 className="type-of-employment-text">Location</h1>
        <ul className="type-of-employment">
          {locationList.map(location => (
            <li key={location.locationId}>
              <input
                type="checkbox"
                id={location.locationId}
                onChange={() => setLocationType(location.locationId)}
                checked={activeLocationIds.includes(location.locationId)} // ✅ This is the key
              />
              <label htmlFor={location.locationId}>
                {location.label} {/* This will be "Hyderabad", "Delhi", etc. */}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Profile
