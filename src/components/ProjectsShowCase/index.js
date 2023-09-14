import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INTITAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowCase extends Component {
  state = {
    category: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiConstants.inProgress})

    const {category} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${category}`

    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.projects.map(item => ({
        id: item.id,
        name: item.name,
        imageUrl: item.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({category: event.target.value}, this.getProjectsData)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#328af2" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getProjectsData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading"> Oops! Something Went Wrong</h1>
      <p className="failure-text">
        {' '}
        We cannot seem to find the page you are looking for.{' '}
      </p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        {' '}
        Retry{' '}
      </button>
    </div>
  )

  renderProjectItem = details => {
    const {id, name, imageUrl} = details

    return (
      <li key={id} className="project-item">
        <img className="project-img" src={imageUrl} alt={name} />
        <p className="project-name"> {name} </p>
      </li>
    )
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list-container">
        {projectsList.map(item => this.renderProjectItem(item))}
      </ul>
    )
  }

  renderProjectsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <>
        <nav className="nav-container">
          <div className="nav-responsive-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
              alt="website logo"
              className="wesite-logo"
            />
          </div>
        </nav>
        <div className="bg-container">
          <div className="responsive-container">
            <select
              className="select"
              value={category}
              onChange={this.onChangeCategory}
            >
              {categoriesList.map(item => (
                <option key={item.id} value={item.id}>
                  {' '}
                  {item.displayText}{' '}
                </option>
              ))}
            </select>
            {this.renderProjectsList()}
          </div>
        </div>
      </>
    )
  }
}

export default ProjectsShowCase
