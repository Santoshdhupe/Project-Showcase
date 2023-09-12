import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProjectItem = props => {
  const {project} = props
  return (
    <li className="list-item">
      <img
        src={project.imageUrl}
        alt={project.name}
        className="project-image"
      />
      <p className="project-name">{project.name}</p>
    </li>
  )
}

class App extends Component {
  state = {
    projectsList: [],
    currentActiveId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  onchangeOption = event => {
    this.setState({currentActiveId: event.target.value}, this.getProjects)
  }

  onclickRetry = () => {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {currentActiveId} = this.state
    const api = `https://apis.ccbp.in/ps/projects?category=${currentActiveId}`
    const response = await fetch(api)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onclickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderFinalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {currentActiveId, projectsList} = this.state
    return (
      <div className="app-container">
        <select
          onChange={this.onchangeOption}
          value={currentActiveId}
          className="select-input"
        >
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        <ul className="projects-list-container">
          {projectsList.map(each => (
            <ProjectItem key={each.id} project={each} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="bg-container">
        <div className="nav-header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        {this.renderFinalView()}
      </div>
    )
  }
}

export default App
