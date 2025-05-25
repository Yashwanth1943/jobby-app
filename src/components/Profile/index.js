import './index.css'

const Profile = props => {
  const {
    profileDetails,
    employmentTypesList,
    salaryRangesList,
    setType,
    setActiveSalaryRange,
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
            <li key={salary.label}>
              <input
                type="radio"
                onClick={() => setActiveSalaryRange(salary.salaryRangeId)}
                id={salary.salaryRangeId}
                name="salary"
              />
              <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Profile
