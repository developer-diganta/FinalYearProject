import React from 'react'
import '../TeacherProfile.js/TeacherProf.css'

function Dashboard() {
    // array of tasks to show in different days
    const tasks = [
        {
            id: 1,
            title: 'Task 1',
            description: 'This is the description of the task 1',
            date: '2022-12-26',
            time: '10:00',
            status: 'pending'
        },
        {
            id: 2,
            title: 'Task 2',
            description: 'This is the description of the task 2',
            date: '2021-09-01',
            time: '10:00',
            status: 'pending'
        },
        {
            id: 3,
            title: 'Task 3',
            description: 'This is the description of the task 3',
            date: '2021-09-01',
            time: '10:00',
            status: 'pending'
        },
        {
            id: 4,
            title: 'Task 4',
            description: 'This is the description of the task 4',
            date: '2021-09-01',
            time: '10:00',
            status: 'pending'
        },
    ]
    var dat = new Date(tasks[0].date)
    console.log(tasks[0].date-dat.getTime(), dat.getTime()/86400000, Math.round(new Date().getTime()/86400000))
    // compare today with another date to get the date difference in day

  return (
    <div className='dashboard_1 p-10'>
        {/* show tasks datewise from tasks array using map compare with current date*/}
        {tasks.map((task) => (
            <div className='task'>
                <div className='py-1 pl-2 my-2' style={{backgroundImage: 'linear-gradient(to right, #c570ff, #cb7eff, #d08cff, #d699ff, #dba6ff, #dfb0ff, #e4bbff, #e8c5ff, #eccfff, #f0d9ff, #f4e3ff, #f8edff)'}}>
                    {
                        // if the date is today then show today else show the date
                        task.date === new Date().toISOString().split('T')[0] ? 'Today' : task.date
                    }
                </div>
                <div className="task pb-10 flex items-center justify-between" style={{minHeight: "20vh"}}>
                    <div>
                        <div className="task__title">
                            {task.title}
                        </div>
                        <div className="task__description">
                            {task.description}
                        </div>    
                    </div>
                    <div className="status">
                        {task.status}
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default Dashboard