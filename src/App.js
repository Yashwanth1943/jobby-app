import './App.css'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails'
import NotFound from './components/NotFound'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobDetails} />
      {/* This catch-all Route must be the last one in the Switch */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App
