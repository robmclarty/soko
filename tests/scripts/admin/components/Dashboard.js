import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Chart from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'

// Return the 10 users who most recently logged in.
const last10Logins = users => users.sort((a, b) => {
  return new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime()
}).slice(0, 10)

const adminUsers = users => users.filter(user => user.isAdmin && user.isActive)

const activeResources = resources => resources.filter(resource => resource.isActive)

const userSignupsChart = users => {
  const now = moment(Date.now())
  const months = moment.monthsShort()
  const currentMonthNum = moment().month()
  const currentMonth = months[currentMonthNum]
  const data = {}

  // Rotate months
  const rotatedMonths = [
    ...months.slice(currentMonthNum + 1),
    ...months.slice(0, currentMonthNum + 1)
  ]

  rotatedMonths.forEach(month => {
    return data[month] = {
      logins: 0,
      signups: 0
    }
  })

  // REFACTOR: This will likely need to be changed at scale as all users would
  // take too long to processes... perhaps turn into separate DB queries.
  users.forEach(user => {
    const createdMoment = moment(user.createdAt)
    const loginMoment = moment(user.loginAt)

    if (now.diff(createdMoment, 'months') <= 12)
      data[months[createdMoment.month()]].signups += 1

    if (now.diff(loginMoment, 'months') <= 12)
      data[months[loginMoment.month()]].logins += 1
  })

  const chartData = {
    labels: rotatedMonths,
    datasets: [
      {
        label: 'Signups',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.keys(data).map(key => data[key].signups)
      },
      {
        label: 'Logins',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.keys(data).map(key => data[key].logins)
      }
    ]
  }
  const chartOptions = {
    animate: false,
    legend: { display: false },
    tooltips: { enabled: false }
  }

  return (
    <Line data={chartData} options={chartOptions} width={600} height={220} />
  )
}

const usersTotalChart  = users => {
  const activeUsers = users.reduce((count, user) => {
    return user.isActive
  }, 0)
  const inactiveUsers = users.length - activeUsers
  const chartData = {
    labels: ["Active", "Inactive"],
    datasets: [{
      data: [activeUsers, inactiveUsers],
      backgroundColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(155, 155, 143, .3)'
      ],
      borderColor: 'rgba(255, 255, 255, 0)'
    }]
  }
  const chartOptions = {
    animate: false
  }

  return (
    <Doughnut data={chartData} options={chartOptions} width={200} height={200} />
  )
}

const Dashboard = ({
  isAuthenticated,
  users,
  resources,
  onClickLogin
}) => {
  if (!isAuthenticated) return (
    <div className="dashboard">
      <p>Welcome to the Cred Auth Manager admin interface.</p>
      <button onClick={onClickLogin}>Login</button>
      <span className="spacer">or</span>
      <Link to="/admin/signup">sign up</Link>
    </div>
  )

  return (
    <div className="dashboard">
      <table className="dashboard-table">
        <tbody>
          <tr>
            <td>
              <div className="users-total">
                <h4>Total Users</h4>
                <div className="users-total-number">{users.length}</div>
                {usersTotalChart(users)}
              </div>
            </td>

            <td colSpan="2">
              <div className="users-signup">
                <h4>Usage (recent year)</h4>
                {userSignupsChart(users)}
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div className="users-admin">
                <h4>Active Admins</h4>
                <ul>
                  {adminUsers(users).map(user => (
                    <li key={user.id}>
                      <Link to={`/admin/users/${ user.id }`}>{user.username}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </td>

            <td>
              <div className="users-login">
                <h4>Recently Logged In</h4>
                <table className="recently-logged-in-table">
                  <tbody>
                    {last10Logins(users).map(user => (
                      <tr key={user.id}>
                        <td><Link to={`/admin/users/${ user.id }`}>{user.username}</Link></td>
                        <td>{user.loginAt.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>

            <td>
              <div className="resources">
                <h4>Active Resources</h4>
                <ul>
                  {activeResources(resources).map(resource => (
                    <li key={resource.id}>
                      <Link to={`/admin/resources/${ resource.id }`}>{resource.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

Dashboard.propTypes = {
  name: PropTypes.string,
  users: PropTypes.array,
  resources: PropTypes.array
}

export default Dashboard
