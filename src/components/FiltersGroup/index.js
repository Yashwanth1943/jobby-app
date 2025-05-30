import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const renderExperienceFiltersList = () => {
    const {experienceLevels} = props

    return experienceLevels.map(level => {
      const {changeExperience, activeExperienceId} = props
      const experienceClassName =
        activeExperienceId === level.id
          ? 'experience-level active'
          : 'experience-level'

      const onClickExperienceItem = () => changeExperience(level.id)

      return (
        <li
          className="experience-item"
          key={level.id}
          onClick={onClickExperienceItem}
        >
          <p className={experienceClassName}>{level.label}</p>
        </li>
      )
    })
  }

  const renderExperienceFilters = () => (
    <div>
      <h1 className="filter-heading">Experience Level</h1>
      <h1>haha</h1>
      <ul className="filter-list">{renderExperienceFiltersList()}</ul>
    </div>
  )

  const renderCategoriesList = () => {
    const {jobCategories} = props

    return jobCategories.map(category => {
      const {changeCategory, activeCategoryId} = props
      const onClickCategoryItem = () => changeCategory(category.id)
      const isActive = category.id === activeCategoryId
      const categoryClassName = isActive
        ? 'category-name active'
        : 'category-name'

      return (
        <li
          className="category-item"
          key={category.id}
          onClick={onClickCategoryItem}
        >
          <p className={categoryClassName}>{category.name}</p>
        </li>
      )
    })
  }

  const renderJobCategories = () => (
    <>
      <h1 className="filter-heading">Job Category</h1>
      <ul className="filter-list">{renderCategoriesList()}</ul>
    </>
  )

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search for jobs"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
    )
  }

  const {clearFilters} = props

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      {renderJobCategories()}
      {renderExperienceFilters()}
      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
