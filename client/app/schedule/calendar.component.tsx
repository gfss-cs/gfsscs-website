'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { slideInLeft, slideInRight } from '@/app/general.animations'

const swipeVariants = {
  enter: {
    scale: 0.8,
    opacity: 0
  },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.4
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.4
    }
  }
}

export default function Calendar({ setFocusedEvent }) {

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [events, setEvents] = React.useState([])

  const [year, setYear] = React.useState((new Date()).getFullYear())
  const [month, setMonth] = React.useState((new Date()).getMonth())

  const [calendar, setCalendar] = React.useState(new Array())

  const getNumDays = () => (new Date(year, month + 1, 0)).getDate()
  const getFirstDay = () => (new Date(year, month, 1)).getDay()

  function Day(day, isActive, key) {
    if(isActive) {
      return (
        <div key={key} className="mb-2 p-2 w-[calc(14%-2px)] h-28 bg-light text-xs md:text-base text-white font-mono">
          <h1 className={clsx({
            '-ml-1 -mt-1 px-1 sm:px-2 py-1 w-fit bg-medium rounded-full': (new Date(year, month, day)).toDateString() === (new Date()).toDateString(),
          })}>{day}</h1>
          {events.map(event => ((new Date(year, month, day)).toDateString() === (new Date(event['date'])).toDateString() ?
            (window.innerWidth < 640 ? 
            <div key={event['_id']} className={clsx('mt-1 px-2 py-1.5 h-16 rounded-md cursor-pointer border-2 border-white', {
              'bg-medium': event['type'] === 'meeting',
              'bg-dark': event['type'] === 'lesson',
              'bg-gold': event['type'] === 'contest' || event['type'] === 'other'
            })} onClick={() => setFocusedEvent(event)}/>
            :
            <h1 key={event['_id']} className={clsx('mt-1 px-2 py-1.5 text-xs rounded-md cursor-pointer border-2 border-white overflow-hidden', {
              'bg-medium': event['type'] === 'meeting',
              'bg-dark': event['type'] === 'lesson',
              'bg-gold': event['type'] === 'contest' || event['type'] === 'other'
            })} onClick={() => setFocusedEvent(event)}>
              {event['name']}
            </h1>)
          : '' ))}
        </div>
      )
    } else {
      return (<div key={key} className="mb-2 w-[calc(14%-2px)] h-28 bg-dark" />)
    }
  }

  function renderCalendar() {
    const cal : React.JSX.Element[] = []
    let key = 0;
    for(let i = 0; i < 7; i++, key++) cal.push(
      <div key={key} className="mb-2 p-2 w-[calc(14%-2px)] h-12 bg-black flex justify-center items-center">
        <h1 className="text-xs md:text-base text-white font-mono">{window.innerWidth < 1024 ? dayNames[i][0] : dayNames[i]}</h1>
      </div>
    )
    for(let i = 1; i <= getFirstDay(); i++, key++) cal.push(Day(0, false, key))
    for(let i = 1; i <= getNumDays(); i++, key++) cal.push(Day(i, true, key))
    for(let i = 1; i <= (getFirstDay() + getNumDays() > 35 ? 42 : 35) - getFirstDay() - getNumDays(); i++, key++) cal.push(Day(0, false, key))
    setCalendar(cal)
  }
  function prevMonth() {
    if(month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else setMonth(month - 1)
    renderCalendar()
  }
  function nextMonth() {
    if(month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else setMonth(month + 1)
    renderCalendar()
  }

  React.useEffect(() => {
    fetch('https://gfsscs-backend-9cb6722f7477.herokuapp.com/events', {'cache': 'no-store'}).then(res => res.json()).then(data => {
      setEvents(data)
      renderCalendar()
    })
  })

  return (
    <div className="w-full">
      {events.length ?
        <div className="my-8 w-full">
          <div className="w-full flex justify-between items-center">
            <motion.button onClick={prevMonth} className="px-4 py-1 bg-medium text-white hover:text-gold hover:bg-dark border-4 border-light hover:border-gold transition-text hover:duration-200" variants={slideInLeft} initial="hidden" animate="visible">
              <FaAngleLeft />
            </motion.button>

            <div className="flex items-center">
              <AnimatePresence>
                <motion.h1 
                key={month}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-x-1/3 text-2xl lg:text-3xl text-white text-center">
                  {window.innerWidth < 640 ? monthNames[month].substring(0, 3) : monthNames[month]} {window.innerWidth < 640 ? "'" + year % 100 : year}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.button onClick={nextMonth} className="px-4 py-1 bg-medium text-white hover:text-gold hover:bg-dark border-4 border-light hover:border-gold transition-text hover:duration-200" variants={slideInRight} initial="hidden" animate="visible">
              <FaAngleRight />
            </motion.button>
          </div>

          <AnimatePresence>
            <motion.div
            key={month}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="mt-6 p-2 pb-0 absolute left-6 right-6 md:left-15vw md:right-15vw bg-medium flex flex-wrap justify-between">
              {calendar}
            </motion.div>
          </AnimatePresence>
        </div>
      : ''}
      <div className="h-[calc(7rem*7)]" />
    </div>
  )
}