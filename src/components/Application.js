import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DayList from 'components/DayList';
// import InterviewerList from 'components/InterviewerList';
import Appointment from 'components/Appointment';
import { getAppointmentsForDay, getInterview } from 'helpers/selectors.js';
import 'components/Application.scss';

// const appointments = [
//   {
//     id: 1,
//     time: '12pm'
//   },
//   {
//     id: 2,
//     time: '1pm',
//     interview: {
//       student: 'Lydia Miller-Jones',
//       interviewer: {
//         id: 1,
//         name: 'Sylvia Palmer',
//         avatar: 'https://i.imgur.com/LpaY82x.png'
//       }
//     }
//   },
//   {
//     id: 3,
//     time: '2pm',
//     interview: {
//       student: 'Zach',
//       interviewer: {
//         id: 2,
//         name: 'Tori Malcolm',
//         avatar: 'https://i.imgur.com/Nmx0Qxo.png'
//       }
//     }
//   },
//   {
//     id: 4,
//     time: '3pm'
//   },
//   {
//     id: 5,
//     time: '4pm',
//     interview: {
//       student: 'James',
//       interviewer: {
//         id: 3,
//         name: 'Mildred Nazir',
//         avatar: 'https://i.imgur.com/T2WwVfS.png'
//       }
//     }
//   }
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  // const [day, setDay] = useState('Monday');
  // const [days, setDays] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/days').then(response => {
  //     setDays(response.data);
  //   });
  // }, []);

  // useEffect(() => {
  //   Promise.all([
  //     axios.get('/api/days'),
  //     axios.get('/api/appointments')
  //     // axios.get('/api/interviewers')
  //   ]).then(all => {
  //     console.log(all);
  //   });
  // }, []);

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(response => {
      setState(prev => ({
        ...prev,
        days: response[0].data,
        appointments: response[1].data,
        interviewers: response[2].data
      }));
    });
  }, []);
  // console.log(state.interviewers);

  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
      />
    );
  });

  // const SelectDay = () => {
  //   setDay(state.day);
  // };

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
